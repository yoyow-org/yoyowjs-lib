import PrivateKey from "../../ecc/src/PrivateKey";
import key from "../../ecc/src/KeyUtils";
import ByteBuffer from "bytebuffer";
import {hash} from "../../ecc";
import {Long} from 'bytebuffer';

import {get, set} from "./state";

var _keyCachePriv = {};
var _keyCachePub = {};

class AccountUtils {

    constructor() {
        let state = {loggedIn: false, roles: ["secondary", "active", "owner", "memo"]};
        this.get = get(state);
        this.set = set(state);

        this.subs = {};
    }

    addSubscription(cb) {
        this.subs[cb] = cb;
    }

    setRoles(roles) {
        this.set("roles", roles);
    }

    generateKeys(accountName, password, roles, prefix) {
        var start = new Date().getTime();
        if (!accountName || !password) {
            throw new Error("Account name or password required");
        }
        if (password.length < 12) {
            throw new Error("Password must have at least 12 characters");
        }

        let privKeys = {};
        let pubKeys = {};

        (roles || this.get("roles")).forEach(role => {
            let seed = accountName + role + password;
            let pkey = _keyCachePriv[seed] ? _keyCachePriv[seed] : PrivateKey.fromSeed(key.normalize_brainKey(seed));
            _keyCachePriv[seed] = pkey;

            privKeys[role] = pkey;
            pubKeys[role] = _keyCachePub[seed] ? _keyCachePub[seed] : pkey.toPublicKey().toString(prefix);

            _keyCachePub[seed] = pubKeys[role];
        });

        return {privKeys, pubKeys};
    }

    checkKeys({accountName, password, auths}) {
        if (!accountName || !password || !auths) {
            throw new Error("checkKeys: Missing inputs");
        }
        let hasKey = false;

        for (let role in auths) {
            let {privKeys, pubKeys} = this.generateKeys(accountName, password, [role]);
            auths[role].forEach(key => {
                if (key[0] === pubKeys[role]) {
                    hasKey = true;
                    this.set(role, {priv: privKeys[role], pub: pubKeys[role]});
                }
            });
        }
        ;

        if (hasKey) {
            this.set("name", accountName);
        }

        this.set("loggedIn", hasKey);

        return hasKey;
    }

    signTransaction(tr) {
        let myKeys = {};
        let hasKey = false;

        this.get("roles").forEach(role => {
            let myKey = this.get(role);
            if (myKey) {
                hasKey = true;
                console.log("adding signer:", myKey.pub);
                tr.add_signer(myKey.priv, myKey.pub);
            }
        });

        if (!hasKey) {
            throw new Error("You do not have any private keys to sign this transaction");
        }
    }

    calculateAccountUID(num) {
        let n = Long.fromNumber(0, true);
        if (typeof num === "string") {
            n = Long.fromString(num, true);
        }
        else if (typeof num === "object" && Long.isLong(num)) {
            n = num;
        } else if (typeof num === "number") {
            n = Long.fromNumber(num, true);
        } else {
            throw new Error("Invalid parameter:" + num);
        }

        let max = Long.MAX_UNSIGNED_VALUE.shiftRightUnsigned(8);
        let id = n.and(max);
        let buff = new ByteBuffer(8, true);
        buff.writeUInt64(id);
        let hashBuff = hash.sha256(buff.buffer);
        let uid = n.multiply(256).add(hashBuff[0]);
        return uid;
    }

    validAccountUID(uid) {
        let u = Long.fromNumber(0, true);
        if (typeof uid === "string") {
            u = Long.fromString(uid, true);
        }
        else if (typeof uid === "object" && Long.isLong(uid)) {
            u = uid;
        } else if (typeof uid === "number") {
            u = Long.fromNumber(uid, true);
        } else {
            if (__LIB_DEBUG__) console.log("validAccountUID: Invalid parameter " + uid);
            return false;
        }
        let checksum = u.and(0xFF);
        let toCheck = u.shiftRightUnsigned(8);
        let buff = new ByteBuffer(8, true);
        buff.writeUInt64(toCheck);
        buff.reset();
        let hashBuff = null;
        let x = buff.toBuffer();
        if (x.toString().indexOf("ArrayBuffer") > 0) {
            let b = this.toBuffer(x);
            hashBuff = hash.sha256(b);
        } else {
            hashBuff = hash.sha256(x);
        }
        return (hashBuff[0] == checksum);
    }

    toArrayBuffer(buf) {
        var ab = new ArrayBuffer(buf.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            view[i] = buf[i];
        }
        return ab;
    }

    toBuffer(ab) {
        var buf = new Buffer(ab.byteLength);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    }
}

let accountUtils = new AccountUtils();

export default accountUtils;
