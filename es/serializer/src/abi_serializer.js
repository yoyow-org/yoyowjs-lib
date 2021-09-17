var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import types from './types';
import ByteBuffer from 'bytebuffer';
import assert, { throws } from 'assert';
import FastParser from './FastParser';
import { Stream } from 'stream';

var uint8 = types.uint8,
    int8 = types.int8,
    uint16 = types.uint16,
    uint32 = types.uint32,
    int64 = types.int64,
    uint64 = types.uint64,
    jsenum = types.jsenum,
    string = types.string,
    bytes = types.bytes,
    bool = types.bool,
    array = types.array,
    fixed_array = types.fixed_array,
    protocol_id_type = types.protocol_id_type,
    object_id_type = types.object_id_type,
    vote_id = types.vote_id,
    future_extensions = types.future_extensions,
    static_variant = types.static_variant,
    map = types.map,
    set = types.set,
    public_key = types.public_key,
    address = types.address,
    time_point_sec = types.time_point_sec,
    extension = types.extension,
    optional = types.optional,
    account_uid_type = types.account_uid_type,
    asset_aid_type = types.asset_aid_type,
    platform_pid_type = types.platform_pid_type,
    post_pid_type = types.post_pid_type,
    share_type = types.share_type,
    asset_flags_type = types.asset_flags_type,
    license_lid_type = types.license_lid_type,
    advertising_aid_type = types.advertising_aid_type,
    advertising_order_oid_type = types.advertising_order_oid_type,
    custom_vote_vid_type = types.custom_vote_vid_type;


future_extensions = types.void;
account_uid_type = uint64;
asset_aid_type = uint64;
platform_pid_type = uint32;
post_pid_type = uint64;
asset_flags_type = uint16;
share_type = int64;
license_lid_type = uint64;
advertising_aid_type = uint64;
advertising_order_oid_type = uint64;
custom_vote_vid_type = uint64;

var build_in_types = _extends({}, types);

