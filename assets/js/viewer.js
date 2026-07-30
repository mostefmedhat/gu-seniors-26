/**
 * GU SENIORS '26 — drag-to-rotate jacket viewer.
 *
 * Loads assets/3d/jacket.glb into a transparent three.js canvas.
 * If the model is missing or fails to load, the section silently falls back
 * to a still photo — the page is never broken by a missing asset.
 */

import * as THREE from 'three';
import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MODEL_URL = 'assets/3d/jacket.glb';

const canvas   = document.getElementById('jacket-canvas');
const fallback = document.getElementById('showcase-fallback');
const hint     = document.getElementById('showcase-hint');

function useFallback(reason) {
  console.warn('[GU] 3D viewer disabled:', reason);
  if (canvas)   canvas.style.display = 'none';
  if (fallback) fallback.hidden = false;
  if (hint)     hint.style.display = 'none';
}

if (!canvas) {
  // nothing to do
} else if (!window.WebGLRenderingContext) {
  useFallback('no WebGL support');
} else {
  init();
}

function init() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true          // transparent background — the section shows through
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 4);

  // Soft studio lighting from an in-memory room — no external HDR to fetch.
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(2, 3, 4);
  scene.add(key);

  const rim = new THREE.DirectionalLight(0x6FE04A, 1.1);
  rim.position.set(-3, 1, -3);
  scene.add(rim);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.enableZoom = false;
  controls.enablePan  = false;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 1.6;
  // Keep the jacket upright — no flipping it upside down.
  controls.minPolarAngle = Math.PI * 0.28;
  controls.maxPolarAngle = Math.PI * 0.72;

  // Stop the idle spin once the visitor takes over.
  controls.addEventListener('start', () => { controls.autoRotate = false; });

  let loaded = null;

  new GLTFLoader().load(
    MODEL_URL,
    (gltf) => {
      const model = gltf.scene;

      // Centre on origin and normalise scale so any export framing works.
      const box    = new THREE.Box3().setFromObject(model);
      const size   = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());

      model.position.sub(centre);

      const maxDim = Math.max(size.x, size.y, size.z);
      if (maxDim > 0) model.scale.setScalar(2.0 / maxDim);

      scene.add(model);
      loaded = model;
      resize();
    },
    undefined,
    (err) => useFallback('could not load ' + MODEL_URL + ' — ' + err.message)
  );

  /**
   * Pulls the camera back far enough that the whole jacket fits.
   * A portrait canvas is narrower than it is tall, so the horizontal field of
   * view is the binding constraint — fit against whichever is tighter, or the
   * sleeves get cropped.
   */
  function frame() {
    if (!loaded) return;

    const sphere = new THREE.Box3()
      .setFromObject(loaded)
      .getBoundingSphere(new THREE.Sphere());

    const vFov = camera.fov * Math.PI / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const dist = (sphere.radius / Math.sin(Math.min(vFov, hFov) / 2)) * 1.12;

    camera.position.set(0, 0, dist);
    camera.near = Math.max(dist / 100, 0.01);
    camera.far  = dist * 10;
    camera.updateProjectionMatrix();

    controls.target.copy(sphere.center);
    controls.minDistance = controls.maxDistance = dist;
    controls.update();
  }

  function resize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frame();
  }

  new ResizeObserver(resize).observe(canvas);
  resize();

  // Pause rendering when the section is off-screen — saves battery on phones.
  let visible = true;
  new IntersectionObserver(
    ([entry]) => { visible = entry.isIntersecting; },
    { threshold: 0 }
  ).observe(canvas);

  renderer.setAnimationLoop(() => {
    // Skip work while off-screen, or while a still photo is showing instead.
    if (!visible || canvas.hidden) return;
    controls.update();
    renderer.render(scene, camera);
  });
}
