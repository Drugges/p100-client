import "./style.css";

import { App } from "p100-lib";

const API_URL = import.meta.env.VITE_API_URL;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

let app: App | null = null;

async function run() {
  document.removeEventListener("click", run);

  const div = document.querySelector("#click-msg");
  if (div) {
    div.parentElement!.removeChild(div);
  }

  const urlParams = new URLSearchParams(window.location.search);

  const queryLanguage = urlParams.get("language");

  const language = queryLanguage ? parseInt(queryLanguage) || 0 : 0;
  console.log("language: ", language);

  const canvas = document.querySelector<HTMLCanvasElement>("#app")!;
  app = new App(canvas, API_URL, PROJECT_ID, language);
  await app.init();
}

async function init() {
  document.addEventListener("click", run);
}

init();
