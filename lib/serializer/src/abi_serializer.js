import types from './types'
import ByteBuffer from 'bytebuffer'
import assert, { throws } from 'assert';
import FastParser from './FastParser';
import { Stream } from 'stream';

var {
    uint8, int8, uint16, uint32, int64, uint64, jsenum,
    string, bytes, bool, array, fixed_array,
    protocol_id_type, object_id_type, vote_id,
    future_extensions,
    static_variant, map, set,
    public_key, address,
    time_point_sec,
    extension,
    optional,
    account_uid_type, asset_aid_type, platform_pid_type, post_pid_type,
    share_type, asset_flags_type,license_lid_type,advertising_aid_type,advertising_order_oid_type,custom_vote_vid_type
} = types;

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

const build_in_types = {
    ...types
}

class AbiSerializer{
    typedefs = new Map();
    structs = new Map();
    actions = new Map();
    tables = new Map();
    error_messages = new Map();

    static max_recursion_depth = 32;

    constructor(abi,max_serialization_time){
        this.set_abi(abi,max_serialization_time);
    }
    ///
    /// @params max_serialization_time 毫秒
    set_abi(abi,max_serialization_time){
        let deadline = new Date().getTime() + max_serialization_time;
        this.typedefs.clear();
        this.structs.clear();
        this.actions.clear();
        this.tables.clear();
        this.error_messages.clear();

        for(let st of abi.structs){
            this.structs.set(st.name,st);
        }

        for(let td of abi.types){
            assert(this.is_type(td.type,0,deadline,max_serialization_time),`invalid type ${td.type}`);
            assert(!this.is_type(td.new_type_name,0,deadline,max_serialization_time),`type \"${td.new_type_name}\" already exists`);
            this.typedefs[td.new_type_name] = td.type; 
        }

        for(let a of abi.actions){
            this.actions.set(a.name,a.type);
        }
        for(let t of abi.tables){
            this.tables.set(t.name,t.type);
        }

        for(let e of abi.error_messages){
            this.error_messages.set(e.error_code,e.error_msg);
        }
        assert(this.typedefs.size == abi.types.length);
        assert(this.structs.size == abi.structs.length);
        assert(this.actions.size == abi.actions.length);
        assert(this.tables.size == abi.tables.length);
        assert(this.error_messages.size == abi.error_messages.length);

        this.validate(deadline,max_serialization_time);
    }

    validate(deadline,max_serialization_time){
        this.typedefs.forEach((type,new_type_name)=>{
            let types_seen = [new_type_name,type];
            let itr = this.typedefs.get(type);
            while(itr){
                assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
                assert(itr == types_seen[types.length-1],`Circular reference in type ${type}`);
                types_seen.push(new_type_name);
                itr = this.typedefs.get(itr);
            }
        });

        this.typedefs.forEach((type,new_type_name)=>{
            assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
            assert(this.is_type(type,0,deadline,max_serialization_time));
        });

        this.structs.forEach((struct,type)=>{
            if(struct.base){
                let current = struct;
                let types_seen = [current.name];
                while(current.base){
                    assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
                    let st = this.get_struct(current.base);
                    assert(st.name == types_seen[types_seen.length-1],`Circular reference in struct ${st.name}`)
                    types_seen.push(st.name);
                    current = st;
                }
            }
            struct.fields.forEach(field=>{
                assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
                assert(this.is_type(field.type,0,deadline,max_serialization_time),`${field.type} is not a type`);
            });
        });

        this.actions.forEach((type,name)=>{
            assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
            assert(this.is_type(type,0,deadline,max_serialization_time),`${type} is not a type`);
        });

        this.tables.forEach((type,name)=>{
            assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
            assert(this.is_type(type,0,deadline,max_serialization_time),`${type} is not a type`);
        });
        //TODO
    }

    is_type(type,recursion_depth,deadline,max_serialization_time){
        assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
        if(recursion_depth > AbiSerializer.max_recursion_depth)return false;
        let _type = this.fundamental_type(type);
        if(build_in_types[_type])return true;
        if(this.typedefs.get(_type))return this.is_type(this.typedefs.get(_type),recursion_depth,deadline,max_serialization_time);
        if(this.structs.get(_type))return true;
        return false;
    }

    is_array(type){
        return /\[\]$/.test(type);
    }

    is_optional(type){
        return /\?$/.test(type);
    }

    fundamental_type(type){
        const s = new String(type);
        if(this.is_array(s)){
            return s.substr(0,s.length-2);
        }else if(this.is_optional(s)){
            return s.substr(0,s.length-1);
        }else{
            return s.toString();
        }
    }

    get_struct(type){
        const st = this.structs.get(type);
        assert(st != null,`Unknown struct of type "${type}"`);
        return st;
    }

    get_action_type(type){
        if(this.actions.has(type)){
            return this.actions.get(type);
        }
        return "";
    }

    resolve_type(type){
        let typedef = this.typedefs.get(type);
        if(typedef){
            let typedefArray = Array.from(this.typedefs);
            for(let i= typedefArray.length;i>0;--i){
                const t = typedef;
                if(this.typedefs.has(t)){
                    typedef = this.typedefs.get(t);
                }else{
                    return t;
                }
            }
        }
        return type;
    }

    /**
     * encode method parameters
     * @param {String} action_type method_name
     * @param {Object} action_args parameters
     * @param {Number} max_serialization_time 
     */
    encode(action_type,action_args,max_serialization_time=1000000){
        return this.variant_to_binary(action_type,action_args,max_serialization_time);
    }

