import * as THREE from 'three';

// Texture cache to prevent re-fetching the same texture multiple times
const textureCache = new Map();
const textureLoader = new THREE.TextureLoader();

// WeakMap to store original pristine materials without circular references in userData
const originalMaterialMap = new WeakMap();

function getOrCreateTexture(url, repeat = [1, 1], isNormal = false) {
  const cacheKey = `${url}_${repeat.join('x')}_${isNormal}`;
  if (textureCache.has(cacheKey)) {
    return textureCache.get(cacheKey);
  }

  const texture = textureLoader.load(url);
  texture.colorSpace = isNormal ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat[0], repeat[1]);
  texture.flipY = false;

  textureCache.set(cacheKey, texture);
  return texture;
}

/**
 * Applies a chosen finish to the 3D model hierarchy based on configured targets.
 * Supports GLTF embedded Material Variants (KHR_materials_variants), dynamic texture swapping, and color tinting.
 * 
 * @param {THREE.Object3D} scene - Scene object
 * @param {Object} finish - { id, name, color, variantName, textureUrl, textureRepeat, target, roughness, metalness }
 * @param {Object} product - Product definition with materialMapping
 * @param {Object} availableMaterials - Dictionary of all materials in the GLB scene (gltf.materials)
 * @returns {Array<string>} list of modified material/mesh identifiers
 */
export function applyFinishToModel(scene, finish, product, availableMaterials = {}) {
  if (!scene || !finish) return [];

  // If 'original', restore the pristine original materials
  if (finish.id === 'original') {
    scene.traverse((node) => {
      if (node.isMesh && originalMaterialMap.has(node)) {
        node.material = originalMaterialMap.get(node);
        if (Array.isArray(node.material)) {
          node.material.forEach((m) => { m.needsUpdate = true; });
        } else if (node.material) {
          node.material.needsUpdate = true;
        }
      }
    });
    return ['original'];
  }

  const modified = [];
  const targetGroup = finish.target?.toLowerCase() || 'all';
  const mappingKeywords = product?.materialMapping?.[targetGroup] || [
    targetGroup,
    'marble',
    'plane',
    'top',
    'table',
    'wood',
    'surface'
  ];

  // Helper to determine if a mesh or material name matches the target group
  const isTargetMatch = (matName, meshName) => {
    if (targetGroup === 'all') return true;
    const lowerMat = (matName || '').toLowerCase();
    const lowerMesh = (meshName || '').toLowerCase();
    return mappingKeywords.some((keyword) => {
      const k = keyword.toLowerCase();
      return lowerMat.includes(k) || lowerMesh.includes(k);
    });
  };

  scene.traverse((node) => {
    if (node.isMesh && node.material) {
      // Save pristine original material in WeakMap on first encounter
      if (!originalMaterialMap.has(node)) {
        originalMaterialMap.set(node, node.material);
      }

      const materials = Array.isArray(node.material) ? node.material : [node.material];
      const newMaterials = materials.map((mat) => {
        const matName = mat.name || '';
        const meshName = node.name || '';

        const matches = isTargetMatch(matName, meshName);

        if (matches) {
          // A) GLTF Embedded Material Variant (Direct assignment from designer's file)
          const targetVariantName = finish.variantName;
          const foundVariantMat = targetVariantName
            ? availableMaterials[targetVariantName] ||
              Object.values(availableMaterials).find((m) => {
                const n = (m?.name || '').toLowerCase();
                const tv = targetVariantName.toLowerCase();
                return n === tv ||
                  (tv.includes('white') && n.includes('white')) ||
                  (tv.includes('black') && n.includes('black')) ||
                  ((tv.includes('brown') || tv.includes('marble') || tv.includes('midnight')) &&
                   (n === 'marble' || n.includes('midnight') || n.includes('brown')));
              })
            : null;

          if (foundVariantMat) {
            foundVariantMat.needsUpdate = true;
            modified.push(`${meshName || 'Mesh'} (Variant: ${targetVariantName})`);
            return foundVariantMat;
          }

          // B) Dynamic high-resolution texture replacement (if variant not embedded in GLB)
          if (finish.textureUrl) {
            const clonedMat = mat.clone();
            const repeat = finish.textureRepeat || [1, 1];
            clonedMat.map = getOrCreateTexture(finish.textureUrl, repeat, false);
            clonedMat.color = new THREE.Color(finish.color || '#FFFFFF');

            if (finish.normalUrl) {
              clonedMat.normalMap = getOrCreateTexture(finish.normalUrl, repeat, true);
              clonedMat.normalScale = new THREE.Vector2(0.2, 0.2);
            }

            if (finish.roughness !== undefined) {
              clonedMat.roughness = finish.roughness;
            }
            if (finish.metalness !== undefined) {
              clonedMat.metalness = finish.metalness;
            }

            clonedMat.needsUpdate = true;
            modified.push(`${meshName || 'Mesh'} (Texture: ${finish.id})`);
            return clonedMat;
          }

          // C) Dynamic Color Tint
          const clonedMat = mat.clone();
          if (finish.color) {
            clonedMat.color = new THREE.Color(finish.color);
          }
          if (finish.roughness !== undefined) {
            clonedMat.roughness = finish.roughness;
          }
          if (finish.metalness !== undefined) {
            clonedMat.metalness = finish.metalness;
          }

          clonedMat.needsUpdate = true;
          modified.push(`${meshName || 'Mesh'} (${matName || 'Material'})`);
          return clonedMat;
        }

        return mat;
      });

      node.material = Array.isArray(node.material) ? newMaterials : newMaterials[0];
    }
  });

  return modified;
}

/**
 * Inspects a 3D scene and extracts mesh and material metadata for easy configuration.
 * 
 * @param {THREE.Object3D} scene 
 * @returns {Array<Object>} Hierarchy of meshes and their current material properties
 */
export function inspectSceneHierarchy(scene) {
  if (!scene) return [];
  const items = [];

  scene.traverse((node) => {
    if (node.isMesh) {
      const mat = node.material;
      const matNames = Array.isArray(mat)
        ? mat.map((m) => m.name || 'unnamed')
        : [mat?.name || 'unnamed'];

      items.push({
        meshName: node.name || 'Unnamed Mesh',
        materials: matNames,
        type: node.type
      });
    }
  });

  return items;
}
