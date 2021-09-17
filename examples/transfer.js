import {Apis} from "yoyowjs-ws";
import {ChainStore, PrivateKey, TransactionHelper} from "../lib";

let from = 455228287;
let to = 479489400;
let active_key = "5KG3KKepSMJ7UMda94p9NDJKS3Gr9PKkkeNpwqjTF5PXCBWte4X";
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

Apis.instance("wss://api.testnet.yoyow.one", true)
    .init_promise.then((res) => {
    // console.log("connected to:", res[0].network_name, "network");
    ChainStore.init().then(() => transfer());
});