    /**
     * 
     * @param {String} action_type method_name
     * @param {String} binary serialized result
     * @param {Number} max_serialization_time 
     */
    decoode(action_type,binary,max_serialization_time = 1000000){
        return this.binary_to_variant(action_type,binary,max_serialization_time);
    }

    variant_to_binary(action_type,action_args,max_serialization_time=1000000){
        return this._variant_to_binary(action_type,action_args,0,new Date().getTime()+max_serialization_time,max_serialization_time);
    }

    _variant_to_binary(action_type, action_args, recursion_depth, deadline,max_serialization_time){
        assert(++recursion_depth < AbiSerializer.max_recursion_depth,`recursive definition, max_recursion_depth ${AbiSerializer.max_recursion_depth}`);
        assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
        if(!this.is_type(action_type,recursion_depth,deadline,max_serialization_time)){
            return ByteBuffer.allocate(0);
        }
        let bytes = ByteBuffer.allocate(1024*1024,true);
        this._variant_to_binary_void(action_type,action_args,bytes,recursion_depth,deadline,max_serialization_time);
        bytes.flip();
        return bytes;
    }

    _variant_to_binary_void(action_type,action_args,data,recursion_depth,deadline,max_serialization_time){
        assert(++recursion_depth < AbiSerializer.max_recursion_depth,`recursive definition, max_recursion_depth ${AbiSerializer.max_recursion_depth}`);
        assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
        const r_type = this.resolve_type(action_type);
        const b_type = build_in_types[this.fundamental_type(r_type)];
        if(b_type){
            b_type.appendByteBuffer(data,b_type.fromObject(action_args));
        }else if(this.is_array(r_type)){
            assert(Array.isArray(action_args),`invalid arguments of ${r_type}`);
            build_in_types.uint8.appendByteBuffer(data,action_args.length);
            for(let arg of action_args){
                this._variant_to_binary_void(this.fundamental_type(r_type),arg,data,recursion_depth,deadline,max_serialization_time);
            }
        }else{
            const st = this.get_struct(r_type);
            if(this.is_object(action_args)){
                if(st.base){
                    this._variant_to_binary_void(this.resolve_type(st.base),action_args,data,recursion_depth,deadline,max_serialization_time);
                }
                for(let field of st.fields){
                    if(action_args.hasOwnProperty(field.name)){
                        this._variant_to_binary_void(field.type,action_args[field.name],data,recursion_depth,deadline,max_serialization_time);
                    }else{
                        throw `Missing '${field.name}' in variant object`;
                    }
                }
            }else if(Array.isArray(action_args)){
                assert(!st.base,"support for base class as array not yet implemented");
                let i = 0;
                if(action_args.length > 0){
                    for(let field of st.fields){
                        if(action_args.length > i){
                            this._variant_to_binary_void(field.type,action_args[i],data,recursion_depth,deadline,max_serialization_time);
                        }else{
                            this._variant_to_binary_void(field.type,null,data,recursion_depth,deadline,max_serialization_time);
                        }
                        ++i;
                    }
                }
            }
        }
    }

    is_object(obj){
        return typeof(obj) == 'object' && Object.prototype.toString.call(obj) == '[object Object]' && !obj.length
    }

    binary_to_variant(type,binary,max_serialization_time = 1000000){
        return this._binary_to_variant(type,binary,0,new Date().getTime() + max_serialization_time,max_serialization_time);
    }

    _binary_to_variant_obj(type,data,obj,recursion_depth,deadline,max_serialization_time){
        let st = this.get_struct(type);
        if(st.base){
            this._binary_to_variant_obj(this.resolve_type(st.base),data,obj,recursion_depth,deadline,max_serialization_time);
        }
        for(let field of st.fields){
            obj[field.name] = this._binary_to_variant_process(this.resolve_type(field.type),data,recursion_depth,deadline,max_serialization_time);
        }
    }

    _binary_to_variant(type,binary,recursion_depth,deadline,max_serialization_time){
        assert(++recursion_depth < AbiSerializer.max_recursion_depth,`recursive definition, max_recursion_depth ${AbiSerializer.max_recursion_depth}`);
        assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
        let bytes = ByteBuffer.fromHex(binary,true);
        return this._binary_to_variant_process(type,bytes,recursion_depth,deadline,max_serialization_time);
    }

    _binary_to_variant_process(type,data,recursion_depth,deadline,max_serialization_time){
        assert(++recursion_depth < AbiSerializer.max_recursion_depth,`recursive definition, max_recursion_depth ${AbiSerializer.max_recursion_depth}`);
        assert(new Date().getTime() < deadline,`serialization time limit ${max_serialization_time}us exceeded`);
        let r_type = this.resolve_type(type);
        let f_type = this.fundamental_type(r_type);
        let b_type = build_in_types[f_type];
        if(b_type){
            return b_type.toObject(b_type.fromByteBuffer(data));
        }
        if(this.is_array(r_type)){
            let size = types.varint32.fromByteBuffer(data);
            let arr = [];
            for(let i = 0;i < size;i++){
                let obj = this._binary_to_variant_process(f_type,data,recursion_depth,deadline,max_serialization_time);
                assert(obj != null, "Invalid packed array");
                arr.push(obj);
            }
            assert(arr.length == size,`packed size does not match unpacked array size, packed size ${size} actual size ${arr.length}`);
            return arr;
        }else if(this.is_optional(r_type)){
            let flag = types.uint8.fromByteBuffer(data);
            if(flag){
                return this._binary_to_variant_process(f_type,data,recursion_depth,deadline,max_serialization_time);
            }else{
                return undefined;
            }
        }
        let obj = {};
        this._binary_to_variant_obj(r_type,data,obj,recursion_depth,deadline,max_serialization_time);
        return obj;
    }

}

export default AbiSerializer;