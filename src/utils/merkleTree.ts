const { MerkleTree } = require("merkletreejs");
const SHA256 = require("crypto-js/sha256");

export function getTree(addresses: string[]) {
  const leaves = addresses.map(x => SHA256(x));
  return new MerkleTree(leaves, SHA256);
}

export function getProof(address: string, tree: any) {
  const leaf = SHA256(address);
  return tree.getProof(leaf);
}

export function getRoot(tree: any) {
  return tree.getRoot().toString("hex");
}

export function checkProof(address: string, proof: string, tree: any) {
  const root = tree.getRoot().toString("hex");
  const leaf = SHA256(address);
  return tree.verify(proof, leaf, root);
}
