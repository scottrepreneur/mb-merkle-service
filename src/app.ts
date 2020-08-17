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
import ethers from "ethers";

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
    // parse message
    let message = JSON.parse(req.params.message);
    console.log("message:", message);

    // recover signature address
    // window.ethereum.sendAsync(  {
    //   method: 'personal_ecRecover',
    //   params: [
    //     `${username}`, response.result
    //           ],
    //   from: window.ethereum.selectedAddress

    // },
    // (error, response) => {
    //   if (error) {
    //     console.error("error with recovering address:", error);
    //   } else {
    //     console.log(response.result);
    //   }
    // });
    let signer = ethers.utils.recoverAddress(
      message.username,
      message.signature,
    );
    console.log("signer:", signer);
    // getBadgesForAddress
    // filter for unlocked==1
    // map lookup for badgeId equivalency
    // for each badge, call discourse badge api
    // on complete return res.json({success: true, badgeIds: [...]})

    // test responses go here
    res.json({ response: signer });
  });

  return app;
}
