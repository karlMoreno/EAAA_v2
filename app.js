import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.161.0/examples/jsm/controls/OrbitControls.js';

const pageData = {
  home: {
    title: 'Home — Escambia Amateur Astronomers Association',
    html: `
      <p><strong>Purpose:</strong> The EAAA is a member society of the Astronomical League.</p>
      <p>The Astronomical League's objective is to promote the science of astronomy by fostering education, supporting observation/research, and assisting communication among amateur societies.</p>
      <p><strong>What we do:</strong> monthly stargazes, community star parties, and monthly meetings focused on astronomy topics and astrophotography.</p>
      <p><strong>Contact:</strong> Club President Ed Magowan (edward_magowan@yahoo.com), Club Sponsor at PSC Lauren Rogers (lrogers@pensacolastate.edu).</p>
    `
  },
  about: {
    title: 'About — Membership',
    html: `
      <p><strong>Join Us!</strong> EAAA dues are $12/year and can be paid by cash or check at monthly meetings.</p>
      <p>Members are automatically members of the Astronomical League and receive a quarterly magazine, plus eligibility for observing clubs and awards.</p>
      <p><a href="https://www.astroleague.org/observing.html" target="_blank" rel="noreferrer">Astronomical League observing programs</a></p>
      <p>Members are also active in preserving dark skies and reducing light pollution via <a href="https://www.darksky.org" target="_blank" rel="noreferrer">DarkSky International</a>.</p>
    `
  },
  calendar: {
    title: 'Calendar',
    html: `
      <p>Come check us out — all levels welcome, from beginner to expert.</p>
      <p><strong>Upcoming highlights:</strong></p>
      <ul>
        <li><strong>Annular Solar Eclipse of 2023</strong> with a ring-of-fire path across the Americas.</li>
        <li><strong>Total Solar Eclipse of 2024</strong> with path of totality mentions including Maine.</li>
      </ul>
      <p><strong>Past events:</strong> Community Outreach, Monthly Stargazes at Casino Beach, Friends and Fun, and the 2010 Lunar Eclipse.</p>
    `
  },
  links: {
    title: 'Links',
    html: `
      <p>Featured astronomy links from EAAA:</p>
      <ul>
        <li><a href="https://www.cleardarksky.com" target="_blank" rel="noreferrer">Pensacola Clear Sky Clock</a></li>
        <li><a href="https://rubinobservatory.org" target="_blank" rel="noreferrer">Rubin Investigations</a></li>
        <li><a href="https://eyes.nasa.gov" target="_blank" rel="noreferrer">NASA Eyes on the Solar System</a></li>
        <li><a href="https://www.heavens-above.com" target="_blank" rel="noreferrer">Heavens Above</a></li>
        <li><a href="https://webb.nasa.gov" target="_blank" rel="noreferrer">James Webb Space Telescope</a></li>
      </ul>
      <p>Share additional favorite space resources with lrogers@pensacolastate.edu for review.</p>
    `
  }
};

const root = document.getElementById('scene-root');
const labelsRoot = document.getElementById('labels');
const panel = document.getElementById('page-panel');
const panelTitle = document.getElementById('panel-title');
const panelContent = document.getElementById('panel-content');
const panelClose = document.getElementById('panel-close');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02040f);
scene.fog = new THREE.FogExp2(0x02040f, 0.00075);

