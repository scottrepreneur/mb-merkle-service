import { governanceClient } from "../apollo/clients";
import {
  ALL_POLL_VOTES_QUERY,
  // USER_CONSECUTIVE_POLL_VOTE_QUERY,
  ALL_EARLY_POLL_VOTES_QUERY,
  ALL_SPELL_VOTES_QUERY,
  ALL_EARLY_SPELL_VOTES_QUERY
} from "../apollo/queries/governance";
import {
  mapFrequenciesToProgressObject,
  longestConsecutiveCount
} from "../utils";

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
    const result: any = await governanceClient.query({
      query: ALL_POLL_VOTES_QUERY,
      fetchPolicy: "cache-first",
      variables: {
        skip: i * 1000,
      },
    }).catch(err => console.log(err));
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

async function allGovernancePollAddressesWithTimestamps() {
  let wholeResult = [];
  let b = true;
  let i = 0;
  while (b === true) {
    i = i + 1;
    const result: any = await governanceClient.query({
      query: ALL_EARLY_POLL_VOTES_QUERY,
      fetchPolicy: "cache-first",
      variables: {
        skip: i * 1000,
      },
    }).catch(err => console.log(err));
    if (result.data.votePollActions.length > 0) {
      wholeResult.push.apply(wholeResult, result.data.votePollActions);
    } else {
      b = false;
    }
  }

  return wholeResult.map((action: any) => {
    return {
      sender: action.sender,
      createdTimestamp: action.poll.startDate,
      votedTimestamp: action.timestamp
    };
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

export async function consecutivePollVoteAddressesForFrequency(
  frequency: number
): Promise<{ addresses: any[]; progress: Object }> {
  const pollVoteAddresses = await allGovernancePollAddressesWithPollId()
  const consecutivePollVoteFreq = new Map(
    [...new Set(pollVoteAddresses)].map(poll => [
      poll.sender,
      // get the longest consecutive count from the arrays of each address
      longestConsecutiveCount(pollVoteAddresses.filter(_poll => {
        // get pollIds for current address
        if (_poll.sender === poll.sender) {
          return _poll.pollId
        }
        return null;
      }).map(function (el) {
        // return an array of pollIds for each address
        return parseInt(el.pollId)
      }))

    ]))

  return {
    addresses: Array.from(
      new Map([...consecutivePollVoteFreq].filter(([k, v]) => v >= frequency)).keys(),
    ),
    progress: mapFrequenciesToProgressObject(consecutivePollVoteFreq, frequency),
  }
}

export async function earlyPollVoteAddressesForTime(time: number) {
  const earlyPollVoteAddresses = await allGovernancePollAddressesWithTimestamps();
  const earlyPollVoteFreq = new Map(
    [...new Set(earlyPollVoteAddresses)].map(poll => [
      poll.sender,
      // get the longest consecutive count from the arrays of each address
      earlyPollVoteAddresses.filter(_poll => {
        // get pollIds for current address
        return _poll.sender === poll.sender && _poll.votedTimestamp - _poll.createdTimestamp < time
      }).length
    ])
  )

  const filterEarlyPollVoteFreq = new Map(
    [...earlyPollVoteFreq]
      .filter(([k, v]) => v !== 0)
  );
  // console.log(filterEarlyPollVoteFreq)

  return {
    addresses: Array.from(
      filterEarlyPollVoteFreq.keys(),
    ),
    progress: {}
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

async function allExecutiveSpellAddressesWithTimestamps() {
  let wholeResult = [];
  let b = true;
  let i = 0;
  while (b === true) {
    i = i + 1;
    const result = await governanceClient.query({
      query: ALL_EARLY_SPELL_VOTES_QUERY,
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
    return {
      sender: action.sender,
      createdTimestamp: action.spell.timestamp,
      votedTimestamp: action.timestamp
    };
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

export async function earlyExecutiveVoteAddressesForTime(time: number) {
  const earlySpellVoteAddresses = await allExecutiveSpellAddressesWithTimestamps();
  // console.log(earlySpellVoteAddresses)

  const earlySpellVoteFreq = new Map(
    [...new Set(earlySpellVoteAddresses)].map(spell => [
      spell.sender,
      // get the longest consecutive count from the arrays of each address
      earlySpellVoteAddresses.filter(_spell => {
        // get pollIds for current address
        return _spell.sender === spell.sender && _spell.votedTimestamp - _spell.createdTimestamp < time
      }).length
    ])
  )

  const filterEarlySpellVoteFreq = new Map(
    [...earlySpellVoteFreq]
      .filter(([k, v]) => v !== 0)
  );
  // console.log(filterEarlySpellVoteFreq)

  return {
    addresses: Array.from(
      filterEarlySpellVoteFreq.keys(),
    ),
    progress: {}
  }
}
