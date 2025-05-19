import "./style.css";

import { App } from "p100-lib";

const API_URL = import.meta.env.VITE_API_URL;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;

let app: App | null = null;

/**
 * Cleanup when Vite restarts
 */
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(dispose);
}

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

  const canvas = document.createElement("canvas");
  document.body.append(canvas);

  app = new App(canvas, API_URL, project || PROJECT_ID, language);
  await app.init();

  // Populate event dropdown
  const dropdown = document.querySelector("#event-dropdown")!;
  // Remove old events
  while (dropdown.firstChild) {
    dropdown.removeChild(dropdown.firstChild);
  }

  const events = app.getGlobalEvents();

  // Populate the dropdown
  events.forEach((event) => {
    const option = document.createElement("option");
    option.value = event._id.toString();
    option.text = event.name;
    dropdown.appendChild(option);
  });

  window.addEventListener("keydown", onKeyDown);

  app.addEventListener(onP100Event);

  document.querySelector("#event-emit")?.addEventListener("click", emitEvent);
}

function dispose() {
  console.log("[Client] dispose()");
  app?.dispose();
  app?.canvas.remove();
  app = null;
  window.removeEventListener("keydown", onKeyDown);
}

function emitEvent() {
  const event = (document.getElementById("event-dropdown") as any).value;
  const payload = (document.getElementById("event-payload") as any).value || "";

  app?.dispatchEvent(event, payload);

  const panel = document.getElementById("event-panel")!;
  panel.style.display = "none";
}

function onKeyDown(e: any) {
  if (e.key === "e") {
    console.log("Show event panel");
    const panel = document.getElementById("event-panel")!;
    panel.style.display = "inherit";
  } else if (e.key === "Enter") {
    emitEvent();
  }
}

function onP100Event(event: string, payload: string) {
  console.log("[P100-EVENT] ", event, payload);
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
  const urlParams = new URLSearchParams(window.location.search);
  const skipClick = !!urlParams.get("click");

  const {
    system: { version },
  } = await response.json();
  console.log("version: ", version);

  const browserVersion = import.meta.env.VITE_VERSION;

  if (version === browserVersion) {
    if (!skipClick) {
      msg("Click to start");
      document.addEventListener("click", run);
    } else {
      run();
    }
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
