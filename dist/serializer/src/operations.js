"use strict";

exports.__esModule = true;
exports.stealth_memo_data = exports.signed_transaction = exports.transaction = exports.balance_claim = exports.withdraw_permission_claim = exports.advertising_ransom = exports.advertising_confirm = exports.advertising_buy = exports.advertising_update = exports.advertising_create = exports.custom_vote_cast = exports.custom_vote_create = exports.license_create = exports.buyout = exports.reward_proxy = exports.reward = exports.score_create = exports.account_update_allowed_assets = exports.account_enable_allowed_assets = exports.proposal_delete = exports.proposal_update = exports.proposal_create = exports.override_transfer = exports.asset_claim_fees = exports.asset_reserve = exports.asset_issue = exports.asset_update = exports.asset_create = exports.asset_create_option = exports.asset_options = exports.account_cancel_auth_platform = exports.account_auth_platform = exports.account_auth_platform_ext = exports.platform_vote_update = exports.platform_update = exports.platform_create = exports.post_update = exports.post = exports.post_update_extensions = exports.post_extensions = exports.Recerptor_Parameter = exports.witness_report = exports.witness_collect_pay = exports.witness_vote_update = exports.witness_update = exports.witness_create = exports.committee_proposal_update = exports.committee_proposal_create = undefined;
exports.committee_update_global_parameter_item_type = exports.committee_update_fee_schedule_item_type = exports.committee_update_account_priviledge_item_type = exports.account_priviledge_update_options = exports.committee_member_vote_update = exports.committee_member_update = exports.committee_member_create = exports.csaf_lease = exports.csaf_collect = exports.account_update_proxy = exports.account_update_key = exports.account_update_auth = exports.account_manage = exports.account_manage_options = exports.account_create = exports.account_reg_info = exports.transfer = exports.transfer_option = exports.memo_data = exports.asset_settle_cancel = exports.transfer_from_blind = exports.blind_transfer = exports.blind_input = exports.transfer_to_blind = exports.blind_output = exports.stealth_confirmation = exports.assert = exports.block_id_predicate = exports.asset_symbol_eq_lit_predicate = exports.account_name_eq_lit_predicate = exports.custom = exports.vesting_balance_withdraw = exports.vesting_balance_create = exports.cdd_vesting_policy_initializer = exports.linear_vesting_policy_initializer = exports.committee_member_update_global_parameters = exports.chain_parameters = exports.withdraw_permission_delete = exports.withdraw_permission_update = exports.withdraw_permission_create = exports.op_wrapper = exports.bitasset_options = exports.price = exports.account_transfer = exports.account_upgrade = exports.account_whitelist = exports.account_update = exports.authority = exports.account_uid_auth = exports.signed_block_header = exports.block_header = exports.signed_block = exports.processed_transaction = exports.fee = exports.fee_extension = exports.asset = exports.void_result = exports.fee_schedule = exports.custom_vote_cast_operation_fee_parameters = exports.custom_vote_create_operation_fee_parameters = exports.advertising_ransom_operation_fee_parameters = exports.advertising_confirm_operation_fee_parameters = exports.advertising_buy_operation_fee_parameters = exports.advertising_update_operation_fee_parameters = exports.advertising_create_operation_fee_parameters = exports.license_create_operation_fee_parameters = exports.buyout_operation_fee_parameters = exports.reward_proxy_operation_fee_parameters = exports.reward_operation_fee_parameters = exports.score_create_operation_fee_parameters = exports.post_update_operation_fee_parameters = exports.post_operation_fee_parameters = exports.transfer_from_blind_operation_fee_parameters = exports.blind_transfer_operation_fee_parameters = exports.transfer_to_blind_operation_fee_parameters = exports.override_transfer_operation_fee_parameters = exports.balance_claim_operation_fee_parameters = exports.assert_operation_fee_parameters = exports.custom_operation_fee_parameters = exports.vesting_balance_withdraw_operation_fee_parameters = exports.vesting_balance_create_operation_fee_parameters = exports.committee_member_update_global_parameters_operation_fee_parameters = exports.committee_member_update_operation_fee_parameters = exports.committee_member_create_operation_fee_parameters = exports.withdraw_permission_delete_operation_fee_parameters = exports.withdraw_permission_claim_operation_fee_parameters = exports.withdraw_permission_update_operation_fee_parameters = exports.withdraw_permission_create_operation_fee_parameters = exports.proposal_delete_operation_fee_parameters = exports.proposal_update_operation_fee_parameters = exports.proposal_create_operation_fee_parameters = exports.witness_update_operation_fee_parameters = exports.witness_create_operation_fee_parameters = exports.account_transfer_operation_fee_parameters = exports.account_upgrade_operation_fee_parameters = exports.account_whitelist_operation_fee_parameters = exports.account_update_operation_fee_parameters = exports.account_create_operation_fee_parameters = exports.transfer_operation_fee_parameters = exports.operation = undefined;

var _types = require("./types");

var _types2 = _interopRequireDefault(_types);

var _serializer = require("./serializer");

