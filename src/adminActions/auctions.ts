import {
  ALL_FLIP_BIDS_QUERY,
  ALL_FLIP_WINS_QUERY,
  ALL_BITES_QUERY,
} from "../apollo/queries/auctions";
import { makerClient } from "../apollo/clients";
import { mapFrequenciesToProgressObject } from "../utils";
import { collateralFlippers } from "../constants";
import * as R from "ramda";

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const makerAllBitesQuery = async function* (step = 0, collateral: string) {
  const query = await makerClient.query({
    query: ALL_BITES_QUERY,
    fetchPolicy: "cache-first",
    variables: { offset: step * 5000, collateral: collateral }
  });

  ++step;

  const hasNextPage = R.prop("hasNextPage", query.data.allBites.pageInfo);

  yield { step, query, hasNextPage };

  if (!hasNextPage) return { step, query };
};

function allBiteAddresses(): Promise<any[]> {

  return new Promise(async (resolve, reject) => {

    const allResults: any[] = [];

    Object.keys(collateralFlippers).forEach(async flipper => {
      // Generator Function
      let query = makerAllBitesQuery(0, flipper);

      // Invoke GenFunc and start process
      let resultSet = await query.next();

      // Deff
      const fillResultsArray = eventNodes => {
        eventNodes.map((bite: any) => {
          allResults.push(R.prop("txFrom", bite.tx.nodes[0]));
          return;
        });
      };

      // Loop
      do {
        const nodes = R.prop("nodes", resultSet.value.query.data.allBites);

        if (R.length(nodes) > 0) {
          fillResultsArray(nodes);
        }

        if (resultSet.value.hasNextPage)
          resultSet = await query.next();

      } while (resultSet.done === false);
    })

    // Resolve Promise
    resolve(allResults);
  });
}

export async function biteAddressesForFrequency(
  frequency: number,
): Promise<{ addresses: any[]; progress: Object }> {
  return new Promise(async (resolve, reject) => {
    const biteAddresses = await allBiteAddresses();
    const biteFreq = new Map(
      [...new Set(biteAddresses)].map(x => [
        x,
        biteAddresses.filter(y => y === x).length,
      ]),
    );

    const _addresses = Array.from(
      new Map([...biteFreq].filter(([k, v]) => v >= frequency)).keys(),
    );

    const progress = mapFrequenciesToProgressObject(biteFreq, frequency)

    if (_addresses && progress) {
      resolve({
        addresses: _addresses,
        progress: progress,
      });
      return;
    }

    reject("biteAddressForFreq " + frequency + " Failed");
  })
}

const makerAllFlipBidsQuery = async function* (step = 0) {
  const query = await makerClient.query({
    query: ALL_FLIP_BIDS_QUERY,
    fetchPolicy: "cache-first",
    variables: { offset: step * 5000 }
  });

  ++step;

  const hasNextPage = R.prop("hasNextPage", query.data.allFlipBidEvents.pageInfo);

  yield { step, query, hasNextPage };

  if (!hasNextPage) return { step, query };
};

function allBidAddresses(): Promise<any[]> {

  return new Promise(async (resolve, reject) => {

    const allResults: any[] = [];

    // Generator Function
    let query = makerAllFlipBidsQuery(0);

    // Invoke GenFunc and start process
    let resultSet = await query.next();

    // Deff
    const fillResultsArray = eventNodes => {
      eventNodes.map((bid: any) => {
        if (bid.act === "TEND" || bid.act === "DENT") {
          allResults.push(R.prop("txFrom", bid.tx.nodes[0]));
        }

        return;
      });
    };

    // Loop
    do {
      const nodes = R.prop("nodes", resultSet.value.query.data.allFlipBidEvents);

      if (R.length(nodes) > 0) {
        fillResultsArray(nodes);
      }

      if (resultSet.value.hasNextPage)
        resultSet = await query.next();

    } while (resultSet.done === false);

    // Resolve Promise
    resolve(allResults);
  });

}

// for now, a tend and dent on the same auction are counted as 2 bids
export function bidAddressesForFrequency(
  frequency: number,
): Promise<{ addresses: any[]; progress: object }> {
  return new Promise(async (resolve, reject) => {
    const bidAddresses = await allBidAddresses();
    console.log(bidAddresses);
    const bidFreq = new Map(
      [...new Set(bidAddresses)].map(x => [
        x,
        bidAddresses.filter(y => y === x).length,
      ]),
    );

    const _addresses = Array.from(
      new Map([...bidFreq].filter(([k, v]) => v >= frequency)).keys(),
    );

    const progress = mapFrequenciesToProgressObject(bidFreq, frequency);

    if (_addresses && progress) {
      resolve({
        addresses: _addresses,
        progress: progress,
      });
      return;
    }

    reject("bidAddressForFreq " + frequency + " Failed");
  });
}

