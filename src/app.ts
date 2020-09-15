import * as express from "express"
import { json, urlencoded } from "body-parser"
//import * as compression from 'compression';
import * as cors from "cors"
import { eventContext } from "aws-serverless-express/middleware"
import { join } from "path"
import { getBadgesForAddress } from "./badges"
// import { checkConsecutiveGovernancePollsCount } from "./badgeActions/governance";
import { updateRoots } from "./adminActions"
import discourseMessage from "./utils/discourseMessage"

export function configureApp () {
  const app = express()
  app.set("view engine", "jade")
  app.use(express.static(join(__dirname, "public")))
  // app.use(compression());
  app.use(cors())
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(eventContext())

  app.get("/", (req, res) => {
    res.json({ blah: "test" })
  })

  app.get("/address/:address", async (req, res) => {
    getBadgesForAddress(req.params.address)
      .then(badgeList => {
        res.json({ badges: badgeList })
      })
      .catch(e => {
        console.log(e)
      })
  })

  app.get("/update-roots", async (req, res) => {
    updateRoots()
    res.json({ success: true })
  })

  app.get("/dev/discourse", (req, res) => {
    discourseMessage(req, res)
  })

  return app
}
