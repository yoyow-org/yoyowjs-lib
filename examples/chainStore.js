import { Apis } from "yoyowjs-ws";
import { ChainStore } from "../lib";

Apis.instance("ws://47.52.155.181:10011", true).init_promise.then((res) => {
    console.log("connected to:", res[0].network);
    ChainStore.init().then(() => ChainStore.subscribe(updateState));
});

let updateState = op => {
    console.log('notice ', op);
}
