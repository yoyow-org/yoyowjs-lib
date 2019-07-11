import {Apis} from "yoyowjs-ws";
import {ChainStore, PrivateKey, TransactionHelper, ops} from "../dist";

console.log(ops.score_create);


let from_account_uid = 33240;
let platform = 33313;
let poster=30833;
let post_pid=2;
let score= 5;
let csaf=1111111;
let active_key = "5J2nZArL1yiVzJUoHwMR4fuSsAVVV6EgTbGw8DjFTL1qi6P8NQs";
let private_key = PrivateKey.fromWif(active_key);

let op_data = { from_account_uid, platform, poster, post_pid, score, csaf };

let transfer = async () => {
    let fees = await TransactionHelper.process_transaction('score_create', op_data, from_account_uid);
    console.log('get fees : ', fees);
    let result = await TransactionHelper.process_transaction('score_create', op_data, from_account_uid, true, true, private_key, true)
    console.log('process result : ', result);
    process.exit(0);
}

Apis.instance("ws://192.168.0.2:11011", true)
    .init_promise.then((res) => {
    console.log("connected to:", res[0].network_name, "network");
    ChainStore.init().then(() => transfer());
});


