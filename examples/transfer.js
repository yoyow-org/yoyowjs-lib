import {Apis} from "yoyowjs-ws";
import {ChainStore, PrivateKey, TransactionHelper} from "../lib";

let from = 230376628;
let to = 217895094;
let active_key = "5KPBRwmiiXqVHoiWnaVW8w1wgMHNG897LdLV7MSLAA28LJcG6Ff";
let private_key = PrivateKey.fromWif(active_key);
let amount = { amount: 100000, asset_id: 0 };
let op_data = { from, to, amount };

let transfer = async () => {
    let fees = await TransactionHelper.process_transaction('transfer', op_data, from);
    console.log('get fees : ', fees);
    let result = await TransactionHelper.process_transaction('transfer', op_data, from, true, true, private_key, true)
    console.log('process result : ', result);
    process.exit(0);
}

Apis.instance("ws://47.52.155.181:10011", true)
    .init_promise.then((res) => {
    console.log("connected to:", res[0].network_name, "network");
    ChainStore.init().then(() => transfer());
});


