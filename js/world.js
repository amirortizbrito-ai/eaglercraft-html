// World generation and management
class World {
    constructor(scene, size = 32) {
        this.scene = scene;
        this.size = size;
        this.blocks = new Map();
        this.meshes = new Map();
        this.generateTerrain();
    }

    generateTerrain() {
        // Simple terrain generation using Perlin noise simulation
        const halfSize = this.size / 2;

        for (let x = -halfSize; x < halfSize; x++) {
            for (let z = -halfSize; z < halfSize; z++) {
                // Simple noise function (pseudo-random)
                const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 5;
                const height = Math.floor(5 + noise);

                for (let y = 0; y < height; y++) {
                    const blockType = this.getBlockType(y, height);
                    this.setBlock(x, y, z, blockType);
                }

                // Add some trees
                if (Math.random() > 0.95 && height > 3) {
                    this.generateTree(x, height, z);
                }
            }
        }
    }

    getBlockType(y, maxHeight) {
        if (y === maxHeight - 1) {
            return BLOCK_TYPES.GRASS;
        } else if (y > maxHeight - 4) {
            return BLOCK_TYPES.DIRT;
        } else {
            return BLOCK_TYPES.STONE;
        }
    }

    generateTree(x, y, z) {
        const trunkHeight = 4;
        for (let i = 0; i < trunkHeight; i++) {
            this.setBlock(x, y + i, z, BLOCK_TYPES.WOOD);
        }

        // Leaves
        for (let dx = -2; dx <= 2; dx++) {
            for (let dz = -2; dz <= 2; dz++) {
                for (let dy = 0; dy < 3; dy++) {
                    if (Math.abs(dx) + Math.abs(dz) < 4) {
                        this.setBlock(x + dx, y + trunkHeight + dy, z + dz, BLOCK_TYPES.LEAVES);
                    }
                }
            }
        }
    }

    setBlock(x, y, z, type) {
        const key = `${x},${y},${z}`;
        const block = new Block(type, x, y, z);
        this.blocks.set(key, block);

        // Create and add mesh
        const mesh = block.createMesh();
        this.scene.add(mesh);
        this.meshes.set(key, mesh);
    }

    removeBlock(x, y, z) {
        const key = `${x},${y},${z}`;
        if (this.blocks.has(key)) {
            const mesh = this.meshes.get(key);
            this.scene.remove(mesh);
            this.blocks.delete(key);
            this.meshes.delete(key);
        }
    }

    getBlock(x, y, z) {
        const key = `${x},${y},${z}`;
        return this.blocks.get(key);
    }

    blockExists(x, y, z) {
        const key = `${x},${y},${z}`;
        return this.blocks.has(key);
    }
}
