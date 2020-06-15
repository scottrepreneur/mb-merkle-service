import { governanceClient } from "../apollo/clients";
import {
  ALL_POLL_VOTES_QUERY,
  ALL_SPELL_VOTES_QUERY,
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
