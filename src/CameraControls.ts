import { Camera, EventDispatcher } from "three/src/Three.js";

export interface CameraControlsEventMap {
  change: any;
  start: any;
  end: any;
}

const _changeEvent = { type: "change" };
const _startEvent = { type: "start" };
const _endEvent = { type: "end" };

export default class CameraControls extends EventDispatcher<CameraControlsEventMap> {
  camera: Camera;
  domElement: HTMLElement;
  button: number = 0;

  active: boolean = false;

  private enabled = true;

  constructor(camera: Camera, domElement: HTMLElement) {
    super();

    this.camera = camera;
    this.domElement = domElement;

    this.enable();
  }

  destroy() {
    this.domElement.removeEventListener("contextmenu", this.onContextMenu);
    this.domElement.removeEventListener("pointerdown", this.onPointerDown);
    this.domElement.removeEventListener("pointercancel", this.onPointerUp);
    this.domElement = null!;
    document.body.removeEventListener("pointermove", this.onPointerMove);
    document.body.removeEventListener("pointerup", this.onPointerUp);
  }

  enable() {
    this.enabled = true;

    this.domElement.addEventListener("contextmenu", this.onContextMenu);
    this.domElement.addEventListener("pointerdown", this.onPointerDown);
    this.domElement.addEventListener("pointercancel", this.onPointerUp);
  }

  disable() {
    if (this.enabled) {
      if (this.active) {
        this.onPointerUp();
      }
      this.domElement.removeEventListener("contextmenu", this.onContextMenu);
      this.domElement.removeEventListener("pointerdown", this.onPointerDown);
      this.domElement.removeEventListener("pointercancel", this.onPointerUp);
    }
  }

  onContextMenu = (event: any) => {
    if (this.enabled === false) return;
    event.preventDefault();
  };

  onPointerDown = (event: any) => {
    if (event.button === 2) {
      this.active = true;
      this.button = event.button;

      this.dispatchEvent(_startEvent);

      document.body.addEventListener("pointermove", this.onPointerMove);
      document.body.addEventListener("pointerup", this.onPointerUp);
    } else {
      this.button = 0;
    }
  };

  onPointerUp = () => {
    this.button = 0;
    this.active = false;
    this.dispatchEvent(_endEvent);
    document.body.removeEventListener("pointermove", this.onPointerMove);
    document.body.removeEventListener("pointerup", this.onPointerUp);
  };

  onPointerMove = (event: any) => {
    this.dispatchEvent(_changeEvent);
    this.camera.rotation.y -= event.movementX / 500;
    this.camera.rotation.x -= event.movementY / 500;
  };
}
