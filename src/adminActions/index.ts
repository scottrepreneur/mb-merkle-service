import { addOrUpdateTemplateRecord } from "../utils/aws";
import {
  pollVoteAddressesForFrequency,
  spellVoteAddressesForFrequency,
} from "./governance";
import {
  biteAddressesForFrequency,
  // bidAddressesForFrequency,
  // bidGuyAddressesForFrequency,
} from "./auctions";
import { MerkleTree } from "../utils/merkleTree";

export async function updateRoots() {
  // saving at least 1 dai in DSR
  console.log({ templateId: 1, dai_saved: 1 });

  // locking Dai in DSR for N (time) periods
  const daiInDsr = [
    { templateId: 2, periods: 3 },
    { templateId: 3, periods: 6 },
  ];
  daiInDsr.map(async periods => {
    console.log(periods);
  });

  // transfer N (amount) of Dai
  const daiTransferred = [
    { templateId: 4, amount: 10 },
    { templateId: 5, amount: 100 },
  ];
  daiTransferred.map(async amount => {
    console.log(amount);
  });

  // skip 6 & 7, ecosystem partners Dai challenges

  // voting on at least N (frequency) governance polls
  const governanceVoteFrequencies = [
    { templateId: 6, frequency: 1 },
    { templateId: 7, frequency: 5 },
    { templateId: 8, frequency: 10 },
    { templateId: 9, frequency: 20 },
    { templateId: 10, frequency: 50 },
    { templateId: 11, frequency: 100 },
  ];
  governanceVoteFrequencies.map(async freq => {
    const addresses = await pollVoteAddressesForFrequency(freq.frequency);
    const tree = new MerkleTree(addresses.addresses);
    addOrUpdateTemplateRecord(
      freq.templateId,
      addresses.addresses,
      tree.getHexRoot(),
      addresses.progress,
    );
  });

  // voting on N (frequency) consecutive governance polls
  const consecutiveGovernanceVoteFrequencies = [
    { templateId: 12, frequency: 2 },
    { templateId: 13, frequency: 5 },
    { templateId: 14, frequency: 10 },
  ];
  consecutiveGovernanceVoteFrequencies.map(async freq => {
    console.log(freq);
  });

  // voting on at least N (frequency) executive proposals (spells)
  const executiveSpellFrequencies = [
    { templateId: 15, frequency: 1 },
    { templateId: 16, frequency: 5 },
    { templateId: 17, frequency: 10 },
    { templateId: 18, frequency: 20 },
    { templateId: 19, frequency: 50 },
  ];
  executiveSpellFrequencies.map(async freq => {
    const addresses = await spellVoteAddressesForFrequency(freq.frequency);
    // console.log(addresses.length);
    if (addresses.addresses.length > 0) {
      const tree = new MerkleTree(addresses.addresses);
      addOrUpdateTemplateRecord(
        freq.templateId,
        addresses.addresses,
        tree.getHexRoot(),
        addresses.progress,
      );
    } else {
      addOrUpdateTemplateRecord(
        freq.templateId,
        [],
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        {},
      );
    }
  });

  // early voter on Executive Spell (within 60 minutes of creation)
  console.log({ templateId: 20, time: 60 });

  // early voter on governance poll (within 60 minutes of start time)
  console.log({ templateId: 21, time: 60 });

  // biting at least N (frequency) unsafe Vaults
  const bitingVaultsFrequencies = [
    { templateId: 22, frequency: 1 },
    { templateId: 23, frequency: 10 },
    { templateId: 24, frequency: 50 },
    { templateId: 25, frequency: 100 },
  ];
  bitingVaultsFrequencies.map(async freq => {
    const addresses = await biteAddressesForFrequency(freq.frequency);
    console.log(addresses.addresses);
    const tree = new MerkleTree(addresses.addresses);
    addOrUpdateTemplateRecord(
      freq.templateId,
      addresses.addresses,
      tree.getHexRoot(),
      addresses.progress,
    );
  });

  // bidding on at least N (frequency) collateral auctions
  const bidCollateralAuctionFrequencies = [
    { templateId: 26, frequency: 1 },
    { templateId: 27, frequency: 5 },
    { templateId: 28, frequency: 10 },
    { templateId: 29, frequency: 25 },
  ];
  bidCollateralAuctionFrequencies.map(async freq => {
    // const addresses = await bidAddressesForFrequency(freq.frequency);
    console.log(freq);
    // const tree = new MerkleTree(addresses.addresses);
    // addOrUpdateTemplateRecord(
    //   freq.templateId,
    //   addresses.addresses,
    //   tree.getHexRoot(),
    //   addresses.progress
    // );
  });

  // winning at least N (frequency) collateral auctions
  const winCollateralAuctionFrequencies = [
    { templateId: 30, frequency: 1 },
    { templateId: 31, frequency: 5 },
    { templateId: 32, frequency: 10 },
    { templateId: 33, frequency: 25 },
  ];
  winCollateralAuctionFrequencies.map(async freq => {
    // const addresses = await bidGuyAddressesForFrequency(freq.frequency);
    console.log(freq);
    // const tree = new MerkleTree(addresses.addresses);
    // addOrUpdateTemplateRecord(
    //   freq.templateId,
    //   addresses.addresses,
    //   tree.getHexRoot(),
    //   addresses.progress
    // );
  });
}
