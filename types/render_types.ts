export type Url = string;
export type ThemeComponents = "header" | "text" | "button" | "logo" | "background";
export interface RenderOptions {
    name: string;
    headline: string;
    currentPosition: string;
    education: string;
    theme: string;
    profileImageUrl: Url;
}
