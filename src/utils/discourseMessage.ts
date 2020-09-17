import fetch from "node-fetch";
import { getBadgesForAddress } from "../badges";
import { ethers } from "ethers";
import { badgeMap } from "./badgeMap";
import { includes, isEmpty, isNumber, isNaN } from "lodash";

const DISCOURSE_BADGES_API: string = process.env.DISCOURSE_BADGES_API!;
const DISCOURSE_API_USERNAME: string = process.env.DISCOURSE_API_USERNAME!;
const DISCOURSE_FORUM_URL: string = process.env.DISCOURSE_FORUM_URL!;

// ################################
let success: boolean = false;
let signer: any = undefined;
let badgeIds: any[] = [];
let errors: any[] = [];
// ################################

// (((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))
// (((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))
const discourseMessage = async query => {
  errors = []; badgeIds = [];

  return new Promise( async (resolve, reject) => {
    // let query = {...requestQuery};

    if (isBlank(query)) { errors.push("Missing query params"); reject(responseObject()); }

    if (!VerifyMessage(query)) { reject(responseObject()); }

    // get the unlocked badges from discourse for this user
    const userAccount = await fetch(`${DISCOURSE_FORUM_URL}?username=${query.username}`, {method:"GET"});
    // console.log("userAccount:", userAccount);
    query.account = await userAccount.json();
    console.log("query.account", query.account);

    getBadgesForAddress(signer)
      .then(badgeList      => { return badgeList.filter(b => { return b.unlocked === 1; }); })
      .then(unlockedBadges => { return grantUnlockedBadges(query, unlockedBadges); })
      .then(keepPromises   => { return Promise.all(keepPromises); })
      .then(()             => { success = true; resolve(responseObject()); })
      .catch(error         => { errors.push(error); reject(responseObject());
    });
  });
};
// (((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))
// (((((((((((((((((((((((((((((((((((((((((())))))))))))))))))))))))))))))))))))))))))

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const VerifyMessage = async msg => {
  try {
    signer = ethers.utils.verifyMessage(msg.username, msg.signature);

    if (signer && signer.toLowerCase() !== msg.address.toLowerCase())
      return false;

  }
  catch (error) {
    errors.push(error);
    return false;
  }
  finally {
    if (signer) { return true; }

    return false;
  }
};

const grantUnlockedBadges = (query, unlockedBadges) => {

  if (!unlockedBadges) { errors.push("No unlocked badges available");
    return;
  }

  if (unlockedBadges.length === 0) { errors.push("No eligible badges found.");
    return;
  }

  return unlockedBadges.map(async badge => {
    if (Object.keys(badgeMap).includes(badge.id.toString())) {
      // prevent request from executing if 
      const userBadges = query.account.badges.map(b => b.id);
      console.log("userBadges:", userBadges);
      if ( includes(userBadges, badgeMap[badge.id]) ){
        return
      }

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Username": `${DISCOURSE_API_USERNAME}`,
          "Api-Key": `${DISCOURSE_BADGES_API}`,
        },
        body: JSON.stringify({
          username: query.username,
          badge_id: badgeMap[badge.id],
        }),
      };

      const response = await fetch(`${DISCOURSE_FORUM_URL}`, requestOptions);
      const json     = await response.json();

      if (response.status === 200) { badgeIds.push(badgeMap[badge.id]); }

      return json;
    }
  });
};

const isBlank = value => { return (isEmpty(value) && !isNumber(value)) || isNaN(value); };

const responseObject = () => { return { success, errors, badgeIds }; };
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default discourseMessage;
