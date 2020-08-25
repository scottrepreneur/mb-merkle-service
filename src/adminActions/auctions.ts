import {
  ALL_FLIP_BIDS_QUERY,
  ALL_FLIPS_WON_QUERY,
  ALL_BITES_QUERY,
} from "../apollo/queries/auctions";
import { makerClient } from "../apollo/clients";
import { mapFrequenciesToProgressObject } from "../utils";
import { collateralFlippers } from "../constants";

async function allBiteAddresses(): Promise<any[]> {
  let superResult = [];
  for (let flipper in collateralFlippers) {
    // console.log(flipper);
    let wholeResult = [];
    let b = true;
    let i = 0;
    while (b === true) {
      i = i + 1;
      const result = await makerClient.query({
        query: ALL_BITES_QUERY,
        fetchPolicy: "cache-first",
        variables: {
          collateral: flipper,
          offset: i * 1000,
        },
      });
      if (result.data.allBites.nodes.length > 0) {
        let biteResults = result.data.allBites.nodes.map((bite: any) => {
          return bite.tx.txFrom;
        });
        // console.log(biteResults);
        wholeResult.push.apply(wholeResult, biteResults);
      } else {
        b = false;
      }
    }

    wholeResult.map((action: any) => {
      return action.sender;
    });

    superResult.push.apply(superResult, wholeResult);
  }
  return superResult;
}

export async function biteAddressesForFrequency(
  frequency: number,
): Promise<{ addresses: any[]; progress: Object }> {
  const biteAddresses = await allBiteAddresses();
  // console.log(biteAddresses);
  const biteFreq = new Map(
    [...new Set(biteAddresses)].map(x => [
      x,
      biteAddresses.filter(y => y === x).length,
    ]),
  );
  // console.log(biteFreq);

  let _addresses = Array.from(
    new Map([...biteFreq].filter(([k, v]) => v >= frequency)).keys(),
  );
  // console.log(test.length);
  return {
    addresses: _addresses,
    progress: mapFrequenciesToProgressObject(biteFreq, frequency),
  };
}

// cost tradeoffs for 1k vs 10k record batches
// 21 queries at 1k for 950 cost = 18k
// 3 queries at 10k for 8500 cost = 24k

async function allBidAddresses(): Promise<any[]> {
  let wholeResult = [];
  let b = true;
  let i = 0;
  while (b === true) {
    setTimeout(async function() {
      i = i + 1;
      const result = await makerClient.query({
        query: ALL_FLIP_BIDS_QUERY,
        fetchPolicy: "cache-first",
        variables: {
          offset: i * 1000,
        },
      });

      // get address sent from for TEND and DENT events
      if (result.data.allFlipBidEvents.nodes.length > 0) {
        let bidResults = result.data.allFlipBidEvents.nodes.map((bid: any) => {
          if (bid.act === "TEND" || bid.act === "DENT") {
            return bid.tx.nodes[0].txFrom;
          } else {
            return null;
          }
        });
        let newResults = bidResults.filter(x => x);
        wholeResult.push.apply(wholeResult, newResults);
      } else {
        b = false;
      }
    }, 500);
  }

  return wholeResult;
}

// for now, a tend and dent on the same auction are counted as 2 bids
export async function bidAddressesForFrequency(
  frequency: number,
): Promise<{ addresses: any[]; progress: object }> {
  const bidAddresses = await allBidAddresses();

  const bidFreq = new Map(
    [...new Set(bidAddresses)].map(x => [
      x,
      bidAddresses.filter(y => y === x).length,
    ]),
  );
  // console.log(bidFreq);

  let _addresses = Array.from(
    new Map([...bidFreq].filter(([k, v]) => v >= frequency)).keys(),
  );
  // console.log(_addresses.length);
  return {
    addresses: _addresses,
    progress: mapFrequenciesToProgressObject(bidFreq, frequency),
  };
}

async function allBidGuyAddresses(): Promise<any[]> {
  let superResult = [];
  for (let flipper in collateralFlippers) {
    let wholeResult = [];
    let b = true;
    let i = 0;
    while (b === true) {
      setTimeout(async function() {
        i = i + 1;
        const result = await makerClient.query({
          query: ALL_FLIPS_WON_QUERY,
          fetchPolicy: "cache-first",
          variables: {
            flipper: flipper,
            offset: i * 1000,
          },
        });
        if (result.data.allFlipBidGuys.nodes.length > 0) {
          let bidGuyResults = result.data.allFlipBidGuys.nodes.map(
            (bid: any) => {
              return {
                guy: bid.guy,
                bidId: bid.bidId,
              };
            },
          );

          // remove the 0x000 cleared result
          let noZero = bidGuyResults.filter(bid => {
            if (bid.guy != "0x0000000000000000000000000000000000000000") {
              return true;
            } else {
              return false;
            }
          });

          // select the first from the array (most recent in time)
          let onlyWinners = noZero.filter(
            (e, i) => noZero.findIndex(a => a["bidId"] === e["bidId"]) === i,
          );

          let winnerResults = onlyWinners.map(bid => {
            return bid.guy;
          });
          // console.log(bidResults);
          wholeResult.push.apply(wholeResult, winnerResults);
        } else {
          b = false;
        }
      }, 500);
    }

    superResult.push.apply(superResult, wholeResult);
  }
  return superResult;
}

export async function bidGuyAddressesForFrequency(
  frequency: number,
): Promise<{ addresses: any[]; progress: object }> {
  const bidGuyAddresses = await allBidGuyAddresses();

  const bidGuyFreq = new Map(
    [...new Set(bidGuyAddresses)].map(x => [
      x,
      bidGuyAddresses.filter(y => y === x).length,
    ]),
  );
  // console.log(bidGuyFreq);

  let _addresses = Array.from(
    new Map([...bidGuyFreq].filter(([k, v]) => v >= frequency)).keys(),
  );
  // console.log(_addresses.length);
  return {
    addresses: _addresses,
    progress: mapFrequenciesToProgressObject(bidGuyFreq, frequency),
  };
}
