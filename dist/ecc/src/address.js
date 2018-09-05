'use strict';

exports.__esModule = true;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _yoyowjsWs = require('yoyowjs-ws');

var _hash2 = require('./hash');

var _hash3 = _interopRequireDefault(_hash2);

var _bs = require('bs58');

var _deepEqual = require('deep-equal');

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** Addresses are shortened non-reversable hashes of a public key.  The full PublicKey is preferred.
    @deprecated
*/
var Address = function () {
    function Address(addy) {
        _classCallCheck(this, Address);

        this.addy = addy;
    }

    Address.fromBuffer = function fromBuffer(buffer) {
        var _hash = _hash3.default.sha512(buffer);
        var addy = _hash3.default.ripemd160(_hash);
        return new Address(addy);
    };

    Address.fromString = function fromString(string) {
        var address_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _yoyowjsWs.ChainConfig.address_prefix;

        var prefix = string.slice(0, address_prefix.length);
        _assert2.default.equal(address_prefix, prefix, 'Expecting key to begin with ' + address_prefix + ', instead got ' + prefix);
        var addy = string.slice(address_prefix.length);
        addy = new Buffer((0, _bs.decode)(addy), 'binary');
        var checksum = addy.slice(-4);
        addy = addy.slice(0, -4);
        var new_checksum = _hash3.default.ripemd160(addy);
        new_checksum = new_checksum.slice(0, 4);
        var isEqual = (0, _deepEqual2.default)(checksum, new_checksum); //, 'Invalid checksum'
        if (!isEqual) {
            throw new Error("Checksum did not match");
        }
        return new Address(addy);
    };

    /** @return Address - Compressed PTS format (by default) */
    Address.fromPublic = function fromPublic(public_key) {
        var compressed = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        var version = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 56;

        var sha2 = _hash3.default.sha256(public_key.toBuffer(compressed));
        var rep = _hash3.default.ripemd160(sha2);
        var versionBuffer = new Buffer(1);
        versionBuffer.writeUInt8(0xFF & version, 0);
        var addr = Buffer.concat([versionBuffer, rep]);
        var check = _hash3.default.sha256(addr);
        check = _hash3.default.sha256(check);
        var buffer = Buffer.concat([addr, check.slice(0, 4)]);
        return new Address(_hash3.default.ripemd160(buffer));
    };

    Address.prototype.toBuffer = function toBuffer() {
        return this.addy;
    };

    Address.prototype.toString = function toString() {
        var address_prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _yoyowjsWs.ChainConfig.address_prefix;

        var checksum = _hash3.default.ripemd160(this.addy);
        var addy = Buffer.concat([this.addy, checksum.slice(0, 4)]);
        return address_prefix + (0, _bs.encode)(addy);
    };

    return Address;
}();

exports.default = Address;
module.exports = exports['default'];