import express, { Request, Response } from "express";
import { render } from "./src/render";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 9000;
app.post(
    "/api/render/:name/:headline/:currentPosition/:education/:linkedinProfileUrl/:profileImageUrl/:currentPositionUrl?/:educationUrl?/",
    async (req: Request, res: Response) => {
        try {
            let {
                name,
                headline,
                currentPosition,
                education,
                currentPositionUrl,
                educationUrl,
                linkedinProfileUrl,
                profileImageUrl,
            } = req.params;

            currentPositionUrl = currentPositionUrl ?? linkedinProfileUrl;
            educationUrl = educationUrl ?? linkedinProfileUrl;

            // Link to base64
            const image = await axios.get(profileImageUrl, { responseType: "arraybuffer" });
            const base64Img = Buffer.from(image.data, "binary").toString("base64");

            res.set("Content-Type", "image/svg+xml");
            res.send(
                render({
                    name,
                    headline,
                    currentPosition,
                    education,
                    currentPositionUrl,
                    educationUrl,
                    linkedinProfileUrl,
                    profileImageUrl: base64Img,
                })
            );
        } catch (err) {
            throw new Error("Error rendering SVG");
        }
    }
);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

// Link: https://badges.linkedin.com/profile?locale=en_US&badgetype=VERTICAL&badgetheme=light&uid=92175&version=v1&maxsize=medium&trk=profile-badge&vanityname=ivan
