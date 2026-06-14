// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {TrialRegistrar, IWorldID} from "../src/TrialRegistrar.sol";

contract TrialRegistrarScript is Script {
    function run() public {
        address worldIdRouter = vm.envAddress("WORLD_ID_ROUTER");

        vm.startBroadcast();

        TrialRegistrar TrialRegistrar = new TrialRegistrar(IWorldID(worldIdRouter));

        vm.stopBroadcast();

        console2.log("TrialRegistrar deployed at:", address(TrialRegistrar));
        console2.log("World ID router:", worldIdRouter);
    }
}
