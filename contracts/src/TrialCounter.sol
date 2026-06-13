interface IWorldID {
    function verifyProof(
        uint256 root,
        uint256 groupId,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external view;
}

contract VerifyLegacyV3 {
    IWorldID public immutable worldIdRouter;
    uint256 public constant GROUP_ID = 1; // Orb
    mapping(uint256 => bool) public nullifierHashes;

    mapping(address => bool) public addressRegistered;
    mapping(uint256 => Trial) public trials;
    uint256 totalTrials;

    struct Trial {
        bytes32 id;
        uint256 maxRedemptions;
        uint256 currentRedemptions;
        uint64 start;
        uint64 end;
    }
    event TrialClaimed(address user, bytes32 id);
    error InvalidNullifier();
    error NoRemainingRedemptions();

    constructor(IWorldID _worldIdRouter) {
        worldIdRouter = _worldIdRouter;
    }

    function verifyLegacyAndExecute(
        uint256 root,
        uint256 signalHash,
        uint256 nullifierHash,
        uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external {
        if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

        worldIdRouter.verifyProof(
            root,
            GROUP_ID,
            signalHash,
            nullifierHash,
            externalNullifierHash,
            proof
        );

        nullifierHashes[nullifierHash] = true;
        addressRegistered[address(uint160(signalHash))] = true;

        // Execute protected business logic here.
    }
    function addTrial(Trial memory t) public {
        totalTrials += 1;
        trials[totalTrials] = t;
    }
    function redeemTrial(uint256 index, address recipient) public {
        Trial storage trial = trials[index];
        require(
            block.timestamp > trial.start && block.timestamp < trial.end,
            "Invalid Time Window"
        );
        require(
            trial.currentRedemptions + 1 <= trial.maxRedemptions,
            "NoRemainingRedemptions"
        );
        require(addressRegistered[recipient]==true,"invalid recipient");
        trial.currentRedemptions += 1;
        emit TrialClaimed(recipient,trial.id);
    }
}
