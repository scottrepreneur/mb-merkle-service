import fetch from "node-fetch";
import { getBadgesForAddress } from "../badges";
import { ethers } from "ethers";
import { badgeMap } from "./badgeMap";
import { isEmpty, isNumber, isNaN } from "lodash";

const DISCOURSE_BADGES_API: string = process.env.DISCOURSE_BADGES_API!;
const DISCOURSE_API_USERNAME: string = process.env.DISCOURSE_API_USERNAME!;
const DISCOURSE_FORUM_URL: string = process.env.DISCOURSE_FORUM_URL!;

let status: number = 200;
let success: boolean = true;
let badgeIds: any = null;
let signer: any = undefined;
const errors: any[] = ["DiscourseMessage Failed"];

// Default Export
const discourseMessage = (req, res) => {
  if (isBlank(req.query)) {
    status = 500;
    success = false;
    errors.push("Invalid request query, please check request params.");

    return jsonResponse(res);
  }

  if (!VerifyMessage(req.query)) {
    return jsonResponse(res);
  }

  getBadgesForAddress(signer).then(badgeList => {
    let unlockedBadges: { id: number; description: string }[] = [];
    // filter for any unlocked badges
    unlockedBadges = badgeList.filter(badge => {
      return badge.unlocked === 1;
    });

    // return if no user has no unlocked badges
    if (unlockedBadges.length === 0) {
      success = false;
      status = 200;
      errors.push("No eligible badges found.");

      return jsonResponse(res);
    }

    // map over each badge & call discourse badge api
    badgeIds = unlockedBadges.map(async badge => {
      if (Object.keys(badgeMap).includes(badge.id.toString())) {
        // Request Options/Config
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Username": `${DISCOURSE_API_USERNAME}`,
            "Api-Key": `${DISCOURSE_BADGES_API}`,
          },
          body: JSON.stringify({
            username: req.query.username,
            badge_id: badgeMap[badge.id],
          }),
        };

        // fetch discourse API
        let response = await fetch(`${DISCOURSE_FORUM_URL}`, requestOptions);

        // response error handling
        if (response.status !== 200) {
          success = false;
          status = 200;
          errors.push("Problem connecting to Discourse API.");

          return jsonResponse(res);
        }
      }
    });

    // valid response
    return jsonResponse(res);
  });

  return jsonResponse(res);
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const jsonResponse = res => {
  res.status(status).json({
    success,
    badgeIds,
    errors,
  });

  return errors.pop();
};

const VerifyMessage = msg => {
  try {
    signer = ethers.utils.verifyMessage(msg.username, msg.signature);
  } catch (error) {
    success = false;
    status = 500;
    errors.push(error);
  } finally {
    if (!signer) {
      return false;
    }

    if (signer.toLowerCase() !== msg.address.toLowerCase()) {
      return false;
    }
  }

  return true;
};

const isBlank = value => {
  return (isEmpty(value) && !isNumber(value)) || isNaN(value);
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default discourseMessage;
