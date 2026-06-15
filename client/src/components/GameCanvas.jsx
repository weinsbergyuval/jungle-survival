import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ARENA = 34; // half-size of the playable square
const PLAYER_R = 0.5;
const MOVE_SPEED = 8;
const LOOK_SENS = 0.0022;
const PITCH_MIN = -0.5;
const PITCH_MAX = 0.55;
const CAM_DIST = 4.6;
const CAM_HEIGHT = 2.1;
const SHOULDER = 1.25;
const AIM_DIST = 14; // how far ahead the camera (and crosshair) looks

const PLAYER_MAX_HP = 100;
const MAG_SIZE = 12;
const FIRE_DELAY = 0.13;
const RELOAD_TIME = 1.1;
const SHOT_DAMAGE = 20;
const HUD_INTERVAL = 0.08;
const INTERMISSION = 3;

const SKIN = 0xf1c49a;

const MONSTER_TYPES = {
  grub: { color: 0x6fbf3f, hp: 30, speed: 2.3, attack: 6, points: 10, scale: 1 },
  brute: { color: 0x8e63d6, hp: 70, speed: 1.6, attack: 13, points: 25, scale: 1.5 },
  zippy: { color: 0xf2933c, hp: 16, speed: 3.8, attack: 5, points: 15, scale: 0.75 },
};

function buildCharacter(character, weapon) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color: character.color, roughness: 0.85 });
  const accentMat = new THREE.MeshStandardMaterial({ color: character.accent, roughness: 0.85 });
  const legsMat = new THREE.MeshStandardMaterial({ color: character.legs, roughness: 0.85 });
  const skinMat = new THREE.MeshStandardMaterial({ color: SKIN, roughness: 0.7 });

  const legGeo = new THREE.BoxGeometry(0.26, 0.7, 0.26);
  const legL = new THREE.Mesh(legGeo, legsMat);
  legL.position.set(-0.17, 0.35, 0);
  const legR = legL.clone();
  legR.position.x = 0.17;

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.42), bodyMat);
  body.position.y = 1.05;

  const armGeo = new THREE.BoxGeometry(0.17, 0.66, 0.17);
  const armL = new THREE.Mesh(armGeo, accentMat);
  armL.position.set(-0.45, 1.06, 0);
  // right arm extended forward, holding the weapon
  const armR = new THREE.Mesh(armGeo, accentMat);
  armR.position.set(0.4, 1.04, 0.34);
  armR.rotation.x = Math.PI / 2.2;

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.31, 20, 20), skinMat);
  head.position.y = 1.74;

  g.add(legL, legR, body, armL, armR, head);

  if (character.id === 'finn') {
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x5b3a22, roughness: 0.9 });
    const curlGeo = new THREE.SphereGeometry(0.16, 10, 10);
    [
      [0, 2.0, 0], [-0.2, 1.95, 0.05], [0.2, 1.95, 0.05], [-0.16, 1.9, -0.18],
      [0.16, 1.9, -0.18], [0, 1.92, -0.22], [-0.26, 1.82, -0.02], [0.26, 1.82, -0.02],
    ].forEach((p) => {
      const c = new THREE.Mesh(curlGeo, hairMat);
      c.position.set(...p);
      g.add(c);
    });
  } else if (character.id === 'luna') {
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x7a4a24, roughness: 0.9 });
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.33, 20, 20), hairMat);
    cap.position.set(0, 1.78, -0.04);
    cap.scale.set(1, 0.9, 1);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.16), hairMat);
    back.position.set(0, 1.45, -0.2);
    g.add(cap, back);
  } else if (character.id === 'pip') {
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xc2a24a, roughness: 0.8 });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.06, 20), hatMat);
    brim.position.y = 1.98;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.33, 0.32, 20), hatMat);
    crown.position.y = 2.13;
    g.add(brim, crown);
  }

  const wMat = new THREE.MeshStandardMaterial({ color: weapon.color, roughness: 0.5, metalness: 0.2 });
  const wDark = new THREE.MeshStandardMaterial({ color: 0x2b2f34, roughness: 0.6, metalness: 0.3 });
  const gun = new THREE.Group();
  const gunBody = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.22, 0.8), wMat);
  const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.5), wMat);
  barrel.position.z = 0.62;
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.34, 0.18), wDark);
  grip.position.set(0, -0.22, -0.18);
  const muzzle = new THREE.Object3D();
  muzzle.position.z = 0.9;
  gun.add(gunBody, barrel, grip, muzzle);
  gun.position.set(0.4, 0.96, 0.62);
  g.add(gun);
  g.userData.muzzle = muzzle;
  return g;
}

