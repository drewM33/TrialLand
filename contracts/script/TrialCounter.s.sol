// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console2} from "forge-std/Script.sol";
import {VerifyLegacyV3, IWorldID} from "../src/TrialCounter.sol";

contract TrialCounterScript is Script {
    function run() public {
        address worldIdRouter = vm.envAddress("WORLD_ID_ROUTER");

        vm.startBroadcast();

        VerifyLegacyV3 trialCounter = new VerifyLegacyV3(IWorldID(worldIdRouter));

        vm.stopBroadcast();

        console2.log("TrialCounter deployed at:", address(trialCounter));
        console2.log("World ID router:", worldIdRouter);
    }
}
