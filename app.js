import * as THREE from 'https://unpkg.com/three@0.161.0/build/three.module.js';

const pageData = {
  home: {
    title: 'Home — Escambia Amateur Astronomers Association',
    html: `
      <p><strong>Purpose:</strong> The EAAA is a member society of the Astronomical League.</p>
      <p>The Astronomical League's objective is to promote the science of astronomy by fostering education, supporting observation/research, and assisting communication among amateur societies.</p>
      <p><strong>What we do:</strong> monthly stargazes, community star parties, and monthly meetings focused on astronomy topics and astrophotography.</p>
      <p><strong>Contact:</strong> Club President Ed Magowan (edward_magowan@yahoo.com), Club Sponsor at PSC Lauren Rogers (lrogers@pensacolastate.edu).</p>
    `,
    label: 'Home'
  },
  about: {
    title: 'About — Membership',
    html: `
      <p><strong>Join Us!</strong> EAAA dues are $12/year and can be paid by cash or check at monthly meetings.</p>
      <p>Members are automatically members of the Astronomical League and receive a quarterly magazine, plus eligibility for observing clubs and awards.</p>
      <p><a href="https://www.astroleague.org/observing.html" target="_blank" rel="noreferrer">Astronomical League observing programs</a></p>
      <p>Members are also active in preserving dark skies and reducing light pollution via <a href="https://www.darksky.org" target="_blank" rel="noreferrer">DarkSky International</a>.</p>
    `,
    label: 'About'
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
    `,
    label: 'Calendar'
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
    `,
    label: 'Links'
  }
};

const root = document.getElementById('scene-root');
const labelsRoot = document.getElementById('labels');
const panelTitle = document.getElementById('panel-title');
const panelContent = document.getElementById('panel-content');

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
root.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x02040f);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 56, 130);
camera.lookAt(0, 0, 0);

const ambient = new THREE.AmbientLight(0x223355, 0.16);
scene.add(ambient);

const sunLight = new THREE.PointLight(0xffe6aa, 2.7, 1200, 1.4);
scene.add(sunLight);

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(10, 64, 64),
  new THREE.MeshBasicMaterial({ color: 0xffc04d })
);
scene.add(sun);

const corona = new THREE.Mesh(
  new THREE.SphereGeometry(11.5, 48, 48),
  new THREE.MeshBasicMaterial({ color: 0xffaa55, transparent: true, opacity: 0.2 })
);
scene.add(corona);

const starsGeo = new THREE.BufferGeometry();
const starCount = 2500;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  const r = 700 + Math.random() * 500;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
  starPos[i * 3 + 1] = r * Math.cos(phi);
  starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.8, sizeAttenuation: true })));

function createPlanet({ key, radius, distance, color, speed, ring = false, labelText }) {
  const pivot = new THREE.Object3D();
  scene.add(pivot);

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 48, 48),
    new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0.02 })
  );
  mesh.position.x = distance;
  mesh.userData.pageKey = key;
  mesh.userData.speed = speed;
  mesh.userData.distance = distance;
  mesh.userData.labelText = labelText;
  pivot.add(mesh);

  if (ring) {
    const ringMesh = new THREE.Mesh(
      new THREE.RingGeometry(radius * 1.35, radius * 2.1, 72),
      new THREE.MeshStandardMaterial({ color: 0xc9c2a3, side: THREE.DoubleSide, roughness: 1 })
    );
    ringMesh.rotation.x = Math.PI / 2.8;
    ringMesh.position.x = distance;
    pivot.add(ringMesh);
  }

  const orbit = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(
      [...Array(96)].map((_, i) => {
        const t = (i / 96) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(t) * distance, 0, Math.sin(t) * distance);
      })
    ),
    new THREE.LineBasicMaterial({ color: 0x25395f })
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
  createPlanet({ key: 'about', radius: 3.8, distance: 28, color: 0x3a73d9, speed: 0.007, labelText: 'About (Earth)' }),
  createPlanet({ key: 'calendar', radius: 5.4, distance: 49, color: 0xc8b17b, speed: 0.0045, ring: true, labelText: 'Calendar (Saturn)' }),
  createPlanet({ key: 'links', radius: 4.8, distance: 71, color: 0x3b73cc, speed: 0.0032, labelText: 'Links (Neptune)' })
];

function setPage(key) {
  const page = pageData[key];
  panelTitle.textContent = page.title;
  panelContent.innerHTML = page.html;
}
setPage('home');

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

window.addEventListener('pointerdown', (event) => {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const planetMeshes = [sun, ...planets.map((p) => p.mesh)];
  const hit = raycaster.intersectObjects(planetMeshes)[0];
  if (!hit) return;

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
    visible: p.z < 1
  };
}

const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta();
  sun.rotation.y += dt * 0.08;
  corona.scale.setScalar(1 + Math.sin(clock.elapsedTime * 2.4) * 0.02);

  planets.forEach((planet) => {
    planet.pivot.rotation.y += planet.speed;
    planet.mesh.rotation.y += 0.01;

    const screen = toScreenPosition(planet.mesh.getWorldPosition(new THREE.Vector3()));
    planet.labelEl.style.display = screen.visible ? 'block' : 'none';
    planet.labelEl.style.left = `${screen.x}px`;
    planet.labelEl.style.top = `${screen.y - 26}px`;
  });

  const sunScreen = toScreenPosition(sun.getWorldPosition(new THREE.Vector3()));
  sunLabel.style.display = sunScreen.visible ? 'block' : 'none';
  sunLabel.style.left = `${sunScreen.x}px`;
  sunLabel.style.top = `${sunScreen.y - 34}px`;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
