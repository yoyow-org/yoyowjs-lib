import { Apis } from "yoyowjs-ws";
import { ChainStore } from "../lib";

Apis.instance("wss://api.testnet.yoyow.one/", true).init_promise.then((res) => {
    console.log(res);
    console.log("connected to:", res[0].network);
    ChainStore.init().then(() => ChainStore.subscribe(updateState));
});

let updateState = op => {
    console.log('notice ', op);
}
