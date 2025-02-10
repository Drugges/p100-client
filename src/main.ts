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

  const paths = window.location.pathname.split("/");

  //  const projectId = paths.length === 3 ? paths[1] : PROJECT_ID;
  const language = paths.length === 2 ? parseInt(paths[1]) || 0 : 0;

  const canvas = document.querySelector<HTMLCanvasElement>("#app")!;
  app = new App(canvas, API_URL, PROJECT_ID, language);
  await app.init();
}

async function init() {
  document.addEventListener("click", run);
}

init();
