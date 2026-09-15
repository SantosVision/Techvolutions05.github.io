(() => {
  "use strict";

  const canvas = document.getElementById("view");
  const errorEl = document.getElementById("webgl-error");
  function failTour() {
    if (errorEl) errorEl.hidden = false;
  }
  if (!window.THREE || !canvas) {
    failTour();
    return;
  }

  const ROOM_SIZE = 8;
  const HOUSE = ROOM_SIZE * 2;
  const WALL_H = 3.15;
  const WALL_T = 0.16;
  const DOOR_W = 1.28;
  const DOOR_H = 2.16;
  const EYE = 1.58;
  const WALK_R = 0.28;
  const SPEED = 3.4;

  const ROOMS = {
    living: {
      name: "Living Room",
      blurb: "Plaster hearth, linen sofa, oak floors.",
      x: 4.2,
      z: 3.2,
      yaw: Math.PI - 0.55,
      links: [
        { to: "kitchen", x: 7.62, z: 4, label: "Kitchen" },
        { to: "bedroom", x: 4, z: 7.62, label: "Bedroom" }
      ]
    },
    kitchen: {
      name: "Kitchen",
      blurb: "Sage cabinets and a maple island.",
      x: 10.35,
      z: 5.55,
      yaw: -0.62,
      links: [
        { to: "living", x: 8.38, z: 4, label: "Living" },
        { to: "bathroom", x: 12, z: 7.62, label: "Bath" }
      ]
    },
    bedroom: {
      name: "Bedroom",
      blurb: "A quiet west-facing sleeping room.",
      x: 5.5,
      z: 10.55,
      yaw: 2.05,
      links: [
        { to: "living", x: 4, z: 8.38, label: "Living" },
        { to: "bathroom", x: 7.62, z: 12, label: "Bath" }
      ]
    },
    bathroom: {
      name: "Bathroom",
      blurb: "Subway tile, tub, and brass notes.",
      x: 12.2,
      z: 10.9,
      yaw: 2.48,
      links: [
        { to: "kitchen", x: 12, z: 8.38, label: "Kitchen" },
        { to: "bedroom", x: 8.38, z: 12, label: "Bedroom" }
      ]
    }
  };

  const PINS = [
    { room: "living", x: 0.85, y: 1.15, z: 4, title: "Plaster hearth", kicker: "Living", body: "A simple plaster surround with a charcoal firebox. The room’s warm center on winter listings." },
    { room: "living", x: 4.1, y: 0.55, z: 4.35, title: "Cedar coffee table", kicker: "Living", body: "Low cedar slab on block legs — a place for a book, not a TV dinner." },
    { room: "kitchen", x: 12, y: 1.05, z: 4.15, title: "Maple island", kicker: "Kitchen", body: "Work surface, breakfast edge, and the path between garden window and bath door." },
    { room: "kitchen", x: 14.7, y: 1.4, z: 1.15, title: "Garden window", kicker: "Kitchen", body: "North light over the sink. Herbs would live here in a real listing." },
    { room: "bedroom", x: 2.4, y: 0.85, z: 12, title: "Linen bed", kicker: "Bedroom", body: "Headboard on the west wall so morning light from the living doorway lands softly." },
    { room: "bathroom", x: 10.2, y: 0.7, z: 13.4, title: "Built-in tub", kicker: "Bath", body: "Tile deck and a deep basin — the quiet end of the Willow Hall loop." }
  ];

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colliders = [];

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !coarse, powerPreference: "high-performance" });
  } catch (err) {
    failTour();
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;
  renderer.shadowMap.enabled = !coarse;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xb7c4c2);
  scene.fog = new THREE.Fog(0xc9c2b4, 14, 28);

  const camera = new THREE.PerspectiveCamera(68, window.innerWidth / window.innerHeight, 0.08, 60);
  camera.position.set(ROOMS.living.x, EYE, ROOMS.living.z);

  const clock = new THREE.Clock();
  const house = new THREE.Group();
  scene.add(house);

  function noise(ctx, alpha) {
    const { width, height } = ctx.canvas;
    const img = ctx.getImageData(0, 0, width, height);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * alpha;
      d[i] = Math.max(0, Math.min(255, d[i] + n));
      d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
      d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
    }
    ctx.putImageData(img, 0, 0);
  }

  function canvasTex(draw, repeatX, repeatY) {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const ctx = c.getContext("2d");
    draw(ctx, c);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeatX || 1, repeatY || 1);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return tex;
  }

  const woodTex = canvasTex((ctx, c) => {
    ctx.fillStyle = "#8a5a32";
    ctx.fillRect(0, 0, c.width, c.height);
    for (let y = 0; y < c.height; y += 32) {
      ctx.fillStyle = y % 64 === 0 ? "#7a4e2b" : "#94633a";
      ctx.fillRect(0, y, c.width, 31);
      ctx.strokeStyle = "rgba(50,28,12,0.35)";
      ctx.beginPath();
      ctx.moveTo(0, y + 31);
      ctx.lineTo(c.width, y + 31);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,210,160,0.08)";
      for (let i = 0; i < 6; i += 1) {
        ctx.beginPath();
        ctx.moveTo(0, y + 6 + i * 4);
        ctx.bezierCurveTo(120, y + i * 5, 280, y + 12, c.width, y + 8 + i);
        ctx.stroke();
      }
    }
    noise(ctx, 18);
  }, 8, 8);

  const plasterTex = canvasTex((ctx, c) => {
    ctx.fillStyle = "#efe6d6";
    ctx.fillRect(0, 0, c.width, c.height);
    noise(ctx, 14);
  }, 3, 2);

  const sagePlaster = canvasTex((ctx, c) => {
    ctx.fillStyle = "#d7e0d6";
    ctx.fillRect(0, 0, c.width, c.height);
    noise(ctx, 12);
  }, 2, 2);

  const rosePlaster = canvasTex((ctx, c) => {
    ctx.fillStyle = "#eadcd4";
    ctx.fillRect(0, 0, c.width, c.height);
    noise(ctx, 12);
  }, 2, 2);

  const tileTex = canvasTex((ctx, c) => {
    ctx.fillStyle = "#c5ced0";
    ctx.fillRect(0, 0, c.width, c.height);
    const tw = 64;
    const th = 32;
    for (let y = 0; y < c.height; y += th) {
      const offset = (y / th) % 2 === 0 ? 0 : tw / 2;
      for (let x = -tw; x < c.width; x += tw) {
        ctx.fillStyle = "#f3f6f7";
        ctx.fillRect(x + offset + 2, y + 2, tw - 4, th - 4);
      }
    }
  }, 6, 4);

  const tileFloor = canvasTex((ctx, c) => {
    ctx.fillStyle = "#9aa6a8";
    ctx.fillRect(0, 0, c.width, c.height);
    for (let y = 0; y < 8; y += 1) {
      for (let x = 0; x < 8; x += 1) {
        ctx.fillStyle = (x + y) % 2 === 0 ? "#e7ecee" : "#d5dddf";
        ctx.fillRect(x * 64 + 2, y * 64 + 2, 60, 60);
      }
    }
  }, 4, 4);

  const woodMat = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.72, metalness: 0.02 });
  const plasterMat = new THREE.MeshStandardMaterial({ map: plasterTex, roughness: 0.92, metalness: 0 });
  const sageMat = new THREE.MeshStandardMaterial({ map: sagePlaster, roughness: 0.9, metalness: 0 });
  const roseMat = new THREE.MeshStandardMaterial({ map: rosePlaster, roughness: 0.9, metalness: 0 });
  const tileWallMat = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.45, metalness: 0.04 });
  const tileFloorMat = new THREE.MeshStandardMaterial({ map: tileFloor, roughness: 0.4, metalness: 0.05 });
  const ceilingMat = new THREE.MeshStandardMaterial({ color: 0xf4efe8, roughness: 0.95, metalness: 0 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x6a4326, roughness: 0.55, metalness: 0.05 });
  const brassMat = new THREE.MeshStandardMaterial({ color: 0xb08d57, roughness: 0.35, metalness: 0.7 });

  function mesh(geo, mat, x, y, z, parent) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    (parent || house).add(m);
    return m;
  }

  function box(w, h, d, mat, x, y, z, parent) {
    return mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
  }

  function addCollider(minX, maxX, minZ, maxZ) {
    colliders.push({ minX, maxX, minZ, maxZ });
  }

  function wallAlongX(x0, x1, z, doors, mat) {
    const list = (doors || []).slice().sort((a, b) => a - b);
    let cursor = x0;
    list.forEach((cx) => {
      const a = cx - DOOR_W / 2;
      const b = cx + DOOR_W / 2;
      if (a > cursor + 0.02) {
        box(a - cursor, WALL_H, WALL_T, mat, (cursor + a) / 2, WALL_H / 2, z);
        addCollider(cursor, a, z - WALL_T / 2 - 0.02, z + WALL_T / 2 + 0.02);
      }
      box(DOOR_W, WALL_H - DOOR_H, WALL_T, mat, cx, DOOR_H + (WALL_H - DOOR_H) / 2, z);
      box(0.08, DOOR_H, 0.12, trimMat, a + 0.04, DOOR_H / 2, z);
      box(0.08, DOOR_H, 0.12, trimMat, b - 0.04, DOOR_H / 2, z);
      box(DOOR_W + 0.08, 0.08, 0.12, trimMat, cx, DOOR_H + 0.02, z);
      cursor = b;
    });
    if (x1 > cursor + 0.02) {
      box(x1 - cursor, WALL_H, WALL_T, mat, (cursor + x1) / 2, WALL_H / 2, z);
      addCollider(cursor, x1, z - WALL_T / 2 - 0.02, z + WALL_T / 2 + 0.02);
    }
  }

  function wallAlongZ(z0, z1, x, doors, mat) {
    const list = (doors || []).slice().sort((a, b) => a - b);
    let cursor = z0;
    list.forEach((cz) => {
      const a = cz - DOOR_W / 2;
      const b = cz + DOOR_W / 2;
      if (a > cursor + 0.02) {
        box(WALL_T, WALL_H, a - cursor, mat, x, WALL_H / 2, (cursor + a) / 2);
        addCollider(x - WALL_T / 2 - 0.02, x + WALL_T / 2 + 0.02, cursor, a);
      }
      box(WALL_T, WALL_H - DOOR_H, DOOR_W, mat, x, DOOR_H + (WALL_H - DOOR_H) / 2, cz);
      box(0.12, DOOR_H, 0.08, trimMat, x, DOOR_H / 2, a + 0.04);
      box(0.12, DOOR_H, 0.08, trimMat, x, DOOR_H / 2, b - 0.04);
      box(0.12, 0.08, DOOR_W + 0.08, trimMat, x, DOOR_H + 0.02, cz);
      cursor = b;
    });
    if (z1 > cursor + 0.02) {
      box(WALL_T, WALL_H, z1 - cursor, mat, x, WALL_H / 2, (cursor + z1) / 2);
      addCollider(x - WALL_T / 2 - 0.02, x + WALL_T / 2 + 0.02, cursor, z1);
    }
  }

  function windowPane(x, y, z, w, h, rotY) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = rotY || 0;
    box(w + 0.1, h + 0.1, 0.06, trimMat, 0, 0, 0, g);
    const glass = box(w, h, 0.02, new THREE.MeshBasicMaterial({
      color: 0x9ec2d4
    }), 0, 0, 0.02, g);
    glass.castShadow = false;
    house.add(g);
  }

  const floor = mesh(new THREE.PlaneGeometry(HOUSE + 0.4, HOUSE + 0.4), woodMat, HOUSE / 2, 0, HOUSE / 2);
  floor.rotation.x = -Math.PI / 2;
  const bathFloor = mesh(new THREE.PlaneGeometry(ROOM_SIZE - 0.2, ROOM_SIZE - 0.2), tileFloorMat, 12, 0.01, 12);
  bathFloor.rotation.x = -Math.PI / 2;
  const ceil = mesh(new THREE.PlaneGeometry(HOUSE + 0.4, HOUSE + 0.4), ceilingMat, HOUSE / 2, WALL_H, HOUSE / 2);
  ceil.rotation.x = Math.PI / 2;
  ceil.castShadow = false;

  wallAlongX(0, HOUSE, 0.08, [], plasterMat);
  wallAlongX(0, HOUSE, HOUSE - 0.08, [], roseMat);
  wallAlongZ(0, HOUSE, 0.08, [], plasterMat);
  wallAlongZ(0, HOUSE, HOUSE - 0.08, [], sageMat);
  wallAlongX(0, HOUSE, ROOM_SIZE, [4, 12], plasterMat);
  wallAlongZ(0, HOUSE, ROOM_SIZE, [4, 12], plasterMat);

  box(ROOM_SIZE - 0.4, 1.15, WALL_T * 0.4, tileWallMat, 12, 0.58, 8.08);

  windowPane(3.2, 1.7, 0.18, 1.6, 1.3, 0);
  windowPane(12.6, 1.7, 0.18, 1.5, 1.15, 0);
  windowPane(0.18, 1.7, 12.2, 1.4, 1.25, Math.PI / 2);
  windowPane(15.82, 1.55, 4.2, 1.1, 1.0, -Math.PI / 2);

  function rug(w, d, color, x, z) {
    box(w, 0.03, d, new THREE.MeshStandardMaterial({ color, roughness: 0.95 }), x, 0.025, z);
  }

  function sofa() {
    const g = new THREE.Group();
    box(2.4, 0.42, 0.92, new THREE.MeshStandardMaterial({ color: 0xc4b7a2, roughness: 0.85 }), 0, 0.32, 0, g);
    box(2.4, 0.55, 0.18, new THREE.MeshStandardMaterial({ color: 0xb7a48c, roughness: 0.85 }), 0, 0.72, -0.38, g);
    box(0.16, 0.38, 0.9, new THREE.MeshStandardMaterial({ color: 0xb7a48c, roughness: 0.85 }), -1.12, 0.55, 0.02, g);
    box(0.16, 0.38, 0.9, new THREE.MeshStandardMaterial({ color: 0xb7a48c, roughness: 0.85 }), 1.12, 0.55, 0.02, g);
    g.position.set(4.15, 0, 5.55);
    house.add(g);
  }

  function hearth() {
    box(0.42, 1.35, 1.7, new THREE.MeshStandardMaterial({ color: 0xe7dcc8, roughness: 0.9 }), 0.55, 0.68, 4);
    box(0.28, 0.72, 0.7, new THREE.MeshStandardMaterial({ color: 0x2a2724, roughness: 0.7, emissive: 0x3a2210, emissiveIntensity: 0.2 }), 0.62, 0.5, 4);
    box(0.5, 0.12, 1.9, plasterMat, 0.55, 1.38, 4);
  }

  function coffee() {
    box(1.05, 0.08, 0.62, new THREE.MeshStandardMaterial({ color: 0x6b3e22, roughness: 0.5 }), 4.1, 0.42, 4.35);
    box(0.08, 0.38, 0.08, trimMat, 3.7, 0.2, 4.12);
    box(0.08, 0.38, 0.08, trimMat, 4.5, 0.2, 4.12);
    box(0.08, 0.38, 0.08, trimMat, 3.7, 0.2, 4.58);
    box(0.08, 0.38, 0.08, trimMat, 4.5, 0.2, 4.58);
  }

  function plant(x, z) {
    box(0.22, 0.22, 0.22, new THREE.MeshStandardMaterial({ color: 0x8a4a32, roughness: 0.8 }), x, 0.16, z);
    mesh(new THREE.SphereGeometry(0.28, 16, 12), new THREE.MeshStandardMaterial({ color: 0x3f6b4e, roughness: 0.8 }), x, 0.52, z);
    mesh(new THREE.SphereGeometry(0.18, 12, 10), new THREE.MeshStandardMaterial({ color: 0x4f7d5a, roughness: 0.8 }), x + 0.12, 0.7, z - 0.05);
  }

  function art(x, y, z, rotY, w, h, color) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = rotY;
    box(w + 0.06, h + 0.06, 0.04, trimMat, 0, 0, 0, g);
    box(w, h, 0.03, new THREE.MeshStandardMaterial({ color, roughness: 0.6 }), 0, 0, 0.02, g);
    house.add(g);
  }

  rug(3.2, 2.4, 0x6d7a62, 4.1, 4.5);
  sofa();
  addCollider(2.8, 5.5, 5.0, 6.15);
  hearth();
  addCollider(0.2, 1.0, 3.1, 4.9);
  coffee();
  addCollider(3.5, 4.7, 3.95, 4.75);
  plant(1.3, 1.25);
  plant(6.7, 1.2);
  art(4.2, 1.85, 0.2, 0, 1.1, 0.75, 0xc9784a);
  box(1.6, 1.2, 0.32, trimMat, 6.6, 0.7, 1.1);
  box(0.08, 1.05, 0.28, new THREE.MeshStandardMaterial({ color: 0xe9e1d2 }), 6.6, 0.72, 1.1);

  function cabinets() {
    const sageCab = new THREE.MeshStandardMaterial({ color: 0x5d6f62, roughness: 0.55 });
    const stone = new THREE.MeshStandardMaterial({ color: 0xe6e1d8, roughness: 0.4 });
    box(4.6, 0.9, 0.62, sageCab, 12.2, 0.45, 0.55);
    box(4.6, 0.06, 0.68, stone, 12.2, 0.93, 0.55);
    box(0.62, 0.9, 3.4, sageCab, 15.25, 0.45, 2.4);
    box(0.68, 0.06, 3.4, stone, 15.25, 0.93, 2.4);
    box(1.7, 0.88, 0.9, sageCab, 12, 0.46, 4.15);
    box(1.82, 0.06, 1.02, new THREE.MeshStandardMaterial({ color: 0xc4a574, roughness: 0.45 }), 12, 0.94, 4.15);
    box(0.7, 1.85, 0.7, new THREE.MeshStandardMaterial({ color: 0x4a524c, roughness: 0.4, metalness: 0.2 }), 15.2, 0.93, 6.4);
    box(0.9, 0.08, 0.55, new THREE.MeshStandardMaterial({ color: 0x2b2b2b, roughness: 0.5 }), 10.4, 0.94, 0.55);
    mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.18, 16), brassMat, 12.55, 0.98, 0.55);
  }

  rug(2.2, 1.6, 0xead9c4, 10.4, 5.6);
  cabinets();
  addCollider(9.9, 14.5, 0.2, 0.95);
  addCollider(14.8, 15.7, 0.7, 4.2);
  addCollider(11.1, 12.9, 3.65, 4.7);
  addCollider(14.7, 15.7, 5.9, 6.9);
  box(1.2, 0.72, 1.2, new THREE.MeshStandardMaterial({ color: 0xeee6d8, roughness: 0.7 }), 9.6, 0.38, 6.4);
  box(0.08, 0.7, 0.08, trimMat, 9.15, 0.35, 5.95);
  box(0.08, 0.7, 0.08, trimMat, 10.05, 0.35, 5.95);
  box(0.08, 0.7, 0.08, trimMat, 9.15, 0.35, 6.85);
  box(0.08, 0.7, 0.08, trimMat, 10.05, 0.35, 6.85);

  function bed() {
    const linen = new THREE.MeshStandardMaterial({ color: 0xe8ddd2, roughness: 0.88 });
    const blush = new THREE.MeshStandardMaterial({ color: 0xc9a396, roughness: 0.88 });
    box(2.05, 0.38, 1.7, linen, 2.35, 0.32, 12);
    box(2.05, 0.16, 1.7, blush, 2.35, 0.54, 12);
    box(0.12, 0.95, 1.72, trimMat, 1.38, 0.55, 12);
    box(0.42, 0.18, 0.38, linen, 1.7, 0.72, 11.45);
    box(0.42, 0.18, 0.38, linen, 1.7, 0.72, 12.55);
    box(0.42, 0.48, 0.42, trimMat, 2.2, 0.28, 10.7);
    box(0.42, 0.48, 0.42, trimMat, 2.2, 0.28, 13.3);
    mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.42, 12), brassMat, 2.2, 0.78, 10.7);
    mesh(new THREE.SphereGeometry(0.1, 12, 10), new THREE.MeshStandardMaterial({ color: 0xf2e6c9, emissive: 0xe8d7a0, emissiveIntensity: 0.4 }), 2.2, 1.05, 10.7);
  }

  rug(2.8, 2.2, 0x8b6b58, 3.4, 12);
  bed();
  addCollider(1.3, 3.5, 11.1, 12.9);
  box(1.3, 0.85, 0.45, trimMat, 6.3, 0.45, 14.8);
  art(4.2, 1.8, 15.8, Math.PI, 0.9, 0.7, 0x5d6f62);
  plant(6.6, 9.3);

  function bathSet() {
    const porcelain = new THREE.MeshStandardMaterial({ color: 0xf4f1ea, roughness: 0.35 });
    box(1.7, 0.52, 0.82, porcelain, 10.2, 0.32, 13.45);
    box(1.5, 0.12, 0.62, new THREE.MeshStandardMaterial({ color: 0xd5e3e8, roughness: 0.2, metalness: 0.1, emissive: 0x9bb8c4, emissiveIntensity: 0.15 }), 10.2, 0.52, 13.45);
    box(1.1, 0.72, 0.48, sageMat, 13.7, 0.4, 8.55);
    box(1.1, 0.05, 0.52, new THREE.MeshStandardMaterial({ color: 0xe6e1d8, roughness: 0.4 }), 13.7, 0.78, 8.55);
    mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.12, 16), porcelain, 13.7, 0.86, 8.55);
    box(0.7, 0.42, 0.42, porcelain, 14.7, 0.24, 12.2);
    mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.12, 16), porcelain, 14.7, 0.52, 12.2);
    box(0.22, 0.7, 0.08, brassMat, 14.7, 0.85, 12.42);
    art(12, 1.7, 8.22, 0, 0.7, 0.9, 0xdfe6e8);
  }

  bathSet();
  addCollider(9.3, 11.1, 12.95, 13.95);
  addCollider(13.1, 14.3, 8.25, 8.9);
  addCollider(14.4, 15.1, 11.9, 12.5);

  scene.add(new THREE.HemisphereLight(0xfff3dd, 0x6a5a48, 0.72));
  const sun = new THREE.DirectionalLight(0xffe6c2, 0.85);
  sun.position.set(2, 8, -4);
  sun.castShadow = !coarse;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 28;
  sun.shadow.camera.left = -12;
  sun.shadow.camera.right = 12;
  sun.shadow.camera.top = 12;
  sun.shadow.camera.bottom = -12;
  scene.add(sun);

  function lamp(x, z, color, intensity) {
    const l = new THREE.PointLight(color, intensity, 11, 2);
    l.position.set(x, 2.72, z);
    if (!coarse) l.castShadow = false;
    scene.add(l);
    mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.06, 16), brassMat, x, WALL_H - 0.08, z);
  }

  lamp(4, 4, 0xffd8a8, 1.35);
  lamp(12, 4, 0xfff0d2, 1.4);
  lamp(4, 12, 0xffcfa0, 1.2);
  lamp(12, 12, 0xeef4ff, 1.25);

  let yaw = ROOMS.living.yaw;
  let pitch = -0.05;
  const keys = Object.create(null);
  const stick = { x: 0, z: 0 };
  let looking = false;
  let lastLook = null;
  let dragDist = 0;
  let currentRoom = "living";
  let tween = null;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  const hotspotRoot = document.getElementById("hotspots");
  const pinRoot = document.getElementById("pins");
  const hotspotEls = [];
  const pinEls = [];

  Object.keys(ROOMS).forEach((id) => {
    ROOMS[id].links.forEach((link) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "hotspot";
      btn.textContent = link.label;
      btn.addEventListener("click", (ev) => {
        ev.stopPropagation();
        goToRoom(link.to);
      });
      hotspotRoot.appendChild(btn);
      hotspotEls.push({ el: btn, link, from: id });
    });
  });

  PINS.forEach((pin, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pin";
    btn.setAttribute("aria-label", pin.title);
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      openPin(pin);
    });
    pinRoot.appendChild(btn);
    pinEls.push({ el: btn, pin, i });
  });

  function roomFromPosition(x, z) {
    const east = x >= ROOM_SIZE;
    const south = z >= ROOM_SIZE;
    if (!east && !south) return "living";
    if (east && !south) return "kitchen";
    if (!east && south) return "bedroom";
    return "bathroom";
  }

  function setRoomUi(id) {
    currentRoom = id;
    const room = ROOMS[id];
    document.getElementById("room-label").textContent = room.name;
    document.getElementById("room-blurb").textContent = room.blurb;
    document.querySelectorAll("[data-room]").forEach((el) => {
      el.classList.toggle("is-here", el.getAttribute("data-room") === id);
    });
  }

  function goToRoom(id) {
    const room = ROOMS[id];
    if (!room) return;
    const veil = document.getElementById("veil");
    veil.classList.add("on");
    const start = camera.position.clone();
    const end = new THREE.Vector3(room.x, EYE, room.z);
    const startYaw = yaw;
    let dyaw = room.yaw - startYaw;
    while (dyaw > Math.PI) dyaw -= Math.PI * 2;
    while (dyaw < -Math.PI) dyaw += Math.PI * 2;
    tween = {
      t: 0,
      dur: reduceMotion ? 0.01 : 0.85,
      start,
      end,
      startYaw,
      targetYaw: startYaw + dyaw
    };
    setRoomUi(id);
    window.setTimeout(() => veil.classList.remove("on"), reduceMotion ? 40 : 280);
  }

  function resolveMove(nx, nz) {
    let x = nx;
    let z = nz;
    x = Math.max(WALK_R + 0.12, Math.min(HOUSE - WALK_R - 0.12, x));
    z = Math.max(WALK_R + 0.12, Math.min(HOUSE - WALK_R - 0.12, z));
    colliders.forEach((c) => {
      const px = Math.max(c.minX, Math.min(x, c.maxX));
      const pz = Math.max(c.minZ, Math.min(z, c.maxZ));
      const dx = x - px;
      const dz = z - pz;
      const d2 = dx * dx + dz * dz;
      if (d2 < WALK_R * WALK_R) {
        const d = Math.sqrt(d2) || 0.0001;
        x = px + (dx / d) * WALK_R;
        z = pz + (dz / d) * WALK_R;
      }
    });
    return { x, z };
  }

  function applyLook() {
    pitch = Math.max(-1.15, Math.min(1.15, pitch));
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;
  }

  function onLookMove(dx, dy) {
    yaw -= dx * 0.0038;
    pitch -= dy * 0.0032;
    applyLook();
  }

  canvas.addEventListener("pointerdown", (ev) => {
    if (ev.button !== undefined && ev.button !== 0) return;
    looking = true;
    dragDist = 0;
    lastLook = { x: ev.clientX, y: ev.clientY };
    canvas.setPointerCapture(ev.pointerId);
  });
  canvas.addEventListener("pointermove", (ev) => {
    if (!looking || !lastLook) return;
    const dx = ev.clientX - lastLook.x;
    const dy = ev.clientY - lastLook.y;
    dragDist += Math.abs(dx) + Math.abs(dy);
    lastLook = { x: ev.clientX, y: ev.clientY };
    onLookMove(dx, dy);
  });
  function endLook(ev) {
    looking = false;
    lastLook = null;
    if (ev && canvas.hasPointerCapture(ev.pointerId)) canvas.releasePointerCapture(ev.pointerId);
  }
  canvas.addEventListener("pointerup", endLook);
  canvas.addEventListener("pointercancel", endLook);

  window.addEventListener("keydown", (ev) => {
    keys[ev.code] = true;
    if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(ev.code)) ev.preventDefault();
    if (ev.code === "Digit1") goToRoom("living");
    if (ev.code === "Digit2") goToRoom("kitchen");
    if (ev.code === "Digit3") goToRoom("bedroom");
    if (ev.code === "Digit4") goToRoom("bathroom");
  });
  window.addEventListener("keyup", (ev) => { keys[ev.code] = false; });

  const joy = document.getElementById("joystick");
  const knob = document.getElementById("joystick-knob");
  if (coarse) {
    joy.hidden = false;
    let joyId = null;
    function joyFrom(ev) {
      const r = joy.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      let dx = ev.clientX - cx;
      let dy = ev.clientY - cy;
      const max = 32;
      const mag = Math.hypot(dx, dy) || 1;
      if (mag > max) {
        dx = (dx / mag) * max;
        dy = (dy / mag) * max;
      }
      knob.style.transform = "translate(" + dx + "px," + dy + "px)";
      stick.x = dx / max;
      stick.z = dy / max;
    }
    joy.addEventListener("pointerdown", (ev) => {
      joyId = ev.pointerId;
      joy.setPointerCapture(ev.pointerId);
      joyFrom(ev);
    });
    joy.addEventListener("pointermove", (ev) => {
      if (joyId !== ev.pointerId) return;
      joyFrom(ev);
    });
    function joyEnd(ev) {
      if (joyId !== ev.pointerId) return;
      joyId = null;
      stick.x = 0;
      stick.z = 0;
      knob.style.transform = "";
    }
    joy.addEventListener("pointerup", joyEnd);
    joy.addEventListener("pointercancel", joyEnd);
  }

  document.querySelectorAll("[data-room]").forEach((el) => {
    el.addEventListener("click", () => goToRoom(el.getAttribute("data-room")));
  });

  const pinCard = document.getElementById("pin-card");
  function openPin(pin) {
    document.getElementById("pin-kicker").textContent = pin.kicker;
    document.getElementById("pin-title").textContent = pin.title;
    document.getElementById("pin-body").textContent = pin.body;
    pinCard.hidden = false;
  }
  document.getElementById("pin-close").addEventListener("click", () => { pinCard.hidden = true; });

  const help = document.getElementById("help");
  document.getElementById("btn-help").addEventListener("click", () => help.showModal());
  try {
    if (!sessionStorage.getItem("lumenstep-help")) {
      help.showModal();
      sessionStorage.setItem("lumenstep-help", "1");
    }
  } catch (err) {
    help.showModal();
  }

  const hint = document.getElementById("hint");
  window.setTimeout(() => hint.classList.add("is-gone"), 5200);

  function project(x, y, z) {
    const v = new THREE.Vector3(x, y, z).project(camera);
    const behind = v.z > 1;
    return {
      x: (v.x * 0.5 + 0.5) * window.innerWidth,
      y: (-v.y * 0.5 + 0.5) * window.innerHeight,
      visible: !behind && v.x > -1.15 && v.x < 1.15 && v.y > -1.2 && v.y < 1.2
    };
  }

  function updateOverlays() {
    const cam = camera.position;
    hotspotEls.forEach((item) => {
      const dx = item.link.x - cam.x;
      const dz = item.link.z - cam.z;
      const dist = Math.hypot(dx, dz);
      const near = dist < 4.8 && item.from === currentRoom && item.link.to !== currentRoom;
      const p = project(item.link.x, 1.35, item.link.z);
      const show = near && p.visible;
      item.el.style.display = show ? "flex" : "none";
      if (show) {
        item.el.style.left = p.x + "px";
        item.el.style.top = p.y + "px";
      }
    });
    pinEls.forEach((item) => {
      const pin = item.pin;
      const dist = Math.hypot(pin.x - cam.x, pin.z - cam.z);
      const p = project(pin.x, pin.y, pin.z);
      const show = dist < 5.2 && pin.room === currentRoom && p.visible;
      item.el.style.display = show ? "block" : "none";
      if (show) {
        item.el.style.left = p.x + "px";
        item.el.style.top = p.y + "px";
      }
    });
  }

  function tick() {
    const dt = Math.min(clock.getDelta(), 0.05);
    if (tween) {
      tween.t += dt;
      const u = Math.min(1, tween.t / tween.dur);
      const e = u * u * (3 - 2 * u);
      camera.position.lerpVectors(tween.start, tween.end, e);
      yaw = tween.startYaw + (tween.targetYaw - tween.startYaw) * e;
      pitch = pitch * (1 - e * 0.4);
      applyLook();
      if (u >= 1) {
        const stuck = resolveMove(tween.end.x, tween.end.z);
        camera.position.set(stuck.x, EYE, stuck.z);
        tween = null;
      }
    } else {
      let ix = stick.x;
      let iz = stick.z;
      if (keys.KeyW || keys.ArrowUp) iz -= 1;
      if (keys.KeyS || keys.ArrowDown) iz += 1;
      if (keys.KeyA || keys.ArrowLeft) ix -= 1;
      if (keys.KeyD || keys.ArrowRight) ix += 1;
      const mag = Math.hypot(ix, iz);
      if (mag > 0) {
        ix /= mag;
        iz /= mag;
        const sin = Math.sin(yaw);
        const cos = Math.cos(yaw);
        const wishX = ix * cos + iz * sin;
        const wishZ = -ix * sin + iz * cos;
        const next = resolveMove(
          camera.position.x + wishX * SPEED * dt,
          camera.position.z + wishZ * SPEED * dt
        );
        camera.position.x = next.x;
        camera.position.z = next.z;
        camera.position.y = EYE;
        const rid = roomFromPosition(camera.position.x, camera.position.z);
        if (rid !== currentRoom) setRoomUi(rid);
      }
    }
    updateOverlays();
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const hash = (window.location.hash || "").replace("#", "");
  const startRoom = ROOMS[hash] ? hash : "living";
  camera.position.set(ROOMS[startRoom].x, EYE, ROOMS[startRoom].z);
  yaw = ROOMS[startRoom].yaw;
  setRoomUi(startRoom);
  applyLook();
  requestAnimationFrame(tick);
  window.setTimeout(() => document.getElementById("loader").classList.add("is-done"), 180);
})();
