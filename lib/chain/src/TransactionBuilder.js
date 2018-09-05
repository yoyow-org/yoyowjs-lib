import assert from "assert";
import {Signature, PublicKey, hash} from "../../ecc";
import {ops} from "../../serializer";
import {Apis, ChainConfig} from 'yoyowjs-ws';
import {Long} from 'bytebuffer';

import ChainTypes from './ChainTypes';

var head_block_time_string, committee_min_review, head_block_number;

class TransactionBuilder {

    constructor() {
        this.ref_block_num = 0
        this.ref_block_prefix = 0
        this.expiration = 0
        this.operations = []
        this.signatures = []
        this.signer_private_keys = []

        // semi-private method bindings
        this._broadcast = _broadcast.bind(this)
    }

    /**
     @arg {string} name - like "transfer"
     @arg {object} operation - JSON matchching the operation's format
     */
    add_type_operation(name, operation) {
        this.add_operation(this.get_type_operation(name, operation));
        return;
    }


    /** 这里会在签名前自动调用，一但完成不能改变 */
    finalize() {
        return new Promise((resolve, reject) => {

            if (this.tr_buffer) {
                throw new Error("already finalized");
            }

            resolve(Apis.instance().db_api().exec("get_objects", [["2.1.0"]]).then((r) => {
                head_block_time_string = r[0].time;
                if (this.expiration === 0)
                    this.expiration = base_expiration_sec() + ChainConfig.expire_in_secs
                this.ref_block_num = r[0].head_block_number & 0xFFFF;
                this.ref_block_prefix = new Buffer(r[0].head_block_id, 'hex').readUInt32LE(4);
                head_block_number = r[0].head_block_number;

                var iterable = this.operations;
                for (var i = 0, op; i < iterable.length; i++) {
                    op = iterable[i];
                    if (op[1]["finalize"]) {
                        op[1].finalize();
                    }
                }
                this.tr_buffer = ops.transaction.toBuffer(this);

            }));

        });
    }

    /** @return {string} hex transaction ID */
    id() {
        if (!this.tr_buffer) {
            throw new Error("not finalized");
        }
        return hash.sha256(this.tr_buffer).toString('hex').substring(0, 40);
    }

    /** @return {Number} trasaction head block number */
    head_block_number() {
        if (!this.tr_buffer) {
            throw new Error("not finalized");
        }
        return head_block_number;
    }

