# yoyowJS (yoyowjs-lib)

Pure JavaScript yoyow library for node.js and browsers. Can be used to construct, sign and broadcast transactions in JavaScript, and to easily obtain data from the blockchain via public apis.

## Setup

```
npm install https://github.com/yoyow-org/yoyowjs-lib.git
```

## Usage

Three sub-libraries are included: `ECC`, `Chain` and `Serializer`. Generally only the `ECC` and `Chain` libraries need to be used directly.

### Chain

This library provides utility functions to handle blockchain state

### ECC

The ECC library contains all the crypto functions for private and public keys as well as transaction creation/signing.