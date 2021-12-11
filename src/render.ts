import fs from "fs";
import { RenderOptions } from "../types/render_types";

export const render = (options: RenderOptions): string => {
    return `
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="250" height="268" viewBox="0 0 250 268" fill="none">
  ${renderAll(options)}
  </svg>
  `;
};

const renderAll = (options: RenderOptions): string => {
    const style = `<defs> <style>${fs.readFileSync(
        __dirname + "/../css/light.css",
        "utf8"
    )}</style></defs>`;
    const topBar = fs.readFileSync(__dirname + "/../svg/topbar.svg", "utf8");
    const image = `
  <defs>
    <clipPath id="img">
    <circle cx="calc(10% + 22px)" cy="92" r="22" />
    </clipPath>
  </defs>
  <image class="link" x="10%" y="70" width="50" height="50" clip-path="url(#img)" xlink:href="data:image/png;base64,${options.profileImageUrl}"/>`;
    const name = `<a href="${options.linkedinProfileUrl}"><text class="link" xmlns="http://www.w3.org/2000/svg" x="10%" y="140" text-anchor="left" font-family="roboto" font-weight="bold" font-size="16" fill="#000">${options.name}</text></a>`;
    const desc = `<text class="link" xmlns="http://www.w3.org/2000/svg" x="10%" y="160" text-anchor="left" font-family="roboto" font-size="16" fill="#000">${options.headline}</text>`;
    const work = `<a href="${options.currentPositionUrl}"><text class="link" xmlns="http://www.w3.org/2000/svg" x="10%" y="180" text-anchor="left" font-family="roboto" font-size="12" fill="#000">${options.currentPosition}</text></a>`;
    const education = `<a href="${options.educationUrl}"><text class="link" xmlns="http://www.w3.org/2000/svg" x="10%" y="200" text-anchor="left" font-family="roboto" font-size="12" fill="#000">${options.education}</text></a>`;
    const view = `<a href="${options.linkedinProfileUrl}" target="_blank">${fs.readFileSync(
        __dirname + "/../svg/view.svg",
        "utf8"
    )} </a>`;
    return style + topBar + image + name + desc + work + education + view;
};
