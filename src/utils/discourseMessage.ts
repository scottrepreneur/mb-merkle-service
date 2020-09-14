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

export async function discourseMessage(req, res) {
  let unlockedBadges: { id: number; description: string }[] = [];
  let discourseBadgeIds: any;
  let errors: any[] = [];
  let responseSent: boolean = false;
  // parse message
  let message;
  try {
    message = JSON.parse(req.params);
  } catch {
    console.log("JSON parse error");
    return;
    // TODO: Error handle to show alert if parse fails
  }
  // console.log("message:", message);
  let signer = ethers.utils.verifyMessage(message.username, message.signature);
  if (signer.toLowerCase() !== message.address.toLowerCase()) {
    res.json({ success: false });
    return false;
  }
  // getBadgesForAddress && filter for unlocked==1
  getBadgesForAddress(signer)
    .then(badgeList => {
      unlockedBadges = badgeList.filter(badge => {
        return badge.unlocked === 1;
      });

      // map lookup for badgeId equivalency
      // console.log("Object.keys(badgeMap):", Object.keys(badgeMap));
      discourseBadgeIds = unlockedBadges.map(badge => {
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
          let fetchResult = async () => {
            let response = await fetch(
              `${DISCOURSE_FORUM_URL}`,
              requestOptions,
            );
            console.log("response.status:", response.status);

            if (response.status !== 200 && responseSent === false) {
              errors.push(response);
              // console.log("discourseError:", response);

              responseSent = true;
            }
            return response;
          };
          // add await below
          fetchResult();
          // console.log("fetchResult:", fetchResult);
          return badgeMap[badge.id];
        } else {
          return false;
        }
      });
    })
    .then(() => {
      // console.log("errors line 67:", errors);
      if (responseSent === true) {
        // console.log("response already sent.");
        res.json({
          success: false,
          badgeIds: null,
          errors: ["Problem connecting to Discourse API."],
        });
      } else {
        // discourseBadgeIds = discourseBadgeIds.filter(e => e !== false);
        if (unlockedBadges.length === 0) {
          res.json({
            success: false,
            badgeIds: null,
            errors: ["No eligible badges found."],
          });
        } else {
          res.json({
            success: true,
            badgeIds: discourseBadgeIds,
            errors: errors,
          });
        }
      }
    });

  // test responses go here
  return true;
}