    /**
     Typically one will use {@link this.add_type_operation} instead.
     @arg {array} operation - [operation_id, operation]
     */
    add_operation(operation) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        assert(operation, "operation");
        if (!Array.isArray(operation)) {
            throw new Error("Expecting array [operation_id, operation]");
        }
        this.operations.push(operation);
        return;
    }

    get_type_operation(name, operation) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        assert(name, "name");
        assert(operation, "operation");
        var _type = ops[name];
        assert(_type, `Unknown operation ${name}`);
        var operation_id = ChainTypes.operations[_type.operation_name];
        if (operation_id === undefined) {
            throw new Error(`unknown operation: ${_type.operation_name}`);
        }
        if (!operation.fee) {
            operation.fee = {total: {amount: 0, asset_id: 0}};
        }
        if (name === 'proposal_create') {
            /*
             * Proposals involving the committee account require a review
             * period to be set, look for them here
             */
            let requiresReview = false, extraReview = 0;
            operation.proposed_ops.forEach(op => {
                const COMMITTE_ACCOUNT = 0;
                let key;
                switch (op.op[0]) {
                    case 0: // transfer
                        key = "from";
                        break;

                    case 6: //account_update
                    case 17: // asset_settle
                        key = "account";
                        break;

                    case 10: // asset_create
                    case 11: // asset_update
                    case 12: // asset_update_bitasset
                    case 13: // asset_update_feed_producers
                    case 14: // asset_issue
                    case 18: // asset_global_settle
                    case 43: // asset_claim_fees
                        key = "issuer";
                        break;

                    case 15: // asset_reserve
                        key = "payer";
                        break;

                    case 16: // asset_fund_fee_pool
                        key = "from_account";
                        break;

                    case 22: // proposal_create
                    case 23: // proposal_update
                    case 24: // proposal_delete
                        key = "fee_paying_account";
                        break;

                    case 31: // committee_member_update_global_parameters
                        requiresReview = true;
                        extraReview = 60 * 60 * 24 * 13; // Make the review period 2 weeks total
                        break;
                }
                if (key in op.op[1] && op.op[1][key] === COMMITTE_ACCOUNT) {
                    requiresReview = true;
                }
            });
            operation.expiration_time || (operation.expiration_time = (base_expiration_sec() + ChainConfig.expire_in_secs_proposal));
            if (requiresReview) {
                operation.review_period_seconds = extraReview + Math.max(committee_min_review, 24 * 60 * 60 || ChainConfig.review_in_secs_committee);
                /*
                 * Expiration time must be at least equal to
                 * now + review_period_seconds, so we add one hour to make sure
                 */
                operation.expiration_time += (60 * 60 + extraReview);
            }
        }
        var operation_instance = _type.fromObject(operation);
        return [operation_id, operation_instance];
    }

    /* optional: fetch the current head block */

    update_head_block() {
        return Promise.all([
            Apis.instance().db_api().exec("get_objects", [["2.0.0"]]),
            Apis.instance().db_api().exec("get_objects", [["2.1.0"]])
        ]).then(function (res) {
            let [g, r] = res;
            head_block_time_string = r[0].time;
            committee_min_review = g[0].parameters.committee_proposal_review_period;
        });
    }

    /** optional: there is a deafult expiration */
    set_expire_seconds(sec) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        return this.expiration = base_expiration_sec() + sec;
    }

    /* Wraps this transaction in a proposal_create transaction */
    propose(proposal_create_options) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        if (!this.operations.length) {
            throw new Error("add operation first");
        }

        assert(proposal_create_options, "proposal_create_options");
        assert(proposal_create_options.fee_paying_account, "proposal_create_options.fee_paying_account");

        let proposed_ops = this.operations.map(op => {
            return {op: op};
        })

        this.operations = []
        this.signatures = []
        this.signer_private_keys = []
        proposal_create_options.proposed_ops = proposed_ops;
        this.add_type_operation("proposal_create", proposal_create_options);
        return this;
    }

    has_proposed_operation() {
        let hasProposed = false;
        for (var i = 0; i < this.operations.length; i++) {
            if ("proposed_ops" in this.operations[i][1]) {
                hasProposed = true;
                break;
            }
        }

        return hasProposed;
    }

    /**
     * 获取当前ops所需要的总费用
     * @param pay_uid
     * @return {Promise.<min_fees最低总费用,min_real_fees最低真实费用（不能用币天抵扣的部分）,statistics账号余额总览>}
     */
    get_fees_by_ops(pay_uid = null) {
        let operations = [];
        for (let i = 0, op; i < this.operations.length; i++) {
            op = this.operations[i];
            operations.push(ops.operation.toObject(op));
        }
        var promises = [Apis.instance().db_api().exec("get_required_fee_data", [operations])];
        if (pay_uid != null) {
            promises.push(Apis.instance().db_api().exec("get_full_accounts_by_uid", [[pay_uid], {fetch_statistics: true}]));
        }
        return Promise.all(promises).then((results) => {
            let statistics = null;
            if (pay_uid != null) statistics = results[1][0][1].statistics;
            let fees = results[0];
            let min_fees = Long.ZERO, min_real_fees = Long.ZERO;
            if (fees.length > 0) {
                let i = 0;
                if (pay_uid != null) {
                    for (i = 0; i < fees.length; i++) {//计算总手续费
                        if (fees[i].fee_payer_uid == pay_uid) {//支付人是指定账户时才统计
                            min_fees = min_fees.add(Long.fromValue(fees[i].min_fee));
                            min_real_fees = min_real_fees.add(Long.fromValue(fees[i].min_real_fee));
                        }
                    }
                } else {
                    for (i = 0; i < fees.length; i++) {//计算总手续费
                        min_fees = min_fees.add(Long.fromValue(fees[i].min_fee));
                        min_real_fees = min_real_fees.add(Long.fromValue(fees[i].min_real_fee));
                    }
                }
            }
            return {min_fees, min_real_fees, statistics};
        });
    }

    /**
     * 为操作设置手续费用
     * @param pay_uid 支付手续费的用户uid,用于检测用户余额
     * @param isBalance 是否从余额支付，默认为false 即为零钱支付
     * @param useCsaf 是否允许币天（积分）抵扣，默认false
     * @returns {Promise.<TResult>}
     */
    set_required_fees(pay_uid, isBalance = false, useCsaf = false) {
        if (this.tr_buffer) {
            throw new Error("already finalized");
        }
        if (!this.operations.length) {
            throw new Error("add operations first");
        }
        var operations = [];
        for (var i = 0, op; i < this.operations.length; i++) {
            op = this.operations[i];
            operations.push(ops.operation.toObject(op));
        }

        let asset_id = 0;
        var promises = [
            Apis.instance().db_api().exec("get_required_fee_data", [operations]),
            Apis.instance().db_api().exec("get_full_accounts_by_uid", [[pay_uid], {fetch_statistics: true}])
        ];

        return Promise.all(promises).then((results) => {
            //console.log("statistics:", results[1][0][1].statistics);
            let statistics = results[1][0][1].statistics;
            let fees = results[0];
            let fee_total = Long.ZERO;// Long.fromValue(fees[0][0]);
            for (let i = 0, fee; i < fees.length; i++) {//计算总手续费
                if (fees[i].fee_payer_uid === pay_uid) {//支付人是指定账户时才统计
                    fee = Long.fromValue(fees[i].min_fee);
                    fee_total = fee_total.add(fee);
                }
            }

            let core_balance = Long.fromValue(statistics.core_balance);
            let prepaid_balance = Long.fromValue(statistics.prepaid);
            let csaf_balance = Long.fromValue(statistics.csaf);

            //检查余额是否充足
            if (isBalance) {
                if (fee_total.gt(core_balance.add(csaf_balance))) {
                    throw new Error("余额不足");
                }
            } else {
                if (fee_total.gt(prepaid_balance.add(csaf_balance))) {
                    throw new Error("零钱不足");
                }
            }

            var fee_index = 0;
            var set_fee = operation => {
                if (!operation.fee || operation.fee.total.amount === 0
                    || (operation.fee.total.amount.toString && operation.fee.total.amount.toString() === "0")
                ) {
                    let fee_mast = Long.fromValue(fees[fee_index].min_real_fee);//最低必须用币支付的费用
                    let tmpFee = {total: {amount: Long.fromValue(fees[fee_index].min_fee), asset_id: 0}};//最低总费用
                    let csaf = tmpFee.total.amount.sub(fee_mast);
                    let options = null;

                    //优先处理必须用币支付的部分
                    if (fee_mast.gt(0)) {
                        options = {};
                        if (isBalance) {
                            options.from_balance = {amount: fee_mast, asset_id: 0};
                        } else {
                            options.from_prepaid = {amount: fee_mast, asset_id: 0};
                        }
                    }

                    //处理可用币天支付的部分
                    if (csaf.gt(0)) {
                        if (options == null) options = {};
                        if (csaf_balance.gte(csaf) && useCsaf) {
                            //如果币天够用 && 允许使用币天抵扣
                            options.from_csaf = {amount: csaf, asset_id: 0};
                        } else {//币天不够用
                            //优先用币天
                            let fc = Long.ZERO;
                            //币天够用 && 允许使用币天抵扣
                            if (csaf_balance.gt(0) && useCsaf) {
                                options.from_csaf = {amount: csaf_balance, asset_id: 0};
                                fc = csaf_balance;
                            }
                            //再用零钱/余额
                            let old = Long.ZERO;
                            if (isBalance) {
                                old = options.from_balance ? options.from_balance.amount : Long.ZERO;
                                options.from_balance = {amount: csaf.sub(fc).add(old), asset_id: 0};
                            } else {
                                old = options.from_prepaid ? options.from_prepaid.amount : Long.ZERO;
                                options.from_prepaid = {amount: csaf.sub(fc).add(old), asset_id: 0};
                            }
                        }
                    }

                    if (options != null) tmpFee.options = options;
                    operation.fee = tmpFee;
                } else {
                }
                fee_index++;
                if (operation.proposed_ops) {
                    var result = [];
                    for (var y = 0; y < operation.proposed_ops.length; y++)
                        result.push(set_fee(operation.proposed_ops[y].op[1]))

                    return result;
                }
            }
            for (let i = 0; i < this.operations.length; i++) {
                set_fee(this.operations[i][1])
            }
        });
    }

    get_potential_signatures() {
        var tr_object = ops.signed_transaction.toObject(this);
        return Promise.all([
            Apis.instance().db_api().exec("get_potential_signatures", [tr_object]),
            Apis.instance().db_api().exec("get_potential_address_signatures", [tr_object])
        ]).then(function (results) {
                return {pubkeys: results[0], addys: results[1]};
            }
        );
    }

    get_required_signatures(available_keys) {
        if (!available_keys.length) {
            return Promise.resolve([]);
        }
        var tr_object = ops.signed_transaction.toObject(this);
        return Apis.instance().db_api().exec("get_required_signatures", [tr_object, available_keys]).then(function (required_public_keys) {
            return required_public_keys;
        });
    }

    get_transaction_hex() {
        var tr_object = ops.signed_transaction.toObject(this);
        return Apis.instance().db_api().exec("get_transaction_hex", [tr_object]).then(function (hex) {
            return hex;
        });
    }

    add_signer(private_key, public_key = private_key.toPublicKey()) {

        assert(private_key.d, "required PrivateKey object")

        if (this.signed) {
            throw new Error("already signed");
        }
        if (!public_key.Q) {
            public_key = PublicKey.fromPublicKeyString(public_key);
        }
        // prevent duplicates
        let spHex = private_key.toHex()
        for (let sp of this.signer_private_keys) {
            if (sp[0].toHex() === spHex)
                return
        }
        this.signer_private_keys.push([private_key, public_key]);
    }

    sign(chain_id = Apis.instance().chain_id) {
        if (!this.tr_buffer) {
            throw new Error("not finalized");
        }
        if (this.signed) {
            throw new Error("already signed");
        }
        if (!this.signer_private_keys.length) {
            throw new Error("Transaction was not signed. Do you have a private key? [no_signers]");
        }
        var end = this.signer_private_keys.length;
        for (var i = 0; 0 < end ? i < end : i > end; 0 < end ? i++ : i++) {
            var [private_key, public_key] = this.signer_private_keys[i];
            var sig = Signature.signBuffer(
                Buffer.concat([new Buffer(chain_id, 'hex'), this.tr_buffer]),
                private_key,
                public_key
            );
            this.signatures.push(sig.toBuffer());
        }
        this.signer_private_keys = [];
        this.signed = true;
        return;
    }

    serialize() {
        return ops.signed_transaction.toHex(this);
    }

    toObject() {
        return ops.signed_transaction.toObject(this);
    }

    broadcast(was_broadcast_callback) {
        if (this.tr_buffer) {
            return this._broadcast(was_broadcast_callback);
        } else {
            return this.finalize().then(() => {
                return this._broadcast(was_broadcast_callback);
            });
        }
    }
}

