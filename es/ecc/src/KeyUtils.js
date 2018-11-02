import PrivateKey from './PrivateKey';
import PublicKey from './PublicKey';
import Address from './address';
import Aes from './aes';

import hash from './hash';
// import dictionary from './dictionary_en';
import secureRandom from 'secure-random';
import { ChainConfig } from 'yoyowjs-ws';
import assert from 'assert';
import randomBytes from 'randombytes';

// hash for .25 second
var HASH_POWER_MILLS = 250;
var entropyPos = 0,
    entropyCount = 0;
var externalEntropyArray = randomBytes(101);
var log2 = function log2(x) {
    return Math.log(x) / Math.LN2;
};

var key = {

    /** Uses 1 second of hashing power to create a key/password checksum.  An
    implementation can re-call this method with the same password to re-match
    the strength of the CPU (either after moving from a desktop to a mobile,
    mobile to desktop, or N years from now when CPUs are presumably stronger).
      A salt is used for all the normal reasons...
      @return object {
        aes_private: Aes,
        checksum: "{hash_iteration_count},{salt},{checksum}"
    }
    */
    aes_checksum: function aes_checksum(password) {
        var randomBuffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        if (!(typeof password === "string")) {
            throw new Error("password string required");
        }
        var salt = randomBuffer != null ? randomBuffer : secureRandom.randomBuffer(4).toString('hex');
        var iterations = 0;
        var secret = salt + password;
        // hash for .1 second
        var start_t = Date.now();
        while (Date.now() - start_t < HASH_POWER_MILLS) {
            secret = hash.sha256(secret);
            iterations += 1;
        }

        var checksum = hash.sha256(secret);
        var checksum_string = [iterations, salt.toString('hex'), checksum.slice(0, 4).toString('hex')].join(',');

        return {
            aes_private: Aes.fromSeed(secret),
            checksum: checksum_string
        };
    },


    /** Provide a matching password and key_checksum.  A "wrong password"
    error is thrown if the password does not match.  If this method takes
    much more or less than 1 second to return, one should consider updating
    all encyrpted fields using a new key.key_checksum.
    */
    aes_private: function aes_private(password, key_checksum) {
        var _key_checksum$split = key_checksum.split(','),
            iterations = _key_checksum$split[0],
            salt = _key_checksum$split[1],
            checksum = _key_checksum$split[2];

        var secret = salt + password;
        for (var i = 0; 0 < iterations ? i < iterations : i > iterations; 0 < iterations ? i++ : i++) {
            secret = hash.sha256(secret);
        }
        var new_checksum = hash.sha256(secret);
        if (!(new_checksum.slice(0, 4).toString('hex') === checksum)) {
            throw new Error("wrong password");
        }
        return Aes.fromSeed(secret);
    },


    /**
        A week random number generator can run out of entropy.  This should ensure even the worst random number implementation will be reasonably safe.
          @param1 string entropy of at least 32 bytes
    */
    random32ByteBuffer: function random32ByteBuffer() {
        var entropy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.cpuEntropy();
        var randomBuffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


        if (!(typeof entropy === 'string')) {
            throw new Error("string required for entropy");
        }

        if (entropy.length < 32) {
            throw new Error("expecting at least 32 bytes of entropy");
        }

        var start_t = Date.now();

        while (Date.now() - start_t < HASH_POWER_MILLS) {
            entropy = hash.sha256(entropy);
        }var hash_array = [];
        hash_array.push(entropy);

        // Hashing for 1 second may helps the computer is not low on entropy (this method may be called back-to-back).
        // webworker无法获取到window的情况，通过传参方式从main提供
        hash_array.push(randomBuffer != null ? new Buffer(randomBuffer) : secureRandom.randomBuffer(32));

        return hash.sha256(Buffer.concat(hash_array));
    },


    suggest_brain_key: function suggest_brain_key() {
        var dictionary = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ",";
        var entropy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.browserEntropy();


        var randomBuffer = this.random32ByteBuffer(entropy);

        var word_count = 16;
        var dictionary_lines = dictionary.split(',');

        if (!(dictionary_lines.length === 49744)) {
            throw new Error('expecting ' + 49744 + ' but got ' + dictionary_lines.length + ' dictionary words');
        }

        var brainkey = [];
        var end = word_count * 2;

        for (var i = 0; i < end; i += 2) {

            // randomBuffer has 256 bits / 16 bits per word == 16 words
            var num = (randomBuffer[i] << 8) + randomBuffer[i + 1];

            // convert into a number between 0 and 1 (inclusive)
            var rndMultiplier = num / Math.pow(2, 16);
            var wordIndex = Math.round(dictionary_lines.length * rndMultiplier);

            brainkey.push(dictionary_lines[wordIndex]);
        }
        return this.normalize_brainKey(brainkey.join(' '));
    },

    /**
     * 获取随机key
     * @param {Buffer} randomBuffer - 新增参数，在webworker操作的时候，从main通知到webworker
     */
    get_random_key: function get_random_key(entropy) {
        var randomBuffer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        return PrivateKey.fromBuffer(this.random32ByteBuffer(entropy, randomBuffer));
    },
    get_brainPrivateKey: function get_brainPrivateKey(brainKey) {
        var sequence = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

        if (sequence < 0) {
            throw new Error("invalid sequence");
        }
        brainKey = key.normalize_brainKey(brainKey);
        return PrivateKey.fromBuffer(hash.sha256(hash.sha512(brainKey + " " + sequence)));
    },


    // Turn invisible space like characters into a single space
    normalize_brainKey: function normalize_brainKey(brainKey) {
        if (!(typeof brainKey === 'string')) {
            throw new Error("string required for brainKey");
        }

        brainKey = brainKey.trim();
        return brainKey.split(/[\t\n\v\f\r ]+/).join(' ');
    },
    browserEntropy: function browserEntropy() {

        var entropyStr = "";
        try {
            entropyStr = new Date().toString() + " " + window.screen.height + " " + window.screen.width + " " + window.screen.colorDepth + " " + " " + window.screen.availHeight + " " + window.screen.availWidth + " " + window.screen.pixelDepth + navigator.language + " " + window.location + " " + window.history.length;

            for (var i = 0, mimeType; i < navigator.mimeTypes.length; i++) {
                mimeType = navigator.mimeTypes[i];
                entropyStr += mimeType.description + " " + mimeType.type + " " + mimeType.suffixes + " ";
            }
            if (__DEBUG__) console.log("INFO\tbrowserEntropy gathered");
        } catch (error) {
            //nodejs:ReferenceError: window is not defined
            entropyStr = hash.sha256(new Date().toString());
        }

        var b = new Buffer(entropyStr);
        entropyStr += b.toString('binary') + " " + new Date().toString();
        return entropyStr;
    },


    // @return array of 5 legacy addresses for a pubkey string parameter.
    addresses: function addresses(pubkey) {
        var address_prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ChainConfig.address_prefix;

        var public_key = PublicKey.fromPublicKeyString(pubkey, address_prefix);
        // S L O W
        var address_string = [Address.fromPublic(public_key, false, 0).toString(address_prefix), // btc_uncompressed
        Address.fromPublic(public_key, true, 0).toString(address_prefix), // btc_compressed
        Address.fromPublic(public_key, false, 56).toString(address_prefix), // pts_uncompressed
        Address.fromPublic(public_key, true, 56).toString(address_prefix), // pts_compressed
        public_key.toAddressString(address_prefix) // bts_short, most recent format
        ];
        return address_string;
    },


    /**
    This runs in just under 1 second and ensures a minimum of cpuEntropyBits
    bits of entropy are gathered.
      Based on more-entropy. @see https://github.com/keybase/more-entropy/blob/master/src/generator.iced
      @arg {number} [cpuEntropyBits = 128]
    @return {array} counts gathered by measuring variations in the CPU speed during floating point operations.
    */
    cpuEntropy: function cpuEntropy() {
        var cpuEntropyBits = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 128;

        var collected = [];
        var lastCount = null;
        var lowEntropySamples = 0;
        while (collected.length < cpuEntropyBits) {
            var count = this.floatingPointCount();
            if (lastCount != null) {
                var delta = count - lastCount;
                if (Math.abs(delta) < 1) {
                    lowEntropySamples++;
                    continue;
                }
                // how many bits of entropy were in this sample
                var bits = Math.floor(log2(Math.abs(delta)) + 1);
                if (bits < 4) {
                    if (bits < 2) {
                        lowEntropySamples++;
                    }
                    continue;
                }
                collected.push(delta);
            }
            lastCount = count;
        }
        if (lowEntropySamples > 10) {
            var pct = Number(lowEntropySamples / cpuEntropyBits * 100).toFixed(2);
            // Is this algorithm getting inefficient?
            console.warn('WARN: ' + pct + '% low CPU entropy re-sampled');
        }
        return collected;
    },


    /**
        @private
        Count while performing floating point operations during a fixed time
        (7 ms for example).  Using a fixed time makes this algorithm
        predictable in runtime.
    */
    floatingPointCount: function floatingPointCount() {
        var workMinMs = 7;
        var d = Date.now();
        var i = 0,
            x = 0;
        while (Date.now() < d + workMinMs + 1) {
            x = Math.sin(Math.sqrt(Math.log(++i + x)));
        }
        return i;
    }
};

export default key;