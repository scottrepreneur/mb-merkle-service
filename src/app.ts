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
    let unlockedBadges: {}[] = [];
    // parse message
    let message = JSON.parse(req.params.message);
    console.log("message:", message);
    let signer = ethers.utils.verifyMessage(
      message.username,
      message.signature,
    );
    console.log("signer:", signer);
    console.log("message.address === signer", message.address, signer);
    if (signer.toLowerCase() !== message.address.toLowerCase()) {
      res.json({ success: false });
      return false;
    }
    // getBadgesForAddress
    getBadgesForAddress(signer)
      .then(badgeList => {
        unlockedBadges = badgeList.filter(badge => {
          console.log("badge#", badge.id, badge.unlocked);
          return badge.unlocked === 1;
        });
        console.log("unlockedBadges:", unlockedBadges);
        res.json({ response: unlockedBadges });
        // return tempBadges;
      })
      .catch(e => {
        console.log(e);
      });

    // console.log("unlockedBadges:", unlockedBadges);
    // filter for unlocked==1
    // map lookup for badgeId equivalency
    // for each badge, call discourse badge api
    // on complete return res.json({success: true, badgeIds: [...]})

    // test responses go here
    // res.json({ response: unlockedBadges });
    return true;
  });

  return app;
}
