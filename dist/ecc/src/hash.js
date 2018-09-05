"use strict";

exports.__esModule = true;

var _createHash = require("create-hash");

var _createHash2 = _interopRequireDefault(_createHash);

var _createHmac = require("create-hmac");

var _createHmac2 = _interopRequireDefault(_createHmac);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var hash = {
    /** @arg {string|Buffer} data
     @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
     @return {string|Buffer} - Buffer when digest is null, or string
     */
    sha1: function sha1(data, encoding) {
        return (0, _createHash2.default)('sha1').update(data).digest(encoding);
    },


    /** @arg {string|Buffer} data
     @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
     @return {string|Buffer} - Buffer when digest is null, or string
     */
    sha256: function sha256(data, encoding) {
        return (0, _createHash2.default)('sha256').update(data).digest(encoding);
    },


    /** @arg {string|Buffer} data
     @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
     @return {string|Buffer} - Buffer when digest is null, or string
     */
    sha512: function sha512(data, encoding) {
        return (0, _createHash2.default)('sha512').update(data).digest(encoding);
    },
    HmacSHA256: function HmacSHA256(buffer, secret) {
        return (0, _createHmac2.default)('sha256', secret).update(buffer).digest();
    },
    ripemd160: function ripemd160(data) {
        return (0, _createHash2.default)('rmd160').update(data).digest();
    }
};

exports.default = hash;
module.exports = exports["default"];