const camera = new THREE.PerspectiveCamera(53, window.innerWidth / window.innerHeight, 0.1, 2500);
camera.position.set(0, 70, 170);
camera.lookAt(0, -6, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.22;
controls.minDistance = 70;
controls.maxDistance = 260;
controls.maxPolarAngle = Math.PI * 0.48;

const ambient = new THREE.AmbientLight(0x203050, 0.2);
scene.add(ambient);

const rimLight = new THREE.DirectionalLight(0x7da2ff, 0.38);
rimLight.position.set(-120, 80, -160);
scene.add(rimLight);

const sunLight = new THREE.PointLight(0xffe0a1, 42000, 1800, 2);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.bias = -0.0001;
scene.add(sunLight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(11.5, 96, 96),
  new THREE.MeshStandardMaterial({
    color: 0xffbb4f,
    emissive: 0xff9b2f,
    emissiveIntensity: 1.2,
    roughness: 0.78,
    metalness: 0
  })
);
sun.castShadow = false;
scene.add(sun);

const corona = new THREE.Mesh(
  new THREE.SphereGeometry(13.3, 56, 56),
  new THREE.MeshBasicMaterial({ color: 0xffb866, transparent: true, opacity: 0.23 })
);
scene.add(corona);

const dustDisk = new THREE.Mesh(
  new THREE.RingGeometry(16, 115, 128),
  new THREE.MeshStandardMaterial({
    color: 0x121c34,
    transparent: true,
    opacity: 0.33,
    side: THREE.DoubleSide,
    roughness: 1,
    metalness: 0
  })
);
dustDisk.rotation.x = -Math.PI / 2;
dustDisk.position.y = -13;
dustDisk.receiveShadow = true;
scene.add(dustDisk);

const starsGeo = new THREE.BufferGeometry();
const starCount = 3600;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 850 + Math.random() * 900;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPos[i * 3 + 1] = r * Math.cos(phi);
  starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(
  new THREE.Points(
    starsGeo,
    new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: true, transparent: true, opacity: 0.95 })
  )
);

function canvasTexture(draw) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  draw(ctx, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  texture.needsUpdate = true;
  return texture;
}

function earthTexture() {
  return canvasTexture((ctx, w, h) => {
    const ocean = ctx.createLinearGradient(0, 0, 0, h);
    ocean.addColorStop(0, '#4ea5ff');
    ocean.addColorStop(1, '#0b3f86');
    ctx.fillStyle = ocean;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#68ba63';
    for (let i = 0; i < 25; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const rw = 65 + Math.random() * 180;
      const rh = 24 + Math.random() * 80;
      ctx.beginPath();
      ctx.ellipse(x, y, rw, rh, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255,255,255,0.42)';
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      ctx.ellipse(Math.random() * w, Math.random() * h, 20 + Math.random() * 75, 4 + Math.random() * 22, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

function saturnTexture() {
  return canvasTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#dbc59c');
    g.addColorStop(1, '#9a7f56');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 28; i++) {
      ctx.fillStyle = `rgba(80,55,30,${0.08 + Math.random() * 0.12})`;
      const y = (i / 28) * h + (Math.random() - 0.5) * 10;
      ctx.fillRect(0, y, w, 10 + Math.random() * 18);
    }
  });
}

function neptuneTexture() {
  return canvasTexture((ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#5ab2ff');
    g.addColorStop(1, '#20419c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 34; i++) {
      ctx.fillStyle = `rgba(180,225,255,${0.05 + Math.random() * 0.1})`;
      const y = (i / 34) * h + (Math.random() - 0.5) * 8;
      ctx.fillRect(0, y, w, 8 + Math.random() * 14);
    }
  });
}

const planetTextures = {
  about: earthTexture(),
  calendar: saturnTexture(),
  links: neptuneTexture()
};

function createPlanet({ key, radius, distance, speed, labelText, ring = false, tilt = 0.15 }) {
  const pivot = new THREE.Object3D();
  scene.add(pivot);

  const material = new THREE.MeshStandardMaterial({
    map: planetTextures[key],
    roughness: 0.78,
    metalness: 0,
    bumpMap: planetTextures[key],
    bumpScale: 0.1,
    emissive: 0x12233f,
    emissiveIntensity: 0.18
  });

  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 96, 96), material);
  mesh.position.x = distance;
  mesh.rotation.z = tilt;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData.pageKey = key;
  pivot.add(mesh);

  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 1.04, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x86b7ff, transparent: true, opacity: key === 'about' ? 0.14 : 0.08 })
  );
  atmosphere.position.x = distance;
  pivot.add(atmosphere);

  if (ring) {
    const ringTex = canvasTexture((ctx, w, h) => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 300; i++) {
        const a = Math.random() * w;
        ctx.fillStyle = `rgba(230,220,190,${0.2 + Math.random() * 0.7})`;
        ctx.fillRect(a, 0, 1 + Math.random() * 3, h);
      }
    });

    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(radius * 1.55, radius * 2.9, 128),
      new THREE.MeshStandardMaterial({ map: ringTex, transparent: true, side: THREE.DoubleSide, roughness: 1, metalness: 0 })
    );
    ringMesh.rotation.x = Math.PI / 2.45;
    ringMesh.rotation.z = 0.28;
    ringMesh.position.x = distance;
    ringMesh.castShadow = true;
    ringMesh.receiveShadow = true;
    pivot.add(ringMesh);
  }

  const orbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      [...Array(128)].map((_, i) => {
        const t = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(t) * distance, 0, Math.sin(t) * distance);
      })
    ),
    new THREE.LineBasicMaterial({ color: 0x24406d, transparent: true, opacity: 0.65 })
  );
  scene.add(orbit);

  const labelEl = document.createElement('div');
  labelEl.className = 'planet-label';
  labelEl.innerHTML = `<strong>${labelText}</strong><span>${pageData[key].title}</span>`;
  labelsRoot.appendChild(labelEl);

  return { pivot, mesh, labelEl, speed };
}

