import * as express from "express";
import { json, urlencoded } from "body-parser";
//import * as compression from 'compression';
import * as cors from "cors";
import { eventContext } from "aws-serverless-express/middleware";
import { join } from "path";
import { getBadgesForAddress } from "./badges";
// import { checkConsecutiveGovernancePollsCount } from "./badgeActions/governance";
import { updateRoots } from "./adminActions";
import { discourseMessage } from "./utils/discourseMessage";

// // replace window.ethereum with ethers.js
// import { ethers } from "ethers";
// import { badgeMap } from "./utils/badgeMap";
// import fetch from "node-fetch";

// const DISCOURSE_BADGES_API: string = process.env.DISCOURSE_BADGES_API!;
// const DISCOURSE_API_USERNAME: string = process.env.DISCOURSE_API_USERNAME!;

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
    discourseMessage(req, res);
  });

  return app;
}
