'use strict';

exports.__esModule = true;

var _secureRandom = require('secure-random');

var _secureRandom2 = _interopRequireDefault(_secureRandom);

var _bytebuffer = require('bytebuffer');

var _ecc = require('../../ecc');

var _serializer = require('../../serializer');

var _TransactionBuilder = require('./TransactionBuilder');

var _TransactionBuilder2 = _interopRequireDefault(_TransactionBuilder);

var _yoyowjsWs = require('yoyowjs-ws');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helper = {};

helper.unique_nonce_entropy = null;
helper.unique_nonce_uint64 = function () {
    var entropy = helper.unique_nonce_entropy = function () {

        if (helper.unique_nonce_entropy === null) {
            return parseInt(_secureRandom2.default.randomUint8Array(1)[0]);
        } else {
            return ++helper.unique_nonce_entropy % 256;
        }
    }();
    var long = _bytebuffer.Long.fromNumber(Date.now());
    long = long.shiftLeft(8).or(_bytebuffer.Long.fromNumber(entropy));
    return long.toString();
};

/* Todo, set fees */
helper.to_json = function (tr) {
    var broadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    return function (tr, broadcast) {
        var tr_object = _serializer.ops.signed_transaction.toObject(tr);
        if (broadcast) {
            var net = _yoyowjsWs.Apis.instance().network_api();
            console.log('... tr_object', JSON.stringify(tr_object));
            return net.exec("broadcast_transaction", [tr_object]);
        } else {
            return tr_object;
        }
    }(tr, broadcast);
};

helper.signed_tr_json = function (tr, private_keys) {
    var tr_buffer = _serializer.ops.transaction.toBuffer(tr);
    tr = _serializer.ops.transaction.toObject(tr);
    tr.signatures = function () {
        var result = [];
        for (var i = 0; 0 < private_keys.length ? i < private_keys.length : i > private_keys.length; 0 < private_keys.length ? i++ : i++) {
            var private_key = private_keys[i];
            result.push(_ecc.Signature.signBuffer(tr_buffer, private_key).toHex());
        }
        return result;
    }();
    return tr;
};

helper.expire_in_min = function (min) {
    return Math.round(Date.now() / 1000) + min * 60;
};

helper.seconds_from_now = function (timeout_sec) {
    return Math.round(Date.now() / 1000) + timeout_sec;
};

/**
    Print to the console a JSON representation of any object in
    @graphene/serializer { types }
*/
helper.template = function (serializer_operation_type_name) {
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { use_default: true, annotate: true };

    var so = type[serializer_operation_type_name];
    if (!so) {
        throw new Error('unknown serializer_operation_type ' + serializer_operation_type_name);
    }
    return so.toObject(undefined, debug);
};

helper.new_operation = function (serializer_operation_type_name) {
    var so = type[serializer_operation_type_name];
    if (!so) {
        throw new Error('unknown serializer_operation_type ' + serializer_operation_type_name);
    }
    var object = so.toObject(undefined, { use_default: true, annotate: true });
    return so.fromObject(object);
};

helper.instance = function (ObjectId) {
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
helper.process_transaction = function (op_type, op_data, pay_uid) {
    var useBalance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    var useCsaf = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var priKey = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var broadcast = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;

    var tr = new _TransactionBuilder2.default();
    tr.add_type_operation(op_type, op_data);
    if (broadcast) {
        return tr.set_required_fees(pay_uid, useBalance, useCsaf).then(function () {
            tr.add_signer(priKey);
            return new Promise(function (resolve, reject) {
                tr.broadcast().then(function (op_res) {
                    return resolve(op_res);
                }).catch(function (err) {
                    reject(err);
                });
            });
        }).catch(function (err) {
            return Promise.reject(err);
        });
    } else {
        return tr.get_fees_by_ops(pay_uid).then(function (fees) {
            var csaf_can = fees.min_fees.sub(fees.min_real_fees); // 可用积分抵扣部分
            var csaf_balance = _bytebuffer.Long.fromValue(fees.statistics.csaf); // 积分余额
            var use_csaf = _bytebuffer.Long.ZERO; // 本次交易可用积分
            // 积分足够，交易可用为最大可用抵扣 | 积分不足，交易可用为全部积分余额
            use_csaf = csaf_balance.gte(csaf_can) ? csaf_can : csaf_balance;
            var with_csaf_fees = fees.min_fees.sub(use_csaf); //用积分抵扣后剩余费用
            var result = {
                min_fees: fees.min_fees,
                min_real_fees: fees.min_real_fees,
                use_csaf: use_csaf,
                with_csaf_fees: with_csaf_fees
                //useCsaf: useCsaf // 是否使用积分 交由UI端自行组装
            };
            return result;
        }).catch(function (err) {
            return Promise.reject(Utils.formatError(err));
        });
    }
};

exports.default = helper;
module.exports = exports['default'];