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

export async function allGovernancePollAddresses() {
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

export async function allGovernancePollAddressesWithPollId() {
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

export async function allGovernancePollAddressesWithTimestamps() {
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

export function pollVoteAddressesForFrequency(
  frequency: number,
  addressList: string[]
): { addresses: any[]; progress: Object } {
  const pollVoteFreq = new Map(
    [...new Set(addressList)].map(x => [
      x,
      addressList.filter(y => y === x).length,
    ]),
  );

  const _addresses = Array.from(
    new Map([...pollVoteFreq].filter(([k, v]) => v >= frequency)).keys(),
  )
  const _progress = mapFrequenciesToProgressObject(pollVoteFreq, frequency)

  return {
    addresses: _addresses,
    progress: _progress,
  };
}

export function consecutivePollVoteAddressesForFrequency(
  frequency: number,
  addressList: { sender: string, pollId: string }[]
): { addresses: any[]; progress: Object } {
  const consecutivePollVoteFreq = new Map(
    [...new Set(addressList)].map(poll => [
      poll.sender,
      // get the longest consecutive count from the arrays of each address
      longestConsecutiveCount(addressList.filter(_poll => {
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

  const _addresses = Array.from(
    new Map([...consecutivePollVoteFreq].filter(([k, v]) => v >= frequency)).keys(),
  )

  const _progress = mapFrequenciesToProgressObject(consecutivePollVoteFreq, frequency)

  return {
    addresses: _addresses,
    progress: _progress,
  }
}

export function earlyPollVoteAddressesForTime(
  time: number,
  addressList: { sender: string, votedTimestamp: number, createdTimestamp: number }[]
): { addresses: string[], progress: {} } {
  const earlyPollVoteFreq = new Map(
    [...new Set(addressList)].map(poll => [
      poll.sender,
      // get the longest consecutive count from the arrays of each address
      addressList.filter(_poll => {
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

  const _addresses = Array.from(
    filterEarlyPollVoteFreq.keys(),
  )

  return {
    addresses: _addresses,
    progress: {}
  }
}

// EXECUTIVE PROPOSALS (SPELLS)

export async function allExecutiveSpellAddresses() {
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

export async function allExecutiveSpellAddressesWithTimestamps() {
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

export function spellVoteAddressesForFrequency(
  frequency: number,
  addressList: string[]
): { addresses: string[]; progress: Object } {
  const spellVoteFreq = new Map(
    [...new Set(addressList)].map(x => [
      x,
      addressList.filter(y => y === x).length,
    ]),
  );

  const _addresses = Array.from(
    new Map([...spellVoteFreq].filter(([k, v]) => v >= frequency)).keys(),
  )

  const _progress = mapFrequenciesToProgressObject(spellVoteFreq, frequency)

  return {
    addresses: _addresses,
    progress: _progress,
  };
}

export function earlyExecutiveVoteAddressesForTime(
  time: number,
  addressList: { sender: string, votedTimestamp: number, createdTimestamp: number }[]
) {
  const earlySpellVoteFreq = new Map(
    [...new Set(addressList)].map(spell => [
      spell.sender,
      // get the longest consecutive count from the arrays of each address
      addressList.filter(_spell => {
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

  const _addresses = Array.from(
    filterEarlySpellVoteFreq.keys(),
  )

  const _progress = {} // need to deal with time in --> mapFrequenciesToProgressObject(time, filterEarlySpellVoteFreq)

  return {
    addresses: _addresses,
    progress: _progress
  }
}