var _serializer2 = _interopRequireDefault(_serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uint8 = _types2.default.uint8,
    int8 = _types2.default.int8,
    uint16 = _types2.default.uint16,
    uint32 = _types2.default.uint32,
    int64 = _types2.default.int64,
    uint64 = _types2.default.uint64,
    jsenum = _types2.default.jsenum,
    string = _types2.default.string,
    bytes = _types2.default.bytes,
    bool = _types2.default.bool,
    array = _types2.default.array,
    fixed_array = _types2.default.fixed_array,
    protocol_id_type = _types2.default.protocol_id_type,
    object_id_type = _types2.default.object_id_type,
    vote_id = _types2.default.vote_id,
    future_extensions = _types2.default.future_extensions,
    static_variant = _types2.default.static_variant,
    map = _types2.default.map,
    set = _types2.default.set,
    public_key = _types2.default.public_key,
    address = _types2.default.address,
    time_point_sec = _types2.default.time_point_sec,
    extension = _types2.default.extension,
    optional = _types2.default.optional,
    account_uid_type = _types2.default.account_uid_type,
    asset_aid_type = _types2.default.asset_aid_type,
    platform_pid_type = _types2.default.platform_pid_type,
    post_pid_type = _types2.default.post_pid_type,
    share_type = _types2.default.share_type,
    asset_flags_type = _types2.default.asset_flags_type,
    license_lid_type = _types2.default.license_lid_type,
    advertising_aid_type = _types2.default.advertising_aid_type,
    advertising_order_oid_type = _types2.default.advertising_order_oid_type,
    custom_vote_vid_type = _types2.default.custom_vote_vid_type;


future_extensions = _types2.default.void;
account_uid_type = uint64;
asset_aid_type = uint64;
platform_pid_type = uint32;
post_pid_type = uint64;
asset_flags_type = uint16;
share_type = int64;
license_lid_type = uint64;
advertising_aid_type = uint64;
advertising_order_oid_type = uint64;
custom_vote_vid_type = uint64;

/*
 When updating generated code
 Replace:  operation = static_variant [
 with:     operation.st_operations = [

 Delete:
 public_key = new Serializer(
 "public_key"
 key_data: bytes 33
 )

 */
// Place-holder, their are dependencies on "operation" .. The final list of
// operations is not avialble until the very end of the generated code.
// See: operation.st_operations = ...
var operation = static_variant();
// module.exports["operation"] = operation;

exports.operation = operation;
// For module.exports

var Serializer = function Serializer(operation_name, serilization_types_object, compare) {
    return new _serializer2.default(operation_name, serilization_types_object, compare);
    // return module.exports[operation_name] = s;
};

// Custom-types follow Generated code:

// ##  Generated code follows
// # programs/js_operation_serializer > npm i -g decaffeinate
// ## -------------------------------
/**
 * 转账费率
 * @type {Serializer}
 */
var transfer_operation_fee_parameters = exports.transfer_operation_fee_parameters = new Serializer("transfer_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

/**
 * 创建账户费率
 * @type {Serializer}
 */
var account_create_operation_fee_parameters = exports.account_create_operation_fee_parameters = new Serializer("account_create_operation_fee_parameters", {
    basic_fee: uint64,
    price_per_auth: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

/**
 * 更新账户
 * @type {Serializer}
 */
var account_update_operation_fee_parameters = exports.account_update_operation_fee_parameters = new Serializer("account_update_operation_fee_parameters", {
    fee: int64,
    price_per_auth: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});
/**
 * 账户白名单
 * @type {Serializer}
 */
var account_whitelist_operation_fee_parameters = exports.account_whitelist_operation_fee_parameters = new Serializer("account_whitelist_operation_fee_parameters", {
    fee: int64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var account_upgrade_operation_fee_parameters = exports.account_upgrade_operation_fee_parameters = new Serializer("account_upgrade_operation_fee_parameters", {
    membership_annual_fee: uint64,
    membership_lifetime_fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var account_transfer_operation_fee_parameters = exports.account_transfer_operation_fee_parameters = new Serializer("account_transfer_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var witness_create_operation_fee_parameters = exports.witness_create_operation_fee_parameters = new Serializer("witness_create_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var witness_update_operation_fee_parameters = exports.witness_update_operation_fee_parameters = new Serializer("witness_update_operation_fee_parameters", {
    fee: int64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var proposal_create_operation_fee_parameters = exports.proposal_create_operation_fee_parameters = new Serializer("proposal_create_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var proposal_update_operation_fee_parameters = exports.proposal_update_operation_fee_parameters = new Serializer("proposal_update_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var proposal_delete_operation_fee_parameters = exports.proposal_delete_operation_fee_parameters = new Serializer("proposal_delete_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var withdraw_permission_create_operation_fee_parameters = exports.withdraw_permission_create_operation_fee_parameters = new Serializer("withdraw_permission_create_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var withdraw_permission_update_operation_fee_parameters = exports.withdraw_permission_update_operation_fee_parameters = new Serializer("withdraw_permission_update_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var withdraw_permission_claim_operation_fee_parameters = exports.withdraw_permission_claim_operation_fee_parameters = new Serializer("withdraw_permission_claim_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var withdraw_permission_delete_operation_fee_parameters = exports.withdraw_permission_delete_operation_fee_parameters = new Serializer("withdraw_permission_delete_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var committee_member_create_operation_fee_parameters = exports.committee_member_create_operation_fee_parameters = new Serializer("committee_member_create_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var committee_member_update_operation_fee_parameters = exports.committee_member_update_operation_fee_parameters = new Serializer("committee_member_update_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var committee_member_update_global_parameters_operation_fee_parameters = exports.committee_member_update_global_parameters_operation_fee_parameters = new Serializer("committee_member_update_global_parameters_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var vesting_balance_create_operation_fee_parameters = exports.vesting_balance_create_operation_fee_parameters = new Serializer("vesting_balance_create_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var vesting_balance_withdraw_operation_fee_parameters = exports.vesting_balance_withdraw_operation_fee_parameters = new Serializer("vesting_balance_withdraw_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var custom_operation_fee_parameters = exports.custom_operation_fee_parameters = new Serializer("custom_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var assert_operation_fee_parameters = exports.assert_operation_fee_parameters = new Serializer("assert_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var balance_claim_operation_fee_parameters = exports.balance_claim_operation_fee_parameters = new Serializer("balance_claim_operation_fee_parameters");

var override_transfer_operation_fee_parameters = exports.override_transfer_operation_fee_parameters = new Serializer("override_transfer_operation_fee_parameters", {
    fee: uint64,
    price_per_kbyte: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var transfer_to_blind_operation_fee_parameters = exports.transfer_to_blind_operation_fee_parameters = new Serializer("transfer_to_blind_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var blind_transfer_operation_fee_parameters = exports.blind_transfer_operation_fee_parameters = new Serializer("blind_transfer_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var transfer_from_blind_operation_fee_parameters = exports.transfer_from_blind_operation_fee_parameters = new Serializer("transfer_from_blind_operation_fee_parameters", {
    fee: uint64,
    min_real_fee: uint64,
    min_rf_percent: uint64,
    extensions: optional(future_extensions)
});

var post_operation_fee_parameters = exports.post_operation_fee_parameters = new Serializer("post_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var post_update_operation_fee_parameters = exports.post_update_operation_fee_parameters = new Serializer("post_update_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var score_create_operation_fee_parameters = exports.score_create_operation_fee_parameters = new Serializer("score_create_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var reward_operation_fee_parameters = exports.reward_operation_fee_parameters = new Serializer("reward_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var reward_proxy_operation_fee_parameters = exports.reward_proxy_operation_fee_parameters = new Serializer("reward_proxy_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var buyout_operation_fee_parameters = exports.buyout_operation_fee_parameters = new Serializer("buyout_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var license_create_operation_fee_parameters = exports.license_create_operation_fee_parameters = new Serializer("license_create_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var advertising_create_operation_fee_parameters = exports.advertising_create_operation_fee_parameters = new Serializer("advertising_create_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var advertising_update_operation_fee_parameters = exports.advertising_update_operation_fee_parameters = new Serializer("advertising_update_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var advertising_buy_operation_fee_parameters = exports.advertising_buy_operation_fee_parameters = new Serializer("advertising_buy_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var advertising_confirm_operation_fee_parameters = exports.advertising_confirm_operation_fee_parameters = new Serializer("advertising_confirm_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var advertising_ransom_operation_fee_parameters = exports.advertising_ransom_operation_fee_parameters = new Serializer("advertising_ransom_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var custom_vote_create_operation_fee_parameters = exports.custom_vote_create_operation_fee_parameters = new Serializer("custom_vote_create_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var custom_vote_cast_operation_fee_parameters = exports.custom_vote_cast_operation_fee_parameters = new Serializer("custom_vote_cast_operation_fee_parameters", {
    fee: uint64,
    price_per_output: uint32,
    min_real_fee: uint64,
    min_rf_percent: uint16,
    extensions: optional(future_extensions)
});

var fee_parameters = static_variant([transfer_operation_fee_parameters, account_create_operation_fee_parameters, account_update_operation_fee_parameters, account_whitelist_operation_fee_parameters, account_upgrade_operation_fee_parameters, account_transfer_operation_fee_parameters, witness_create_operation_fee_parameters, witness_update_operation_fee_parameters, proposal_create_operation_fee_parameters, proposal_update_operation_fee_parameters, proposal_delete_operation_fee_parameters, withdraw_permission_create_operation_fee_parameters, withdraw_permission_update_operation_fee_parameters, withdraw_permission_claim_operation_fee_parameters, withdraw_permission_delete_operation_fee_parameters, committee_member_create_operation_fee_parameters, committee_member_update_operation_fee_parameters, committee_member_update_global_parameters_operation_fee_parameters, vesting_balance_create_operation_fee_parameters, vesting_balance_withdraw_operation_fee_parameters, custom_operation_fee_parameters, assert_operation_fee_parameters, balance_claim_operation_fee_parameters, override_transfer_operation_fee_parameters, transfer_to_blind_operation_fee_parameters, blind_transfer_operation_fee_parameters, transfer_from_blind_operation_fee_parameters, post_operation_fee_parameters, post_update_operation_fee_parameters, score_create_operation_fee_parameters, reward_operation_fee_parameters, reward_proxy_operation_fee_parameters, buyout_operation_fee_parameters, license_create_operation_fee_parameters, advertising_create_operation_fee_parameters, advertising_update_operation_fee_parameters, advertising_buy_operation_fee_parameters, advertising_confirm_operation_fee_parameters, advertising_ransom_operation_fee_parameters, custom_vote_create_operation_fee_parameters, custom_vote_cast_operation_fee_parameters]);

var fee_schedule = exports.fee_schedule = new Serializer("fee_schedule", {
    parameters: set(fee_parameters),
    scale: uint32
});

var void_result = exports.void_result = new Serializer("void_result");

var asset = exports.asset = new Serializer("asset", {
    amount: int64,
    asset_id: asset_aid_type
});
/**
 * 费用类型扩展
 * @type {Serializer}
 */
var fee_extension = exports.fee_extension = new Serializer("fee_extension", {
    from_balance: optional(asset), //从余额支付
    from_prepaid: optional(asset), //从零钱包支付
    from_csaf: optional(asset) //使用币龄抵扣
});
var fee = exports.fee = new Serializer("fee", {
    total: asset,
    options: optional(extension(fee_extension))
});

var operation_result = static_variant([void_result, object_id_type, asset]);

var processed_transaction = exports.processed_transaction = new Serializer("processed_transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: set(future_extensions),
    signatures: array(bytes(65)),
    operation_results: array(operation_result)
});

var signed_block = exports.signed_block = new Serializer("signed_block", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: protocol_id_type("witness"),
    transaction_merkle_root: bytes(20),
    extensions: set(future_extensions),
    witness_signature: bytes(65),
    transactions: array(processed_transaction)
});

var block_header = exports.block_header = new Serializer("block_header", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: protocol_id_type("witness"),
    transaction_merkle_root: bytes(20),
    extensions: set(future_extensions)
});

var signed_block_header = exports.signed_block_header = new Serializer("signed_block_header", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: protocol_id_type("witness"),
    transaction_merkle_root: bytes(20),
    extensions: set(future_extensions),
    witness_signature: bytes(65)
});

var account_uid_auth = exports.account_uid_auth = new Serializer("account_uid_auth", {
    uid: account_uid_type,
    auth_type: jsenum({ owner_auth: 0, active_auth: 1, secondary_auth: 2 })
}, function (a, b) {
    return a.uid.gt(b.uid) ? 1 : a.uid.lt(b.uid) ? -1 : 0;
});

var authority = exports.authority = new Serializer("authority", {
    weight_threshold: uint32,
    //account_auths: set(future_extensions),
    account_uid_auths: map(account_uid_auth, uint16),
    key_auths: map(public_key, uint16)
    //,address_auths: set(future_extensions)
});

var account_update = exports.account_update = new Serializer("account_update", {
    fee: fee,
    account: account_uid_type,
    owner: optional(authority),
    active: optional(authority),
    //new_options: optional(account_options),
    extensions: optional(future_extensions)
});

var account_whitelist = exports.account_whitelist = new Serializer("account_whitelist", {
    fee: fee,
    authorizing_account: account_uid_type,
    account_to_list: account_uid_type,
    new_listing: uint8,
    extensions: optional(future_extensions)
});

var account_upgrade = exports.account_upgrade = new Serializer("account_upgrade", {
    fee: fee,
    account_to_upgrade: account_uid_type,
    upgrade_to_lifetime_member: bool,
    extensions: optional(future_extensions)
});

var account_transfer = exports.account_transfer = new Serializer("account_transfer", {
    fee: fee,
    account_id: account_uid_type,
    new_owner: account_uid_type,
    extensions: optional(future_extensions)
});

var price = exports.price = new Serializer("price", {
    base: asset,
    quote: asset
});

var bitasset_options = exports.bitasset_options = new Serializer("bitasset_options", {
    feed_lifetime_sec: uint32,
    minimum_feeds: uint8,
    force_settlement_delay_sec: uint32,
    force_settlement_offset_percent: uint16,
    maximum_force_settlement_volume: uint16,
    short_backing_asset: asset_aid_type,
    extensions: optional(future_extensions)
});

var op_wrapper = exports.op_wrapper = new Serializer("op_wrapper", { op: operation });

var withdraw_permission_create = exports.withdraw_permission_create = new Serializer("withdraw_permission_create", {
    fee: fee,
    withdraw_from_account: account_uid_type,
    authorized_account: account_uid_type,
    withdrawal_limit: asset,
    withdrawal_period_sec: uint32,
    periods_until_expiration: uint32,
    period_start_time: time_point_sec
});

var withdraw_permission_update = exports.withdraw_permission_update = new Serializer("withdraw_permission_update", {
    fee: fee,
    withdraw_from_account: account_uid_type,
    authorized_account: account_uid_type,
    permission_to_update: protocol_id_type("withdraw_permission"),
    withdrawal_limit: asset,
    withdrawal_period_sec: uint32,
    period_start_time: time_point_sec,
    periods_until_expiration: uint32
});

var withdraw_permission_delete = exports.withdraw_permission_delete = new Serializer("withdraw_permission_delete", {
    fee: fee,
    withdraw_from_account: account_uid_type,
    authorized_account: account_uid_type,
    withdrawal_permission: protocol_id_type("withdraw_permission")
});

var chain_parameters = exports.chain_parameters = new Serializer("chain_parameters", {
    current_fees: fee_schedule,
    block_interval: uint8,
    maintenance_interval: uint32,
    maintenance_skip_slots: uint8,
    committee_proposal_review_period: uint32,
    maximum_transaction_size: uint32,
    maximum_block_size: uint32,
    maximum_time_until_expiration: uint32,
    maximum_proposal_lifetime: uint32,
    maximum_asset_whitelist_authorities: uint8,
    maximum_asset_feed_publishers: uint8,
    maximum_witness_count: uint16,
    maximum_committee_count: uint16,
    maximum_authority_membership: uint16,
    reserve_percent_of_fee: uint16,
    network_percent_of_fee: uint16,
    lifetime_referrer_percent_of_fee: uint16,
    cashback_vesting_period_seconds: uint32,
    cashback_vesting_threshold: int64,
    count_non_member_votes: bool,
    allow_non_member_whitelists: bool,
    witness_pay_per_block: int64,
    worker_budget_per_day: int64,
    max_predicate_opcode: uint16,
    fee_liquidation_threshold: int64,
    accounts_per_fee_scale: uint16,
    account_fee_scale_bitshifts: uint8,
    max_authority_depth: uint8,
    extensions: optional(future_extensions)
});

var committee_member_update_global_parameters = exports.committee_member_update_global_parameters = new Serializer("committee_member_update_global_parameters", {
    fee: fee,
    new_parameters: chain_parameters
});

var linear_vesting_policy_initializer = exports.linear_vesting_policy_initializer = new Serializer("linear_vesting_policy_initializer", {
    begin_timestamp: time_point_sec,
    vesting_cliff_seconds: uint32,
    vesting_duration_seconds: uint32
});

var cdd_vesting_policy_initializer = exports.cdd_vesting_policy_initializer = new Serializer("cdd_vesting_policy_initializer", {
    start_claim: time_point_sec,
    vesting_seconds: uint32
});

var vesting_policy_initializer = static_variant([linear_vesting_policy_initializer, cdd_vesting_policy_initializer]);

var vesting_balance_create = exports.vesting_balance_create = new Serializer("vesting_balance_create", {
    fee: fee,
    creator: account_uid_type,
    owner: account_uid_type,
    amount: asset,
    policy: vesting_policy_initializer
});

var vesting_balance_withdraw = exports.vesting_balance_withdraw = new Serializer("vesting_balance_withdraw", {
    fee: fee,
    vesting_balance: protocol_id_type("vesting_balance"),
    owner: account_uid_type,
    amount: asset
});

var custom = exports.custom = new Serializer("custom", {
    fee: fee,
    payer: account_uid_type,
    required_auths: set(account_uid_type),
    id: uint16,
    data: bytes()
});

var account_name_eq_lit_predicate = exports.account_name_eq_lit_predicate = new Serializer("account_name_eq_lit_predicate", {
    account_id: account_uid_type,
    name: string
});

var asset_symbol_eq_lit_predicate = exports.asset_symbol_eq_lit_predicate = new Serializer("asset_symbol_eq_lit_predicate", {
    asset_id: asset_aid_type,
    symbol: string
});

var block_id_predicate = exports.block_id_predicate = new Serializer("block_id_predicate", { id: bytes(20) });

var predicate = static_variant([account_name_eq_lit_predicate, asset_symbol_eq_lit_predicate, block_id_predicate]);

var assert = exports.assert = new Serializer("assert", {
    fee: fee,
    fee_paying_account: account_uid_type,
    predicates: array(predicate),
    required_auths: set(account_uid_type),
    extensions: optional(future_extensions)
});

// export const override_transfer = new Serializer(
//     "override_transfer",
//     {
//         fee: fee,
//         issuer: account_uid_type,
//         from: account_uid_type,
//         to: account_uid_type,
//         amount: asset,
//         memo: optional(memo_data),
//         extensions: optional(future_extensions)
//     }
// );

var stealth_confirmation = exports.stealth_confirmation = new Serializer("stealth_confirmation", {
    one_time_key: public_key,
    to: optional(public_key),
    encrypted_memo: bytes()
});

var blind_output = exports.blind_output = new Serializer("blind_output", {
    commitment: bytes(33),
    range_proof: bytes(),
    owner: authority,
    stealth_memo: optional(stealth_confirmation)
});

var transfer_to_blind = exports.transfer_to_blind = new Serializer("transfer_to_blind", {
    fee: fee,
    amount: asset,
    from: account_uid_type,
    blinding_factor: bytes(32),
    outputs: array(blind_output)
});

var blind_input = exports.blind_input = new Serializer("blind_input", {
    commitment: bytes(33),
    owner: authority
});

var blind_transfer = exports.blind_transfer = new Serializer("blind_transfer", {
    fee: fee,
    inputs: array(blind_input),
    outputs: array(blind_output)
});

var transfer_from_blind = exports.transfer_from_blind = new Serializer("transfer_from_blind", {
    fee: fee,
    amount: asset,
    to: account_uid_type,
    blinding_factor: bytes(32),
    inputs: array(blind_input)
});

var asset_settle_cancel = exports.asset_settle_cancel = new Serializer("asset_settle_cancel", {
    fee: fee,
    settlement: protocol_id_type("force_settlement"),
    account: account_uid_type,
    amount: asset,
    extensions: set(future_extensions)
});

// export const asset_claim_fees = new Serializer(
//     "asset_claim_fees",
//     {
//         fee: fee,
//         issuer: account_uid_type,
//         amount_to_claim: asset,
//         extensions: set(future_extensions)
//     }
// );

//--------------------------------- ================================================================================================================================
//  op order by op_types          | ================================================================================================================================
//--------------------------------- ================================================================================================================================

/**
 * 备注结构
 * @type {Serializer}
 */
var memo_data = exports.memo_data = new Serializer("memo_data", {
    from: public_key, // 转出账号备注公钥
    to: public_key, // 转入账号备注公钥
    nonce: uint64, // 随机数
    message: bytes() // 备注信息
});

/**
 * 转账操作拓展信息
 * @type {Serializer}
 */
var transfer_option = exports.transfer_option = new Serializer("transfer_option", {
    from_balance: optional(asset), // 从余额转出金额
    from_prepaid: optional(asset), // 从零钱包转出金额
    to_balance: optional(asset), // 转入到余额
    to_prepaid: optional(asset), // 转入到零钱包
    sign_platform: optional(account_uid_type) // sign by platform account
});

/**
 * TODO: op_type = 0    只从零钱包转出时需要 secondary 权限；如果有部分是从余额转出，则需要 active 权限
 * 转账
 * 如果出现 from_balance 和/或 from_prepaid ，则需满足 from_balance + from_prepaid == amount
 * 如果都不出现，则默认全部从余额转出。
 * 如果出现 to_balance 和/或 to_prepaid ，则需满足 to_balance + to_prepaid == amount
 * 如果都不出现，则默认全部转入到余额。
 * 如果 from 和 to 相同，则只能从余额转入到零钱包，或者从零钱包转入到余额
 * @type {Serializer}
 */
var transfer = exports.transfer = new Serializer("transfer", {
    fee: fee, // 手续费
    from: account_uid_type, // 转出账号
    to: account_uid_type, // 转入账号
    amount: asset, // 转账内容（金额、资产类型）
    memo: optional(memo_data), // 备注（可选）
    extensions: optional(extension(transfer_option)) // 扩展字段
});

/**
 * 账号对象注册信息
 * @type {Serializer}
 */
var account_reg_info = exports.account_reg_info = new Serializer("account_reg_info", {
    registrar: account_uid_type, // 注册商
    referrer: account_uid_type, // 引荐人
    registrar_percent: uint16, // 注册商分成比例
    referrer_percent: uint16, // 引荐人分成比例
    allowance_per_article: asset, // 每文最低收入，文章收益低于此值无需分成
    max_share_per_article: asset, // 每篇文章最高分成金额
    max_share_total: asset, // 账号累积最高分成金额
    buyout_percent: uint16, // 买断价比例（参照账号累积最高分成金额）。买断后不再分成。默认 100%
    extensions: optional(set(future_extensions)) // 扩展字段
});

/**
 * TODO: op_type = 1    需要 active 权限。
 * 创建账号
 * 注册商才能注册账号。
 * @type {Serializer}
 */
var account_create = exports.account_create = new Serializer("account_create", {
    fee: fee, // 手续费
    uid: account_uid_type, // 新账号 uid
    name: string, // 昵称
    owner: authority, // 主控权限
    active: authority, // 资金权限
    secondary: authority, // 零钱权限
    memo_key: public_key, // 备注公钥
    reg_info: account_reg_info, // 注册信息
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * 账户管理参数
 * @type {Serializer}
 */
var account_manage_options = exports.account_manage_options = new Serializer("account_manage_options", {
    can_post: optional(bool), // 是否可以发帖
    can_reply: optional(bool), // 是否可以回帖
    can_rate: optional(bool) // 是否可以作评价
});

/**
 * TODO: op_type = 2    需要 active 权限
 * 账户管理：赋予/取消 发帖权限、回帖权限、评价权限
 * @type {Serializer}
 */
var account_manage = exports.account_manage = new Serializer("account_manage", {
    fee: fee, // 手续费
    executor: account_uid_type, // 管理者
    account: account_uid_type, // 被管理者
    options: optional(account_manage_options), // 管理参数
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 3    修改账号的 owner 或 active 需要 owner 权限，否则需要 active 权限
 * 账户授权修改
 * 这个操作用来修改/重设账号的授权结构，也可用来修改备注密钥。
 * 四个修改项必须至少出现一个。
 * @type {Serializer}
 */
var account_update_auth = exports.account_update_auth = new Serializer("account_update_auth", {
    fee: fee, // 手续费
    uid: account_uid_type, // 账号
    owner: optional(authority), // 新的主控权限（可选）
    active: optional(authority), // 新的资金权限（可选）
    secondary: optional(authority), // 新的零钱权限（可选）
    memo_key: optional(public_key), // 新的备注密钥（可选）
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 4    需要 active 权限
 * 账户独立密钥修改（以 key 改 key）
 * 这个操作只能用来修改 active 和 secondary 授权
 * 当上述授权中包含一个 key 时，可以用该 key 签名，将该 key 修改为其他 key
 * 如果账号包含多个 key ，该 key 只能修改自身，而不能修改其他 key 或者权重、阈值
 * 即使该 key 在授权中不是 100% 权重，仍然可以修改自身。
 * 可以由其他账号支付手续费，必须有付费账号的足够签名才能支付。
 * @type {Serializer}
 */
var account_update_key = exports.account_update_key = new Serializer("account_update_key", {
    fee: fee, // 手续费
    fee_paying_account: account_uid_type, // 手续费付费账号
    uid: account_uid_type, // 修改密钥的账户
    old_key: public_key, // 旧的密钥公钥
    new_key: public_key, // 新的密钥公钥
    update_active: bool, // 是否修改资金权限
    update_secondary: bool, // 是否修改零钱权限
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 5    需要 active 权限
 * 账户投票代理人修改
 * 代理人如果设置为  “PROXY_TO_SELF_ACCOUNT_UID” 宏，即数值 175 ，则为取消代理。
 * 如果当前没有设置代理，而是直接投票，那么，设置代理时，原有投票清空。
 * @type {Serializer}
 */
var account_update_proxy = exports.account_update_proxy = new Serializer("account_update_proxy", {
    fee: fee, // 手续费
    voter: account_uid_type, // 委托人
    proxy: account_uid_type, // 代理人
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 6    采集给自己需要 secondary 权限，采集给其他账号需要 active 权限。
 * 手续费币龄采集(币天领取)
 * @type {Serializer}
 */
var csaf_collect = exports.csaf_collect = new Serializer("csaf_collect", {
    fee: fee, // 手续费
    from: account_uid_type, // 采集币龄的账号
    to: account_uid_type, // 接收币龄的账号
    amount: asset, // 采集数量
    time: time_point_sec, // 采集时间 整分钟秒数 不得晚于头块，不得早于5分钟前
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 7    需要 active 权限。
 * 手续费币龄租借/修改租约/取消租约
 * @type {Serializer}
 */
var csaf_lease = exports.csaf_lease = new Serializer("csaf_lease", {
    fee: fee, // 手续费
    from: account_uid_type, // 借出账号
    to: account_uid_type, // 借入账号
    amount: asset, // 借出金额
    expiration: time_point_sec, // 过期时间
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 8    需要 active 权限
 * 创建理事会成员（成为候选理事）
 * @type {Serializer}
 */
var committee_member_create = exports.committee_member_create = new Serializer("committee_member_create", {
    fee: fee, // 手续费
    committee_member_account: account_uid_type, // 账号
    pledge: asset, // 押金
    url: string, // 介绍链接
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 9     需要 active 权限
 * 理事会成员信息修改 / 引退
 * 如果新的押金为 0 ，则引退。否则，押金必须不低于系统全局参数
 * 减少押金或者引退时，押金延期退回。
 * @type {Serializer}
 */
var committee_member_update = exports.committee_member_update = new Serializer("committee_member_update", {
    fee: fee, // 手续费
    account: account_uid_type, // 账号
    new_pledge: optional(asset), // 新的押金（可选）
    new_url: optional(string), // 新的介绍链接（可选）
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 10      需要 active 权限
 * 理事会选举（投票）
 * @type {Serializer}
 */
var committee_member_vote_update = exports.committee_member_vote_update = new Serializer("committee_member_vote_update", {
    fee: fee, // 手续费
    voter: account_uid_type, // 投票人
    committee_members_to_add: set(account_uid_type), // 新增投票的候选理事清单
    committee_members_to_remove: set(account_uid_type), // 移除投票的候选理事清单
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * 权限管理明细
 * @type {Serializer}
 */
var account_priviledge_update_options = exports.account_priviledge_update_options = new Serializer("account_priviledge_update_options", {
    can_vote: optional(bool), // 是否有投票权（见证人、理事会）       需要 4 票
    is_admin: optional(bool), // 是否管理员（用于内容平台）          需要 3 票
    is_registrar: optional(bool), // 是否注册商                        需要 4 票
    takeover_registrar: optional(account_uid_type) // 指定接管注册商账号                 需要 4 票
});

/**
 * 账户权限管理类提案单项
 * @type {Serializer}
 */
var committee_update_account_priviledge_item_type = exports.committee_update_account_priviledge_item_type = new Serializer("committee_update_account_priviledge_item_type", {
    account: account_uid_type, // 目标账号
    new_priviledges: extension(account_priviledge_update_options) // 新的权限管理明细
});

/**
 * 手续费费率表管理类提案单项
 * @type {Serializer}
 */
var committee_update_fee_schedule_item_type = exports.committee_update_fee_schedule_item_type = new Serializer("committee_update_fee_schedule_item_type", {
    //TODO:未实现committee_update_fee_schedule_item_type类型
});

/**
 * 系统全局参数管理类提案单项
 * @type {Serializer}
 */
var committee_update_global_parameter_item_type = exports.committee_update_global_parameter_item_type = new Serializer("committee_update_global_parameter_item_type", {
    //TODO: 未实现committee_update_global_parameter_item_type类型
    committee_updatable_parameters: {
        maximum_transaction_size: optional(uint32),
        maximum_block_size: optional(uint32),
        maximum_time_until_expiration: optional(uint32),
        maximum_authority_membership: optional(uint16),
        max_authority_depth: optional(uint8),
        csaf_rate: optional(uint64),
        max_csaf_per_account: optional(share_type),
        csaf_accumulate_window: optional(uint64),
        min_witness_pledge: optional(uint64),
        max_witness_pledge_seconds: optional(uint64),
        witness_avg_pledge_update_interval: optional(uint32),
        witness_pledge_release_delay: optional(uint32),
        min_governance_voting_balance: optional(uint64),
        governance_voting_expiration_blocks: optional(uint32),
        governance_votes_update_interval: optional(uint32),
        max_governance_votes_seconds: optional(uint64),
        max_witnesses_voted_per_account: optional(uint16),
        max_witness_inactive_blocks: optional(uint32),
        by_vote_top_witness_pay_per_block: optional(share_type),
        by_vote_rest_witness_pay_per_block: optional(share_type),
        by_pledge_witness_pay_per_block: optional(share_type),
        by_vote_top_witness_count: optional(uint16),
        by_vote_rest_witness_count: optional(uint16),
        by_pledge_witness_count: optional(uint16),
        budget_adjust_interval: optional(uint32),
        budget_adjust_target: optional(uint16),
        min_committee_member_pledge: optional(uint64),
        committee_member_pledge_release_delay: optional(uint32),
        witness_report_prosecution_period: optional(uint32),
        witness_report_allow_pre_last_block: optional(bool),
        witness_report_pledge_deduction_amount: optional(share_type),
        platform_min_pledge: optional(uint64),
        platform_pledge_release_delay: optional(uint32),
        platform_max_vote_per_account: optional(uint16),
        platform_max_pledge_seconds: optional(uint64),
        platform_avg_pledge_update_interval: optional(uint32)
    }
});

/**
 * 提案内容单项
 */
var committee_proposal_item_type = static_variant([committee_update_account_priviledge_item_type, // 账户权限管理类提案单项
committee_update_fee_schedule_item_type, // 手续费费率表管理类提案单项
committee_update_global_parameter_item_type // 系统全局参数管理类提案单项
]);

/**
 * 表决意见
 */
var opinion_against = -1,
    opinion_neutral = 0,
    opinion_for = 1;
var voting_opinion_type = static_variant([opinion_against, // 反对
opinion_neutral, // 中立
opinion_for // 赞成
]);

/**
 * TODO: op_type = 11       需要 active 权限
 * 理事会提案创建
 * @type {Serializer}
 */
var committee_proposal_create = exports.committee_proposal_create = new Serializer("committee_proposal_create", {
    fee: fee, // 手续费
    proposer: account_uid_type, // 提案人
    items: array(committee_proposal_item_type), // 提案内容清单
    voting_closing_block_num: uint32, // 投票截止时间（块号）
    execution_block_num: uint32, // 提案计划执行时间（块号）
    expiration_block_num: uint32, // 提案过期时间（块号）
    proposer_opinion: optional(voting_opinion_type), // 提案人表决意见（可选）
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 12       需要 active 权限
 * 理事会提案表决
 * @type {Serializer}
 */
var committee_proposal_update = exports.committee_proposal_update = new Serializer("committee_proposal_update", {
    fee: fee, // 手续费
    account: account_uid_type, // 表决账号
    proposal_number: uint64, // 提案编号
    opinion: voting_opinion_type, // 表决意见
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 13        需要 active 权限
 * 创建见证人
 * 公钥设置为 YYW1111111111111111111111111111111114T1Anm ，则不安排出块
 * 押金必须不低于系统全局参数
 * @type {Serializer}
 */
var witness_create = exports.witness_create = new Serializer("witness_create", {
    fee: fee, // 手续费
    witness_account: account_uid_type, // 见证人账号
    block_signing_key: public_key, // 出块签名公钥
    pledge: asset, // 押金
    url: string, // 介绍链接
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 14       需要 active 权限
 * 修改见证人信息 / 见证人引退
 * 新的押金设置为 0 ，则见证人引退。否则，押金必须不低于系统全局参数。
 * 减少押金或者见证人引退时，押金延期退回
 * @type {Serializer}
 */
var witness_update = exports.witness_update = new Serializer("witness_update", {
    fee: fee, // 手续费
    account: account_uid_type, // 见证人账号
    new_signing_key: optional(public_key), // 新出块签名公钥（可选）
    new_pledge: optional(asset), // 新的抵押金额（可选）
    new_url: optional(string), // 新的介绍链接（可选）
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 15       需要 active 权限
 * 见证人投票
 * @type {Serializer}
 */
var witness_vote_update = exports.witness_vote_update = new Serializer("witness_vote_update", {
    fee: fee, // 手续费
    voter: account_uid_type, // 投票人账号
    witnesses_to_add: array(account_uid_type), // 新增投票见证人清单
    witnesses_to_remove: array(account_uid_type), // 移除投票见证人清单
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO op_type = 16        需要 active 权限
 * 领取见证人工资
 * @type {Serializer}
 */
var witness_collect_pay = exports.witness_collect_pay = new Serializer("witness_collect_pay", {
    fee: fee, // 手续费
    witness_account: account_uid_type, // 见证人账号
    pay: asset, // 领取金额
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 17       需要 secondary 权限
 * 举报见证人双出
 * @type {Serializer}
 */
var witness_report = exports.witness_report = new Serializer("witness_report", {
    fee: fee, // 手续费
    reporter: account_uid_type, // 举报人账号
    first_block: signed_block_header, // 举报块头一
    second_block: signed_block_header, // 举报块头二
    extensions: optional(future_extensions) // 扩展字段
});

var Recerptor_Parameter = exports.Recerptor_Parameter = new Serializer("Recerptor_Parameter", {
    cur_ratio: uint16,
    to_buyout: bool,
    buyout_ratio: uint16,
    buyout_price: share_type,
    buyout_expiration: time_point_sec,
    extensions: optional(future_extensions) // 扩展字段
});

var post_extensions = exports.post_extensions = new Serializer("post_extensions", {
    post_type: optional(uint8),
    forward_price: optional(share_type),
    license_lid: optional(license_lid_type),
    permission_flags: optional(uint32),
    receiptors: optional(map(account_uid_type, Recerptor_Parameter)),
    sign_platform: optional(account_uid_type) // sign by platform account
});

var post_update_extensions = exports.post_update_extensions = new Serializer("post_update_extensions", {
    forward_price: optional(share_type),
    receiptors: optional(account_uid_type),
    to_buyout: optional(bool),
    buyout_ratio: optional(uint16),
    buyout_price: optional(share_type),
    buyout_expiration: optional(time_point_sec),
    license_lid: optional(license_lid_type),
    permission_flags: optional(uint32),
    content_sign_platform: optional(account_uid_type), // sign by platform account
    receiptor_sign_platform: optional(account_uid_type) // sign by platform account
});

/**
 * TODO: op_type = 18       需要平台账号和作者账号的 secondary 权限同时签名。(授权平台，让平台同时签名)
 * 发文章
 * @type {Serializer}
 */
var post = exports.post = new Serializer("post", {
    fee: fee, // 手续费
    post_pid: post_pid_type, // 同一账号下帖子唯一标识（pid）
    platform: account_uid_type, // 平台账号
    poster: account_uid_type, // 作者账号
    origin_poster: optional(account_uid_type), // 如果是转帖，原帖作者账号（可选）
    origin_post_pid: optional(post_pid_type), // 如果是转帖，原帖 pid （可选）
    origin_platform: optional(account_uid_type), // 如果是转帖，原帖平台账号（可选）
    hash_value: string, // 帖子哈希值
    extra_data: string, // 帖子额外数据
    title: string, // 帖子标题
    body: string, // 帖子内容
    extensions: optional(extension(post_extensions)) // 扩展字段
});

/**
 * TODO: op_type = 19       需要平台账号和作者账号的 secondary 权限同时签名。(授权平台，让平台同时签名)
 * 更新文章
 * @type {Serializer}
 */
var post_update = exports.post_update = new Serializer("post_update", {
    fee: fee, // 手续费
    platform: account_uid_type, // 平台账号
    poster: account_uid_type, // 作者账号
    post_pid: post_pid_type, // 帖子 pid
    hash_value: optional(string), // 帖子哈希值（可选）
    extra_data: optional(string), // 帖子额外数据（可选）
    title: optional(string), // 帖子标题（可选）
    body: optional(string), // 帖子内容（可选）
    extensions: optional(extension(post_update_extensions)) // 扩展字段
});

/**
 * TODO: op_type = 20       需要 active 权限。
 * 创建平台
 * @type {Serializer}
 */
var platform_create = exports.platform_create = new Serializer("platform_create", {
    fee: fee, // 手续费
    account: account_uid_type, // 账号
    pledge: asset, // 押金
    name: string, // 平台名称
    url: string, // 链接
    extra_data: string, // 额外数据
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 21       需要 active 权限。
 * 修改平台信息 / 关闭平台
 * 押金设为 0 则为关闭平台。
 * @type {Serializer}
 */
var platform_update = exports.platform_update = new Serializer("platform_update", {
    fee: fee, // 手续费
    account: account_uid_type, // 账号
    new_pledge: optional(asset), // 新的押金（可选）
    new_name: optional(string), // 新的名称（可选）
    new_url: optional(string), // 新的链接（可选）
    new_extra_data: optional(string), // 新的额外数据（可选）
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 22       需要 active 权限
 * 更改或刷新平台投票状态
 * @type {Serializer}
 */
var platform_vote_update = exports.platform_vote_update = new Serializer("platform_vote_update", {
    fee: fee, // 手续费
    voter: account_uid_type, // 投票人账号
    platform_to_add: array(account_uid_type), // 新增投票平台清单
    platform_to_remove: array(account_uid_type), // 移除投票平台清单
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 23       需要 active 权限
 * 授权平台
 * @type {Serializer}
 */

var account_auth_platform_ext = exports.account_auth_platform_ext = new Serializer("account_auth_platform_ext", {
    limit_for_platform: optional(share_type),
    permission_flags: optional(uint32),
    memo: optional(memo_data)
});

var account_auth_platform = exports.account_auth_platform = new Serializer("account_auth_platform", {
    fee: fee, // 手续费
    uid: account_uid_type, // 授权账户
    platform: account_uid_type, // 平台账户
    extensions: optional(extension(account_auth_platform_ext)) // 扩展字段
});

/**
 * TODO: op_type = 24       需要 active 权限
 * 取消平台授权
 * @type {Serializer}
 */
var account_cancel_auth_platform = exports.account_cancel_auth_platform = new Serializer("account_cancel_auth_platform", {
    fee: fee, // 手续费
    uid: account_uid_type, // 授权账户
    platform: account_uid_type, // 平台账户
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * 资产参数集合、资产发行人权限集合的内部结构
 */
// var white_list = 0x02, override_authority = 0x04, transfer_restricted = 0x08, issue_asset = 0x200, change_max_supply = 0x400;
// var asset_flags_type = static_variant([
//     white_list,             // 白名单，如果启用，则该资产发行人可以控制他人是否可以使用该资产（这里的“使用”包含转账等操作）
//     override_authority,     // 强制转账，如果启用，则该资产发行人可以强制转走或者收回其他人账户里的该类资产
//     transfer_restricted,    // 限制转账，如果启用，则转账的发起者或者接收者必须是该资产发行人
//     issue_asset,            // 发行资产，如果启用，则该资产发行人可以增加一定数量的该类资产到某账户，同时增加该资产的当前流通总量
//     change_max_supply       // 修改流通量上限，如果启用，则该资产发行人可以修改该资产的流通量上限
// ]);

/**
 * 资产选项结构
 * @type {Serializer}
 */
var asset_options = exports.asset_options = new Serializer("asset_options", {
    max_supply: int64, // 流通量上限
    market_fee_percent: uint16, // 交易手续费百分比（预留字段，暂未使用，必须为 0 ）
    max_market_fee: int64, // 交易手续费最大值（预留字段，暂未使用，必须为 0 ）
    issuer_permissions: asset_flags_type, // 资产发行人权限集合（表示发行人是否有权修改 flags 字段中某些标志位）
    flags: asset_flags_type, // 资产参数集合
    whitelist_authorities: set(account_uid_type), // 资产白名单管理员清单
    blacklist_authorities: set(account_uid_type), // 资产黑名单管理员清单
    whitelist_markets: set(asset_aid_type), // 交易对白名单（预留字段，暂未使用，必须为空）
    blacklist_markets: set(asset_aid_type), // 交易对黑名单（预留字段，暂未使用，必须为空）
    description: string, // 资产描述
    extensions: optional(future_extensions) // 资产选项扩展字段
});

// export const asset_options = new Serializer(
//     "asset_options",
//     {
//         max_supply: int64,
//         market_fee_percent: uint16,
//         max_market_fee: int64,
//         issuer_permissions: uint16,
//         flags: uint16,
//         core_exchange_rate: price,
//         whitelist_authorities: set(account_uid_type),
//         blacklist_authorities: set(account_uid_type),
//         whitelist_markets: set(asset_aid_type),
//         blacklist_markets: set(asset_aid_type),
//         description: string,
//         extensions: optional(future_extensions)
//     }
// );

/**
 * “创建资产”操作的扩展字段里使用的数据类型
 * 如果创建资产时指定初始流通量，创建成功后，该数量的该类资产会立即加入到创建人账户。
 * 初始流通量不能超过流通量上限。
 * @type {Serializer}
 */
var asset_create_option = exports.asset_create_option = new Serializer("asset_create_option", {
    initial_supply: optional(share_type) // 初始流通量
});

/**
 * TODO: op_type = 25       需要 active 权限
 * 创建资产
 * 创建一种新的资产类型。创建成功后，该创建人（账户）为该资产类型的初始“发行人”。
 * 资产代码必须大写英文字母开头，大写英文字母或者数字结尾，可以包含大写英文字母、数字、一个小数点，最短 3 位，最长 16 位。
 * 精度不能大于 12 .
 * @type {Serializer}
 */
var asset_create = exports.asset_create = new Serializer("asset_create", {
    fee: fee, // 手续费
    issuer: account_uid_type, // 拥有者UID
    symbol: string, // 符号
    precision: uint8, // 精度
    common_options: asset_options, // 资产选项
    extensions: optional(extension(asset_create_option)) // 扩展字段
});

/**
 * TODO: op_type = 26       需要 active 权限
 * 更新资产
 * @type {Serializer}
 */
var asset_update = exports.asset_update = new Serializer("asset_update", {
    fee: fee, // 手续费
    issuer: account_uid_type, // 拥有者UID
    asset_to_update: asset_aid_type, // 需更新的资产ID
    new_precision: optional(uint8), // 新的精度（可选）
    new_options: asset_options, // 新资产选项
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 27      需要 active 权限
 * 发行资产
 * 增加指定数量的指定资产类型到指定目的账户。该资产的当前流通量会相应增加。
 * 指定资产类型必须启用了“发行资产”标志位。操作完成后，该资产的当前流通量不得超过该资产设定的流通量上限。
 * 一般使用资产发行人的备注密钥对备注进行加密，目的账户用自己的备注密钥解密。
 * @type {Serializer}
 */
var asset_issue = exports.asset_issue = new Serializer("asset_issue", {
    fee: fee, // 手续费
    issuer: account_uid_type, // 拥有者UID
    asset_to_issue: asset, // 发行的数量
    issue_to_account: account_uid_type, // 目标账号UID
    memo: optional(memo_data), // 备注
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 28       需要 active 权限
 * 回收/销毁资产
 * 从自己余额中销毁，系统为从当前发行量上扣除
 * @type {Serializer}
 */
var asset_reserve = exports.asset_reserve = new Serializer("asset_reserve", {
    fee: fee, // 手续费
    payer: account_uid_type, // 操作人UID
    amount_to_reserve: asset, // 销毁数量（数量及资产类型）
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 29       需要 active 权限
 * 提取资产在市场上收取的费用到所有者账户
 * @type {Serializer}
 */
var asset_claim_fees = exports.asset_claim_fees = new Serializer("asset_claim_fees", {
    fee: fee, // 手续费
    issuer: account_uid_type, // 拥有者UID
    amount_to_claim: asset, // 提取数量（数量及资产类型）
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 30       需要 active 权限
 * 资产所有者覆盖/强制转账
 * 资产所有者在允许此操作时，就可以在任意有此资产人账户中转移资产
 * @type {Serializer}
 */
var override_transfer = exports.override_transfer = new Serializer("override_transfer", {
    fee: fee, // 手续费
    issuer: account_uid_type, // 资产拥有者UID
    from: account_uid_type, // 转出账户
    to: account_uid_type, // 转入账户
    amount: asset, // 交易数量（数量及资产类型）
    memo: optional(memo_data), // 备注
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 31       施工中
 * 提案创建
 * @type {Serializer}
 */
var proposal_create = exports.proposal_create = new Serializer("proposal_create", {
    fee: fee,
    fee_paying_account: account_uid_type,
    expiration_time: time_point_sec,
    proposed_ops: array(op_wrapper),
    review_period_seconds: optional(uint32),
    extensions: optional(future_extensions)
});

/**
 * TODO: op_type = 32       施工中
 * 提案修改
 * @type {Serializer}
 */
var proposal_update = exports.proposal_update = new Serializer("proposal_update", {
    fee: fee,
    fee_paying_account: account_uid_type,
    proposal: protocol_id_type("proposal"),
    active_approvals_to_add: set(account_uid_type),
    active_approvals_to_remove: set(account_uid_type),
    owner_approvals_to_add: set(account_uid_type),
    owner_approvals_to_remove: set(account_uid_type),
    key_approvals_to_add: set(public_key),
    key_approvals_to_remove: set(public_key),
    extensions: optional(future_extensions)
});

/**
 * TODO: op_type = 33       施工中
 * 提案删除
 * @type {Serializer}
 */
var proposal_delete = exports.proposal_delete = new Serializer("proposal_delete", {
    fee: fee,
    fee_paying_account: account_uid_type,
    using_owner_authority: bool,
    proposal: protocol_id_type("proposal"),
    extensions: optional(future_extensions)
});

/**
 * TODO: op_type = 34           需要 active 权限。
 * 启用/停用账户端资产白名单
 * 如果启用，则该账户只可转入、转出白名单内的资产类型；如果停用，则该账户可以转入、转出所有资产类型。
 * 从停用状态变成启用状态时，白名单中默认只有“核心资产”，即 YOYO 。
 * @type {Serializer}
 */
var account_enable_allowed_assets = exports.account_enable_allowed_assets = new Serializer("account_enable_allowed_assets", {
    fee: fee, // 手续费
    account: account_uid_type, // 账户
    enable: bool, // 是否启用白名单
    extensions: optional(future_extensions) // 扩展字段
});

/**
 * TODO: op_type = 35            新增需要 secondary权限 其他需要 active权限
 * 更新账户端资产白名单
 */
var account_update_allowed_assets = exports.account_update_allowed_assets = new Serializer("account_update_allowed_assets", {
    fee: fee, // 手续费
    account: account_uid_type, // 账户
    assets_to_add: array(asset_aid_type), // 增加到白名单的资产类型清单
    assets_to_remove: array(asset_aid_type), // 从白名单中删除的资产类型清单
    extensions: optional(future_extensions) // 扩展字段
});

// ======================================================================================================================================================================

var score_create = exports.score_create = new Serializer("score_create", {
    fee: fee,
    from_account_uid: account_uid_type,
    platform: account_uid_type, // 平台账号
    poster: account_uid_type,
    post_pid: post_pid_type,
    score: int8,
    csaf: share_type,
    sign_platform: optional(account_uid_type), // sign by platform account
    extensions: optional(future_extensions)
});

var reward = exports.reward = new Serializer("reward", {
    fee: fee,
    from_account_uid: account_uid_type,
    platform: account_uid_type, // 平台账号
    poster: account_uid_type,
    post_pid: post_pid_type,
    amount: asset,
    extensions: optional(future_extensions)
});

var reward_proxy = exports.reward_proxy = new Serializer("reward_proxy", {
    fee: fee,
    from_account_uid: account_uid_type,
    platform: account_uid_type, // 平台账号
    poster: account_uid_type,
    post_pid: post_pid_type,
    amount: share_type,
    sign_platform: optional(account_uid_type), // sign by platform account
    extensions: optional(future_extensions)
});

var buyout = exports.buyout = new Serializer("buyout", {
    fee: fee,
    from_account_uid: account_uid_type,
    platform: account_uid_type, // 平台账号
    poster: account_uid_type,
    post_pid: post_pid_type,
    receiptor_account_uid: account_uid_type,
    sign_platform: optional(account_uid_type), // sign by platform account
    extensions: optional(future_extensions)
});

var license_create = exports.license_create = new Serializer("license_create", {
    fee: fee,
    license_lid: license_lid_type,
    platform: account_uid_type, // 平台账号
    type: uint8,
    hash_value: string,
    extra_data: string,
    title: string,
    body: string,
    extensions: optional(future_extensions)
});

var custom_vote_create = exports.custom_vote_create = new Serializer("custom_vote_create", {
    fee: fee,
    custom_vote_creater: account_uid_type,
    vote_vid: custom_vote_vid_type,
    title: string,
    description: string,
    vote_expired_time: time_point_sec,
    vote_asset_id: asset_aid_type,
    required_asset_amount: share_type,
    minimum_selected_items: uint8,
    maximum_selected_items: uint8,
    options: array(string),
    extensions: optional(future_extensions)
});

var custom_vote_cast = exports.custom_vote_cast = new Serializer("custom_vote_cast", {
    fee: fee,
    voter: account_uid_type,
    custom_vote_creater: account_uid_type,
    custom_vote_vid: custom_vote_vid_type,
    vote_result: set(uint8),
    extensions: optional(future_extensions)
});

var advertising_create = exports.advertising_create = new Serializer("advertising_create", {
    fee: fee,
    advertising_aid: advertising_aid_type,
    platform: account_uid_type, // 平台账号
    unit_time: optional(uint32),
    unit_price: optional(share_type),
    description: optional(string),
    extensions: optional(future_extensions)
});

var advertising_update = exports.advertising_update = new Serializer("advertising_update", {
    fee: fee,
    platform: account_uid_type, // 平台账号
    advertising_aid: advertising_aid_type,
    description: optional(string),
    unit_price: optional(share_type),
    unit_time: optional(uint32),
    on_sell: optional(bool),
    extensions: optional(future_extensions)
});

var advertising_buy = exports.advertising_buy = new Serializer("advertising_buy", {
    fee: fee,
    advertising_order_oid: advertising_order_oid_type,
    from_account: account_uid_type,
    platform: account_uid_type, // 平台账号
    advertising_aid: advertising_aid_type,
    start_time: time_point_sec,
    buy_number: uint32,
    extra_data: string,
    memo: optional(memo_data),
    extensions: optional(future_extensions)
});

var advertising_confirm = exports.advertising_confirm = new Serializer("advertising_confirm", {
    fee: fee,
    platform: account_uid_type, // 平台账号
    advertising_aid: advertising_aid_type,
    advertising_order_oid: advertising_order_oid_type,
    isconfirm: bool,
    extensions: optional(future_extensions)
});

var advertising_ransom = exports.advertising_ransom = new Serializer("advertising_ransom", {
    fee: fee,
    from_account: account_uid_type,
    platform: account_uid_type, // 平台账号
    advertising_aid: advertising_aid_type,
    advertising_order_oid: advertising_order_oid_type,
    extensions: optional(future_extensions)
});

var withdraw_permission_claim = exports.withdraw_permission_claim = new Serializer("withdraw_permission_claim", {
    fee: fee,
    withdraw_permission: protocol_id_type("withdraw_permission"),
    withdraw_from_account: account_uid_type,
    withdraw_to_account: account_uid_type,
    amount_to_withdraw: asset,
    memo: optional(memo_data)
});

/**
 * 领取余额
 * @type {Serializer}
 */
var balance_claim = exports.balance_claim = new Serializer("balance_claim", {
    fee: fee,
    deposit_to_account: account_uid_type,
    balance_to_claim: protocol_id_type("balance"),
    balance_owner_key: public_key,
    total_claimed: asset
});

operation.st_operations = [transfer, // 0 转账
account_create, // 1 注册新账户
account_manage, // 2 账户管理（认证）
account_update_auth, // 3 账户授权修改
account_update_key, // 4 账户独立密钥修改（以 key 改 key）
account_update_proxy, // 5 账户投票代理人修改
csaf_collect, // 6 手续费币龄采集
csaf_lease, // 7 手续费币龄租借/修改租约/取消租约
committee_member_create, // 8 创建理事会成员（成为候选理事）
committee_member_update, // 9 理事会成员信息修改 / 引退
committee_member_vote_update, // 10 理事会选举
committee_proposal_create, // 11 理事会提案创建
committee_proposal_update, // 12 理事会提案表决
witness_create, // 13 创建见证人
witness_update, // 14 更新见证人
witness_vote_update, // 15 更改或刷新见证人投票状态
witness_collect_pay, // 16 领取见证人工资
witness_report, // 17 举报见证人双出
post, // 18 发帖/回帖
post_update, // 19 更新文章
platform_create, // 20 创建平台
platform_update, // 21 更新平台
platform_vote_update, // 22 更改或刷新平台投票状态
account_auth_platform, // 23 授权平台
account_cancel_auth_platform, // 24 取消平台授权
asset_create, // 25 创建资产
asset_update, // 26 修改资产
asset_issue, // 27 发行资产
asset_reserve, // 28 销毁资产
asset_claim_fees, // 29 提取资产在市场收取的费用
override_transfer, // 30 资产所有者覆盖转账
proposal_create, // 31 创建提案 （待完成）
proposal_update, // 32 修改提案 （待完成）
proposal_delete, // 33 删除提案 （待完成）
account_enable_allowed_assets, // 34 启用/停用账户端资产白名单
account_update_allowed_assets, // 35 更新账户端资产白名单
account_whitelist, // 36 更新账号白名单
score_create, //37 点赞
reward, //38 打赏
reward_proxy, //39 平台代理打赏
buyout, //40 买断
license_create, //41 创建许可
advertising_create, //42 创建广告位
advertising_update, //43 更新广告位
advertising_buy, //44 购买广告位
advertising_confirm, //45 确认/拒绝广告订单
advertising_ransom, //46  广告订单过期,赎回资金
custom_vote_create, //47 创建自定义广告
custom_vote_cast //48 对自定义投票参与投票
];

var transaction = exports.transaction = new Serializer("transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: optional(future_extensions)
});

var signed_transaction = exports.signed_transaction = new Serializer("signed_transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: optional(future_extensions),
    signatures: array(bytes(65))
});

//# -------------------------------
//#  Generated code end
//# -------------------------------

// Custom Types

var stealth_memo_data = exports.stealth_memo_data = new Serializer("stealth_memo_data", {
    from: optional(public_key),
    amount: asset,
    blinding_factor: bytes(32),
    commitment: bytes(33),
    check: uint32
});
// var stealth_confirmation = new Serializer(
//     "stealth_confirmation", {
//     one_time_key: public_key,
//     to: optional( public_key ),
//     encrypted_memo: stealth_memo_data
// })