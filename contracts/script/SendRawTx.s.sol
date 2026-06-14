// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";

/// @notice Broadcasts a single transaction with arbitrary raw calldata.
///
/// Configure via env vars:
///   TARGET  - address to call (the `to` field)
///   DATA    - raw calldata as a hex string, e.g. 0xa9059cbb...
///   VALUE   - (optional) wei to send, defaults to 0
///
/// Run with:
///   forge script script/SendRawTx.s.sol:SendRawTxScript \
///     --rpc-url sepolia_testnet --broadcast
contract SendRawTxScript is Script {
    function run() public {
        address target = vm.envAddress("TARGET");
        bytes memory data = vm.envBytes("DATA");
        uint256 value = vm.envOr("VALUE", uint256(0));

        console2.log("Target:", target);
        console2.log("Value (wei):", value);
        console2.logBytes(data);

        vm.startBroadcast();

        (bool success, bytes memory ret) = target.call{value: value}(data);

        vm.stopBroadcast();

        require(success, "raw tx reverted");
        console2.log("Success. Return data:");
        console2.logBytes(ret);
    }
}
