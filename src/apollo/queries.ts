import gql from "graphql-tag";

export const USER_POLL_ACTIONS_QUERY = gql`
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

export const ALL_FLIP_BIDS_QUERY = gql`
  allFlipKickEvents {
    nodes {
      id
      gal
    }
  }
`;

export const USER_FLIP_BIDS_QUERY = gql`
  allFlipKickEvents(condition: {gal: $address})  {
    nodes {
      id
      gal
    }
  }
`;
