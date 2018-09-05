/* Serializer */
import Serializer from "./serializer/src/serializer";
import fp from "./serializer/src/FastParser";
import types from "./serializer/src/types";
import * as ops from "./serializer/src/operations";
import template from "./serializer/src/template";
import SerializerValidation from "./serializer/src/SerializerValidation";


if (global && global["__LIB_DEBUG__"] == undefined) {
    global.__LIB_DEBUG__ = JSON.parse(process.env.npm_package_config_libdebug || false);
}

export { Serializer, fp, types, ops, template, SerializerValidation };

/* ECC */
import Address from "./ecc/src/address";
import Aes from "./ecc/src/aes";
import PrivateKey from "./ecc/src/PrivateKey";
import PublicKey from "./ecc/src/PublicKey";
import Signature from "./ecc/src/signature";
import brainKey from "./ecc/src/BrainKey";
import hash from "./ecc/src/hash";
import key from "./ecc/src/KeyUtils";

export { Address, Aes, PrivateKey, PublicKey, Signature, brainKey, hash, key };

/* Chain */
import TransactionBuilder  from "./chain/src/TransactionBuilder";
import ChainTypes from "./chain/src/ChainTypes";
import ObjectId from "./chain/src/ObjectId";
import NumberUtils from "./chain/src/NumberUtils";
import TransactionHelper from "./chain/src/TransactionHelper";
import ChainValidation from "./chain/src/ChainValidation";
import EmitterInstance from "./chain/src/EmitterInstance";
import AccountUtils from "./chain/src/AccountUtils";


export {TransactionBuilder, ChainTypes, EmitterInstance,
    ObjectId, NumberUtils, TransactionHelper, ChainValidation, AccountUtils }
