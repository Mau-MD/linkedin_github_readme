const DOCKER_URL = "http://0.0.0.0:8080";
const PROD_URL = "https://linkedin-github.herokuapp.com/";

export const config = {
    BASE_URL: process.env.NODE_ENV === "production" ? PROD_URL : DOCKER_URL,
    NODE_PORT: "8080",
};
