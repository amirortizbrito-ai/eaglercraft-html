// Main game loop
let scene, camera, renderer, world, player;
let lastTime = Date.now();
let frameCount = 0;

function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 100, 200);

    // Camera setup
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 10, 0);

    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;
    scene.add(directionalLight);

    // World and Player setup
    world = new World(scene, 64);
    player = new Player(camera, world);

    // Window resize handler
    window.addEventListener('resize', onWindowResize);

    // Start game loop
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Update player
    player.update();

    // Update HUD
    updateHUD();

    // Render
    renderer.render(scene, camera);
}

function updateHUD() {
    const now = Date.now();
    frameCount++;

    if (now - lastTime >= 1000) {
        document.getElementById('fps').textContent = `FPS: ${frameCount}`;
        frameCount = 0;
        lastTime = now;
    }

    // Update coordinates
    const pos = player.camera.position;
    document.getElementById('coordinates').textContent =
        `X: ${pos.x.toFixed(1)} Y: ${pos.y.toFixed(1)} Z: ${pos.z.toFixed(1)}`;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the game
window.addEventListener('load', init);