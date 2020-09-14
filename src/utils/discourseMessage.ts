import { getBadgesForAddress } from "../badges";

// replace window.ethereum with ethers.js
import { ethers } from "ethers";
import { badgeMap } from "./badgeMap";
import fetch from "node-fetch";
// import { stringify } from "querystring";
// import { v4String } from "uuid/interfaces";

const DISCOURSE_BADGES_API: string = process.env.DISCOURSE_BADGES_API!;
const DISCOURSE_API_USERNAME: string = process.env.DISCOURSE_API_USERNAME!;
const DISCOURSE_FORUM_URL: string = process.env.DISCOURSE_FORUM_URL!;

export default function discourseMessage(req, res) {
  let unlockedBadges: { id: number; description: string }[] = [];
  let discourseBadgeIds: any;
  let errors: any[] = [];
  let responseSent: boolean = false;
  // parse message
  console.log("discourseMessage.ts:", req.query);
  let message;
  try {
    message = req.query;
  } catch {
    console.log("JSON parse error");
    return;
    // TODO: Error handle to show alert if parse fails
  }
  // console.log("message:", message);
  let signer = ethers.utils.verifyMessage(message.username, message.signature);
  if (signer.toLowerCase() !== message.address.toLowerCase()) {
    res.json({ success: false, errors: "Error signing the message." });
  }
  // getBadgesForAddress && filter for unlocked==1
  getBadgesForAddress(signer).then(async badgeList => {
    unlockedBadges = badgeList.filter(badge => {
      return badge.unlocked === 1;
    });

    // map lookup for badgeId equivalency
    // console.log("Object.keys(badgeMap):", Object.keys(badgeMap));
    discourseBadgeIds = unlockedBadges.map(async badge => {
      // console.log("badge.description:", badge.description);
      if (Object.keys(badgeMap).includes(badge.id.toString())) {
        // for each badge, call discourse badge api
        const requestOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Api-Username": `${DISCOURSE_API_USERNAME}`,
            "Api-Key": `${DISCOURSE_BADGES_API}`,
          },
          body: JSON.stringify({
            username: message.username,
            badge_id: badgeMap[badge.id],
          }),
        };

        let response = await fetch(`${DISCOURSE_FORUM_URL}`, requestOptions);

        console.log("response.status:", response.status);

        if (response.status !== 200 && responseSent === false) {
          // errors.push(response);
          // responseSent = true;
          res
            .status(500)
            .send({
              success: false,
              badgeIds: null,
              errors: "Problem connecting to Discourse API.",
            })
            .end();

          return;
        }

        if (unlockedBadges.length === 0) {
          res.status(200).json({
            success: false,
            badgeIds: null,
            errors: "No eligible badges found.",
          });
          return;
        }
      }

      return false;
    });

    res.json({
      success: true,
      badgeIds: discourseBadgeIds,
      errors: errors,
    });
  });

  // test responses go here
  return true;
}
