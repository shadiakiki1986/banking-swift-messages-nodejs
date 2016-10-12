# banking-swift-messages-nodejs
Nodejs library that parses fields from swift messages in txt format.

[![Build Status](https://travis-ci.org/shadiakiki1986/banking-swift-messages-nodejs.svg?branch=master)](https://travis-ci.org/shadiakiki1986/banking-swift-messages-nodejs)

The input to this parser is the output file of [pdftotext](https://packages.debian.org/sid/poppler-utils) with input `swift_message.pdf`

where the pdf file is the one spit out by [Swift Alliance Lite 2](https://www.swift.com/our-solutions/interfaces-and-integration/alliance-lite2)

The output is a JSON structure with the swift message fields and their values

ATM this only does MT103 swift messages (incoming transfers).

# Installation
1. Install Command-line-tool: `npm install -g banking-swift-messages`
2. Install `pdftotext` with `[sudo] apt-get install poppler-utils`

# Usage
1. Go to your `Swift Alliance Lite 2` incoming messages folder: `Alliance\ Lite2/files/reception/IncomingMsgs`
2. Run
```bash
pdftotext selected_file.pdf > selected_file.txt
# save result to file
swift2json -f selected_file.txt > selected_file.json
# save result to mongo
swift2json -f selected_file.txt -m localhost
```

Notes on caching to mongo:
* the key in the mongo db is the [basename](https://www.npmjs.com/package/basename) of the filename passed
* currently only the default mongodb port 27017 is allowed
* currently only the `banking-swift-messages` database name is allowed
* in case of error in connection to the mongo hostname, `swift2json` exits with code `255`

# Dockerfile
This dockerfile is just a worker that
1. greps the FFA text-format swift messages in `/usr/share/swift/*.txt` for `FIN 103` (incoming transfers)
2. parses those files with [bin/swift2json](https://github.com/shadiakiki1986/banking-swift-messages-nodejs)
3. populates the json to the mongo database

Usage
1. Launch a mongo db instance: `docker run -it -p 27017:27017 mongo`
2. Run the automated dockerfile published on [Docker hub]()
 * it `docker run -v /mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs:/usr/share/swift --env MONGOHOST=localhost -it shadiakiki1986/banking-swift-messages-nodejs`

Alternatively, build the dockerfile locally
1. Build this dockerfile `docker build -t s2m .`
2. Run it `docker run -v /mnt/hqfile_data/Shadi/swift-datedPdfs/IncomingMsgs:/usr/share/swift --env MONGOHOST=localhost -it s2m`

Change `localhost` to the hostname of the mongo db

# Swift Messages Background Documentation
'''Much of this documentation was reached through the documentation of [qoomon/banking-swift-messages-java](https://github.com/qoomon/banking-swift-messages-java), which is a parser for swift messages'''

The difference between that and this is that:
* there the input is the raw swift message
* This library deals with the text file output from `pdftotext` of the pdf version of the swift message that is output by `Swift Alliance Lite 2`

A credit transfer in the [swift](http://www.sepaforcorporates.com/swift-for-corporates/swift-message-types-know-mts-mxs/) messages inventory is labeled `MT103`.

For general reading, check [The Structure Of A SWIFT Message, Explained!](http://www.sepaforcorporates.com/swift-for-corporates/read-swift-message-structure/)
and [SWIFT Message Types – Know Your MTs from your MXs...](http://www.sepaforcorporates.com/swift-for-corporates/swift-message-types-know-mts-mxs/).

[Trade Samaritan](http://tradesamaritan.com/world-trade/products/mt103-single-customer-credit-transfer) and [Millenium BCP](http://ind.millenniumbcp.pt/pt/negocios/tesouraria/Documents/Manual_mt103.pdf) ([cached](docs/Manual_mt103.pdf)) explain the fields and procedure for this message well.

# Development
* Install dependencies: `[sudo] npm install`
* Lint: `grunt jshint` or just `grunt`
* Develop while watching edits: `grunt watch`
* Run unit tests: `npm test`
 * note that the proprietary files tests are skipped if not present
 * to test against a mongo instance, run one with `docker run -it -p 27017:27017 mongo`

