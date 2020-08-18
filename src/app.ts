import * as express from "express";
import { json, urlencoded } from "body-parser";
//import * as compression from 'compression';
import * as cors from "cors";
import { eventContext } from "aws-serverless-express/middleware";
import { join } from "path";
import { getBadgesForAddress } from "./badges";
// import { checkConsecutiveGovernancePollsCount } from "./badgeActions/governance";
import { updateRoots } from "./adminActions";

// replace window.ethereum with ethers.js
import { ethers } from "ethers";
import { badgeMap } from "./utils/badgeMap";
import fetch from "node-fetch";

export function configureApp() {
  const app = express();
  app.set("view engine", "jade");
  app.use(express.static(join(__dirname, "public")));
  // app.use(compression());
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(eventContext());

  app.get("/", (req, res) => {
    // console.log(req.headers);
    res.json({ blah: "test" });
  });

  app.get("/address/:address", async (req, res) => {
    getBadgesForAddress(req.params.address)
      .then(badgeList => {
        res.json({ badges: badgeList });
      })
      .catch(e => {
        console.log(e);
      });
  });

  app.get("/update-roots", async (req, res) => {
    updateRoots();
    res.json({ success: true });
  });

  app.get("/discourse/:message", async (req, res) => {
    let unlockedBadges: { id: number; description: string }[] = [];
    let errors: {} = {};
    // parse message
    let message = JSON.parse(req.params.message);
    // console.log("message:", message);
    let signer = ethers.utils.verifyMessage(
      message.username,
      message.signature,
    );
    // console.log("signer:", signer);
    // console.log("message.address === signer", message.address, signer);
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

        // res.json({ response: unlockedBadges });
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
                "Api-Username": "aaron",
                "Api-Key":
                  "4e266cbb726c5f1533bfed87a62d43f2f9263786d6e403adbbaa36b69f840ff0",
              },
              body: JSON.stringify({
                username: message.username,
                badge_id: badgeMap[badge.id],
              }),
            };
            fetch(
              `http://157.245.226.106:9292/user_badges.json`,
              requestOptions,
            )
              .then(res => res.json())
              .then(
                // resolved => console.log("Discourse API response:", resolved),
                resolved => {
                  Object.keys(resolved).includes("badges")
                    ? console.log("success state:", resolved)
                    : (errors = resolved);
                },
              );
            // .catch(err => errors.push(err));
            return badgeMap[badge.id];
          } else {
            return false;
          }
        });
        // on complete return res.json({success: true, badgeIds: [...]})
        // console.log("errors", errors);
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
  });

  return app;
}
