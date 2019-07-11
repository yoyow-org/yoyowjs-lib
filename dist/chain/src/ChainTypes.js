"use strict";

exports.__esModule = true;
var ChainTypes = {};

ChainTypes.reserved_spaces = {
    relative_protocol_ids: 0,
    protocol_ids: 1,
    implementation_ids: 2
};

ChainTypes.object_type = {
    "null": 0,
    base: 1,
    account: 2,
    asset: 3,
    force_settlement: 4,
    committee_member: 5,
    witness: 6,
    limit_order: 7,
    call_order: 8,
    custom: 9,
    proposal: 10,
    operation_history: 11,
    withdraw_permission: 12,
    vesting_balance: 13,
    worker: 14,
    balance: 15
};

ChainTypes.impl_object_type = {
    global_property: 0,
    dynamic_global_property: 1,
    index_meta: 2,
    asset_dynamic_data: 3,
    asset_bitasset_data: 4,
    account_balance: 5,
    account_statistics: 6,
    transaction: 7,
    block_summary: 8,
    account_transaction_history: 9,
    blinded_balance: 10,
    chain_property: 11,
    witness_schedule: 12,
    budget_record: 13
};

ChainTypes.vote_type = {
    committee: 0,
    witness: 1,
    worker: 2
};

ChainTypes.operations = {
    transfer: 0,
    account_create: 1,
    account_manage: 2,
    account_update_auth: 3,
    account_update_key: 4,
    account_update_proxy: 5,
    csaf_collect: 6,
    csaf_lease: 7,
    committee_member_create: 8, //创建理事会成员（成为候选理事）
    committee_member_update: 9, //理事会成员信息修改 / 引退
    committee_member_vote_update: 10, //理事会选举
    committee_proposal_create: 11, //理事会提案创建
    committee_proposal_update: 12, //理事会提案表决
    witness_create: 13,
    witness_update: 14,
    witness_vote_update: 15,
    witness_collect_pay: 16,
    witness_report: 17,
    post: 18,
    post_update: 19,
    platform_create: 20,
    platform_update: 21,
    platform_vote_update: 22,
    account_auth_platform: 23,
    account_cancel_auth_platform: 24,
    asset_create: 25, //创建资产
    asset_update: 26, //修改资产
    asset_issue: 27, //发行资产
    asset_reserve: 28, //销毁资产
    asset_claim_fees: 29, //提取资产在市场收取的费用
    override_transfer: 30, //资产所有者覆盖转账
    proposal_create: 31, //创建提案 （待完成）  
    proposal_update: 32, //修改提案 （待完成）
    proposal_delete: 33, //删除提案 （待完成）
    account_enable_allowed_assets: 34, //启用/停用账户端资产白名单
    account_update_allowed_assets: 35, //更新账户端资产白名单
    account_whitelist: 36, // 36 更新账号白名单
    score_create: 37, //37 点赞
    reward: 38, //38 打赏
    reward_proxy: 39, //39 平台代理打赏
    buyout: 40, //40 买断
    license_create: 41, //41 创建许可
    advertising_create: 42, //42 创建广告位
    advertising_update: 43, //43 更新广告位
    advertising_buy: 44, //44 购买广告位
    advertising_confirm: 45, //45 确认/拒绝广告订单
    advertising_ransom: 46, //46  广告订单过期,赎回资金
    custom_vote_create: 47, //47 创建自定义投票
    custom_vote_cast: 48 //48 参与自定义投票
};

exports.default = ChainTypes;
module.exports = exports["default"];