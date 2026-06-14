## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

Counter (no constructor args):

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

TrialCounter (requires `WORLD_ID_ROUTER` — see [World ID address book](https://docs.world.org/world-id/idkit/onchain-verification)):

```shell
$ cd contracts
$ export WORLD_ID_ROUTER=0x57f928158C3EE7CDad1e4D8642503c4D0201f611  # World Chain Sepolia
$ forge script script/TrialCounter.s.sol:TrialCounterScript \
    --rpc-url worldchain_sepolia \
    --private-key $PRIVATE_KEY \
    --broadcast
```

Simulate without broadcasting by omitting `--broadcast`.

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
