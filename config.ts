const DEV_URL = "http://0.0.0.0:8080";
const PROD_URL = "";

export const config = {
    BASE_URL: process.env.NODE_ENV === "production" ? PROD_URL : DEV_URL,
};
