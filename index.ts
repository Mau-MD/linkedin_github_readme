import express, { Request, Response } from "express";
import { render } from "./src/render";
import cors from "cors";
import axios from "axios";
import path from "path";
import fs from "fs";
import { getCurrentThemes } from "./src/themes";

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "frontend/dist")));

const PORT = process.env.PORT || 8080;
const HOST = process.env.DOCKER === "true" ? "0.0.0.0" : "localhost";

app.get(
    "/api/render/:name/:headline/:currentPosition/:education/:theme/:profileImageUrl/",
    async (req: Request, res: Response) => {
        try {
            let { name, headline, currentPosition, education, theme, profileImageUrl } = req.params;

            if (getCurrentThemes().includes(theme) === false) {
                throw new Error(`Theme ${theme} is not supported`);
            }

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
                    profileImageUrl: base64Img,
                    theme,
                })
            );
        } catch (err) {
            res.status(400).send(err);
        }
    }
);

app.get("/api/getThemes", (req: Request, res: Response) => {
    res.send(getCurrentThemes());
});

app.get("/", (req: Request, res: Response) => {
    res.sendFile(__dirname, "frontend/dist/index.html");
});

app.listen(PORT, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});

// Link: https://badges.linkedin.com/profile?locale=en_US&badgetype=VERTICAL&badgetheme=light&uid=92175&version=v1&maxsize=medium&trk=profile-badge&vanityname=ivan
