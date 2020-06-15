import gql from "graphql-tag";

export const ALL_BITES_QUERY = gql`
  query allBites($collateral: String!, $offset: Int) {
    allBites(ilkIdentifier: $collateral, first: 1000, offset: $offset) {
      nodes {
        bidId
        ilk {
          id
        }
        tx {
          txFrom
        }
      }
    }
  }
`;

export const ALL_FLIP_BIDS_QUERY = gql`
  query allFlipBidEvents($offset: Int) {
    allFlipBidEvents(first: 1000, offset: $offset) {
      nodes {
        bidId
        act
        tx {
          nodes {
            txFrom
          }
        }
      }
    }
  }
`;

export const ALL_FLIPS_WON_QUERY = gql`
  query allFlipBidGuys($flipper: String!, $offset: Int) {
    allFlipBidGuys(
      filter: {
        addressByAddressId: { address: { equalToInsensitive: $flipper } }
      }
      orderBy: HEADER_BY_HEADER_ID__BLOCK_NUMBER_DESC
      first: 1000
      offset: $offset
    ) {
      nodes {
        bidId
        guy
      }
    }
  }
`;

// ALL_FLAP_BIDS
// ALL_FLAP_WINS
// ALL_FLOP_BIDS
// ALL_FLOP_WINS