function buildMonster(type, wave) {
  const def = MONSTER_TYPES[type];
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: def.color, roughness: 0.8 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), mat);
  body.position.y = 0.55;
  body.scale.set(1, 0.9, 1);

  const eyeGeo = new THREE.SphereGeometry(0.1, 10, 10);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.16, 0.66, 0.42);
  const eyeR = eyeL.clone();
  eyeR.position.x = 0.16;
  const pupGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const pupL = new THREE.Mesh(pupGeo, dark);
  pupL.position.set(-0.16, 0.66, 0.5);
  const pupR = pupL.clone();
  pupR.position.x = 0.16;

  // little teeth + horns to look menacing
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.24, 8), dark);
  horn.position.set(-0.18, 0.98, 0);
  const horn2 = horn.clone();
  horn2.position.x = 0.18;

  const footGeo = new THREE.BoxGeometry(0.16, 0.18, 0.2);
  const footL = new THREE.Mesh(footGeo, dark);
  footL.position.set(-0.2, 0.09, 0.1);
  const footR = footL.clone();
  footR.position.x = 0.2;

  g.add(body, eyeL, eyeR, pupL, pupR, horn, horn2, footL, footR);
  g.scale.setScalar(def.scale);

  const hp = Math.round(def.hp * (1 + (wave - 1) * 0.12));
  return {
    mesh: g,
    type,
    hp,
    maxHp: hp,
    speed: def.speed,
    attack: def.attack,
    points: def.points,
    r: 0.5 * def.scale,
    attackCd: 0,
    alive: true,
    bob: Math.random() * Math.PI * 2,
  };
}

