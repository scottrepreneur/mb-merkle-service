import { governanceClient } from "../apollo/clients";
import { ALL_POLL_VOTES_QUERY } from "../apollo/queries/governance";

async function allGovernancePollAddresses() {
  const result = await governanceClient.query({
    query: ALL_POLL_VOTES_QUERY,
    fetchPolicy: "cache-first",
  });
  return result.data.votePollActions.map(action => {
    return action.sender;
  });
}

export async function pollVoteAddressesForFrequency(frequency: number) {
  const pollVoteAddresses = await allGovernancePollAddresses();
  const pollVoteFreq = pollVoteAddresses.reduce(function(acc, curr) {
    if (typeof acc[curr] == "undefined") {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }

    return acc;
  }, {});

  return Object.keys(pollVoteFreq).filter(el => pollVoteFreq[el] >= frequency);
}
