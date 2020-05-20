import { governanceClient } from "../apollo/clients";
import { ALL_POLL_VOTES_QUERY } from "../apollo/queries/governance";

async function allGovernancePollAddresses() {
  let wholeResult = [];
  let b = true;
  let i = 0;
  while (b === true) {
    i = i + 1;
    const result = await governanceClient.query({
      query: ALL_POLL_VOTES_QUERY,
      fetchPolicy: "cache-first",
      variables: {
        skip: i * 1000,
      },
    });
    if (result.data.votePollActions.length > 0) {
      wholeResult.push.apply(wholeResult, result.data.votePollActions);
    } else {
      b = false;
    }
  }

  return wholeResult.map((action: any) => {
    return action.sender;
  });
}

export async function pollVoteAddressesForFrequency(frequency: number) {
  const pollVoteAddresses = await allGovernancePollAddresses();
  // console.log(pollVoteAddresses);
  const pollVoteFreq = new Map(
    [...new Set(pollVoteAddresses)].map((x) => [
      x,
      pollVoteAddresses.filter((y) => y === x).length,
    ])
  );

  // console.log(pollVoteFreq);

  return Array.from(
    new Map([...pollVoteFreq].filter(([k, v]) => v >= frequency)).keys()
  );
}