export default function GameCanvas({ character, weapon, onLockChange, onHud, onGameOver }) {
  const mountRef = useRef(null);
  // cbRef lets the game loop call the latest React callbacks without being stale closures.
  const cbRef = useRef({ onLockChange, onHud, onGameOver });
  cbRef.current = { onLockChange, onHud, onGameOver };

  // One big useEffect = one game session. Everything (scene, renderer, events) is created
  // on mount and fully torn down on unmount. We never trigger React re-renders from inside
  // the loop — that would reset state and kill performance. Instead we mutate a plain `state`
  // object every frame and push HUD snapshots to React on a timer via onHud().
  useEffect(() => {
    const mount = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x8ecbf0);
    scene.fog = new THREE.Fog(0x8ecbf0, 40, 80);

    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 200);

    scene.add(new THREE.HemisphereLight(0xbfe7ff, 0x4f7a3a, 1.0));
    const sun = new THREE.DirectionalLight(0xfff2cc, 1.4);
    sun.position.set(20, 40, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -50, right: 50, top: 50, bottom: -50 });
    scene.add(sun);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(90, 90),
      new THREE.MeshStandardMaterial({ color: 0x6fb73a, roughness: 1 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    for (let i = 0; i < 26; i++) {
      const patch = new THREE.Mesh(
        new THREE.CircleGeometry(1.5 + Math.random() * 2.5, 12),
        new THREE.MeshStandardMaterial({ color: 0x5fa32e, roughness: 1 })
      );
      patch.rotation.x = -Math.PI / 2;
      patch.position.set((Math.random() - 0.5) * 70, 0.01, (Math.random() - 0.5) * 70);
      scene.add(patch);
    }

    const obstacles = [];
    const addProp = (o) => {
      o.mesh.traverse((m) => {
        if (m.isMesh) m.castShadow = true;
      });
      scene.add(o.mesh);
      obstacles.push(o);
    };
    const buildTree = (x, z) => {
      const g = new THREE.Group();
      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.3, 2.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x7a4a24, roughness: 1 })
      );
      trunk.position.y = 1.1;
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x4fa33a, roughness: 1 });
      const f1 = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 12), leafMat);
      f1.position.y = 2.6;
      const f2 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 12, 12), leafMat);
      f2.position.set(0.6, 3.1, 0.2);
      const f3 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), leafMat);
      f3.position.set(-0.5, 3.0, -0.2);
      g.add(trunk, f1, f2, f3);
      g.position.set(x, 0, z);
      return { mesh: g, x, z, r: 0.6 };
    };
    const buildRock = (x, z) => {
      const rock = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.7, 0),
        new THREE.MeshStandardMaterial({ color: 0x8a8f98, roughness: 1, flatShading: true })
      );
      rock.position.set(x, 0.35, z);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      return { mesh: rock, x, z, r: 0.8 };
    };
    const buildCrate = (x, z) => {
      const crate = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 1.1, 1.1),
        new THREE.MeshStandardMaterial({ color: 0xc58a4a, roughness: 0.9 })
      );
      crate.position.set(x, 0.55, z);
      crate.rotation.y = Math.random() * Math.PI;
      return { mesh: crate, x, z, r: 0.85 };
    };

    let placed = 0;
    while (placed < 30) {
      const x = (Math.random() - 0.5) * (ARENA * 2 - 4);
      const z = (Math.random() - 0.5) * (ARENA * 2 - 4);
      if (Math.hypot(x, z) <= 7) continue;
      const roll = Math.random();
      addProp(roll < 0.5 ? buildTree(x, z) : roll < 0.8 ? buildRock(x, z) : buildCrate(x, z));
      placed++;
    }
    for (let a = 0; a < Math.PI * 2; a += 0.32) {
      addProp(buildTree(Math.cos(a) * (ARENA + 1.5), Math.sin(a) * (ARENA + 1.5)));
    }

    // Med kits scattered around — walk over one to heal, then it respawns.
    const medkits = [];
    const makeMedkit = (x, z) => {
      const g = new THREE.Group();
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.4, 0.5),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
      );
      box.position.y = 0.25;
      const crossMat = new THREE.MeshStandardMaterial({ color: 0xe24b4a });
      const cross1 = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 0.12), crossMat);
      cross1.position.y = 0.46;
      const cross2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.34), crossMat);
      cross2.position.y = 0.46;
      g.add(box, cross1, cross2);
      g.traverse((m) => {
        if (m.isMesh) m.castShadow = true;
      });
      g.position.set(x, 0, z);
      scene.add(g);
      return { mesh: g, x, z, active: true, respawn: 0 };
    };
    for (let i = 0; i < 7; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * (ARENA * 2 - 8);
        z = (Math.random() - 0.5) * (ARENA * 2 - 8);
      } while (Math.hypot(x, z) < 5);
      medkits.push(makeMedkit(x, z));
    }

    const player = buildCharacter(character, weapon);
    player.traverse((m) => {
      if (m.isMesh) m.castShadow = true;
    });
    scene.add(player);
    const muzzle = player.userData.muzzle;

    // Tracer + muzzle flash + particle pools
    const flash = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 8, 8),
      new THREE.MeshBasicMaterial({ color: weapon.color })
    );
    flash.visible = false;
    scene.add(flash);

    const effects = []; // { obj, life, max, fade }
    const spawnTracer = (from, to) => {
      const geo = new THREE.BufferGeometry().setFromPoints([from, to]);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: weapon.color, transparent: true }));
      scene.add(line);
      effects.push({ obj: line, life: 0.06, max: 0.06, fade: true });
    };
    const spawnBurst = (pos, color, count = 16) => {
      const geo = new THREE.BufferGeometry();
      const arr = new Float32Array(count * 3);
      const vel = [];
      for (let i = 0; i < count; i++) {
        arr.set([pos.x, pos.y, pos.z], i * 3);
        vel.push(new THREE.Vector3((Math.random() - 0.5) * 4, Math.random() * 4, (Math.random() - 0.5) * 4));
      }
      geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color, size: 0.18, transparent: true }));
      scene.add(pts);
      effects.push({ obj: pts, life: 0.7, max: 0.7, fade: true, vel });
    };

    const monsters = [];
    // Plain mutable object, NOT React state. React state would cause re-renders that reset
    // the loop. We read and write this directly inside requestAnimationFrame every frame.
    const state = {
      pos: new THREE.Vector3(0, 0, 0),
      yaw: 0,
      pitch: -0.08,
      keys: new Set(),
      locked: false,
      firing: false,
      hp: PLAYER_MAX_HP,
      ammo: MAG_SIZE,
      reloading: false,
      reloadTimer: 0,
      fireCd: 0,
      wave: 0,
      score: 0,
      kills: 0,
      intermission: 0,
      gameOver: false,
      hudTimer: 0,
    };
    window.__jungle = state;

    function spawnWave(n) {
      state.wave = n;
      const count = 4 + n * 2;
      for (let i = 0; i < count; i++) {
        let type = 'grub';
        const roll = Math.random();
        if (n >= 3 && roll < 0.2) type = 'brute';
        else if (roll < 0.35) type = 'zippy';
        const m = buildMonster(type, n);
        const a = Math.random() * Math.PI * 2;
        const rad = ARENA - 2 - Math.random() * 6;
        m.mesh.position.set(Math.cos(a) * rad, 0, Math.sin(a) * rad);
        m.mesh.traverse((x) => {
          if (x.isMesh) x.castShadow = true;
        });
        m.mesh.userData.monster = m;
        scene.add(m.mesh);
        monsters.push(m);
      }
    }
    // Wave 1 spawns on first pointer lock so monsters charge the instant the player clicks in.

    const raycaster = new THREE.Raycaster();
    const centerNDC = new THREE.Vector2(0, 0); // NDC (0,0) = exact screen center = crosshair
    const muzzleWorld = new THREE.Vector3();

    // Hitscan: cast a ray from the camera through the crosshair. Whatever monster mesh the
    // ray hits first takes damage instantly — no bullet projectile travels through the air.
    // This is how most fast-paced shooters (Valorant, CS, Fortnite) handle gunfire.
    function fire() {
      if (state.gameOver || state.reloading || state.fireCd > 0) return;
      if (state.ammo <= 0) {
        startReload();
        return;
      }
      state.ammo--;
      state.fireCd = FIRE_DELAY;

      raycaster.setFromCamera(centerNDC, camera);
      const hits = raycaster.intersectObjects(
        monsters.filter((m) => m.alive).map((m) => m.mesh),
        true
      );
      muzzle.getWorldPosition(muzzleWorld);
      flash.position.copy(muzzleWorld);
      flash.visible = true;
      effects.push({ obj: flash, life: 0.05, max: 0.05, hideOnly: true });

      let end;
      if (hits.length) {
        end = hits[0].point.clone();
        let node = hits[0].object;
        while (node && !node.userData.monster) node = node.parent;
        const m = node?.userData.monster;
        if (m && m.alive) {
          m.hp -= SHOT_DAMAGE;
          spawnBurst(end, MONSTER_TYPES[m.type].color, 10);
          if (m.hp <= 0) {
            m.alive = false;
            state.score += m.points;
            state.kills++;
            spawnBurst(m.mesh.position.clone().setY(0.6), MONSTER_TYPES[m.type].color, 22);
            scene.remove(m.mesh);
          }
        }
      } else {
        raycaster.ray.at(60, (end = new THREE.Vector3()));
      }
      spawnTracer(muzzleWorld.clone(), end);
    }

    function startReload() {
      if (state.reloading || state.ammo === MAG_SIZE) return;
      state.reloading = true;
      state.reloadTimer = RELOAD_TIME;
    }

    function onKeyDown(e) {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(k)) {
        state.keys.add(k);
        e.preventDefault();
      } else if (k === 'r') {
        startReload();
      }
    }
    function onKeyUp(e) {
      state.keys.delete(e.key.toLowerCase());
    }
    function onMouseMove(e) {
      if (!state.locked) return;
      state.yaw -= e.movementX * LOOK_SENS;
      state.pitch -= e.movementY * LOOK_SENS;
      state.pitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, state.pitch));
    }
    function onMouseDown(e) {
      if (e.button === 0 && state.locked) state.firing = true;
    }
    function onMouseUp(e) {
      if (e.button === 0) state.firing = false;
    }
    function onCanvasClick() {
      if (!state.locked && !state.gameOver) renderer.domElement.requestPointerLock?.();
    }
    let waveStarted = false;
    function onLockChangeEvt() {
      state.locked = document.pointerLockElement === renderer.domElement;
      if (!state.locked) state.firing = false;
      if (state.locked && !waveStarted) {
        waveStarted = true;
        spawnWave(1);
      }
      cbRef.current.onLockChange?.(state.locked);
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('click', onCanvasClick);
    document.addEventListener('pointerlockchange', onLockChangeEvt);

    function onResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    const pushHud = () =>
      cbRef.current.onHud?.({
        hp: Math.max(0, Math.round(state.hp)),
        maxHp: PLAYER_MAX_HP,
        wave: state.wave,
        score: state.score,
        kills: state.kills,
        ammo: state.ammo,
        maxAmmo: MAG_SIZE,
        reloading: state.reloading,
        intermission: Math.ceil(state.intermission),
      });
    pushHud();

    const clock = new THREE.Clock();
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    const move = new THREE.Vector3();
    const camOffset = new THREE.Vector3();
    const lookAt = new THREE.Vector3();
    const toPlayer = new THREE.Vector3();
    let raf;

    function animate() {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      if (!state.gameOver && state.locked) {
        // --- player movement ---
        // yaw is the horizontal look angle (in radians, changed by mouse X movement).
        // forward/right are 3D vectors derived from yaw so W always moves where you face,
        // and A/D strafe perpendicular to that regardless of where you're looking.
        forward.set(Math.sin(state.yaw), 0, Math.cos(state.yaw));
        right.set(-Math.cos(state.yaw), 0, Math.sin(state.yaw));
        move.set(0, 0, 0);
        if (state.keys.has('w')) move.add(forward);
        if (state.keys.has('s')) move.sub(forward);
        if (state.keys.has('d')) move.add(right);
        if (state.keys.has('a')) move.sub(right);
        if (move.lengthSq() > 0) {
          move.normalize().multiplyScalar(MOVE_SPEED * dt);
          state.pos.add(move);
        }
        state.pos.x = Math.max(-ARENA, Math.min(ARENA, state.pos.x));
        state.pos.z = Math.max(-ARENA, Math.min(ARENA, state.pos.z));
        for (const o of obstacles) {
          const dx = state.pos.x - o.x;
          const dz = state.pos.z - o.z;
          const d = Math.hypot(dx, dz);
          const minD = PLAYER_R + o.r;
          if (d < minD && d > 0.0001) {
            const push = (minD - d) / d;
            state.pos.x += dx * push;
            state.pos.z += dz * push;
          }
        }
        player.position.set(state.pos.x, 0, state.pos.z);
        player.rotation.y = state.yaw;

        // --- med kit pickups ---
        for (const kit of medkits) {
          if (kit.active) {
            kit.mesh.rotation.y += dt * 1.5;
            kit.mesh.position.y = 0.12 + Math.sin(t * 3 + kit.x) * 0.08;
            if (state.hp < PLAYER_MAX_HP && Math.hypot(state.pos.x - kit.x, state.pos.z - kit.z) < 1.3) {
              state.hp = Math.min(PLAYER_MAX_HP, state.hp + 30);
              kit.active = false;
              kit.mesh.visible = false;
              kit.respawn = 18;
              spawnBurst(new THREE.Vector3(kit.x, 0.6, kit.z), 0x5fbf3f, 16);
            }
          } else {
            kit.respawn -= dt;
            if (kit.respawn <= 0) {
              kit.active = true;
              kit.mesh.visible = true;
            }
          }
        }

        // --- shooting + reload ---
        if (state.fireCd > 0) state.fireCd -= dt;
        if (state.reloading) {
          state.reloadTimer -= dt;
          if (state.reloadTimer <= 0) {
            state.reloading = false;
            state.ammo = MAG_SIZE;
          }
        }
        if (state.firing) fire();

        // --- monsters ---
        // Simple chase AI: each monster normalizes the vector toward the player, moves along
        // it by speed*dt units, then attacks if close enough and cooldown has expired.
        for (const m of monsters) {
          if (!m.alive) continue;
          m.attackCd -= dt;
          toPlayer.set(state.pos.x - m.mesh.position.x, 0, state.pos.z - m.mesh.position.z);
          const dist = toPlayer.length();
          if (dist > 0.001) toPlayer.divideScalar(dist); // normalize without creating a new Vector3
          const reach = m.r + PLAYER_R + 0.3;
          if (dist > reach) {
            m.mesh.position.x += toPlayer.x * m.speed * dt;
            m.mesh.position.z += toPlayer.z * m.speed * dt;
          } else if (m.attackCd <= 0) {
            state.hp -= m.attack;
            m.attackCd = 0.8;
            if (state.hp <= 0) {
              state.hp = 0;
              state.gameOver = true;
              state.firing = false;
              if (document.pointerLockElement) document.exitPointerLock?.();
              cbRef.current.onGameOver?.({ score: state.score, wave: state.wave, kills: state.kills });
            }
          }
          // Push overlapping monsters apart so they spread into a ring instead of stacking.
          for (const o of monsters) {
            if (o === m || !o.alive) continue;
            const sx = m.mesh.position.x - o.mesh.position.x;
            const sz = m.mesh.position.z - o.mesh.position.z;
            const sd = Math.hypot(sx, sz);
            const md = m.r + o.r;
            if (sd < md && sd > 0.0001) {
              const p = ((md - sd) / sd) * 0.5;
              m.mesh.position.x += sx * p;
              m.mesh.position.z += sz * p;
            }
          }
          m.mesh.rotation.y = Math.atan2(toPlayer.x, toPlayer.z);
          m.mesh.position.y = Math.abs(Math.sin(t * 6 + m.bob)) * 0.12;
        }

        // remove dead from array
        for (let i = monsters.length - 1; i >= 0; i--) {
          if (!monsters[i].alive) monsters.splice(i, 1);
        }

        // --- wave flow ---
        if (monsters.length === 0) {
          if (state.intermission <= 0) state.intermission = INTERMISSION;
          state.intermission -= dt;
          if (state.intermission <= 0) {
            state.intermission = 0;
            spawnWave(state.wave + 1);
          }
        }

        // --- HUD ---
        state.hudTimer -= dt;
        if (state.hudTimer <= 0) {
          state.hudTimer = HUD_INTERVAL;
          pushHud();
        }
      }

      // --- effects update (runs even on game over so bursts finish) ---
      for (let i = effects.length - 1; i >= 0; i--) {
        const fx = effects[i];
        fx.life -= dt;
        if (fx.life <= 0) {
          if (fx.hideOnly) fx.obj.visible = false;
          else {
            scene.remove(fx.obj);
            fx.obj.geometry?.dispose();
            fx.obj.material?.dispose();
          }
          effects.splice(i, 1);
          continue;
        }
        if (fx.vel) {
          const p = fx.obj.geometry.attributes.position;
          for (let j = 0; j < fx.vel.length; j++) {
            fx.vel[j].y -= 6 * dt;
            p.setXYZ(j, p.getX(j) + fx.vel[j].x * dt, Math.max(0.05, p.getY(j) + fx.vel[j].y * dt), p.getZ(j) + fx.vel[j].z * dt);
          }
          p.needsUpdate = true;
        }
        if (fx.fade && fx.obj.material) fx.obj.material.opacity = fx.life / fx.max;
      }

      // --- camera (third-person over-the-shoulder) ---
      // `look` is the unit vector the camera faces, derived from yaw + pitch.
      // The camera sits CAM_DIST units *behind* the player and SHOULDER units to the right.
      // It stares AIM_DIST units ahead so the crosshair aligns with where the gun points.
      const cp = Math.cos(state.pitch);
      const look = new THREE.Vector3(Math.sin(state.yaw) * cp, Math.sin(state.pitch), Math.cos(state.yaw) * cp);
      camOffset.copy(look).multiplyScalar(-CAM_DIST).add(right.clone().multiplyScalar(SHOULDER));
      camera.position.set(state.pos.x + camOffset.x, CAM_HEIGHT + camOffset.y, state.pos.z + camOffset.z);
      lookAt.set(state.pos.x + look.x * AIM_DIST, CAM_HEIGHT + look.y * AIM_DIST, state.pos.z + look.z * AIM_DIST);
      camera.lookAt(lookAt);

      renderer.render(scene, camera);
    }
    animate();

    // Cleanup runs when the component unmounts (game over → Play Again, or navigating away).
    // Removing event listeners and cancelling the animation frame prevents zombie loops
    // and stacked duplicate listeners from a second mount.
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('pointerlockchange', onLockChangeEvt);
      window.removeEventListener('resize', onResize);
      if (document.pointerLockElement) document.exitPointerLock?.();
      delete window.__jungle;
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [character, weapon]);

  return <div ref={mountRef} className="fixed inset-0 z-0" />;
}
