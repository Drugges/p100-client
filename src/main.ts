import './style.css'

import GameScene from "./GameScene";

const scene = new GameScene();

const project: any = {
  _id: "123",
  name: "Test Project",
  nodes: [
    {
      name: "Door-1",
      type: "entity",
      primitive: "plane",
      _id: "1",
      position: {
        x: -2.0,
        y: 0.0,
        z: -2.5,
      },
      rotation: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
      scale: {
        x: 1.0,
        y: 1.0,
        z: 1.0,
      },
      components: [
        {
          type: "plane-geometry",
          width: 1,
          height: 1,
        },
        {
          type: "material",
          shader: "flat",
          color: "#FF0000"
        },
        {
          type: "scale-animation",
          on: {
            name: "hover-enter",
            target: "1"
          },
          target: { x: 2, y: 2, z: 2 }
        },
        {
          type: "scale-animation",
          on: {
            name: "click",
            target: "1"
          },
          target: { x: 1, y: 1, z: 1 }
        },
      ],
      nodes: [],
    },
    {
      name: "Door-2",
      type: "entity",
      primitive: "plane",
      _id: "2",
      position: {
        x: 2.0,
        y: 0.0,
        z: -2.5,
      },
      rotation: {
        x: 0.0,
        y: 0.0,
        z: 0.0,
      },
      scale: {
        x: 1.0,
        y: 1.0,
        z: 1.0,
      },
      components: [
        {
          type: "plane-geometry",
          width: 1,
          height: 1,
        },
        {
          type: "material",
          shader: "flat",
          color: "#FF0000"
        },
        {
          type: "scale-animation",
          on: {
            name: "hover-enter",
            target: "1"
          },
          target: { x: 2, y: 2, z: 2 }
        },
        {
          type: "scale-animation",
          on: {
            name: "click",
            target: "1"
          },
          target: { x: 1, y: 1, z: 1 }
        },
      ],
      nodes: [],
    },
  ],
};

//scene.renderProject(project);

