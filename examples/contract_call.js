import {Apis} from "yoyowjs-ws";
import {ChainStore, PrivateKey, TransactionHelper,ops,AbiSerializer} from "../lib";

let from = 455228287;
let contract_id = 479489400;
let active_key = "5KG3KKepSMJ7UMda94p9NDJKS3Gr9PKkkeNpwqjTF5PXCBWte4X";
let private_key = PrivateKey.fromWif(active_key);

async function get_abi(){
  const res = await Apis.instance().db_api().exec("get_accounts_by_uid",[[`${contract_id}`]]);
  if(res && res[0]){
    return res[0].abi;
  }
  throw `account ${contract_id} does not exists`
}
async function generate_op_data(abi){
  const parameters = await Apis.instance().db_api().exec("get_objects",[['2.0.0']]);
  let trx_cpu_limit = parameters[0].parameters.extension_parameters.trx_cpu_limit;
  const as = new AbiSerializer(abi,trx_cpu_limit);
  const data = as.encode(
    "transfer",
    {
      'from':from,
      'to':contract_id,
      'amount':'50'
    }
  );
  return {
    "fee": {
      "total": {
        "amount": 0,
        "asset_id": 0
      }
    },
    account:from,
    contract_id,
    method_name:"transfer",
    data:data.toString('hex')
  }
}

let contract_call = async (op_data) => {
    let fees = await TransactionHelper.process_transaction('contract_call_operation', op_data, from);
    console.log('get fees : ', fees);
    let result = await TransactionHelper.process_transaction('contract_call_operation', op_data, from, true, true, private_key, true)
    console.log('process result : ', result);
}

Apis.instance("wss://api.testnet.yoyow.one", true)
    .init_promise.then((res) => {
    // console.log("connected to:", res[0].network_name, "network");
    ChainStore.init().then(async () => {
      try{
        const abi = await get_abi();
        const op_data = await generate_op_data(abi);
        const op = ops['contract_call_operation'].fromObject(op_data);
        console.log("op",op);
        await contract_call(op_data);
      }catch(e){
        console.error(e);
      }finally{
        process.exit(0);
      }
    });
});


