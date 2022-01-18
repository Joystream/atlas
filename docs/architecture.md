# Atlas technical architecture

_Partly adapted from https://github.com/Joystream/atlas/issues/1577_

## Overview

Joystream is a decentralized platform so there cannot be a permissioned backend for all the Atlas querying/persistence needs. Instead, Atlas uses a number of different "backend" services. This document tries to outline all of those services and connections between them.

<img width="1200" alt="Atlas architecture" src="https://user-images.githubusercontent.com/12646744/149950568-a0434411-aa09-48e2-99b7-b839c152ba5e.png">

### Joystream blockchain

_Repo: https://github.com/Joystream/joystream_

The Joystream blockchain is the technical centrepiece, serving as both the data, social and economic infrastructure layer for the overall system. It is a standalone Proof-of-Stake (PoS) blockchain (hence not a set of smart contracts, as is often the case for other systems). The native token, or currency, of the system is called JOY, is often denoted by the currency symbol $JOY. A distinguishing feature of the system is that it is upgradable, meaning that it has a built in capability for the community to upgrade the rules that govern the system. It has many interconnected subsystems, but the most important parts w.r.t. Atlas are

- **Membership System:** Described here https://joystream.gitbook.io/joystream-handbook/
- **Data Directory:** Described here https://joystream.gitbook.io/joystream-handbook/subsystems/storage/data-directory
- **Content Directory:** Described here (old) https://joystream.gitbook.io/joystream-handbook/subsystems/content-directory

The Joystream blockchain is written on top of a blockchain framework called [Substrate](https://docs.substrate.io/), which is a Rust based SDK for developer to build their own blockchains. This means we do not need to deal with very low level concepts, such as peer-to-peer networking, the consensus algorithm or state database. We only need to define the business logic of our specific use case, and this is done in Rust.

### Query Node

_Repo (framework): https://github.com/Joystream/hydra_

_Repo (mappings and schema): https://github.com/Joystream/joystream/tree/master/query-node_

_Production instance: https://hydra.joystream.org/graphql_

When applications need to read the state of the blockchain in some way, for example to see all video channels that exist, this mostly does not work well if you attempt to do so by directly connecting to a validator node. Validator nodes, who are involved in the business of validating the integrity of the system as it evolves, do not have any search indexes that allow for efficient queries of the current state of the system. For this reason, the query node is an intermediate query node layer which maintains various explicit query state that can be accessed through a GraphQL API. Our particular query node is built on top of a framework we built, called _Hydra_, described [here](https://www.joystream.org/hydra).

A critical issue with the query node infrastructure is that any changes to the blockchain require that infrastructure developers have to define the APIs, through schemas called _input schemas_, and processing code that takes blockchain ledger events and transactions, and updates the underlying query state of the node, these are called _mappings_. Writing such input schemas requires understanding both the underlying business logic of the part of the blockchain you want to expose to applications, and also what the requirements are of the particular application(s) you have in mind. This capability currently does not exist within the Atlas team itself, and so far we have relied on infrastructure developers to support us.

Currently, there is only a single query node deployed in every test or production deployment for Joystream networks, and it is operated by Jsgenesis in those cases. The likely future scenario is that running a query node will get bundled into the activities of a Gateway, as what particular schemas and queries are relevant to a given product instance may not apply to another. An alternative could be to make it a paid DAO role, or to try to rely on a third party middleware protocol like [Subsquid](https://www.subsquid.io/) eventually will become.

### Orion

_Repo: https://github.com/Joystream/orion_

_Production instance: https://orion.joystream.org/graphql_

Orion is a service for maintaining viewing statistics for content in Joystream, and likely will become the future Gateway node. It also maintains information about channel following and featured content set by community (see more [here](community/featured-content.md)). To simplify the Atlas architecture, Orion also acts as a GraphQL gateway, acting as a single point of entry for all Atlas querying needs. Any query sent to Orion will be proxied to query node and then enriched with Orion-specific data like video views. This is achieved with [GraphQL schema stitching](https://www.apollographql.com/blog/backend/graphql-schema-stitching/).

It's highly likely that Orion stops becoming a primary data store for viewing data in the future, as this really needs to live in a shared public data layer, rather than a trusted server. An open question which remains is what this open shared data layer for traffic information should look like. Currently, a very naive approach is taken to this, but it has obvious problems around verifiability, permissioning, fault tolerance and availability. Orion is a trusted and trusting service - it doesn't verify the data supplied to it and Atlas doesn't verify the data it gets from Orion. Anyone can read the data from Orion and modify it using GraphQL.

### Storage Nodes - Colossus

_Repo: https://github.com/Joystream/joystream/tree/giza/storage-node_

Storage nodes are responsible for long term archiving of user assets, such as videos, avatars, etc. The reference implementation for the Joystream storage node protocol is called `Colossus`. Importantly, these assets are _not_ stored on-chain, that is by validating nodes. A given asset is stored by a small subset of storage nodes, for redundancy, and each storage node only stores a small share of the overall set of assets. They are operated by community members through on-chain roles in the storage working groups, and are policed and directed by on-chain authorities, i.e. the lead and the council. Atlas uses storage nodes to do asset uploads from users when they publish.

### Distribution Nodes - Argus

_Repo: https://github.com/Joystream/joystream/tree/giza/distributor-node_

Bandwidth nodes are responsible for distributing user assets to end-users at scale, similar to how a CDN works. The reference implementation for the Joystream bandwidth node protocol is called `Argus`. Bandwidth nodes replicate data as needed from storage nodes, and maintain a local cache based on local request statistics. Currently there is no authentication layer, hence anyone can download anything, without payment or credentials. They are also operated by community members through on-chain roles in the distributor working groups. Atlas uses distribution nodes to download assets for displaying in the app (user avatars, videos, etc.).

### polkadot{.js} browser extension

A key design requirement of Atlas is that the user has full custody of all digital assets, meaning that no third-party (even the future Gateway) should have access to any of the keys that control the $JOY, NFTs, Social Tokens, channels or memberships of the user. This is not the only way to build apps on top of Joystream, someone could - and likely will, build a fully custodied and friction minimised version.

With this constraint in mind, the only robust way to allow users to manage keys, while also using the app in the browser, is to rely on a browser extension for key management. For the Ethereum ecosystem, [Metamask](https://metamask.io/) plays this role. Since Joystream is built on Substrate, we use the [polkadot{.js} extension](https://github.com/polkadot-js/extension), which is the equivalent for this ecosystem. It is not a full wallet, for example it does not have the ability to speak to a validator node, so it cannot send transactions or display balances, it only allows for holding keys and signing transactions. It's a POC and is not intended for end user so we will likely need to explore alternatives in the future.
