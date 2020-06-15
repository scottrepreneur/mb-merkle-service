import { checkTemplateAddressesForAddress } from "./utils";
import { getTemplate } from "./utils/aws";
import { MerkleTree } from "./utils/merkleTree";

// HARDER TO TRACK IDEAS

//  Propose a new Maker project
//  Contribute to an existing project/bounty
//  Get a development grant
//  Translate content
//  Apply to be a translator
//  Apply to be a translator reviewer
//  Create new content for comm-dev
//  Edit existing content
//  Improve Maker knowledge
//  E.g. learn about vaults, voting, governance etc.
//  Get resources for working with Maker
//  E.g. writing style guide, visual style guide, assets
//  Join a governance meeting
//  Take notes at a meeting
//  Get Maker to take part in Hackathon (sponsorship/mentorship)

const badgeList = {
  MKR1: {
    id: 1,
    parent: 0,
    tier: 1,
    name: "Accrue 1 Dai from DSR",
    longName: "Accrue 1 Dai from the Dai Savings Rate",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://oasis.app/save",
    steps: {
      1: "",
    },
    imgPath: "dsr-badge.svg",
    redeemed: 0,
    unlocked: 0,
    proof: [],
    root: "",
  },
  MKR2: {
    id: 2,
    parent: 1,
    tier: 2,
    name: "Earn in DSR for 3 months",
    longName: "Lock 10 Dai from the Dai Savings Rate",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://oasis.app/save",
    steps: {
      1: "",
    },
    imgPath: "dsr-badge.svg",
    redeemed: 0,
    unlocked: 0,
    proof: [],
    root: "",
  },
  MKR3: {
    id: 3,
    parent: 2,
    tier: 3,
    name: "Earn in DSR for 6 months",
    longName: "Earn on 10 locked Dai in DSR for 6 months",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://oasis.app/save",
    steps: {
      1: "",
    },
    imgPath: "dsr-badge.svg",
    redeemed: 0,
    unlocked: 0,
    proof: [],
    root: "",
  },
  MKR4: {
    id: 4,
    parent: 0,
    tier: 1,
    name: "Send 10 Dai",
    longName: "Send 10 Dai",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR5: {
    id: 5,
    parent: 4,
    tier: 2,
    name: "Send 20 Dai",
    longName: "Send 20 Dai",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR6: {
    id: 6,
    parent: 0,
    tier: 1,
    name: "Join the PoolTogether savings game",
    longName: "Join the PoolTogther savings game",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR7: {
    id: 7,
    parent: 0,
    tier: 1,
    name: "Lend Dai on Compound",
    longName: "Lend Dai on Compound",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR8: {
    id: 8,
    parent: 0,
    tier: 1,
    name: "Vote on a Governance Poll",
    longName: "Vote on one Governance Poll",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "poll-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR9: {
    id: 9,
    parent: 8,
    tier: 2,
    name: "Vote on 5 Governance Polls",
    longName: "Vote on at least 5 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR10: {
    id: 10,
    parent: 9,
    tier: 3,
    name: "Vote on 10 Governance Polls",
    longName: "Vote on at least 10 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR11: {
    id: 11,
    parent: 10,
    tier: 4,
    name: "Vote on 20 Governance Polls",
    longName: "Vote on at least 20 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR12: {
    id: 12,
    parent: 11,
    tier: 5,
    name: "Vote on 50 Governance Polls",
    longName: "Vote on at least 5 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR13: {
    id: 13,
    parent: 12,
    tier: 6,
    name: "Vote on 100 Governance Polls",
    longName: "Vote on at least 100 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR14: {
    id: 14,
    parent: 8,
    tier: 1,
    name: "Vote on 2 consecutive Governance Polls",
    longName: "Vote on at least 2 consecutive Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR15: {
    id: 15,
    parent: 14,
    tier: 2,
    name: "Vote on 5 consecutive Governance Polls",
    longName: "Vote on at least 5 consecutive Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR16: {
    id: 16,
    parent: 15,
    tier: 3,
    name: "Vote on 10 consecutive Governance Polls",
    longName: "Vote on at least 10 consecutive Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR17: {
    id: 17,
    parent: 0,
    tier: 1,
    name: "Vote on an Executive Proposal",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR18: {
    id: 18,
    parent: 17,
    tier: 2,
    name: "Vote on 5 Executive Proposals",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR19: {
    id: 19,
    parent: 18,
    tier: 3,
    name: "Vote on 10 Executive Proposals",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR20: {
    id: 20,
    parent: 19,
    tier: 4,
    name: "Vote on 20 Executive Proposals",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR21: {
    id: 21,
    parent: 20,
    tier: 5,
    name: "Vote on 50 Executive Proposals",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR22: {
    id: 22,
    parent: 0,
    tier: 1,
    name: "First Executive Voter",
    longName: "Be one of the first voters on<br>a new Executive Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR23: {
    id: 23,
    parent: 0,
    tier: 1,
    name: "First Governance Poller",
    longName: "Be one of the first voters on<br>a new Governance Poll",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR24: {
    id: 24,
    parent: 0,
    tier: 1,
    name: "Bite an unsafe Vault",
    longName: "Bite an unsafe Vault",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR25: {
    id: 25,
    parent: 24,
    tier: 2,
    name: "Bite 10 unsafe Vaults",
    longName: "Bite an unsafe Vault",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR26: {
    id: 26,
    parent: 25,
    tier: 3,
    name: "Bite 50 unsafe Vaults",
    longName: "Bite an unsafe Vault",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR27: {
    id: 27,
    parent: 26,
    tier: 4,
    name: "Bite 100 unsafe Vault",
    longName: "Bite 100 unsafe Vault",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR28: {
    id: 28,
    parent: 0,
    tier: 1,
    name: "Bid on a Collateral Auction",
    longName: "Bid on a Collateral Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR29: {
    id: 29,
    parent: 28,
    tier: 2,
    name: "Bid on 5 Collateral Auctions",
    longName: "Bid on 5 Collateral Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR30: {
    id: 30,
    parent: 29,
    tier: 3,
    name: "Bid on 10 Collateral Auctions",
    longName: "Bid on 10 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR31: {
    id: 31,
    parent: 30,
    tier: 4,
    name: "Bid on 25 Collateral Auctions",
    longName: "Bid on 25 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR32: {
    id: 32,
    parent: 0,
    tier: 1,
    name: "Won a Collateral Auction",
    longName: "Won a Collateral Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR33: {
    id: 33,
    parent: 32,
    tier: 2,
    name: "Won 5 Collateral Auctions",
    longName: "Won 5 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR34: {
    id: 34,
    parent: 33,
    tier: 3,
    name: "Won 10 Collateral Auctions",
    longName: "Won 10 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },
  MKR35: {
    id: 35,
    parent: 34,
    tier: 4,
    name: "Won 25 Collateral Auctions",
    longName: "Won 25 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: [],
    root: "",
  },

  // *** SET PARENT AND TIER *** //
  // MKR36: {
  //   id: 36,
  //   name: "Bid on a Surplus Auction",
  //   longName: "Bid on a Surplus Auction",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR37: {
  //   id: 37,
  //   name: "Bid on 5 Surplus Auctions",
  //   longName: "Bid on 5 Surplus Auction",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR38: {
  //   id: 38,
  //   name: "Bid on 10 Surplus Auctions",
  //   longName: "Bid on 10 Surplus Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR39: {
  //   id: 39,
  //   name: "Bid on 25 Surplus Auctions",
  //   longName: "Bid on 25 Surplus Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR40: {
  //   id: 40,
  //   name: "Won a Surplus Auction",
  //   longName: "Won a Surplus Auction",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR41: {
  //   id: 41,
  //   name: "Won 5 Surplus Auctions",
  //   longName: "Won 5 Surplus Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR42: {
  //   id: 42,
  //   name: "Won 10 Surplus Auctions",
  //   longName: "Won 10 Surplus Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR43: {
  //   id: 43,
  //   name: "Won 25 Surplus Auctions",
  //   longName: "Won 25 Surplus Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR44: {
  //   id: 44,
  //   name: "Bid on a Debt Auction",
  //   longName: "Bid on a Debt Auction",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR45: {
  //   id: 45,
  //   name: "Bid on 5 Debt Auctions",
  //   longName: "Bid on 5 Debt Auction",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR46: {
  //   id: 46,
  //   name: "Bid on 10 Debt Auctions",
  //   longName: "Bid on 10 Debt Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR47: {
  //   id: 47,
  //   name: "Bid on 25 Debt Auctions",
  //   longName: "Bid on 25 Debt Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR48: {
  //   id: 48,
  //   name: "Won a Debt Auction",
  //   longName: "Won a Debt Auction",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR49: {
  //   id: 49,
  //   name: "Won 5 Debt Auctions",
  //   longName: "Won 5 Debt Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR50: {
  //   id: 50,
  //   name: "Won 10 Debt Auctions",
  //   longName: "Won 10 Debt Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR51: {
  //   id: 51,
  //   name: "Won 25 Debt Auctions",
  //   longName: "Won 25 Debt Auctions",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "quick-vote-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR52: {
  //   id: 52,
  //   name: "MKR in Voting Contract for 3 months",
  //   longName: "Secure MKR Governance with your<br>MKR for at least 3 months",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "lock-mkr-x3-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR53: {
  //   id: 53,
  //   name: "MKR in Voting Contract for 6 months",
  //   longName: "Secure MKR Governance with your<br>MKR for at least 6 months",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "lock-mkr-x3-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR54: {
  //   id: 54,
  //   name: "MKR in Voting Contract for 12 months",
  //   longName: "Secure MKR Governance with your<br>MKR for at least 12 months",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "lock-mkr-x12-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR55: {
  //   id: 55,
  //   name: "Enact a Proposal",
  //   longName: "Cast the Spell to enact the<br>proposal contained in the Spell",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://etherscan.io",
  //   imgPath: "cast-spell-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR56: {
  //   id: 56,
  //   name: "Create a Proposal that gets 10 votes",
  //   longName:
  //     "Create an Executive Proposal that<br>accumulates at least 10 voters",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "spell-10-votes-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR57: {
  //   id: 57,
  //   name: "Create a Proposal that is passed",
  //   longName:
  //     "Create an Executive Proposal<br>that is passed by MKR Governance",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "spell-is-cast-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR58: {
  //   id: 58,
  //   name: "Create 5 Proposals that pass",
  //   longName:
  //     "Create an Executive Proposal<br>that is passed by MKR Governance",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "spell-is-cast-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR59: {
  //   id: 59,
  //   name: "Create 10 Proposals that pass",
  //   longName:
  //     "Create an Executive Proposal<br>that is passed by MKR Governance",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "spell-is-cast-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR60: {
  //   id: 60,
  //   name: "Create a Governance Poll",
  //   longName:
  //     "Create a Governance Poll to<br />establish MKR governance sentiment",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "spell-is-cast-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR61: {
  //   id: 61,
  //   name: "Create 5 Governance Polls",
  //   longName:
  //     "Create 5 Governance Polls to<br />establish MKR governance sentiment",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "spell-is-cast-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR62: {
  //   id: 62,
  //   name: "Create 10 Governance Polls",
  //   longName:
  //     "Create 10 Governance Polls to<br />establish MKR governance sentiment",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "spell-is-cast-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
  // MKR63: {
  //   id: 63,
  //   name: "Create 25 Governance Polls",
  //   longName:
  //     "Create 25 Governance Polls to<br />establish MKR governance sentiment",
  //   description:
  //     "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
  //   resource: "https://vote.makerdao.com",
  //   imgPath: "spell-is-cast-badge.svg",
  //   unlocked: 0,
  //   redeemed: 0,
  //   proof: "",
  // },
};

// const limited_badges = {
//   LMKR1: {
//     name: "Casted SCD Shutdown Spell",
//     longName: "Cast SCD Shutdown Spell",
//     description:
//       "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
//     resource: "https://vote.makerdao.com",
//     imgPath: "spell-is-cast-badge.svg",
//     unlocked: 0,
//     redeemed: 0,
//   },
//   LMKR2: {
//     name: "Casted MCD Launch Spell",
//     longName: "Cast MCD Launch Spell",
//     description:
//       "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
//     resource: "https://vote.makerdao.com",
//     imgPath: "spell-is-cast-badge.svg",
//     unlocked: 0,
//     redeemed: 0,
//   },
// };

export async function getBadgesForAddress(_address: string) {
  return Promise.all(
    Object.keys(badgeList).map(async key => {
      let badge = badgeList[key];
      console.log(key);
      let template = await getTemplate(parseFloat(key.slice(3, key.length)));
      if (badge.progress != {}) {
        if (template.progress[_address]) {
          badge.progress = template.progress[_address];
        } else {
          badge.progress = 0;
        }
      } else {
        badge.progress = 0;
      }

      if (template.addresses.length > 0) {
        let tree = new MerkleTree(template.addresses);
        badge.root = tree.getHexRoot();

        badge.unlocked = checkTemplateAddressesForAddress(
          _address,
          template.addresses,
        );

        if (badge.unlocked && !badge.redeemed) {
          badge.proof = tree.getHexProof(_address);
        }
      }

      return badge;
    }),
  );
}
