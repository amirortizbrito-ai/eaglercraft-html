// Block types and materials
const BLOCK_TYPES = {
    DIRT: 0,
    GRASS: 1,
    STONE: 2,
    WOOD: 3,
    LEAVES: 4,
    SAND: 5,
    WATER: 6,
    LAVA: 7,
};

const BLOCK_COLORS = {
    [BLOCK_TYPES.DIRT]: 0x8b6f47,
    [BLOCK_TYPES.GRASS]: 0x7cb342,
    [BLOCK_TYPES.STONE]: 0x757575,
    [BLOCK_TYPES.WOOD]: 0x8d6e63,
    [BLOCK_TYPES.LEAVES]: 0x558b2f,
    [BLOCK_TYPES.SAND]: 0xf1c40f,
    [BLOCK_TYPES.WATER]: 0x2196f3,
    [BLOCK_TYPES.LAVA]: 0xff5722,
};

class Block {
    constructor(type, x, y, z) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.z = z;
    }

    getMaterial() {
        const color = BLOCK_COLORS[this.type] || 0xffffff;
        return new THREE.MeshLambertMaterial({ color });
    }

    createMesh() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = this.getMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.x, this.y, this.z);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
    }
}