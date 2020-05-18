import {
  // ALL_FLIP_BIDS_QUERY,
  ALL_BITES_QUERY,
} from "../apollo/queries/auctions";
import { makerClient } from "../apollo/clients";
// import { addOrUpdateTemplateAddresses } from "../utils/aws";

async function allBiteAddresses() {
  const result = await makerClient.query({
    query: ALL_BITES_QUERY,
    fetchPolicy: "cache-first",
    variables: {
      collateral: "ETH-A",
    },
  });
  const biteAddresses = result.data.allBites.nodes.map((bite: any) => {
    return bite.tx.txFrom;
  });

  return biteAddresses;
}

export async function biteAddressesForFrequency(frequency: number) {
  const biteAddresses = await allBiteAddresses();
  const biteFreq = biteAddresses.reduce(function(acc, curr) {
    if (typeof acc[curr] == "undefined") {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }

    return acc;
  }, {});

  return Object.keys(biteFreq).filter(el => biteFreq[el] > frequency);
}
