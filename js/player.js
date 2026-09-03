// Player controller and physics
class Player {
    constructor(camera, world) {
        this.camera = camera;
        this.world = world;
        this.camera.position.set(0, 10, 0);

        this.velocity = new THREE.Vector3();
        this.speed = 0.3;
        this.jumpForce = 0.8;
        this.gravity = 0.02;

        this.keys = {};
        this.isJumping = false;
        this.onGround = false;

        this.selectedBlockType = BLOCK_TYPES.STONE;

        this.setupControls();
    }

    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });

        document.addEventListener('click', () => {
            this.breakBlock();
        });

        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.placeBlock();
        });

        // Lock pointer on click
        document.addEventListener('click', () => {
            document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
            document.body.requestPointerLock();
        });

        document.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement === document.body) {
                this.camera.rotation.order = 'YXZ';
                this.camera.rotation.y -= e.movementX * 0.005;
                this.camera.rotation.x -= e.movementY * 0.005;

                // Clamp pitch
                this.camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.camera.rotation.x));
            }
        });
    }

    breakBlock() {
        const raycaster = new THREE.Raycaster(this.camera.position, this.camera.getWorldDirection(new THREE.Vector3()));
        const intersects = raycaster.intersectObjects(this.world.scene.children);

        for (let intersection of intersects) {
            const pos = intersection.object.position;
            this.world.removeBlock(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z));
            break;
        }
    }

    placeBlock() {
        const raycaster = new THREE.Raycaster(this.camera.position, this.camera.getWorldDirection(new THREE.Vector3()));
        const intersects = raycaster.intersectObjects(this.world.scene.children);

        for (let intersection of intersects) {
            const normal = intersection.face.normal;
            const pos = intersection.object.position.clone();

            // Offset to adjacent block
            pos.add(normal);

            this.world.setBlock(Math.round(pos.x), Math.round(pos.y), Math.round(pos.z), this.selectedBlockType);
            break;
        }
    }

    update() {
        // Movement
        const forward = new THREE.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new THREE.Vector3();
        right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

        if (this.keys['w']) this.velocity.add(forward.multiplyScalar(this.speed));
        if (this.keys['s']) this.velocity.sub(forward.multiplyScalar(this.speed));
        if (this.keys['a']) this.velocity.sub(right.multiplyScalar(this.speed));
        if (this.keys['d']) this.velocity.add(right.multiplyScalar(this.speed));

        // Jumping
        if (this.keys[' '] && this.onGround) {
            this.velocity.y = this.jumpForce;
            this.onGround = false;
        }

        // Gravity
        this.velocity.y -= this.gravity;

        // Apply velocity
        this.camera.position.add(this.velocity);

        // Collision detection (simple)
        this.onGround = this.checkCollision();

        // Damping
        this.velocity.x *= 0.9;
        this.velocity.z *= 0.9;
    }

    checkCollision() {
        const playerPos = this.camera.position;
        const blockBelow = this.world.getBlock(
            Math.round(playerPos.x),
            Math.round(playerPos.y - 1.6),
            Math.round(playerPos.z)
        );

        if (blockBelow) {
            return true;
        }

        return false;
    }
}
