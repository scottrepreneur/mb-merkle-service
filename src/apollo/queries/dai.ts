import gql from "graphql-tag";

export const ALL_POT_JOINS_QUERY = gql`
  query allPotJoins($offset: Int) {
    allPotJoins(first: 1000, offset: $offset) {
      nodes {
        id
        wad
        eventLogByLogId {
          transactionByTxHash {
            txFrom
          }
          blockNumber
          txHash
        }
      }
    }
  }
`;

export const ALL_POT_EXITS_QUERY = gql`
  query allPotExits($offset: Int) {
    allPotExits(first: 1000, offset: $offset) {
      totalCount
      nodes {
        wad
        eventLogByLogId {
          transactionByTxHash {
            txFrom
          }
          blockNumber
          txHash
        }
      }
    }
  }
`;

// TRANSFERRED_DAI_QUERY
// POOL_TOGETHER
// COMPOUND_DAI
