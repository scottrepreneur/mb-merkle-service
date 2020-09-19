import { governanceClient } from "../apollo/clients";
import {
  ALL_POLL_VOTES_QUERY,
  // USER_CONSECUTIVE_POLL_VOTE_QUERY,
  // EARLY_POLL_VOTER_QUERY,
  ALL_SPELL_VOTES_QUERY,
  // EARLY_SPELL_VOTER_QUERY
} from "../apollo/queries/governance";
import { mapFrequenciesToProgressObject } from "../utils";

// GOVERNANCE POLLS

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

async function allGovernancePollAddressesWithPollId() {
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
    return { sender: action.sender, pollId: action.poll.pollId };
  });
}

export async function pollVoteAddressesForFrequency(
  frequency: number,
): Promise<{ addresses: any[]; progress: Object }> {
  const pollVoteAddresses = await allGovernancePollAddresses();
  const pollVoteFreq = new Map(
    [...new Set(pollVoteAddresses)].map(x => [
      x,
      pollVoteAddresses.filter(y => y === x).length,
    ]),
  );

  return {
    addresses: Array.from(
      new Map([...pollVoteFreq].filter(([k, v]) => v >= frequency)).keys(),
    ),
    progress: mapFrequenciesToProgressObject(pollVoteFreq, frequency),
  };
}

function longestConsecutiveCount(arr: number[]) {
  let chunks: any[] = [];
  let prev: number = 0;

  var sorted = arr.sort(function (a, b) { return a - b });

  sorted.forEach((current) => {
    if (current - prev != 1) chunks.push([]);
    chunks[chunks.length - 1].push(current);
    prev = current;
  })

  chunks.sort((a, b) => b.length - a.length);

  return chunks[0].length;
}

export async function consecutivePollVoteAddressesForFrequency(
  frequency: number
): Promise<{ addresses: any[]; progress: Object }> {
  const pollVoteAddresses = await allGovernancePollAddressesWithPollId()
  const consecutiveVoteFreq = new Map(
    [...new Set(pollVoteAddresses)].map(poll => [
      poll.sender,
      // get the longest consecutive count from the arrays
      longestConsecutiveCount(pollVoteAddresses.filter(_poll => {
        // get polls for current address
        if (_poll.sender === poll.sender) {
          return _poll.pollId
        }
        return null;
      }).map(function (el) {
        // return an array of pollIds for each address
        return parseInt(el.pollId)
      }))

    ]))

  console.log(consecutiveVoteFreq)
  return {
    addresses: Array.from(
      new Map([...consecutiveVoteFreq].filter(([k, v]) => v >= frequency)).keys(),
    ),
    progress: mapFrequenciesToProgressObject(consecutiveVoteFreq, frequency),
  }
}

// EXECUTIVE PROPOSALS (SPELLS)

async function allExecutiveSpellAddresses() {
  let wholeResult = [];
  let b = true;
  let i = 0;
  while (b === true) {
    i = i + 1;
    const result = await governanceClient.query({
      query: ALL_SPELL_VOTES_QUERY,
      fetchPolicy: "cache-first",
      variables: {
        skip: i * 1000,
      },
    });
    if (result.data.addActions.length > 0) {
      wholeResult.push.apply(wholeResult, result.data.addActions);
    } else {
      b = false;
    }
  }

  return wholeResult.map((action: any) => {
    return action.sender;
  });
}

export async function spellVoteAddressesForFrequency(
  frequency: number,
): Promise<{ addresses: string[]; progress: Object }> {
  const spellVoteAddresses = await allExecutiveSpellAddresses();
  const spellVoteFreq = new Map(
    [...new Set(spellVoteAddresses)].map(x => [
      x,
      spellVoteAddresses.filter(y => y === x).length,
    ]),
  );

  return {
    addresses: Array.from(
      new Map([...spellVoteFreq].filter(([k, v]) => v >= frequency)).keys(),
    ),
    progress: mapFrequenciesToProgressObject(spellVoteFreq, frequency),
  };
}
