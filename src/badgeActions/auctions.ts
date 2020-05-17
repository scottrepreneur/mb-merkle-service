import {
  // ALL_FLIP_BIDS_QUERY,
  USER_FLIP_BIDS_QUERY,
} from "../apollo/queries";
import { makerClient } from "../apollo/clients";

export async function checkFlipBidsCountForAddress(
  address: string,
  count: number,
) {
  const result = await makerClient.query({
    query: USER_FLIP_BIDS_QUERY,
    fetchPolicy: "cache-first",
    variables: {
      address: address,
    },
  });
  if (result.data.votePollActions.length >= count) {
    return 1;
  } else {
    return 0;
  }
}

export function checkFlipWinsCountForAddress(address: string, count: number) {
  return 1;
}

export function checkFlapBidsCountForAddress(address: string, count: number) {
  return 1;
}

export function checkFlapWinsCountForAddress(address: string, count: number) {
  return 1;
}

export function checkFlopBidsCountForAddress(address: string, count: number) {
  return 1;
}

export function checkFlopWinsCountForAddress(address: string, count: number) {
  return 1;
}
