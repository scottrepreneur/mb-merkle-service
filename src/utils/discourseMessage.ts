import { getBadgesForAddress } from "../badges"

import { ethers } from "ethers"
import { badgeMap } from "./badgeMap"
import fetch from "node-fetch"

const DISCOURSE_BADGES_API: string = process.env.DISCOURSE_BADGES_API!
const DISCOURSE_API_USERNAME: string = process.env.DISCOURSE_API_USERNAME!
const DISCOURSE_FORUM_URL: string = process.env.DISCOURSE_FORUM_URL!

export default function discourseMessage (req, res) {
  let unlockedBadges: { id: number; description: string }[] = []
  let discourseBadgeIds: any
  let errors: any[] = []
  let responseSent: boolean = false
  let message = req.query

  let signer = ethers.utils.verifyMessage(message.username, message.signature)

  if (signer.toLowerCase() !== message.address.toLowerCase()) {
    return res.json({ success: false, errors: "Error signing the message." })
  }

  getBadgesForAddress(signer).then(badgeList => {
    // filter for any unlocked badges
    unlockedBadges = badgeList.filter(badge => {
      return badge.unlocked === 1
    })

    // return if no user has no unlocked badges
    if (unlockedBadges.length === 0) {
      return res.json({
        success: false,
        badgeIds: null,
        errors: "No eligible badges found.",
      })
    }

    // map over each badge & call discourse badge api
    discourseBadgeIds = unlockedBadges.map(async badge => {
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
            username: message.username,
            badge_id: badgeMap[badge.id],
          }),
        }

        // fetch discourse API
        let response = await fetch(`${DISCOURSE_FORUM_URL}`, requestOptions)

        // response error handling
        if (response.status !== 200 && responseSent === false) {
          return res.status(500).json({
            success: false,
            badgeIds: null,
            errors: "Problem connecting to Discourse API.",
          })
        }
      }
    })

    // valid response
    return res.json({
      success: true,
      badgeIds: discourseBadgeIds,
      errors: errors,
    })
  })

  // discourseMessage Failed
  return false
}