var AbiSerializer = function () {
    function AbiSerializer(abi, max_serialization_time) {
        _classCallCheck(this, AbiSerializer);

        this.typedefs = new Map();
        this.structs = new Map();
        this.actions = new Map();
        this.tables = new Map();
        this.error_messages = new Map();

        this.set_abi(abi, max_serialization_time);
    }
    ///
    /// @params max_serialization_time 毫秒


    AbiSerializer.prototype.set_abi = function set_abi(abi, max_serialization_time) {
        var deadline = new Date().getTime() + max_serialization_time;
        this.typedefs.clear();
        this.structs.clear();
        this.actions.clear();
        this.tables.clear();
        this.error_messages.clear();

        for (var _iterator = abi.structs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref;

            if (_isArray) {
                if (_i >= _iterator.length) break;
                _ref = _iterator[_i++];
            } else {
                _i = _iterator.next();
                if (_i.done) break;
                _ref = _i.value;
            }

            var st = _ref;

            this.structs.set(st.name, st);
        }

        for (var _iterator2 = abi.types, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray2) {
                if (_i2 >= _iterator2.length) break;
                _ref2 = _iterator2[_i2++];
            } else {
                _i2 = _iterator2.next();
                if (_i2.done) break;
                _ref2 = _i2.value;
            }

            var td = _ref2;

            assert(this.is_type(td.type, 0, deadline, max_serialization_time), 'invalid type ' + td.type);
            assert(!this.is_type(td.new_type_name, 0, deadline, max_serialization_time), 'type "' + td.new_type_name + '" already exists');
            this.typedefs[td.new_type_name] = td.type;
        }

        for (var _iterator3 = abi.actions, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
            var _ref3;

            if (_isArray3) {
                if (_i3 >= _iterator3.length) break;
                _ref3 = _iterator3[_i3++];
            } else {
                _i3 = _iterator3.next();
                if (_i3.done) break;
                _ref3 = _i3.value;
            }

            var a = _ref3;

            this.actions.set(a.name, a.type);
        }
        for (var _iterator4 = abi.tables, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
            var _ref4;

            if (_isArray4) {
                if (_i4 >= _iterator4.length) break;
                _ref4 = _iterator4[_i4++];
            } else {
                _i4 = _iterator4.next();
                if (_i4.done) break;
                _ref4 = _i4.value;
            }

            var t = _ref4;

            this.tables.set(t.name, t.type);
        }

        for (var _iterator5 = abi.error_messages, _isArray5 = Array.isArray(_iterator5), _i5 = 0, _iterator5 = _isArray5 ? _iterator5 : _iterator5[Symbol.iterator]();;) {
            var _ref5;

            if (_isArray5) {
                if (_i5 >= _iterator5.length) break;
                _ref5 = _iterator5[_i5++];
            } else {
                _i5 = _iterator5.next();
                if (_i5.done) break;
                _ref5 = _i5.value;
            }

            var e = _ref5;

            this.error_messages.set(e.error_code, e.error_msg);
        }
        assert(this.typedefs.size == abi.types.length);
        assert(this.structs.size == abi.structs.length);
        assert(this.actions.size == abi.actions.length);
        assert(this.tables.size == abi.tables.length);
        assert(this.error_messages.size == abi.error_messages.length);

        this.validate(deadline, max_serialization_time);
    };

    AbiSerializer.prototype.validate = function validate(deadline, max_serialization_time) {
        var _this = this;

        this.typedefs.forEach(function (type, new_type_name) {
            var types_seen = [new_type_name, type];
            var itr = _this.typedefs.get(type);
            while (itr) {
                assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
                assert(itr == types_seen[types.length - 1], 'Circular reference in type ' + type);
                types_seen.push(new_type_name);
                itr = _this.typedefs.get(itr);
            }
        });

        this.typedefs.forEach(function (type, new_type_name) {
            assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
            assert(_this.is_type(type, 0, deadline, max_serialization_time));
        });

        this.structs.forEach(function (struct, type) {
            if (struct.base) {
                var current = struct;
                var types_seen = [current.name];
                while (current.base) {
                    assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
                    var st = _this.get_struct(current.base);
                    assert(st.name == types_seen[types_seen.length - 1], 'Circular reference in struct ' + st.name);
                    types_seen.push(st.name);
                    current = st;
                }
            }
            struct.fields.forEach(function (field) {
                assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
                assert(_this.is_type(field.type, 0, deadline, max_serialization_time), field.type + ' is not a type');
            });
        });

        this.actions.forEach(function (type, name) {
            assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
            assert(_this.is_type(type, 0, deadline, max_serialization_time), type + ' is not a type');
        });

        this.tables.forEach(function (type, name) {
            assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
            assert(_this.is_type(type, 0, deadline, max_serialization_time), type + ' is not a type');
        });
        //TODO
    };

    AbiSerializer.prototype.is_type = function is_type(type, recursion_depth, deadline, max_serialization_time) {
        assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
        if (recursion_depth > AbiSerializer.max_recursion_depth) return false;
        var _type = this.fundamental_type(type);
        if (build_in_types[_type]) return true;
        if (this.typedefs.get(_type)) return this.is_type(this.typedefs.get(_type), recursion_depth, deadline, max_serialization_time);
        if (this.structs.get(_type)) return true;
        return false;
    };

    AbiSerializer.prototype.is_array = function is_array(type) {
        return (/\[\]$/.test(type)
        );
    };

    AbiSerializer.prototype.is_optional = function is_optional(type) {
        return (/\?$/.test(type)
        );
    };

    AbiSerializer.prototype.fundamental_type = function fundamental_type(type) {
        var s = new String(type);
        if (this.is_array(s)) {
            return s.substr(0, s.length - 2);
        } else if (this.is_optional(s)) {
            return s.substr(0, s.length - 1);
        } else {
            return s.toString();
        }
    };

    AbiSerializer.prototype.get_struct = function get_struct(type) {
        var st = this.structs.get(type);
        assert(st != null, 'Unknown struct of type "' + type + '"');
        return st;
    };

    AbiSerializer.prototype.get_action_type = function get_action_type(type) {
        if (this.actions.has(type)) {
            return this.actions.get(type);
        }
        return "";
    };

    AbiSerializer.prototype.resolve_type = function resolve_type(type) {
        var typedef = this.typedefs.get(type);
        if (typedef) {
            var typedefArray = Array.from(this.typedefs);
            for (var i = typedefArray.length; i > 0; --i) {
                var t = typedef;
                if (this.typedefs.has(t)) {
                    typedef = this.typedefs.get(t);
                } else {
                    return t;
                }
            }
        }
        return type;
    };

    /**
     * encode method parameters
     * @param {String} action_type method_name
     * @param {Object} action_args parameters
     * @param {Number} max_serialization_time 
     */


    AbiSerializer.prototype.encode = function encode(action_type, action_args) {
        var max_serialization_time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000000;

        return this.variant_to_binary(action_type, action_args, max_serialization_time);
    };

    /**
     * 
     * @param {String} action_type method_name
     * @param {String} binary serialized result
     * @param {Number} max_serialization_time 
     */


    AbiSerializer.prototype.decoode = function decoode(action_type, binary) {
        var max_serialization_time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000000;

        return this.binary_to_variant(action_type, binary, max_serialization_time);
    };

    AbiSerializer.prototype.variant_to_binary = function variant_to_binary(action_type, action_args) {
        var max_serialization_time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000000;

        return this._variant_to_binary(action_type, action_args, 0, new Date().getTime() + max_serialization_time, max_serialization_time);
    };

    AbiSerializer.prototype._variant_to_binary = function _variant_to_binary(action_type, action_args, recursion_depth, deadline, max_serialization_time) {
        assert(++recursion_depth < AbiSerializer.max_recursion_depth, 'recursive definition, max_recursion_depth ' + AbiSerializer.max_recursion_depth);
        assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
        if (!this.is_type(action_type, recursion_depth, deadline, max_serialization_time)) {
            return ByteBuffer.allocate(0);
        }
        var bytes = ByteBuffer.allocate(1024 * 1024, true);
        this._variant_to_binary_void(action_type, action_args, bytes, recursion_depth, deadline, max_serialization_time);
        bytes.flip();
        return bytes;
    };

    AbiSerializer.prototype._variant_to_binary_void = function _variant_to_binary_void(action_type, action_args, data, recursion_depth, deadline, max_serialization_time) {
        assert(++recursion_depth < AbiSerializer.max_recursion_depth, 'recursive definition, max_recursion_depth ' + AbiSerializer.max_recursion_depth);
        assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
        var r_type = this.resolve_type(action_type);
        var b_type = build_in_types[this.fundamental_type(r_type)];
        if (b_type) {
            b_type.appendByteBuffer(data, b_type.fromObject(action_args));
        } else if (this.is_array(r_type)) {
            assert(Array.isArray(action_args), 'invalid arguments of ' + r_type);
            build_in_types.uint8.appendByteBuffer(data, action_args.length);
            for (var _iterator6 = action_args, _isArray6 = Array.isArray(_iterator6), _i6 = 0, _iterator6 = _isArray6 ? _iterator6 : _iterator6[Symbol.iterator]();;) {
                var _ref6;

                if (_isArray6) {
                    if (_i6 >= _iterator6.length) break;
                    _ref6 = _iterator6[_i6++];
                } else {
                    _i6 = _iterator6.next();
                    if (_i6.done) break;
                    _ref6 = _i6.value;
                }

                var arg = _ref6;

                this._variant_to_binary_void(this.fundamental_type(r_type), arg, data, recursion_depth, deadline, max_serialization_time);
            }
        } else {
            var st = this.get_struct(r_type);
            if (this.is_object(action_args)) {
                if (st.base) {
                    this._variant_to_binary_void(this.resolve_type(st.base), action_args, data, recursion_depth, deadline, max_serialization_time);
                }
                for (var _iterator7 = st.fields, _isArray7 = Array.isArray(_iterator7), _i7 = 0, _iterator7 = _isArray7 ? _iterator7 : _iterator7[Symbol.iterator]();;) {
                    var _ref7;

                    if (_isArray7) {
                        if (_i7 >= _iterator7.length) break;
                        _ref7 = _iterator7[_i7++];
                    } else {
                        _i7 = _iterator7.next();
                        if (_i7.done) break;
                        _ref7 = _i7.value;
                    }

                    var field = _ref7;

                    if (action_args.hasOwnProperty(field.name)) {
                        this._variant_to_binary_void(field.type, action_args[field.name], data, recursion_depth, deadline, max_serialization_time);
                    } else {
                        throw 'Missing \'' + field.name + '\' in variant object';
                    }
                }
            } else if (Array.isArray(action_args)) {
                assert(!st.base, "support for base class as array not yet implemented");
                var i = 0;
                if (action_args.length > 0) {
                    for (var _iterator8 = st.fields, _isArray8 = Array.isArray(_iterator8), _i8 = 0, _iterator8 = _isArray8 ? _iterator8 : _iterator8[Symbol.iterator]();;) {
                        var _ref8;

                        if (_isArray8) {
                            if (_i8 >= _iterator8.length) break;
                            _ref8 = _iterator8[_i8++];
                        } else {
                            _i8 = _iterator8.next();
                            if (_i8.done) break;
                            _ref8 = _i8.value;
                        }

                        var _field = _ref8;

                        if (action_args.length > i) {
                            this._variant_to_binary_void(_field.type, action_args[i], data, recursion_depth, deadline, max_serialization_time);
                        } else {
                            this._variant_to_binary_void(_field.type, null, data, recursion_depth, deadline, max_serialization_time);
                        }
                        ++i;
                    }
                }
            }
        }
    };

    AbiSerializer.prototype.is_object = function is_object(obj) {
        return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) == 'object' && Object.prototype.toString.call(obj) == '[object Object]' && !obj.length;
    };

    AbiSerializer.prototype.binary_to_variant = function binary_to_variant(type, binary) {
        var max_serialization_time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000000;

        return this._binary_to_variant(type, binary, 0, new Date().getTime() + max_serialization_time, max_serialization_time);
    };

    AbiSerializer.prototype._binary_to_variant_obj = function _binary_to_variant_obj(type, data, obj, recursion_depth, deadline, max_serialization_time) {
        var st = this.get_struct(type);
        if (st.base) {
            this._binary_to_variant_obj(this.resolve_type(st.base), data, obj, recursion_depth, deadline, max_serialization_time);
        }
        for (var _iterator9 = st.fields, _isArray9 = Array.isArray(_iterator9), _i9 = 0, _iterator9 = _isArray9 ? _iterator9 : _iterator9[Symbol.iterator]();;) {
            var _ref9;

            if (_isArray9) {
                if (_i9 >= _iterator9.length) break;
                _ref9 = _iterator9[_i9++];
            } else {
                _i9 = _iterator9.next();
                if (_i9.done) break;
                _ref9 = _i9.value;
            }

            var field = _ref9;

            obj[field.name] = this._binary_to_variant_process(this.resolve_type(field.type), data, recursion_depth, deadline, max_serialization_time);
        }
    };

    AbiSerializer.prototype._binary_to_variant = function _binary_to_variant(type, binary, recursion_depth, deadline, max_serialization_time) {
        assert(++recursion_depth < AbiSerializer.max_recursion_depth, 'recursive definition, max_recursion_depth ' + AbiSerializer.max_recursion_depth);
        assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
        var bytes = ByteBuffer.fromHex(binary, true);
        return this._binary_to_variant_process(type, bytes, recursion_depth, deadline, max_serialization_time);
    };

    AbiSerializer.prototype._binary_to_variant_process = function _binary_to_variant_process(type, data, recursion_depth, deadline, max_serialization_time) {
        assert(++recursion_depth < AbiSerializer.max_recursion_depth, 'recursive definition, max_recursion_depth ' + AbiSerializer.max_recursion_depth);
        assert(new Date().getTime() < deadline, 'serialization time limit ' + max_serialization_time + 'us exceeded');
        var r_type = this.resolve_type(type);
        var f_type = this.fundamental_type(r_type);
        var b_type = build_in_types[f_type];
        if (b_type) {
            return b_type.toObject(b_type.fromByteBuffer(data));
        }
        if (this.is_array(r_type)) {
            var size = types.varint32.fromByteBuffer(data);
            var arr = [];
            for (var i = 0; i < size; i++) {
                var _obj = this._binary_to_variant_process(f_type, data, recursion_depth, deadline, max_serialization_time);
                assert(_obj != null, "Invalid packed array");
                arr.push(_obj);
            }
            assert(arr.length == size, 'packed size does not match unpacked array size, packed size ' + size + ' actual size ' + arr.length);
            return arr;
        } else if (this.is_optional(r_type)) {
            var flag = types.uint8.fromByteBuffer(data);
            if (flag) {
                return this._binary_to_variant_process(f_type, data, recursion_depth, deadline, max_serialization_time);
            } else {
                return undefined;
            }
        }
        var obj = {};
        this._binary_to_variant_obj(r_type, data, obj, recursion_depth, deadline, max_serialization_time);
        return obj;
    };

    return AbiSerializer;
}();

AbiSerializer.max_recursion_depth = 32;


export default AbiSerializer;