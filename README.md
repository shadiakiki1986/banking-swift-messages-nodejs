# banking-swift-message-reverse-mustache
Nodejs library that parses fields from swift messages in txt format.

The input to this parser is the output file of [pdftotext](https://packages.debian.org/sid/poppler-utils) with input `swift_message.pdf`

where the pdf file is the one spit out by [Swift Alliance Lite 2](https://www.swift.com/our-solutions/interfaces-and-integration/alliance-lite2)

The output is a JSON structure with the swift message fields and their values

# Usage
Install `pdftotext` with `[sudo] apt-get install poppler-utils`

# Development
* Install dependencies: `[sudo] npm install`
* Lint: `grunt jshint` or just `grunt`
* Develop while watching edits: `grunt watch`
* Run unit tests: `npm test`

# Documentation
'''Much of this documentation was reached through the documentation of [qoomon/banking-swift-messages-java](https://github.com/qoomon/banking-swift-messages-java), which is a parser for swift messages'''

The difference between that and this is that:
* there the input is the raw swift message
* This library deals with the text file output from `pdftotext` of the pdf version of the swift message that is output by `Swift Alliance Lite 2`

A credit transfer in the [swift](http://www.sepaforcorporates.com/swift-for-corporates/swift-message-types-know-mts-mxs/) messages inventory is labeled `MT103`.

For general reading, check [The Structure Of A SWIFT Message, Explained!](http://www.sepaforcorporates.com/swift-for-corporates/read-swift-message-structure/)
and [SWIFT Message Types – Know Your MTs from your MXs...](http://www.sepaforcorporates.com/swift-for-corporates/swift-message-types-know-mts-mxs/).

[Trade Samaritan](http://tradesamaritan.com/world-trade/products/mt103-single-customer-credit-transfer) and [Millenium BCP](http://ind.millenniumbcp.pt/pt/negocios/tesouraria/Documents/Manual_mt103.pdf) ([cached](docs/Manual_mt103.pdf)) explain the fields and procedure for this message well.
