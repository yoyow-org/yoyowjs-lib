let ChainTypes = {};

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
    committee_member: 4,
    witness: 5,
    platform_object:6,
    post:7,
    committee_proposal:8,
    proposal:9,
    operation_history:10,
    active_post:11,
    limit_order: 12
};

ChainTypes.impl_object_type = {
    global_property: 0,
    dynamic_global_property: 1,
    asset_dynamic_data: 2,
    asset_bitasset_data: 4,
    account_balance: 5,
    account_statistics: 6,
    voter:7,
    witness_vote:8,
    committee_member_vote:9,
    registrar_takeover:10,
    csaf_lease:11,
    transaction: 12,
    block_summary: 13,
    account_transaction_history: 14,
    chain_property: 15,
    platform_vote: 16,
    score: 17,
    license: 18,
    advertising: 19,
    advertising_order: 20,
    custom_vote: 21,
    cast_custom_vote: 22,
    account_auth_platform: 23,
    pledge_mining: 24,
    pledge_balance: 25
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
    custom_vote_cast: 48, //48 参与自定义投票
    balance_lock_update: 49, //49 锁仓
    pledge_mining_update: 50, //抵押挖矿更新
    pledge_bonus_collect: 51, //收集抵押挖矿奖励
    limit_order_create: 52, //创建交易挂单
    limit_order_cancel: 53, //取消交易挂单,
    fill_order: 54,  // VIRTUAL
    market_fee_collect: 55, //交易费用收集
    score_bonus_collect: 56,
    beneficiary_assign: 57,
    benefit_collect: 58,
    contract_deploy_operation:59,//部署合约 TODO
    contract_call_operation:60,//调用合约
};

export default ChainTypes;