const sunLabel = document.createElement('div');
sunLabel.className = 'planet-label';
sunLabel.innerHTML = `<strong>Home (Sun)</strong><span>${pageData.home.title}</span>`;
labelsRoot.appendChild(sunLabel);

const planets = [
  createPlanet({ key: 'about', radius: 7.2, distance: 48, speed: 0.0052, labelText: 'About (Earth)', tilt: 0.4 }),
  createPlanet({ key: 'calendar', radius: 9.1, distance: 84, speed: 0.0033, labelText: 'Calendar (Saturn)', ring: true, tilt: 0.2 }),
  createPlanet({ key: 'links', radius: 8.4, distance: 122, speed: 0.0025, labelText: 'Links (Neptune)', tilt: 0.3 })
];

const selectables = [sun, ...planets.map((planet) => planet.mesh)];

function setPage(key) {
  const page = pageData[key];
  panelTitle.textContent = page.title;
  panelContent.innerHTML = page.html;
  panel.classList.remove('hidden');
  panel.setAttribute('aria-hidden', 'false');
}

function hidePanel() {
  panel.classList.add('hidden');
  panel.setAttribute('aria-hidden', 'true');
}

panelClose.addEventListener('click', hidePanel);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener('pointerdown', (event) => {
  if (event.target.closest('#page-panel') || event.target.closest('#hud')) return;

  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const hit = raycaster.intersectObjects(selectables)[0];
  if (!hit) {
    hidePanel();
    return;
  }

  if (hit.object === sun) {
    setPage('home');
    return;
  }

  const key = hit.object.userData.pageKey;
  if (key) setPage(key);
});

function toScreenPosition(v3) {
  const p = v3.clone().project(camera);
  return {
    x: (p.x * 0.5 + 0.5) * window.innerWidth,
    y: (-p.y * 0.5 + 0.5) * window.innerHeight,
    visible: p.z < 1 && p.z > -1
  };
}

const _tmp = new THREE.Vector3();
const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  const dt = clock.getDelta();

  sun.rotation.y += dt * 0.11;
  sunLight.position.copy(sun.position);
  corona.scale.setScalar(1 + Math.sin(elapsed * 1.8) * 0.03);
  dustDisk.rotation.z += dt * 0.01;

  planets.forEach((planet, i) => {
    planet.pivot.rotation.y += planet.speed;
    planet.mesh.rotation.y += dt * (0.8 + i * 0.35);

    const worldPos = planet.mesh.getWorldPosition(_tmp);
    const screen = toScreenPosition(worldPos);
    planet.labelEl.style.display = screen.visible ? 'block' : 'none';
    planet.labelEl.style.left = `${screen.x}px`;
    planet.labelEl.style.top = `${screen.y - 30}px`;
  });

  const sunScreen = toScreenPosition(sun.getWorldPosition(_tmp));
  sunLabel.style.display = sunScreen.visible ? 'block' : 'none';
  sunLabel.style.left = `${sunScreen.x}px`;
  sunLabel.style.top = `${sunScreen.y - 40}px`;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
