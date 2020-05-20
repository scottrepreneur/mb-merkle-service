const { MerkleTree } = require("merkletreejs");
const keccak = require("crypto-js/sha3");

export function getTree(addresses: string[]) {
  const leaves = addresses.map((x) => keccak(x.toLowerCase()));
  // console.log(leaves);
  return new MerkleTree(leaves, keccak);
}

export function getBadgeProof(address: string, tree: any) {
  const leaf = keccak(address.toLowerCase());
  // console.log(leaf);
  // console.log(MerkleTree.print(tree));
  return tree.getProof(leaf);
}

export function getRoot(tree: any) {
  return tree.getRoot().toString("hex");
}

export function checkProof(address: string, proof: string, tree: any) {
  const root = tree.getRoot().toString("hex");
  const leaf = keccak(address.toLowerCase());
  return tree.verify(proof, leaf, root);
}
