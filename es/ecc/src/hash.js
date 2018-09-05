import createHash from "create-hash";
import createHmac from "create-hmac";

var hash = {
    /** @arg {string|Buffer} data
     @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
     @return {string|Buffer} - Buffer when digest is null, or string
     */
    sha1: function sha1(data, encoding) {
        return createHash('sha1').update(data).digest(encoding);
    },


    /** @arg {string|Buffer} data
     @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
     @return {string|Buffer} - Buffer when digest is null, or string
     */
    sha256: function sha256(data, encoding) {
        return createHash('sha256').update(data).digest(encoding);
    },


    /** @arg {string|Buffer} data
     @arg {string} [digest = null] - 'hex', 'binary' or 'base64'
     @return {string|Buffer} - Buffer when digest is null, or string
     */
    sha512: function sha512(data, encoding) {
        return createHash('sha512').update(data).digest(encoding);
    },
    HmacSHA256: function HmacSHA256(buffer, secret) {
        return createHmac('sha256', secret).update(buffer).digest();
    },
    ripemd160: function ripemd160(data) {
        return createHash('rmd160').update(data).digest();
    }
};

export default hash;