var base_expiration_sec = () => {
    var head_block_sec = Math.ceil(getHeadBlockDate().getTime() / 1000);
    var now_sec = Math.ceil(Date.now() / 1000);
    // The head block time should be updated every 3 seconds.  If it isn't
    // then help the transaction to expire (use head_block_sec)
    if (now_sec - head_block_sec > 30) {
        return head_block_sec;
    }
    // If the user's clock is very far behind, use the head block time.
    return Math.max(now_sec, head_block_sec);
};

function _broadcast(was_broadcast_callback) {
    return new Promise((resolve, reject) => {

        if (!this.signed) {
            this.sign();
        }
        if (!this.tr_buffer) {
            throw new Error("not finalized");
        }
        if (!this.signatures.length) {
            throw new Error("not signed");
        }
        if (!this.operations.length) {
            throw new Error("no operations");
        }

        var tr_object = ops.signed_transaction.toObject(this);
        var tr_res = {
            txid: this.id(),
            block_num: this.head_block_number()
        }
        Apis.instance().network_api().exec("broadcast_transaction_with_callback", [function (res) {
            return resolve(tr_res);
        }, tr_object]).then(function (res) {
                if (was_broadcast_callback) was_broadcast_callback();
                return resolve(tr_res);
            }
        ).catch((error) => {
                // console.log may be redundant for network errors, other errors could occur
                var message = error.message;
                if (!message) {
                    message = "";
                }
                let eobj = {};
                eobj.message = message;
                eobj.digest = hash.sha256(this.tr_buffer).toString('hex');
                eobj.transaction = this.tr_buffer.toString('hex');
                eobj.data = tr_object;
                reject(new Error(JSON.stringify(eobj)));
                return;
            }
        );
        return;
    });
}

function getHeadBlockDate() {
    return timeStringToDate(head_block_time_string)
}

function timeStringToDate(time_string) {
    if (!time_string) return new Date("1970-01-01T00:00:00.000Z")
    if (!/Z$/.test(time_string))
        time_string = time_string + "Z"
    return new Date(time_string)
}

export default TransactionBuilder;
