import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Raycaster,
  Vector2,
  Color,
} from "three";

import CameraControls from "./CameraControls";
import EventSystem from "p100-lib/src/EventSystem";

let width = 0;
let height = 0;

export default class GameScene {
  eventSystem = new EventSystem();
  scene: Scene;
  camera: PerspectiveCamera;
  renderer: WebGLRenderer;
  cameraControls: CameraControls;
  raycaster = new Raycaster();
  pointer = new Vector2(-1, -1);

  rendered = false;
  hovered: any = null;

  constructor() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    width = w;
    height = h;

    // Renderer
    const renderer = new WebGLRenderer({ antialias: true });
    this.renderer = renderer;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setAnimationLoop(this.render);
    const canvas = renderer.domElement;
    document.body.appendChild(renderer.domElement);

    // Camera
    const camera = new PerspectiveCamera(70, width / height, 0.001, 100);
    this.camera = camera;
    camera.position.set(0, 0, 0);
    camera.layers.toggle(30);

    // Scene
    const scene = new Scene();
    this.scene = scene;

    // Camera Controls
    const cameraControls = new CameraControls(camera, canvas);
    this.cameraControls = cameraControls;

    // Event Setup
    cameraControls.addEventListener("change", this.onCameraControlsChange);
    cameraControls.addEventListener("end", this.onCameraControlsChangeEnd);

    canvas.addEventListener("mousemove", this.onMouseMove);
    canvas.addEventListener("click", this.onCanvasClick);

    window.addEventListener("resize", this.onWindowResize);

    this.scene.background = new Color(0x000000);
  }

  destroy() {
    const renderer = this.renderer;
    const canvas = renderer.domElement;
    const cameraControls = this.cameraControls;

    canvas.removeEventListener("mousemove", this.onMouseMove);
    canvas.removeEventListener("click", this.onCanvasClick);

    cameraControls.removeEventListener("change", this.onCameraControlsChange);
    cameraControls.removeEventListener("end", this.onCameraControlsChangeEnd);

    window.removeEventListener("resize", this.onWindowResize);
  }

  enable() {}

  disable() {}

  onCanvasClick = () => {
    this.eventSystem.emit("click", this.hovered);
  };

  onCanvasHover(object3D: any) {
    if (object3D === null) {
      this.setHovered(null);
      return;
    }
    if (object3D && object3D.userData.pnode) {
      this.setHovered(object3D.userData.pnode);
    }
  }

  onCameraControlsChange = () => {};

  onCameraControlsChangeEnd = () => {};

  /**
   * Event callback when mouse moves.
   */
  onMouseMove = (event: MouseEvent) => {
    this.pointer.x = (event.clientX / width) * 2 - 1;
    this.pointer.y = -(event.clientY / height) * 2 + 1;
  };

  /**
   * Called by this.
   */
  setHovered(node: any) {
    const hovered = this.hovered;

    if (node === null) {
      // Skip if nothing is hovered
      if (hovered === null) {
        return;
      }

      this.hovered = null;

      this.eventSystem.emit("hover-exit", hovered);

    } else {
      // Skip if already hovered
      if (hovered === node) {
        return;
      }

      // Did we have something hovered?
      if (hovered) {
        this.setHovered(null);
      }

      this.hovered = node;

      this.eventSystem.emit("hover-enter", node);
    }
  }

  render = () => {

    // Raycast
    if (this.rendered) {
      this.raycaster.setFromCamera(this.pointer, this.camera!);
      const intersects = this.raycaster.intersectObjects(
        this.scene.children,
        false
      );
  
      // Handle hover
      this.onCanvasHover(intersects.length > 0 ? intersects[0].object : null);  
    }

    // Render
    this.renderer!.render(this.scene!, this.camera!);
  };

  onWindowResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    width = w;
    height = h;

    // Update scene
    const camera = this.camera;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    this.renderer!.setSize(width, height);
  };
}
