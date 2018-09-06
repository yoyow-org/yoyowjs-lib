var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import Immutable from "immutable";
import { Apis } from "yoyowjs-ws";
import ChainTypes from "./ChainTypes";
import ChainValidation from "./ChainValidation";
import BigInteger from "bigi";
import ee from "./EmitterInstance";
import { Long } from "bytebuffer";

var object_type = ChainTypes.object_type,
    impl_object_type = ChainTypes.impl_object_type;

var emitter = ee();

var op_history = parseInt(object_type.operation_history, 10);
var limit_order = parseInt(object_type.limit_order, 10);
var call_order = parseInt(object_type.call_order, 10);
var proposal = parseInt(object_type.proposal, 10);
var balance_type = parseInt(object_type.balance, 10);
var vesting_balance_type = parseInt(object_type.vesting_balance, 10);
var witness_object_type = parseInt(object_type.witness, 10);
var worker_object_type = parseInt(object_type.worker, 10);
var committee_member_object_type = parseInt(object_type.committee_member, 10);
var account_object_type = parseInt(object_type.account, 10);
var asset_object_type = parseInt(object_type.asset, 10);

var order_prefix = "1." + limit_order + ".";
var call_order_prefix = "1." + call_order + ".";
var proposal_prefix = "1." + proposal + ".";
var balance_prefix = "2." + parseInt(impl_object_type.account_balance, 10) + ".";
var account_stats_prefix = "2." + parseInt(impl_object_type.account_statistics, 10) + ".";
var asset_dynamic_data_prefix = "2." + parseInt(impl_object_type.asset_dynamic_data, 10) + ".";
var bitasset_data_prefix = "2." + parseInt(impl_object_type.asset_bitasset_data, 10) + ".";
var vesting_balance_prefix = "1." + vesting_balance_type + ".";
var witness_prefix = "1." + witness_object_type + ".";
var worker_prefix = "1." + worker_object_type + ".";
var committee_prefix = "1." + committee_member_object_type + ".";
var asset_prefix = "1." + asset_object_type + ".";
var account_prefix = "1." + account_object_type + ".";

/**
 *  @brief maintains a local cache of blockchain state
 *
 *  The ChainStore maintains a local cache of blockchain state and exposes
 *  an API that makes it easy to query objects and receive updates when
 *  objects are available.
 */

