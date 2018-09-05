
var helper = {};

import secureRandom from 'secure-random';

import {Long} from 'bytebuffer';

import { Signature } from "../../ecc";
import { ops } from "../../serializer";
import TransactionBuilder from "./TransactionBuilder";
import {Apis} from "yoyowjs-ws";

helper.unique_nonce_entropy = null;
helper.unique_nonce_uint64=function() {
    var entropy = helper.unique_nonce_entropy = ((() => {

            if (helper.unique_nonce_entropy === null) {
                return parseInt(secureRandom.randomUint8Array(1)[0]);
            } else {
                return ++helper.unique_nonce_entropy % 256;
            }
    })()
    );
    var long = Long.fromNumber(Date.now());
    long = long.shiftLeft(8).or(Long.fromNumber(entropy));
    return long.toString();
};

/* Todo, set fees */
helper.to_json=function( tr, broadcast = false ) {
    return (function(tr, broadcast){
        var tr_object = ops.signed_transaction.toObject(tr);
        if (broadcast) {
            var net = Apis.instance().network_api();
            console.log('... tr_object', JSON.stringify(tr_object));
            return net.exec("broadcast_transaction", [tr_object]);
        } else {
            return tr_object;
        }
    }
    )(tr, broadcast);
};

helper.signed_tr_json=function(tr, private_keys){
    var tr_buffer = ops.transaction.toBuffer(tr);
    tr = ops.transaction.toObject(tr);
    tr.signatures = (() => {
        var result = [];
        for (var i = 0; 0 < private_keys.length ? i < private_keys.length : i > private_keys.length; 0 < private_keys.length ? i++ : i++) {
            var private_key = private_keys[i];
            result.push(Signature.signBuffer( tr_buffer, private_key ).toHex());
        }
        return result;
    })();
    return tr;
};

helper.expire_in_min=function(min){
    return Math.round(Date.now() / 1000) + (min*60);
};

helper.seconds_from_now=function(timeout_sec){
    return Math.round(Date.now() / 1000) + timeout_sec;
};

/**
    Print to the console a JSON representation of any object in
    @graphene/serializer { types }
*/
helper.template=function(serializer_operation_type_name, debug = {use_default: true, annotate: true}){
    var so = type[serializer_operation_type_name];
    if (!so) {
        throw new Error(`unknown serializer_operation_type ${serializer_operation_type_name}`);
    }
    return so.toObject(undefined, debug);
};

helper.new_operation=function(serializer_operation_type_name){
    var so = type[serializer_operation_type_name];
    if (!so) {
        throw new Error(`unknown serializer_operation_type ${serializer_operation_type_name}`);
    }
    var object = so.toObject(undefined, {use_default: true, annotate: true});
    return so.fromObject(object);
};

helper.instance=function(ObjectId){
    return ObjectId.substring("0.0.".length);
};

/** 
 * 处理交易
 * 不广播的情况，返回的fees对象，不做精度转换
 * @param {String} op_type - op 类型
 * @param {Object} op_data - op 操作数据
 * @param {Number|String} pay_uid - 操作者 yoyow id
 * @param {Boolean} useBalance - 是否使用余额 true , 零钱 false
 * @param {Boolean} useCsaf - 是否使用积分
 * @param {PrivateKey} priKey - 签名私钥
 * @param {Boolean} broadcast - 是否广播 , 为false
 * @returns {Promise<U>|*|Thenable<U>|Promise.<TResult>} 不广播的情况 resolve 操作费率, 否则resolve {block_num, txid};
 * */
helper.process_transaction = (op_type, op_data, pay_uid, useBalance = true, useCsaf = false, priKey = null, broadcast = false) => {
    let tr = new TransactionBuilder();
    tr.add_type_operation(op_type, op_data);
    if(broadcast){
        return tr.set_required_fees(pay_uid, useBalance, useCsaf).then(() => {
            tr.add_signer(priKey);
            return new Promise((resolve, reject) => {
                tr.broadcast()
                .then(op_res => resolve(op_res))
                .catch(err => {
                    reject(err);
                });
            });
        }).catch(err => {
            return Promise.reject(err);
        });
    }else{
        return tr.get_fees_by_ops(pay_uid).then(fees => {
            let csaf_can = fees.min_fees.sub(fees.min_real_fees); // 可用积分抵扣部分
            let csaf_balance = Long.fromValue(fees.statistics.csaf); // 积分余额
            let use_csaf = Long.ZERO; // 本次交易可用积分
            // 积分足够，交易可用为最大可用抵扣 | 积分不足，交易可用为全部积分余额
            use_csaf = csaf_balance.gte(csaf_can) ? csaf_can : csaf_balance;
            let with_csaf_fees = fees.min_fees.sub(use_csaf); //用积分抵扣后剩余费用
            let result = {
                min_fees: fees.min_fees,
                min_real_fees: fees.min_real_fees,
                use_csaf: use_csaf,
                with_csaf_fees: with_csaf_fees,
                //useCsaf: useCsaf // 是否使用积分 交由UI端自行组装
            };
            return result;
        }).catch(err => {
            return Promise.reject(Utils.formatError(err));
        });
    }
}

export default helper;
