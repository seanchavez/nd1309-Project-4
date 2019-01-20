# Project 2

This project utilizes the Express framework to expose GET and POST endpoints that interact with a private blockchain.

## Getting Started

Clone or download the project onto your machine. From your command line, CD into the
project's root directory and run:

```
npm install
```

Then run:

```
node index.js
```

### Usage:

Use Postman , curl, or similar tool to make http requests.

## GET

URL: http://localhost:8000/block/[block_height]

A request to this endpoint returns the requested block object in the response.

#### example:

```
curl http://localhost:8000/block/0
```

#### response:

```
{
  "height":0,"timeStamp":"1547943533","body":"Genesis Block!","previousBlockHash":"","hash":"3bdd2e4f11ab0532066942c1442fa122b5249d29bef04911d7f8f15d7a1a9241"
}
```

## POST

URL: http://localhost:8000/block

A request to this endpoint must include data for the block body in JSON format:

```
{
  "body": "Data"
}
```

The request will create a new block with the submitted data on the "body" property and returns the newly added block object in the response.

#### example:

```
curl -d '{"body":"data"}' -H "Content-Type: application/json" -X POST http://localhost:8000/block
```

#### response:

```
{
  "height":1,"timeStamp":"1547943772","body":"data","previousBlockHash":"3bdd2e4f11ab0532066942c1442fa122b5249d29bef04911d7f8f15d7a1a9241","hash":"dd77ad7528809f6f602e96132544e913cebf3447ead372d96be26606a4fe0e07"
}
```