var ChainStore = function () {
    function ChainStore() {
        _classCallCheck(this, ChainStore);

        /** tracks everyone who wants to receive updates when the cache changes */
        this.subscribers = new Set();
        this.subscribed = false;
        this.clearCache();
        this.progress = 0;
        // this.chain_time_offset is used to estimate the blockchain time
        this.chain_time_offset = [];
        this.dispatchFrequency = 40;
    }

    /**
     * Clears all cached state.  This should be called any time the network connection is
     * reset.
     */


    ChainStore.prototype.clearCache = function clearCache() {
        this.objects_by_id = Immutable.Map();
        this.accounts_by_name = Immutable.Map();
        this.accounts_by_uid = Immutable.Map();
        this.balance_objects_by_uid = Immutable.Map();
        this.posts_by_fullid = Immutable.Map();
        this.account_historys = Immutable.Map();
        this.assets_by_symbol = Immutable.Map();
        this.account_ids_by_key = Immutable.Map();
        this.balance_objects_by_address = Immutable.Map();
        this.get_account_refs_of_keys_calls = Immutable.Set();
        this.account_history_requests = new Map(); ///< tracks pending history requests
        this.witness_by_account_id = new Map();
        this.committee_by_account_id = new Map();
        this.objects_by_vote_id = new Map();
        this.fetching_get_full_accounts = new Map();
        clearTimeout(this.timeout);
    };

    ChainStore.prototype.resetCache = function resetCache() {
        this.subscribed = false;
        this.subError = null;
        this.clearCache();
        this.head_block_time_string = null;
        this.init().then(function (result) {
            console.log("resetCache init success");
        }).catch(function (err) {
            console.log("resetCache init error:", err);
        });
    };

    ChainStore.prototype.setDispatchFrequency = function setDispatchFrequency(freq) {
        this.dispatchFrequency = freq;
    };

    ChainStore.prototype.init = function init() {
        var _this = this;

        var reconnectCounter = 0;
        this.dispatched = false;

        var _init = function _init(resolve, reject) {
            var db_api = Apis.instance().db_api();
            if (!db_api) {
                return reject(new Error("Api not found, please initialize the api instance before calling the ChainStore"));
            }
            return db_api.exec("get_objects", [["2.1.0"]]).then(function (optional_objects) {
                //if(__LIB_DEBUG__) console.log('... optional_objects',optional_objects ? optional_objects[0].id : null)
                for (var i = 0; i < optional_objects.length; i++) {
                    var optional_object = optional_objects[i];
                    if (optional_object) {

                        _this._updateObject(optional_object, true);

                        var head_time = new Date(optional_object.time + "+00:00").getTime();
                        _this.head_block_time_string = optional_object.time;
                        _this.chain_time_offset.push(new Date().getTime() - timeStringToDate(optional_object.time).getTime());
                        var now = new Date().getTime();
                        var delta = (now - head_time) / 1000;
                        var start = Date.parse('Sep 1, 2015');
                        var progress_delta = head_time - start;
                        _this.progress = progress_delta / (now - start);

                        if (delta < 60) {
                            /* console.log("synced , chainstore ready");
                            this.subscribed = true;
                            this.subError = null;
                            resolve(); */

                            Apis.instance().db_api().exec("set_subscribe_callback", [_this.onUpdate.bind(_this), true]).then(function () {
                                console.log("synced and subscribed, chainstore ready");
                                _this.subscribed = true;
                                _this.subError = null;
                                _this.notifySubscribers();
                                resolve();
                            }).catch(function (error) {
                                _this.subscribed = false;
                                _this.subError = error;
                                _this.notifySubscribers();
                                reject(error);
                                console.log("Error: ", error);
                            });
                        } else {
                            console.log("not yet synced, retrying in 1s");
                            _this.subscribed = false;
                            reconnectCounter++;
                            if (reconnectCounter > 5) {
                                _this.subError = Error("ChainStore sync error, please check your system clock");
                                return reject(_this.subError);
                            }
                            setTimeout(_init.bind(_this, resolve, reject), 1000);
                        }
                    } else {
                        setTimeout(_init.bind(_this, resolve, reject), 1000);
                    }
                }
            }).catch(function (error) {
                // in the event of an error clear the pending state for id
                console.log('!!! Chain API error', error);
                _this.objects_by_id = _this.objects_by_id.delete("2.1.0");
                reject(error);
            });
        };

        return new Promise(function (resolve, reject) {
            return _init(resolve, reject);
        });
    };

    ChainStore.prototype.onUpdate = function onUpdate(updated_objects) /// map from account id to objects
    {
        for (var a = 0; a < updated_objects.length; ++a) {
            for (var i = 0; i < updated_objects[a].length; ++i) {
                var obj = updated_objects[a][i];

                if (ChainValidation.is_object_id(obj)) {
                    /// the object was removed
                    // Cancelled limit order, emit event for MarketStore to update it's state
                    if (obj.search(order_prefix) == 0) {
                        var old_obj = this.objects_by_id.get(obj);
                        if (!old_obj) {
                            return;
                        }
                        emitter.emit('cancel-order', old_obj.get("id"));
                        var account = this.objects_by_id.get(old_obj.get("seller"));
                        if (account && account.has("orders")) {
                            var limit_orders = account.get("orders");
                            if (account.get("orders").has(obj)) {
                                account = account.set("orders", limit_orders.delete(obj));
                                this.objects_by_id = this.objects_by_id.set(account.get("id"), account);
                            }
                        }
                    }

                    // Update nested call_order inside account object
                    if (obj.search(call_order_prefix) == 0) {

                        var _old_obj = this.objects_by_id.get(obj);
                        if (!_old_obj) {
                            return;
                        }
                        emitter.emit('close-call', _old_obj.get("id"));
                        var _account = this.objects_by_id.get(_old_obj.get("borrower"));
                        if (_account && _account.has("call_orders")) {
                            var call_orders = _account.get("call_orders");
                            if (_account.get("call_orders").has(obj)) {
                                _account = _account.set("call_orders", call_orders.delete(obj));
                                this.objects_by_id = this.objects_by_id.set(_account.get("id"), _account);
                            }
                        }
                    }

                    // Remove the object
                    this.objects_by_id = this.objects_by_id.set(obj, null);
                } else this._updateObject(obj, true);
            }
        }
        this.notifySubscribers();
    };

    ChainStore.prototype.notifySubscribers = function notifySubscribers(obj) {
        var _this2 = this;

        // Dispatch at most only once every x milliseconds
        if (!this.dispatched) {
            this.dispatched = true;
            this.timeout = setTimeout(function () {
                _this2.dispatched = false;
                _this2.subscribers.forEach(function (callback) {
                    var tmp = void 0;
                    if (obj && obj.get('operation_id')) tmp = _this2.getObject(obj.get('operation_id')).toJS();
                    callback(tmp);
                });
            }, this.dispatchFrequency);
        }
    };

    /**
     *  Add a callback that will be called anytime any object in the cache is updated
     */


    ChainStore.prototype.subscribe = function subscribe(callback) {
        if (this.subscribers.has(callback)) console.error("Subscribe callback already exists", callback);
        this.subscribers.add(callback);
    };

    /**
     *  Remove a callback that was previously added via subscribe
     */


    ChainStore.prototype.unsubscribe = function unsubscribe(callback) {
        if (!this.subscribers.has(callback)) console.error("Unsubscribe callback does not exists", callback);
        this.subscribers.delete(callback);
    };

    /** Clear an object from the cache to force it to be fetched again. This may
     * be useful if a query failed the first time and the wallet has reason to believe
     * it may succeede the second time.
     */


    ChainStore.prototype.clearObjectCache = function clearObjectCache(id) {
        this.objects_by_id = this.objects_by_id.delete(id);
    };

    /**
     * There are three states an object id could be in:
     *
     * 1. undefined       - returned if a query is pending
     * 3. defined         - return an object
     * 4. null            - query return null
     *
     */


    ChainStore.prototype.getObject = function getObject(id) {
        var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!ChainValidation.is_object_id(id)) throw Error("argument is not an object id: " + JSON.stringify(id));

        var result = this.objects_by_id.get(id);
        if (result === undefined || force) return this.fetchObject(id, force);
        if (result === true) return undefined;

        return result;
    };

    /**
     *  @return undefined if a query is pending
     *  @return null if id_or_symbol has been queired and does not exist
     *  @return object if the id_or_symbol exists
     */


    ChainStore.prototype.getAsset = function getAsset(id_or_symbol) {
        var _this3 = this;

        if (!id_or_symbol) return null;

        if (ChainValidation.is_object_id(id_or_symbol)) {
            var asset = this.getObject(id_or_symbol);

            if (asset && asset.get("bitasset") && !asset.getIn(["bitasset", "current_feed"])) {
                return undefined;
            }
            return asset;
        }

        /// TODO: verify id_or_symbol is a valid symbol name

        var asset_id = this.assets_by_symbol.get(id_or_symbol);

        if (ChainValidation.is_object_id(asset_id)) {
            var _asset = this.getObject(asset_id);

            if (_asset && _asset.get("bitasset") && !_asset.getIn(["bitasset", "current_feed"])) {
                return undefined;
            }
            return _asset;
        }

        if (asset_id === null) return null;

        if (asset_id === true) return undefined;

        Apis.instance().db_api().exec("lookup_asset_symbols", [[id_or_symbol]]).then(function (asset_objects) {
            // console.log( "lookup symbol ", id_or_symbol )
            if (asset_objects.length && asset_objects[0]) _this3._updateObject(asset_objects[0], true);else {
                _this3.assets_by_symbol = _this3.assets_by_symbol.set(id_or_symbol, null);
                _this3.notifySubscribers();
            }
        }).catch(function (error) {
            console.log("Error: ", error);
            _this3.assets_by_symbol = _this3.assets_by_symbol.delete(id_or_symbol);
        });

        return undefined;
    };

    /**
     *  @param the public key to find accounts that reference it
     *
     *  @return Set of account ids that reference the given key
     *  @return a empty Set if no items are found
     *  @return undefined if the result is unknown
     *
     *  If this method returns undefined, then it will send a request to
     *  the server for the current set of accounts after which the
     *  server will notify us of any accounts that reference these keys
     */


    ChainStore.prototype.getAccountRefsOfKey = function getAccountRefsOfKey(key) {
        var _this4 = this;

        if (this.get_account_refs_of_keys_calls.has(key)) return this.account_ids_by_key.get(key);else {
            this.get_account_refs_of_keys_calls = this.get_account_refs_of_keys_calls.add(key);
            Apis.instance().db_api().exec("get_key_references", [[key]]).then(function (vec_account_id) {
                var refs = Immutable.Set();
                vec_account_id = vec_account_id[0];
                refs = refs.withMutations(function (r) {
                    for (var i = 0; i < vec_account_id.length; ++i) {
                        r.add(vec_account_id[i]);
                    }
                });
                _this4.account_ids_by_key = _this4.account_ids_by_key.set(key, refs);
                _this4.notifySubscribers();
            }, function (error) {
                _this4.account_ids_by_key = _this4.account_ids_by_key.delete(key);
                _this4.get_account_refs_of_keys_calls = _this4.get_account_refs_of_keys_calls.delete(key);
            });
            return undefined;
        }
        return undefined;
    };

    /**
     * @return a Set of balance ids that are claimable with the given address
     * @return undefined if a query is pending and the set is not known at this time
     * @return a empty Set if no items are found
     *
     * If this method returns undefined, then it will send a request to the server for
     * the current state after which it will be subscribed to changes to this set.
     */


    ChainStore.prototype.getBalanceObjects = function getBalanceObjects(address) {
        var _this5 = this;

        var current = this.balance_objects_by_address.get(address);
        if (current === undefined) {
            /** because balance objects are simply part of the genesis state, there is no need to worry about
             * having to update them / merge them or index them in updateObject.
             */
            this.balance_objects_by_address = this.balance_objects_by_address.set(address, Immutable.Set());
            Apis.instance().db_api().exec("get_balance_objects", [[address]]).then(function (balance_objects) {
                var set = new Set();
                for (var i = 0; i < balance_objects.length; ++i) {
                    _this5._updateObject(balance_objects[i]);
                    set.add(balance_objects[i].id);
                }
                _this5.balance_objects_by_address = _this5.balance_objects_by_address.set(address, Immutable.Set(set));
                _this5.notifySubscribers();
            }, function (error) {
                _this5.balance_objects_by_address = _this5.balance_objects_by_address.delete(address);
            });
        }
        return this.balance_objects_by_address.get(address);
    };

    /**
     *  If there is not already a pending request to fetch this object, a new
     *  request will be made.
     *
     *  @return null if the object does not exist,
     *  @return undefined if the object might exist but is not in cache
     *  @return the object if it does exist and is in our cache
     */


    ChainStore.prototype.fetchObject = function fetchObject(id) {
        var _this6 = this;

        var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (typeof id !== 'string') {
            var _result = [];
            for (var i = 0; i < id.length; ++i) {
                _result.push(this.fetchObject(id[i]));
            }return _result;
        }

        if (__LIB_DEBUG__) console.log("!!! fetchObject: ", id, this.subscribed, !this.subscribed && !force);
        if (!this.subscribed && !force) return undefined;

        if (__LIB_DEBUG__) console.log("maybe fetch object: ", id);
        if (!ChainValidation.is_object_id(id)) throw Error("argument is not an object id: " + id);

        if (id.substring(0, 4) == "1.2.") return this.fetchFullAccount(id);

        var result = this.objects_by_id.get(id);
        if (result === undefined) {
            // the fetch
            if (__LIB_DEBUG__) console.log("fetching object: ", id);
            this.objects_by_id = this.objects_by_id.set(id, true);
            Apis.instance().db_api().exec("get_objects", [[id]]).then(function (optional_objects) {
                //if(__LIB_DEBUG__) console.log('... optional_objects',optional_objects ? optional_objects[0].id : null)
                for (var _i = 0; _i < optional_objects.length; _i++) {
                    var optional_object = optional_objects[_i];
                    if (optional_object) _this6._updateObject(optional_object, true);else {
                        _this6.objects_by_id = _this6.objects_by_id.set(id, null);
                        _this6.notifySubscribers();
                    }
                }
            }).catch(function (error) {
                // in the event of an error clear the pending state for id
                console.log('!!! Chain API error', error);
                _this6.objects_by_id = _this6.objects_by_id.delete(id);
            });
        } else if (result === true) // then we are waiting a response
            return undefined;
        return result; // we have a response, return it
    };

    /**
     *  @return null if no such account exists
     *  @return undefined if such an account may exist, and fetch the the full account if not already pending
     *  @return the account object if it does exist
     */


    ChainStore.prototype.getAccount = function getAccount(name_or_id) {
        if (!name_or_id) return null;

        if ((typeof name_or_id === "undefined" ? "undefined" : _typeof(name_or_id)) === 'object') {
            if (name_or_id.id) return this.getAccount(name_or_id.id);else if (name_or_id.get) return this.getAccount(name_or_id.get('id'));else return undefined;
        }

        if (ChainValidation.is_object_id(name_or_id)) {
            var account = this.getObject(name_or_id);
            if (account === null) {
                return null;
            }
            if (account === undefined || account.get('name') === undefined) {
                return this.fetchFullAccount(name_or_id);
            }
            return account;
        } else if (ChainValidation.is_account_name(name_or_id, true)) {
            var account_id = this.accounts_by_name.get(name_or_id);
            if (account_id === null) return null; // already fetched and it wasn't found
            if (account_id === undefined) // then no query, fetch it
                return this.fetchFullAccount(name_or_id);
            return this.getObject(account_id); // return it
        }
        //throw Error( `Argument is not an account name or id: ${name_or_id}` )
    };

    /**
     * 获取指定uid列表的多个账号信息
     * @param uid 账户的数字id
     */


    ChainStore.prototype.getAccountsByUid = function getAccountsByUid(uid) {
        var account = this.accounts_by_uid.get(uid);
        if (account === undefined) {
            this.fetchAccountByUid(uid);
            return undefined;
        }
        return account;
    };

    ChainStore.prototype.fetchAccountByUid = function fetchAccountByUid(account_uid) {
        var _this7 = this;

        var par = [];
        if (ChainValidation.is_account_uid(account_uid)) {
            par.push(account_uid);
        } else throw Error("argument is not an account uid: " + account_uid);

        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec("get_accounts_by_uid", [par]).then(function (optional_account_object) {
                if (optional_account_object && optional_account_object.length > 0 && optional_account_object[0] != null) {
                    _this7.accounts_by_uid = _this7.accounts_by_uid.set(optional_account_object[0].uid, optional_account_object[0]);
                    _this7.notifySubscribers();
                    resolve(optional_account_object[0]);
                } else {
                    _this7.accounts_by_uid = _this7.accounts_by_uid.set(account_uid, null);
                    _this7.notifySubscribers();
                    resolve(null);
                }
            }, reject);
        });
    };

    /**
     * 根据 uid 查询给定资产余额
     * @param uid
     * @param assets 资产id列表数组
     */


    ChainStore.prototype.getAccountBalances = function getAccountBalances(uid) {
        var assets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0];

        if (!Array.isArray(assets)) throw Error("argument is not an array: " + assets);
        var balances = this.balance_objects_by_uid.get(uid);
        if (balances === undefined) {
            this.fetchBalancesByUid(uid, assets);
            return undefined;
        }
        var result = [];

        var _loop = function _loop(a) {
            balances.forEach(function (b) {
                if (assets[a] == b.asset_id) result.push(b);
            });
        };

        for (var a in assets) {
            _loop(a);
        }
        return result;
    };

    ChainStore.prototype.fetchBalancesByUid = function fetchBalancesByUid(uid) {
        var _this8 = this;

        var assets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [0];

        if (!ChainValidation.is_account_uid(uid)) {
            throw Error("argument is not an account uid: " + uid);
        }
        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec("get_account_balances", [uid, assets]).then(function (balance_object) {
                if (balance_object && balance_object.length > 0) {
                    var mArray = _this8.balance_objects_by_uid.get(uid);
                    if (mArray === undefined) {
                        _this8.balance_objects_by_uid = _this8.balance_objects_by_uid.set(uid, balance_object);
                    } else {
                        //合并两个数组的资产数据
                        var have = false;
                        var tmp = [];
                        balance_object.forEach(function (a) {
                            have = false;
                            mArray.forEach(function (b) {
                                if (a.asset_id === b.asset_id) {
                                    b.amount = a.amount;
                                    have = true;
                                }
                            });
                            if (!have) {
                                tmp.push(a);
                            }
                        });
                        if (tmp.length > 0) {
                            var newArray = mArray.concat(tmp);
                            _this8.balance_objects_by_uid = _this8.balance_objects_by_uid.set(uid, newArray);
                        } else {
                            _this8.balance_objects_by_uid = _this8.balance_objects_by_uid.set(uid, mArray);
                        }
                    }
                    _this8.notifySubscribers();
                    resolve(balance_object);
                } else {
                    _this8.balance_objects_by_uid = _this8.balance_objects_by_uid.set(uid, null);
                    _this8.notifySubscribers();
                    resolve(null);
                }
            }, reject);
        });
    };

    /**
     * 根据平台id、作者id、文章id获取单个文章
     * @param platform_pid 平台id
     * @param poster_uid 作者id
     * @param post_pid 文章id
     * @returns {*}
     */


    ChainStore.prototype.getPost = function getPost(platform_pid, poster_uid, post_pid) {
        var fullid = "" + platform_pid + poster_uid + post_pid;
        var post = this.posts_by_fullid.get(fullid);
        if (post === undefined) {
            this.fetchPost(platform_pid, poster_uid, post_pid);
            return undefined;
        }
        return post;
    };

    ChainStore.prototype.fetchPost = function fetchPost(platform_pid, poster_uid, post_pid) {
        var _this9 = this;

        if (!ChainValidation.is_account_uid(poster_uid)) {
            throw Error("argument is not an account poster_uid: " + poster_uid);
        }
        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec("get_post", [platform_pid, poster_uid, post_pid]).then(function (post_object) {
                var fullid = "" + platform_pid + poster_uid + post_pid;
                if (post_object) {
                    _this9.posts_by_fullid = _this9.posts_by_fullid.set(fullid, post_object);
                    _this9.notifySubscribers();
                    resolve(post_object);
                } else {
                    _this9.posts_by_fullid = _this9.posts_by_fullid.set(fullid, null);
                    _this9.notifySubscribers();
                    resolve(null);
                }
            }, reject);
        });
    };

    /**
     * 根据平台 pid 、 发帖者 uid 、发帖时间段 查询帖子列表。
     * poster 可以为 null ，此时查询所有用户的帖子。
     * 时间段由两个时间点组成，先后不限，查询范围为 startTime < 发帖时间 <= endTime
     * limit 不能超过 100
     * 结果按时间排序，最新的排最前。时间相同的，按实际入块顺序，后入块的排在前面。
     *
     * @param platform_pid
     * @param startTime
     * @param endTime
     * @param limit
     * @param poster
     */


    ChainStore.prototype.fetchPostsByPlatformPoster = function fetchPostsByPlatformPoster(platform_pid, startTime, endTime) {
        var _this10 = this;

        var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
        var poster = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        if (!(startTime instanceof Date)) throw Error("argument is not date type: " + startTime);
        if (!(endTime instanceof Date)) throw Error("argument is not date type: " + endTime);
        if (limit < 0) limit = 20;
        if (limit > 100) limit = 100;

        //let s = startTime.getTime() / 1000;
        //let e = endTime.getTime() / 1000;

        var s = startTime.toISOString().split('.')[0];
        var e = endTime.toISOString().split('.')[0];

        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec("get_posts_by_platform_poster", [platform_pid, poster, [s, e], limit]).then(function (post_objects) {
                if (post_objects) {
                    var fullid = "";
                    post_objects.forEach(function (p) {
                        fullid = "" + p.platform + p.poster + p.post_pid;
                        _this10.posts_by_fullid = _this10.posts_by_fullid.set(fullid, p);
                    });
                    _this10.notifySubscribers();
                    resolve(post_objects);
                } else {
                    resolve(null);
                }
            }, reject);
        });
    };

    /**
     * 查询给定帖子的回帖（仅限下一层）。
     * platform_pid 平台 pid
     * parent 为发帖者 uid 和 帖子 pid 的组合。如果为 null ，则返回主贴列表。
     * 时间段由两个时间点组成，先后不限，查询范围为 startTime < 发帖时间 <= endTime
     * limit 不能超过 100
     * 结果按时间排序，最新的排最前。时间相同的，按实际入块顺序，后入块的排在前面。
     * @param platform_pid
     * @param startTime
     * @param endTime
     * @param limit
     * @param parent 参数组，如:[poster,postid]
     */


    ChainStore.prototype.fetchPostsByParent = function fetchPostsByParent(platform_pid, startTime, endTime) {
        var _this11 = this;

        var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
        var parent = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

        if (!(startTime instanceof Date)) throw Error("argument is not date type: " + startTime);
        if (!(endTime instanceof Date)) throw Error("argument is not date type: " + endTime);
        if (limit < 0) limit = 20;
        if (limit > 100) limit = 100;
        if (parent != null) {
            if (!(parent instanceof Array) || parent.length != 2) {
                throw Error("argument is not array type: " + parent);
            } else if (!ChainValidation.is_account_uid(parent[0])) {
                throw Error("argument is not uid: " + parent[0]);
            }
        }
        var s = startTime.toISOString().split('.')[0];
        var e = endTime.toISOString().split('.')[0];

        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec("get_posts_by_parent", [platform_pid, parent, [s, e], limit]).then(function (post_objects) {
                if (post_objects) {
                    var fullid = "";
                    post_objects.forEach(function (p) {
                        fullid = "" + p.platform + p.poster + p.post_pid;
                        _this11.posts_by_fullid = _this11.posts_by_fullid.set(fullid, p);
                    });
                    _this11.notifySubscribers();
                    resolve(post_objects);
                } else {
                    resolve(null);
                }
            }, reject);
        });
    };

    /**
     * 此方法为订阅方法，获取指定用户的历史操作记录,此方法只返回本地已经缓存的，当fetchRelativeAccountHistory被调用时
     * 会通知此订阅
     * 如果要调用更早以前的数据请调用fetchRelativeAccountHistory
     * @param account_uid
     * @param limit
     */


    ChainStore.prototype.getRelativeAccountHistory = function getRelativeAccountHistory(account_uid) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

        var account_history = this.account_historys.get(account_uid);
        if (account_history === undefined) {
            this.fetchRelativeAccountHistory(account_uid, null, 0, limit);
        } else {
            var tmpAH = account_history[account_history.length - 1];
            if (tmpAH.length == 2) {
                if (tmpAH[0] == 1) {
                    this.fetchRelativeAccountHistory(account_uid, null, 0, limit);
                } else {
                    var start = tmpAH[0] - 1;
                    if (start < 1) start = 1;
                    this.fetchRelativeAccountHistory(account_uid, null, 0, limit, start);
                }
            }
        }
        return account_history;
    };

    /**
     * 获取账户历史。
     * 账户历史编号从 1 开始，编号越小的越早。用 start 和 stop 来限定。
     * 从 start 开始往回查询， 达到 stop 或者 limit 后结束。如果 limit == 0 或者 stop > start 则返回结果为空。
     * 如果 start == 0 ，则从最新记录开始查询
     * 必须满足 limit <= 100 ，即分页查询机制，每页最大100条数据
     * @param account_uid
     * @param op_type 如果指定 op_type ， 则指定只查询该操作类型结果
     * @param stop
     * @param limit
     * @param start
     */


    ChainStore.prototype.fetchRelativeAccountHistory = function fetchRelativeAccountHistory(account_uid) {
        var op_type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var stop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

        var _this12 = this;

        var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
        var start = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

        if (!ChainValidation.is_account_uid(account_uid)) {
            throw Error("argument is not uid: " + account_uid);
        }
        return new Promise(function (resolve, reject) {
            Apis.instance().history_api().exec("get_relative_account_history", [account_uid, op_type, stop, limit, start]).then(function (history_objects) {
                if (history_objects) {
                    if (op_type == null) {
                        if (start == 0) {
                            _this12.account_historys = _this12.account_historys.set(account_uid, history_objects);
                        } else {
                            var current_history = _this12.account_historys.get(account_uid);
                            if (!current_history) current_history = Immutable.List();
                            var updated_history = Immutable.fromJS(current_history);
                            updated_history = updated_history.withMutations(function (list) {
                                var _loop2 = function _loop2(i) {
                                    var tmp = current_history.find(function (ch) {
                                        return ch[0] == history_objects[i][0];
                                    });
                                    if (!tmp) {
                                        list.push(history_objects[i]);
                                    }
                                };

                                for (var i = 0; i < history_objects.length; ++i) {
                                    _loop2(i);
                                }
                            });
                            _this12.account_historys = _this12.account_historys.set(account_uid, updated_history);
                        }
                        _this12.notifySubscribers();
                    }
                    resolve(history_objects);
                } else {
                    resolve(null);
                }
            }, reject);
        });
    };

    /**
     * This method will attempt to lookup witness by account_id.
     * If witness doesn't exist it will return null, if witness is found it will return witness object,
     * if it's not fetched yet it will return undefined.
     * @param account_id - account id
     */


    ChainStore.prototype.getWitnessById = function getWitnessById(account_id) {
        var witness_id = this.witness_by_account_id.get(account_id);
        if (witness_id === undefined) {
            this.fetchWitnessByAccount(account_id);
            return undefined;
        }
        return witness_id ? this.getObject(witness_id) : null;
    };

    /**
     * This method will attempt to lookup committee member by account_id.
     * If committee member doesn't exist it will return null, if committee member is found it will return committee member object,
     * if it's not fetched yet it will return undefined.
     * @param account_id - account id
     */


    ChainStore.prototype.getCommitteeMemberById = function getCommitteeMemberById(account_id) {
        var cm_id = this.committee_by_account_id.get(account_id);
        if (cm_id === undefined) {
            this.fetchCommitteeMemberByAccount(account_id);
            return undefined;
        }
        return cm_id ? this.getObject(cm_id) : null;
    };

    /**
     * Obsolete! Please use getWitnessById
     * This method will attempt to lookup the account, and then query to see whether or not there is
     * a witness for this account.  If the answer is known, it will return the witness_object, otherwise
     * it will attempt to look it up and return null.   Once the lookup has completed on_update will
     * be called.
     *
     * @param id_or_account may either be an account_id, a witness_id, or an account_name
     */


    ChainStore.prototype.getWitness = function getWitness(id_or_account) {
        var _this13 = this;

        var account = this.getAccount(id_or_account);
        if (!account) return null;
        var account_id = account.get('id');

        var witness_id = this.witness_by_account_id.get(account_id);
        if (witness_id === undefined) this.fetchWitnessByAccount(account_id);
        return this.getObject(witness_id);

        if (ChainValidation.is_account_name(id_or_account, true) || id_or_account.substring(0, 4) == "1.2.") {
            var _account2 = this.getAccount(id_or_account);
            if (!_account2) {
                this.lookupAccountByName(id_or_account).then(function (account) {
                    if (!account) return null;

                    var account_id = account.get('id');
                    var witness_id = _this13.witness_by_account_id.get(account_id);
                    if (ChainValidation.is_object_id(witness_id)) return _this13.getObject(witness_id, on_update);

                    if (witness_id == undefined) _this13.fetchWitnessByAccount(account_id).then(function (witness) {
                        _this13.witness_by_account_id.set(account_id, witness ? witness.get('id') : null);
                        if (witness && on_update) on_update();
                    });
                }, function (error) {
                    var witness_id = _this13.witness_by_account_id.set(id_or_account, null);
                });
            } else {
                var _account_id = _account2.get('id');
                var _witness_id = this.witness_by_account_id.get(_account_id);
                if (ChainValidation.is_object_id(_witness_id)) return this.getObject(_witness_id, on_update);

                if (_witness_id == undefined) this.fetchWitnessByAccount(_account_id).then(function (witness) {
                    _this13.witness_by_account_id.set(_account_id, witness ? witness.get('id') : null);
                    if (witness && on_update) on_update();
                });
            }
            return null;
        }
        return null;
    };

    // Obsolete! Please use getCommitteeMemberById


    ChainStore.prototype.getCommitteeMember = function getCommitteeMember(id_or_account) {
        var _this14 = this;

        var on_update = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (ChainValidation.is_account_name(id_or_account, true) || id_or_account.substring(0, 4) == "1.2.") {
            var account = this.getAccount(id_or_account);

            if (!account) {
                this.lookupAccountByName(id_or_account).then(function (account) {
                    var account_id = account.get('id');
                    var committee_id = _this14.committee_by_account_id.get(account_id);
                    if (ChainValidation.is_object_id(committee_id)) return _this14.getObject(committee_id, on_update);

                    if (committee_id == undefined) {
                        _this14.fetchCommitteeMemberByAccount(account_id).then(function (committee) {
                            _this14.committee_by_account_id.set(account_id, committee ? committee.get('id') : null);
                            if (on_update && committee) on_update();
                        });
                    }
                }, function (error) {
                    var witness_id = _this14.committee_by_account_id.set(id_or_account, null);
                });
            } else {
                var account_id = account.get('id');
                var committee_id = this.committee_by_account_id.get(account_id);
                if (ChainValidation.is_object_id(committee_id)) return this.getObject(committee_id, on_update);

                if (committee_id == undefined) {
                    this.fetchCommitteeMemberByAccount(account_id).then(function (committee) {
                        _this14.committee_by_account_id.set(account_id, committee ? committee.get('id') : null);
                        if (on_update && committee) on_update();
                    });
                }
            }
        }
        return null;
    };

    /**
     *
     * @return a promise with the witness object
     */


    ChainStore.prototype.fetchWitnessByAccount = function fetchWitnessByAccount(account_id) {
        var _this15 = this;

        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec("get_witness_by_account", [account_id]).then(function (optional_witness_object) {
                if (optional_witness_object) {
                    _this15.witness_by_account_id = _this15.witness_by_account_id.set(optional_witness_object.witness_account, optional_witness_object.id);
                    var witness_object = _this15._updateObject(optional_witness_object, true);
                    resolve(witness_object);
                } else {
                    _this15.witness_by_account_id = _this15.witness_by_account_id.set(account_id, null);
                    _this15.notifySubscribers();
                    resolve(null);
                }
            }, reject);
        });
    };

    /**
     *
     * @return a promise with the witness object
     */


    ChainStore.prototype.fetchCommitteeMemberByAccount = function fetchCommitteeMemberByAccount(account_id) {
        var _this16 = this;

        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec("get_committee_member_by_account", [account_id]).then(function (optional_committee_object) {
                if (optional_committee_object) {
                    _this16.committee_by_account_id = _this16.committee_by_account_id.set(optional_committee_object.committee_member_account, optional_committee_object.id);
                    var committee_object = _this16._updateObject(optional_committee_object, true);
                    resolve(committee_object);
                } else {
                    _this16.committee_by_account_id = _this16.committee_by_account_id.set(account_id, null);
                    _this16.notifySubscribers();
                    resolve(null);
                }
            }, reject);
        });
    };

    /**
     *  Fetches an account and all of its associated data in a single query
     *
     *  @param an account name or account id
     *
     *  @return undefined if the account in question is in the process of being fetched
     *  @return the object if it has already been fetched
     *  @return null if the object has been queried and was not found
     */


    ChainStore.prototype.fetchFullAccount = function fetchFullAccount(name_or_id) {
        var _this17 = this;

        if (__LIB_DEBUG__) console.log("Fetch full account: ", name_or_id);

        var fetch_account = false;
        if (ChainValidation.is_object_id(name_or_id)) {
            var current = this.objects_by_id.get(name_or_id);
            fetch_account = current === undefined;
            if (!fetch_account && fetch_account.get('name')) return current;
        } else {
            if (!ChainValidation.is_account_name(name_or_id, true)) throw Error("argument is not an account name: " + name_or_id);

            var account_id = this.accounts_by_name.get(name_or_id);
            if (ChainValidation.is_object_id(account_id)) return this.getAccount(account_id);
        }

        /// only fetch once every 5 seconds if it wasn't found
        if (!this.fetching_get_full_accounts.has(name_or_id) || Date.now() - this.fetching_get_full_accounts.get(name_or_id) > 5000) {
            this.fetching_get_full_accounts.set(name_or_id, Date.now());
            //console.log( "FETCHING FULL ACCOUNT: ", name_or_id )
            Apis.instance().db_api().exec("get_full_accounts", [[name_or_id], true]).then(function (results) {
                if (results.length === 0) {
                    if (ChainValidation.is_object_id(name_or_id)) {
                        _this17.objects_by_id = _this17.objects_by_id.set(name_or_id, null);
                        _this17.notifySubscribers();
                    }
                    return;
                }
                var full_account = results[0][1];
                if (__LIB_DEBUG__) console.log("full_account: ", full_account);

                var account = full_account.account,
                    vesting_balances = full_account.vesting_balances,
                    statistics = full_account.statistics,
                    call_orders = full_account.call_orders,
                    limit_orders = full_account.limit_orders,
                    referrer_name = full_account.referrer_name,
                    registrar_name = full_account.registrar_name,
                    lifetime_referrer_name = full_account.lifetime_referrer_name,
                    votes = full_account.votes,
                    proposals = full_account.proposals;


                _this17.accounts_by_name = _this17.accounts_by_name.set(account.name, account.id);
                account.referrer_name = referrer_name;
                account.lifetime_referrer_name = lifetime_referrer_name;
                account.registrar_name = registrar_name;
                account.balances = {};
                account.orders = new Immutable.Set();
                account.vesting_balances = new Immutable.Set();
                account.balances = new Immutable.Map();
                account.call_orders = new Immutable.Set();
                account.proposals = new Immutable.Set();
                account.vesting_balances = account.vesting_balances.withMutations(function (set) {
                    vesting_balances.forEach(function (vb) {
                        _this17._updateObject(vb);
                        set.add(vb.id);
                    });
                });

                votes.forEach(function (v) {
                    return _this17._updateObject(v);
                });

                account.balances = account.balances.withMutations(function (map) {
                    full_account.balances.forEach(function (b) {
                        _this17._updateObject(b);
                        map.set(b.asset_type, b.id);
                    });
                });

                account.orders = account.orders.withMutations(function (set) {
                    limit_orders.forEach(function (order) {
                        _this17._updateObject(order);
                        set.add(order.id);
                    });
                });

                account.call_orders = account.call_orders.withMutations(function (set) {
                    call_orders.forEach(function (co) {
                        _this17._updateObject(co);
                        set.add(co.id);
                    });
                });

                account.proposals = account.proposals.withMutations(function (set) {
                    proposals.forEach(function (p) {
                        _this17._updateObject(p);
                        set.add(p.id);
                    });
                });

                _this17._updateObject(statistics);
                var updated_account = _this17._updateObject(account);
                _this17.fetchRecentHistory(updated_account);
                _this17.notifySubscribers();
            }, function (error) {
                console.log("Error: ", error);
                if (ChainValidation.is_object_id(name_or_id)) _this17.objects_by_id = _this17.objects_by_id.delete(name_or_id);else _this17.accounts_by_name = _this17.accounts_by_name.delete(name_or_id);
            });
        }
        return undefined;
    };

    ChainStore.prototype.getAccountMemberStatus = function getAccountMemberStatus(account) {
        if (account === undefined) return undefined;
        if (account === null) return "unknown";
        if (account.get('lifetime_referrer') == account.get('id')) return "lifetime";
        var exp = new Date(account.get('membership_expiration_date')).getTime();
        var now = new Date().getTime();
        if (exp < now) return "basic";
        return "annual";
    };

    ChainStore.prototype.getAccountBalance = function getAccountBalance(account, asset_type) {
        var balances = account.get('balances');
        if (!balances) return 0;

        var balance_obj_id = balances.get(asset_type);
        if (balance_obj_id) {
            var bal_obj = this.objects_by_id.get(balance_obj_id);
            if (bal_obj) return bal_obj.get('balance');
        }
        return 0;
    };

    /**
     * There are two ways to extend the account history, add new more
     * recent history, and extend historic hstory. This method will fetch
     * the most recent account history and prepend it to the list of
     * historic operations.
     *
     *  @param account immutable account object
     *  @return a promise with the account history
     */


    ChainStore.prototype.fetchRecentHistory = function fetchRecentHistory(account) {
        var _this18 = this;

        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 100;

        // console.log( "get account history: ", account )
        /// TODO: make sure we do not submit a query if there is already one
        /// in flight...
        var account_id = account;
        if (!ChainValidation.is_object_id(account_id) && account.toJS) account_id = account.get('id');

        if (!ChainValidation.is_object_id(account_id)) return;

        account = this.objects_by_id.get(account_id);
        if (!account) return;

        var pending_request = this.account_history_requests.get(account_id);
        if (pending_request) {
            pending_request.requests++;
            return pending_request.promise;
        } else pending_request = { requests: 0 };

        var most_recent = "1." + op_history + ".0";
        var history = account.get('history');

        if (history && history.size) most_recent = history.first().get('id');

        /// starting at 0 means start at NOW, set this to something other than 0
        /// to skip recent transactions and fetch the tail
        var start = "1." + op_history + ".0";

        pending_request.promise = new Promise(function (resolve, reject) {
            Apis.instance().history_api().exec("get_account_history", [account_id, most_recent, limit, start]).then(function (operations) {
                var current_account = _this18.objects_by_id.get(account_id);
                var current_history = current_account.get('history');
                if (!current_history) current_history = Immutable.List();
                var updated_history = Immutable.fromJS(operations);
                updated_history = updated_history.withMutations(function (list) {
                    for (var i = 0; i < current_history.size; ++i) {
                        list.push(current_history.get(i));
                    }
                });
                var updated_account = current_account.set('history', updated_history);
                _this18.objects_by_id = _this18.objects_by_id.set(account_id, updated_account);

                //if( current_history != updated_history )
                //   this._notifyAccountSubscribers( account_id )

                var pending_request = _this18.account_history_requests.get(account_id);
                _this18.account_history_requests.delete(account_id);
                if (pending_request.requests > 0) {
                    // it looks like some more history may have come in while we were
                    // waiting on the result, lets fetch anything new before we resolve
                    // this query.
                    _this18.fetchRecentHistory(updated_account, limit).then(resolve, reject);
                } else resolve(updated_account);
            }); // end then
        });

        this.account_history_requests.set(account_id, pending_request);
        return pending_request.promise;
    };

    //_notifyAccountSubscribers( account_id )
    //{
    //   let sub = this.subscriptions_by_account.get( account_id )
    //   let acnt = this.objects_by_id.get(account_id)
    //   if( !sub ) return
    //   for( let item of sub.subscriptions )
    //      item( acnt )
    //}

    /**
     *  Callback that receives notification of objects that have been
     *  added, remove, or changed and are relevant to account_id
     *
     *  This method updates or removes objects from the main index and
     *  then updates the account object with relevant meta-info depending
     *  upon the type of account
     */
    // _updateAccount( account_id, payload )
    // {
    //    let updates = payload[0]

    //    for( let i = 0; i < updates.length; ++i )
    //    {
    //       let update = updates[i]
    //       if( typeof update  == 'string' )
    //       {
    //          let old_obj = this._removeObject( update )

    //          if( update.search( order_prefix ) == 0 )
    //          {
    //                acnt = acnt.setIn( ['orders'], set => set.delete(update) )
    //          }
    //          else if( update.search( vesting_balance_prefix ) == 0 )
    //          {
    //                acnt = acnt.setIn( ['vesting_balances'], set => set.delete(update) )
    //          }
    //       }
    //       else
    //       {
    //          let updated_obj = this._updateObject( update )
    //          if( update.id.search( balance_prefix ) == 0 )
    //          {
    //             if( update.owner == account_id )
    //                acnt = acnt.setIn( ['balances'], map => map.set(update.asset_type,update.id) )
    //          }
    //          else if( update.id.search( order_prefix ) == 0 )
    //          {
    //             if( update.owner == account_id )
    //                acnt = acnt.setIn( ['orders'], set => set.add(update.id) )
    //          }
    //          else if( update.id.search( vesting_balance_prefix ) == 0 )
    //          {
    //             if( update.owner == account_id )
    //                acnt = acnt.setIn( ['vesting_balances'], set => set.add(update.id) )
    //          }

    //          this.objects_by_id = this.objects_by_id.set( acnt.id, acnt )
    //       }
    //    }
    //    this.fetchRecentHistory( acnt )
    // }


    /**
     *  Updates the object in place by only merging the set
     *  properties of object.
     *
     *  This method will create an immutable object with the given ID if
     *  it does not already exist.
     *
     *  This is a "private" method called when data is received from the
     *  server and should not be used by others.
     *
     *  @pre object.id must be a valid object ID
     *  @return an Immutable constructed from object and deep merged with the current state
     */


    ChainStore.prototype._updateObject = function _updateObject(object) {
        var notify_subscribers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
        var emit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;


        if (!("id" in object)) {
            if (__LIB_DEBUG__) console.log("object with no id:", object);
            if ("balance" in object && "owner" in object && "settlement_date" in object) {
                // Settle order object
                emitter.emit("settle-order-update", object);
            }
            return;
        }
        // if (!(object.id.split(".")[0] == 2) && !(object.id.split(".")[1] == 6)) {
        //   console.log( "update: ", object )
        // }

        // DYNAMIC GLOBAL OBJECT
        if (object.id == "2.1.0") {
            object.participation = 100 * (BigInteger(object.recent_slots_filled).bitCount() / 128.0);
            this.head_block_time_string = object.time;
            this.chain_time_offset.push(Date.now() - timeStringToDate(object.time).getTime());
            if (this.chain_time_offset.length > 10) this.chain_time_offset.shift(); // remove first
        }

        var current = this.objects_by_id.get(object.id);
        if (!current) current = Immutable.Map();
        var prior = current;
        if (current === undefined || current === true) this.objects_by_id = this.objects_by_id.set(object.id, current = Immutable.fromJS(object));else {
            this.objects_by_id = this.objects_by_id.set(object.id, current = current.mergeDeep(Immutable.fromJS(object)));
        }

        // BALANCE OBJECT
        if (object.id.substring(0, balance_prefix.length) == balance_prefix) {
            var owner = this.objects_by_id.get(object.owner);
            if (owner === undefined || owner === null) {
                return;
                /*  This prevents the full account from being looked up later
                 owner = {id:object.owner, balances:{ } }
                 owner.balances[object.asset_type] = object.id
                 owner = Immutable.fromJS( owner )
                 */
            } else {
                var balances = owner.get("balances");
                if (!balances) owner = owner.set("balances", Immutable.Map());
                owner = owner.setIn(['balances', object.asset_type], object.id);
            }
            this.objects_by_id = this.objects_by_id.set(object.owner, owner);
        }
        // ACCOUNT STATS OBJECT
        else if (object.id.substring(0, account_stats_prefix.length) == account_stats_prefix) {
                // console.log( "HISTORY CHANGED" )
                var prior_most_recent_op = prior ? prior.get('most_recent_op') : "2.9.0";

                if (prior_most_recent_op != object.most_recent_op) {
                    this.fetchRecentHistory(object.owner);
                }
            }
            // WITNESS OBJECT
            else if (object.id.substring(0, witness_prefix.length) == witness_prefix) {
                    this.witness_by_account_id.set(object.witness_account, object.id);
                    this.objects_by_vote_id.set(object.vote_id, object.id);
                }
                // COMMITTEE MEMBER OBJECT
                else if (object.id.substring(0, committee_prefix.length) == committee_prefix) {
                        this.committee_by_account_id.set(object.committee_member_account, object.id);
                        this.objects_by_vote_id.set(object.vote_id, object.id);
                    }
                    // ACCOUNT OBJECT
                    else if (object.id.substring(0, account_prefix.length) == account_prefix) {
                            current = current.set('active', Immutable.fromJS(object.active));
                            current = current.set('owner', Immutable.fromJS(object.owner));
                            current = current.set('options', Immutable.fromJS(object.options));
                            current = current.set('whitelisting_accounts', Immutable.fromJS(object.whitelisting_accounts));
                            current = current.set('blacklisting_accounts', Immutable.fromJS(object.blacklisting_accounts));
                            current = current.set('whitelisted_accounts', Immutable.fromJS(object.whitelisted_accounts));
                            current = current.set('blacklisted_accounts', Immutable.fromJS(object.blacklisted_accounts));
                            this.objects_by_id = this.objects_by_id.set(object.id, current);
                            this.accounts_by_name = this.accounts_by_name.set(object.name, object.id);
                        }
                        // ASSET OBJECT
                        else if (object.id.substring(0, asset_prefix.length) == asset_prefix) {
                                this.assets_by_symbol = this.assets_by_symbol.set(object.symbol, object.id);
                                var dynamic = current.get('dynamic');
                                if (!dynamic) {
                                    var dad = this.getObject(object.dynamic_asset_data_id, true);
                                    if (!dad) dad = Immutable.Map();
                                    if (!dad.get('asset_id')) {
                                        dad = dad.set('asset_id', object.id);
                                    }
                                    this.objects_by_id = this.objects_by_id.set(object.dynamic_asset_data_id, dad);

                                    current = current.set('dynamic', dad);
                                    this.objects_by_id = this.objects_by_id.set(object.id, current);
                                }

                                var bitasset = current.get('bitasset');
                                if (!bitasset && object.bitasset_data_id) {
                                    var bad = this.getObject(object.bitasset_data_id, true);
                                    if (!bad) bad = Immutable.Map();

                                    if (!bad.get('asset_id')) {
                                        bad = bad.set('asset_id', object.id);
                                    }
                                    this.objects_by_id = this.objects_by_id.set(object.bitasset_data_id, bad);

                                    current = current.set('bitasset', bad);
                                    this.objects_by_id = this.objects_by_id.set(object.id, current);
                                }
                            }
                            // ASSET DYNAMIC DATA OBJECT
                            else if (object.id.substring(0, asset_dynamic_data_prefix.length) == asset_dynamic_data_prefix) {
                                    // let asset_id = asset_prefix + object.id.substring( asset_dynamic_data_prefix.length )
                                    var asset_id = current.get("asset_id");
                                    if (asset_id) {
                                        var asset_obj = this.getObject(asset_id);
                                        if (asset_obj && asset_obj.set) {
                                            asset_obj = asset_obj.set('dynamic', current);
                                            this.objects_by_id = this.objects_by_id.set(asset_id, asset_obj);
                                        }
                                    }
                                }
                                // WORKER OBJECT
                                else if (object.id.substring(0, worker_prefix.length) == worker_prefix) {
                                        this.objects_by_vote_id.set(object.vote_for, object.id);
                                        this.objects_by_vote_id.set(object.vote_against, object.id);
                                    }
                                    // BITASSET DATA OBJECT
                                    else if (object.id.substring(0, bitasset_data_prefix.length) == bitasset_data_prefix) {
                                            var _asset_id = current.get("asset_id");
                                            if (_asset_id) {
                                                var asset = this.getObject(_asset_id);
                                                if (asset) {
                                                    asset = asset.set("bitasset", current);
                                                    emitter.emit('bitasset-update', asset);
                                                    this.objects_by_id = this.objects_by_id.set(_asset_id, asset);
                                                }
                                            }
                                        }
                                        // CALL ORDER OBJECT
                                        else if (object.id.substring(0, call_order_prefix.length) == call_order_prefix) {
                                                // Update nested call_orders inside account object
                                                if (emit) {
                                                    emitter.emit("call-order-update", object);
                                                }

                                                var account = this.objects_by_id.get(object.borrower);
                                                if (account && account.has("call_orders")) {
                                                    var call_orders = account.get("call_orders");
                                                    if (!call_orders.has(object.id)) {
                                                        account = account.set("call_orders", call_orders.add(object.id));
                                                        this.objects_by_id = this.objects_by_id.set(account.get("id"), account);
                                                    }
                                                }
                                            }
                                            // LIMIT ORDER OBJECT
                                            else if (object.id.substring(0, order_prefix.length) == order_prefix) {
                                                    var _account3 = this.objects_by_id.get(object.seller);
                                                    if (_account3 && _account3.has("orders")) {
                                                        var limit_orders = _account3.get("orders");
                                                        if (!limit_orders.has(object.id)) {
                                                            _account3 = _account3.set("orders", limit_orders.add(object.id));
                                                            this.objects_by_id = this.objects_by_id.set(_account3.get("id"), _account3);
                                                        }
                                                    }
                                                    // POROPOSAL OBJECT
                                                } else if (object.id.substring(0, proposal_prefix.length) == proposal_prefix) {
                                                    this.addProposalData(object.required_active_approvals, object.id);
                                                    this.addProposalData(object.required_owner_approvals, object.id);
                                                }

        if (notify_subscribers) {
            this.notifySubscribers(current);
        }
        return current;
    };

    ChainStore.prototype.getObjectsByVoteIds = function getObjectsByVoteIds(vote_ids) {
        var _this19 = this;

        var result = [];
        var missing = [];
        for (var i = 0; i < vote_ids.length; ++i) {
            var obj = this.objects_by_vote_id.get(vote_ids[i]);
            if (obj) result.push(this.getObject(obj));else {
                result.push(null);
                missing.push(vote_ids[i]);
            }
        }

        if (missing.length) {
            // we may need to fetch some objects
            Apis.instance().db_api().exec("lookup_vote_ids", [missing]).then(function (vote_obj_array) {
                console.log("missing ===========> ", missing);
                console.log("vote objects ===========> ", vote_obj_array);
                for (var _i2 = 0; _i2 < vote_obj_array.length; ++_i2) {
                    if (vote_obj_array[_i2]) {
                        _this19._updateObject(vote_obj_array[_i2]);
                    }
                }
            }, function (error) {
                return console.log("Error looking up vote ids: ", error);
            });
        }
        return result;
    };

    ChainStore.prototype.getObjectByVoteID = function getObjectByVoteID(vote_id) {
        var obj_id = this.objects_by_vote_id.get(vote_id);
        if (obj_id) return this.getObject(obj_id);
        return undefined;
    };

    ChainStore.prototype.getHeadBlockDate = function getHeadBlockDate() {
        return timeStringToDate(this.head_block_time_string);
    };

    ChainStore.prototype.getEstimatedChainTimeOffset = function getEstimatedChainTimeOffset() {
        if (this.chain_time_offset.length === 0) return 0;
        // Immutable is fast, sorts numbers correctly, and leaves the original unmodified
        // This will fix itself if the user changes their clock
        var median_offset = Immutable.List(this.chain_time_offset).sort().get(Math.floor((this.chain_time_offset.length - 1) / 2));
        // console.log("median_offset", median_offset)
        return median_offset;
    };

    ChainStore.prototype.addProposalData = function addProposalData(approvals, objectId) {
        var _this20 = this;

        if (approvals) approvals.forEach(function (id) {
            var impactedAccount = _this20.objects_by_id.get(id);
            if (impactedAccount) {
                var proposals = impactedAccount.get("proposals");

                if (!proposals.includes(objectId)) {
                    proposals = proposals.add(objectId);
                    impactedAccount = impactedAccount.set("proposals", proposals);
                    _this20._updateObject(impactedAccount.toJS());
                }
            }
        });
    };

    // ====================================

    /**
     * 通过uid获取该账户的statistics
     * @param {String | Number} uid
     * @returns @returns {Promise<U>|Promise.<T>|*|Promise} resolve(statistics), reject({code, message})
     */


    ChainStore.prototype.fetchAccountStatisticsByUid = function fetchAccountStatisticsByUid(uid) {
        return new Promise(function (resolve, reject) {
            if (!ChainValidation.is_account_uid(uid)) {
                reject({ code: 2002, message: 'invalid account uid' });
            } else {
                Apis.instance().db_api().exec("get_full_accounts_by_uid", [[uid], { fetch_statistics: true }]).then(function (res) {
                    if (res.length == 0) {
                        reject({ code: 2001, message: 'account uid does not exist' });
                    } else {
                        resolve(res[0][1].statistics);
                    }
                }).catch(function (e) {
                    reject({ code: 2000, message: e.message });
                });
            }
        });
    };

    /**
     * 通过uid获取平台信息
     * @param {String | Number} uid 平台所有人uid
     * @returns {Promise<U>|Promise.<T>|*|Promise} resolve(platform), reject({code, message})
     */


    ChainStore.prototype.fetchPlatformByUid = function fetchPlatformByUid(uid) {
        return new Promise(function (resolve, reject) {
            if (!ChainValidation.is_account_uid(uid)) {
                reject({ code: 2002, message: 'invalid account uid' });
            } else {
                Apis.instance().db_api().exec("get_platform_by_account", [uid]).then(function (platform) {
                    if (platform) {
                        resolve(platform);
                    } else {
                        reject({ code: 2004, message: 'platform does not exist' });
                    }
                }).catch(function (e) {
                    reject({ code: 2000, message: e.message });
                });
            }
        });
    };

    /**
     * 查询平台列表
     * @param {String | Number} uid - 指定一个平台所有者id进行查询
     * @param {Number} limit - 返回数据数量
     * @param {Number} sortType - 排序方式 0 by_uid, 1 by_votes, 2 by_pledge
     */


    ChainStore.prototype.fetchPlatforms = function fetchPlatforms(pid) {
        var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
        var sortType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec('lookup_platforms', [pid, limit, sortType]).then(function (res) {
                resolve(res);
            }).catch(function (e) {
                reject(e);
            });
        });
    };

    /**
     * 查询资产列表
     */


    ChainStore.prototype.fetchAssets = function fetchAssets() {
        var _this21 = this;

        var lower_bound_symbol = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        var size = 100;
        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec("list_assets", [lower_bound_symbol, size]).then(function (res) {
                if (lower_bound_symbol) res.shift();
                var assetIds = [];
                for (var _iterator = res, _isArray = Array.isArray(_iterator), _i3 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                    var _ref;

                    if (_isArray) {
                        if (_i3 >= _iterator.length) break;
                        _ref = _iterator[_i3++];
                    } else {
                        _i3 = _iterator.next();
                        if (_i3.done) break;
                        _ref = _i3.value;
                    }

                    var o = _ref;

                    assetIds.push(o.dynamic_asset_data_id);
                }
                Apis.instance().db_api().exec('get_objects', [assetIds]).then(function (dyms) {
                    for (var i = 0; i < dyms.length; i++) {
                        var dym = dyms[i];
                        res[i].current_supply = dym.current_supply;
                        res[i].confidential_supply = dym.confidential_supply;
                        res[i].accumulated_fees = dym.accumulated_fees;
                    }
                    if (res.length >= size - 1) {
                        _this21.fetchAssets(res[res.length - 1].symbol).then(function (_res) {
                            resolve(res.concat(_res));
                        });
                    } else resolve(res);
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    /**
     * 查询资产
     * @param {String | number} query - 资产符号 或 id
     */


    ChainStore.prototype.fetchAsset = function fetchAsset(query) {
        var apiType = 'lookup_asset_symbols';
        if (typeof query == 'number') apiType = 'get_assets';
        return new Promise(function (resolve, reject) {
            Apis.instance().db_api().exec(apiType, [[query]]).then(function (res) {
                if (res.length > 0) {
                    var asset = res[0];
                    if (asset) {
                        Apis.instance().db_api().exec('get_objects', [[asset.dynamic_asset_data_id]]).then(function (dynamic) {
                            var dym = dynamic[0];
                            asset.current_supply = dym.current_supply;
                            asset.confidential_supply = dym.confidential_supply;
                            asset.accumulated_fees = dym.accumulated_fees;
                            resolve(asset);
                        }).catch(function (err) {
                            reject(err);
                        });
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    };

    /**
     * 查询账户资产
     * @param {String | Number} uid - 账户uid
     * @param {Array<int>} [assets] - 资产id数组 默认为查询该账户所拥有的所有资产
     */


    ChainStore.prototype.fetchAccountBalances = function fetchAccountBalances(uid) {
        var assets = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        return new Promise(function (resolve, reject) {

            var promise_balances = Apis.instance().db_api().exec('get_account_balances', [uid, assets]);
            var promise_core_balance = Apis.instance().db_api().exec("get_full_accounts_by_uid", [[uid], { fetch_statistics: true }]);

            Promise.all([promise_core_balance, promise_balances]).then(function (res) {
                if (res[0].length == 0) reject(new Error('Unknown account uid'));
                var _statistics = res[0][0][1].statistics;
                var _assets = [];
                var _assets_id = [];
                for (var _iterator2 = res[1], _isArray2 = Array.isArray(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
                    var _ref2;

                    if (_isArray2) {
                        if (_i4 >= _iterator2.length) break;
                        _ref2 = _iterator2[_i4++];
                    } else {
                        _i4 = _iterator2.next();
                        if (_i4.done) break;
                        _ref2 = _i4.value;
                    }

                    var a = _ref2;

                    if (a.asset_id == 0) a.amount = Long.fromValue(a.amount).add(_statistics.prepaid).toString();
                    _assets.push(a);
                    _assets_id.push(a.asset_id);
                }
                Apis.instance().db_api().exec('get_assets', [_assets_id]).then(function (a_res) {
                    for (var i = 0; i < _assets.length; i++) {
                        var a = a_res[i];
                        _assets[i].precision = a ? a.precision : 0;
                        _assets[i].symbol = a ? a.symbol : null;
                        _assets[i].description = a ? a.options.description : null;
                        _assets[i].max_supply = a ? a.options.max_supply : null;
                        _assets[i].current_supply = a ? a.dynamic_asset_data.current_supply : null;
                        _assets[i].issuer = a ? a.issuer : null;
                    }
                    resolve(_assets);
                }).catch(function (err) {
                    return reject(err);
                });
            }).catch(function (err) {
                return reject(err);
            });
        });
    };

    return ChainStore;
}();

var chain_store = new ChainStore();

function FetchChainObjects(method, object_ids, timeout) {
    var get_object = method.bind(chain_store);

    return new Promise(function (resolve, reject) {

        var timeout_handle = null;

        function onUpdate() {
            var not_subscribed_yet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            var res = object_ids.map(function (id) {
                return get_object(id);
            });
            if (res.findIndex(function (o) {
                return o === undefined;
            }) === -1) {
                if (timeout_handle) clearTimeout(timeout_handle);
                if (!not_subscribed_yet) chain_store.unsubscribe(onUpdate);
                resolve(res);
                return true;
            }
            return false;
        }

        var resolved = onUpdate(true);
        if (!resolved) chain_store.subscribe(onUpdate);

        if (timeout && !resolved) timeout_handle = setTimeout(function () {
            chain_store.unsubscribe(onUpdate);
            reject("timeout");
        }, timeout);
    });
}

chain_store.FetchChainObjects = FetchChainObjects;

function FetchChain(methodName, objectIds) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1900;


    var method = chain_store[methodName];
    if (!method) throw new Error("ChainStore does not have method " + methodName);

    var arrayIn = Array.isArray(objectIds);
    if (!arrayIn) objectIds = [objectIds];

    return chain_store.FetchChainObjects(method, Immutable.List(objectIds), timeout).then(function (res) {
        return arrayIn ? res : res.get(0);
    });
}

chain_store.FetchChain = FetchChain;

function timeStringToDate(time_string) {
    if (!time_string) return new Date("1970-01-01T00:00:00.000Z");
    if (!/Z$/.test(time_string)) //does not end in Z
        // https://github.com/cryptonomex/graphene/issues/368
        time_string = time_string + "Z";
    return new Date(time_string);
}

export default chain_store;