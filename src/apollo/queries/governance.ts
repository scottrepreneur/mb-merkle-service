import gql from "graphql-tag";

// ADMIN QUERIES

export const ALL_POLL_VOTES_QUERY = gql`
  query votePollActions($skip: Int) {
    votePollActions(first: 1000, skip: $skip) {
      id
      sender
      poll {
        pollId
        startDate
        creator
      }
      timestamp
    }
  }
`;

export const ALL_SPELL_VOTES_QUERY = gql`
  query spellVoteActions($skip: Int) {
    addActions(first: 1000, skip: $skip) {
      sender
      spell {
        id
      }
      locked
    }
  }
`;

// USER QUERIES

export const USER_POLL_VOTES_QUERY = gql`
  query votePollActions($address: String) {
    votePollActions(where: { sender: $address }) {
      id
      sender
      poll {
        pollId
      }
      timestamp
    }
  }
`;

export const EARLY_POLL_VOTER_QUERY = gql`
  query votePollActions($address: String) {
    votePollActions(where: { sender: $address }) {
      id
      sender
      poll {
        pollId
        startDate
      }
      timestamp
    }
  }
`;

// USER_SPELL_VOTE_QUERY
// EARLY_SPELL_VOTER_QUERY
// LOCK_MKR_QUERY
// USER_CAST_SPELL_QUERY
// USER_SPELL_10_VOTES_QUERY
// USER_SPELL_CASTED_QUERY
