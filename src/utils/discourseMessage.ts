import { getBadgesForAddress } from "../badges";

// replace window.ethereum with ethers.js
import { ethers } from "ethers";
import { badgeMap } from "./badgeMap";
import fetch from "node-fetch";

const DISCOURSE_BADGES_API: string = process.env.DISCOURSE_BADGES_API!;
const DISCOURSE_API_USERNAME: string = process.env.DISCOURSE_API_USERNAME!;

export async function discourseMessage(req, res) {
  let unlockedBadges: { id: number; description: string }[] = [];
  let errors: {} = {};
  // parse message
  let message = JSON.parse(req.params.message);
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
      console.log("Object.keys(badgeMap):", Object.keys(badgeMap));
      const discourseBadgeIds = unlockedBadges.map(badge => {
        console.log("badge.description:", badge.description);
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
          fetch(
            `https://staging-forum.makerfoundation.com/user_badges.json`,
            requestOptions,
          )
            .then(res => res.json())
            .then(resolved => {
              Object.keys(resolved).includes("badges")
                ? console.log("success state:", resolved)
                : (errors = resolved);
            });
          return badgeMap[badge.id];
        } else {
          return false;
        }
      });
      // on complete return res.json({success: true, badgeIds: [...]})
      res.json({
        success: true || false,
        badgeIds: discourseBadgeIds,
        errors: errors,
      });
    })
    .catch(e => {
      console.log(e);
    });

  // test responses go here
  return true;
}
