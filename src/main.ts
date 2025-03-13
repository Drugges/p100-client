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
  const project = urlParams.get("project");
  const language = queryLanguage ? parseInt(queryLanguage) || 0 : 0;

  const canvas = document.querySelector<HTMLCanvasElement>("#app")!;
  app = new App(canvas, API_URL, project || PROJECT_ID, language);
  await app.init();

  window.addEventListener("keydown", onKeyDown);
}

function onKeyDown(e: any) {
  if (e.key === "e") {
    console.log("Show event panel");
    const panel = document.getElementById("event-panel")!;
    panel.style.display = "inherit";
    setTimeout(() => {
      (document.getElementById("event-input") as any).focus();
    }, 0);
  } else if (e.key === "Enter") {
    const value = (document.getElementById("event-input") as any).value;
    if (value) {
      const canvas = document.getElementById("app")!;
      canvas.dispatchEvent(
        new CustomEvent("external-event", {
          detail: {
            name: value,
            args: "",
          },
        })
      );
    }
    const panel = document.getElementById("event-panel")!;
    panel.style.display = "none";
  }
}

function msg(msg: string) {
  const div = document.getElementById("click-msg");
  div!.innerHTML = msg;
}

async function init() {
  // Get system details
  const response = await fetch(`${API_URL}/system/client`);

  if (!response.ok) {
    msg("Failed to load system details");
    return;
  }

  const {
    system: { version },
  } = await response.json();
  console.log("version: ", version);

  const browserVersion = import.meta.env.VITE_VERSION;

  if (version === browserVersion) {
    msg("Click to start");
    document.addEventListener("click", run);
  } else {
    msg(
      "You are using an old version (" +
        browserVersion +
        "), please clear your browser cache to get the latest version: " +
        version
    );
  }
}

init();
