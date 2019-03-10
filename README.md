# Project 4

This project exposes a RESTful API that represents a Star Registry Service which
allows a user to claim ownership of a star.

## Getting Started

Clone or download the project onto your machine. From the command line, CD into the
project's root directory and run:

```
npm install
```

Then run:

```
node index.js
```

### Usage:

Use Postman, curl, or similar tool to make HTTP requests. Use Electrum, or other
Bitcoin wallet to obtain an address and sign a message.

## Validation Routine:

### URL: http://localhost:8000/requestValidation

A request to this endpoint adds a validation request to the mempool. The message returned
must be validated within five minutes, or the validation request will be deleted from the
mempool. The message returned will need to be signed using a Bitcoin wallet.

#### example request:

```
curl -X POST \
  http://localhost:8000/requestValidation \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
    "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW"
  }'
```

#### example response:

```
{
    "walletAddress": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
    "requestTimeStamp": 1552160056837,
    "message": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW:1552160056837:starRegistry",
    "validationWindow": 300
}
```

### URL: http://localhost:8000/message-signature/validate

A request to this endpoint validates a message signature and grants a user access
to register a single star. The user must register a star within thirty minutes or
the validated request will be deleted from the mempool.

#### example request:

```
curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
  "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
  "signature": "IEOTLDoCHsE5Iv6UgQfepC8ZqMkWyllAAx0W9L28k7cQQiAaKhOwPoe3RUAra0hjDr2M0SCc/PRvxKpk/gn7nvY="
}'
```

#### example response:

```
{
    "registerStar": true,
    "status": {
        "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
        "validationTimeStamp": 1552160196095,
        "message": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW:1552160056837:starRegistry",
        "submissionWindow": 1800,
        "messageSignature": true
    }
}
```

## Star Registration:

### URL: http://localhost:8000/block

A request to this endpoint submits star information to be saved on the blockchain.

#### example request:

```
curl -X POST \
  http://localhost:8000/message-signature/validate \
  -H 'Content-Type: application/json' \
  -H 'cache-control: no-cache' \
  -d '{
"address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
    "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "Found star using https://www.google.com/sky/"
        }
}'
```

#### example response:

```
{
    "hash": "ea5b52eba8276db9eb147889050e851880e8a2d095c5e1055df089db0aded24f",
    "height": 20,
    "time": 1552160286841,
    "body": {
        "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f"
        }
    },
    "previousBlockHash": "e764400da779a428b0e5c439281c51cbbad4a85d186311498cada510b696f41e"
}
```

## Star Lookup:

### URL: http://localhost:8000/stars/hash:[HASH]

A request to this endpoint looks up a Star block by it's hash and returns it's contents
along with the star story decoded to ASCII.

#### example request:

```
curl http://localhost:8000/stars/hash:ea5b52eba8276db9eb147889050e851880e8a2d095c5e1055df089db0aded24f
```

#### example response:

```
{
    "hash": "ea5b52eba8276db9eb147889050e851880e8a2d095c5e1055df089db0aded24f",
    "height": 20,
    "time": 1552160286841,
    "body": {
        "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "previousBlockHash": "e764400da779a428b0e5c439281c51cbbad4a85d186311498cada510b696f41e"
}
```

### URL: http://localhost:8000/stars/address:[ADDRESS]

A request to this endpoint looks up any Star blocks associated with the given address, and
returns their contents along with their star stories decoded to ASCII.

#### example request:

```
curl localhost:8000/stars/address:1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW
```

#### example response:

```
[
    {
        "hash": "be9907f34397a6a275bb693b43ec42389423ba03ef3f8ac62f89803a535aade6",
        "height": 18,
        "time": 1548531540120,
        "body": {
            "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
            "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "previousBlockHash": "d0fa800162e02376fcd752d9c65db43747e9d45a1c1e3687ec509169f5cdf0ca"
    },
    {
        "hash": "e764400da779a428b0e5c439281c51cbbad4a85d186311498cada510b696f41e",
        "height": 19,
        "time": 1552157437144,
        "body": {
            "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
            "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "previousBlockHash": "be9907f34397a6a275bb693b43ec42389423ba03ef3f8ac62f89803a535aade6"
    },
    {
        "hash": "ea5b52eba8276db9eb147889050e851880e8a2d095c5e1055df089db0aded24f",
        "height": 20,
        "time": 1552160286841,
        "body": {
            "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
            "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
                "storyDecoded": "Found star using https://www.google.com/sky/"
            }
        },
        "previousBlockHash": "e764400da779a428b0e5c439281c51cbbad4a85d186311498cada510b696f41e"
    }
]
```

### URL: http://localhost:8000/block/[HEIGHT]

A request to this endpoint looks up a Star block by it's block height, and
returns the contents.

#### example request:

```
curl localhost:8000/block/20
```

#### example response:

```
{
    "hash": "ea5b52eba8276db9eb147889050e851880e8a2d095c5e1055df089db0aded24f",
    "height": 20,
    "time": 1552160286841,
    "body": {
        "address": "1HMs1qQ3H9XcrSgRLJUM8bCGrbd3FHNmLW",
        "star": {
            "dec": "68° 52' 56.9",
            "ra": "16h 29m 1.0s",
            "story": "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
            "storyDecoded": "Found star using https://www.google.com/sky/"
        }
    },
    "previousBlockHash": "e764400da779a428b0e5c439281c51cbbad4a85d186311498cada510b696f41e"
}
```