const makerAllFlipWinsQuery = async function* (step = 0, flipper: string) {
  const query = await makerClient.query({
    query: ALL_FLIP_WINS_QUERY,
    fetchPolicy: "cache-first",
    variables: {
      offset: step * 5000,
      flipper: flipper
    }
  });

  ++step;

  const hasNextPage = R.prop("hasNextPage", query.data.allFlipBidGuys.pageInfo);

  yield { step, query, hasNextPage };

  if (!hasNextPage) return { step, query };
};

async function allBidGuyAddresses(): Promise<any[]> {

  return new Promise(async (resolve, reject) => {

    const allResults: any[] = [];

    Object.keys(collateralFlippers).forEach(async flipper => {
      // Generator Function
      let query = makerAllFlipWinsQuery(0, collateralFlippers[flipper]);

      // Invoke GenFunc and start process
      let resultSet = await query.next();

      // Deff
      const fillResultsArray = eventNodes => {
        eventNodes.map((bid: any) => {
          if (bid.guy !== ZERO_ADDRESS) {
            allResults.push([R.prop("guy", bid), R.prop("bidId", bid)]);
          }

          return;
        });
      };

      // Loop
      do {
        const nodes = R.prop("nodes", resultSet.value.query.data.allFlipBidGuys);

        if (R.length(nodes) > 0) {
          fillResultsArray(nodes);
        }

        if (resultSet.value.hasNextPage)
          resultSet = await query.next();

      } while (resultSet.done === false);
    })

    // Resolve Promise
    resolve(allResults);
  });

  // let superResult = [];
  // for (let flipper in collateralFlippers) {
  //   let wholeResult = [];
  //   let b = true;
  //   let i = 0;
  //   while (b === true) {
  //     setTimeout(async function () {
  //       i = i + 1;
  //       const result = await makerClient.query({
  //         query: ALL_FLIP_WINS_QUERY,
  //         fetchPolicy: "cache-first",
  //         variables: {
  //           flipper: flipper,
  //           offset: i * 1000,
  //         },
  //       });
  //       if (result.data.allFlipBidGuys.nodes.length > 0) {
  //         let bidGuyResults = result.data.allFlipBidGuys.nodes.map(
  //           (bid: any) => {
  //             return {
  //               guy: bid.guy,
  //               bidId: bid.bidId,
  //             };
  //           },
  //         );

  //         // remove the 0x000 cleared result
  //         let noZero = bidGuyResults.filter(bid => {
  //           if (bid.guy != "0x0000000000000000000000000000000000000000") {
  //             return true;
  //           } else {
  //             return false;
  //           }
  //         });

  //         // select the first from the array (most recent in time)
  //         let onlyWinners = noZero.filter(
  //           (e, i) => noZero.findIndex(a => a["bidId"] === e["bidId"]) === i,
  //         );

  //         let winnerResults = onlyWinners.map(bid => {
  //           return bid.guy;
  //         });
  //         // console.log(bidResults);
  //         wholeResult.push.apply(wholeResult, winnerResults);
  //       } else {
  //         b = false;
  //       }
  //     }, 500);
  //   }

  //   superResult.push.apply(superResult, wholeResult);
  // }
  // return superResult;
}

export async function bidGuyAddressesForFrequency(
  frequency: number,
): Promise<{ addresses: any[]; progress: object }> {
  return new Promise(async (resolve, reject) => {
    const bidGuyAddresses = await allBidGuyAddresses();
    console.log(bidGuyAddresses);
    // select the first from the array (most recent in time)
    // const onlyWinners = noZero.filter(
    //   (e, i) => noZero.findIndex(a => a["bidId"] === e["bidId"]) === i,
    // );
    // const winnerResults = onlyWinners.map(bid => {
    //   return bid.guy;
    // });
    const bidGuyFreq = new Map(
      [...new Set(bidGuyAddresses)].map(x => [
        x,
        bidGuyAddresses.filter(y => y === x).length,
      ]),
    );
    // console.log(bidGuyFreq);

    const _addresses = Array.from(
      new Map([...bidGuyFreq].filter(([k, v]) => v >= frequency)).keys(),
    );
    // console.log(_addresses.length);

    const progress = mapFrequenciesToProgressObject(bidGuyFreq, frequency);

    if (_addresses && progress) {
      resolve({
        addresses: _addresses,
        progress: progress,
      });
      return;
    }

    reject("flipGuyAddressForFreq " + frequency + " Failed");
  })
}
