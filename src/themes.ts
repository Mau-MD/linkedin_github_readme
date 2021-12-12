import { ThemeComponents } from "../types/render_types";
import fs from "fs";
import path from "path";

export class ThemeHandler {
    private themeObject;

    constructor(theme: string) {
        const themeFile = fs.readFileSync(path.join(__dirname, `/themes/${theme}.json`), "utf8");
        this.themeObject = JSON.parse(themeFile);
    }

    handleTheme(component: ThemeComponents) {
        return this.themeObject[component];
    }
}

export const getCurrentThemes = (): string[] => {
    const themes = [];
    fs.readdirSync(path.join(__dirname, "/themes")).forEach((file) => {
        themes.push(file.split(".")[0]);
    });
    return themes;
};
