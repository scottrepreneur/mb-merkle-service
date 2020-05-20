import {
  checkTemplateAddressesForAddress,
  addOrUpdateTemplateAddresses,
  getAddressesByTemplate,
} from "./utils/aws";
import { pollVoteAddressesForFrequency } from "./adminActions/governance";
import {
  getBadgeProof,
  getTree,
  // getRoot,
  // checkProof,
} from "./utils/merkleTree";

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
    proof: "",
  },
  MKR2: {
    name: "Earn on 10 locked Dai in DSR for 3 months",
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
    proof: "",
  },
  MKR3: {
    name: "Earn on 10 locked Dai in DSR for 6 months",
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
    proof: "",
  },
  MKR4: {
    name: "Sent 10 Dai",
    longName: "Sent 10 Dai",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR5: {
    name: "Sent 20 Dai",
    longName: "Sent 20 Dai",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR6: {
    name: "Join the PoolTogether savings game",
    longName: "Join the PoolTogther savings game",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR7: {
    name: "Lend Dai on Compound",
    longName: "Lend Dai on Compound",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR8: {
    name: "Vote on a Governance Poll",
    longName: "Vote on one Governance Poll",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "poll-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR9: {
    name: "Vote on 5 Governance Polls",
    longName: "Vote on at least 5 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR10: {
    name: "Vote on 10 Governance Polls",
    longName: "Vote on at least 10 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR11: {
    name: "Vote on 20 Governance Polls",
    longName: "Vote on at least 20 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR12: {
    name: "Vote on 50 Governance Polls",
    longName: "Vote on at least 5 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR13: {
    name: "Vote on 100 Governance Polls",
    longName: "Vote on at least 100 Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "polls-x5-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR14: {
    name: "Vote on 2 consecutive Governance Polls",
    longName: "Vote on at least 2 consecutive Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR15: {
    name: "Vote on 5 consecutive Governance Polls",
    longName: "Vote on at least 5 consecutive Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR16: {
    name: "Vote on 10 consecutive Governance Polls",
    longName: "Vote on at least 10 consecutive Governance Polls",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR17: {
    name: "Vote on an Executive Proposal",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR18: {
    name: "Vote on 5 Executive Proposals",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR19: {
    name: "Vote on 10 Executive Proposals",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR20: {
    name: "Vote on 20 Executive Proposals",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR21: {
    name: "Vote on 50 Executive Proposals",
    longName: "Vote on one Executive Vote<br>to enact a new Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "executive-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR22: {
    name: "First Executive Voter",
    longName: "Be one of the first voters on<br>a new Executive Proposal",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR23: {
    name: "First Governance Poller",
    longName: "Be one of the first voters on<br>a new Governance Poll",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR24: {
    name: "Bite an unsafe Vault",
    longName: "Bite an unsafe Vault",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR25: {
    name: "Bite 10 unsafe Vaults",
    longName: "Bite an unsafe Vault",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR26: {
    name: "Bite 50 unsafe Vaults",
    longName: "Bite an unsafe Vault",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR27: {
    name: "Bite 100 unsafe Vault",
    longName: "Bite 100 unsafe Vault",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR28: {
    name: "Bid on a Collateral Auction",
    longName: "Bid on a Collateral Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR29: {
    name: "Bid on 5 Collateral Auctions",
    longName: "Bid on 5 Collateral Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR30: {
    name: "Bid on 10 Collateral Auctions",
    longName: "Bid on 10 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR31: {
    name: "Bid on 25 Collateral Auctions",
    longName: "Bid on 25 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR32: {
    name: "Won a Collateral Auction",
    longName: "Won a Collateral Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR33: {
    id: "MKR2",
    tier: 2,
    name: "Won 5 Collateral Auctions",
    longName: "Won 5 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR34: {
    name: "Won 10 Collateral Auctions",
    longName: "Won 10 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR35: {
    name: "Won 25 Collateral Auctions",
    longName: "Won 25 Collateral Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR36: {
    name: "Bid on a Surplus Auction",
    longName: "Bid on a Surplus Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR37: {
    name: "Bid on 5 Surplus Auctions",
    longName: "Bid on 5 Surplus Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR38: {
    name: "Bid on 10 Surplus Auctions",
    longName: "Bid on 10 Surplus Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR39: {
    name: "Bid on 25 Surplus Auctions",
    longName: "Bid on 25 Surplus Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR40: {
    name: "Won a Surplus Auction",
    longName: "Won a Surplus Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR41: {
    name: "Won 5 Surplus Auctions",
    longName: "Won 5 Surplus Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR42: {
    name: "Won 10 Surplus Auctions",
    longName: "Won 10 Surplus Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR43: {
    name: "Won 25 Surplus Auctions",
    longName: "Won 25 Surplus Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR44: {
    name: "Bid on a Debt Auction",
    longName: "Bid on a Debt Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR45: {
    name: "Bid on 5 Debt Auctions",
    longName: "Bid on 5 Debt Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR46: {
    name: "Bid on 10 Debt Auctions",
    longName: "Bid on 10 Debt Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR47: {
    name: "Bid on 25 Debt Auctions",
    longName: "Bid on 25 Debt Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR48: {
    name: "Won a Debt Auction",
    longName: "Won a Debt Auction",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR49: {
    name: "Won 5 Debt Auctions",
    longName: "Won 5 Debt Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR50: {
    name: "Won 10 Debt Auctions",
    longName: "Won 10 Debt Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR51: {
    name: "Won 25 Debt Auctions",
    longName: "Won 25 Debt Auctions",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "quick-vote-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR52: {
    name: "MKR in Voting Contract for 3 months",
    longName: "Secure MKR Governance with your<br>MKR for at least 3 months",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "lock-mkr-x3-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR53: {
    name: "MKR in Voting Contract for 6 months",
    longName: "Secure MKR Governance with your<br>MKR for at least 6 months",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "lock-mkr-x3-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR54: {
    name: "MKR in Voting Contract for 12 months",
    longName: "Secure MKR Governance with your<br>MKR for at least 12 months",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "lock-mkr-x12-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR55: {
    name: "Enact a Proposal",
    longName: "Cast the Spell to enact the<br>proposal contained in the Spell",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://etherscan.io",
    imgPath: "cast-spell-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR56: {
    name: "Create a Proposal that gets 10 votes",
    longName:
      "Create an Executive Proposal that<br>accumulates at least 10 voters",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "spell-10-votes-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR57: {
    name: "Create a Proposal that is passed",
    longName:
      "Create an Executive Proposal<br>that is passed by MKR Governance",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "spell-is-cast-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR58: {
    name: "Create 5 Proposals that pass",
    longName:
      "Create an Executive Proposal<br>that is passed by MKR Governance",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "spell-is-cast-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR59: {
    name: "Create 10 Proposals that pass",
    longName:
      "Create an Executive Proposal<br>that is passed by MKR Governance",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "spell-is-cast-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR60: {
    name: "Create a Governance Poll",
    longName:
      "Create a Governance Poll to<br />establish MKR governance sentiment",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "spell-is-cast-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR61: {
    name: "Create 5 Governance Polls",
    longName:
      "Create 5 Governance Polls to<br />establish MKR governance sentiment",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "spell-is-cast-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR62: {
    name: "Create 10 Governance Polls",
    longName:
      "Create 10 Governance Polls to<br />establish MKR governance sentiment",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "spell-is-cast-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
  MKR63: {
    name: "Create 25 Governance Polls",
    longName:
      "Create 25 Governance Polls to<br />establish MKR governance sentiment",
    description:
      "Quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.",
    resource: "https://vote.makerdao.com",
    imgPath: "spell-is-cast-badge.svg",
    unlocked: 0,
    redeemed: 0,
    proof: "",
  },
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
  addOrUpdateTemplateAddresses(8, await pollVoteAddressesForFrequency(1));
  return Promise.all(
    Object.keys(badgeList).map(async key => {
      let badge = badgeList[key];

      badge.unlocked = await checkTemplateAddressesForAddress(
        _address,
        parseFloat(key.slice(3, key.length)),
      );
      if (await badge.unlocked) {
        badge.proof = getBadgeProof(
          _address,
          await getTree(
            await getAddressesByTemplate(parseFloat(key.slice(3, key.length))),
          ),
        );
      }
      return badge;
    }),
  );
}
