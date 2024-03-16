/**
 * Defines the possible Merkle tree IDs.
 * @remarks The MerkleTrees class expects these to start from zero and be in incremental order.
 */
export declare enum MerkleTreeId {
    NULLIFIER_TREE = 0,
    NOTE_HASH_TREE = 1,
    PUBLIC_DATA_TREE = 2,
    L1_TO_L2_MESSAGE_TREE = 3,
    ARCHIVE = 4
}
export declare const merkleTreeIds: () => MerkleTreeId[];
//# sourceMappingURL=merkle_tree_id.d.ts.map