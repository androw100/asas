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
/**
 * Applies a chosen finish or array of finishes to the 3D model hierarchy based on configured targets.
 * Supports GLTF embedded Material Variants (KHR_materials_variants), dynamic texture swapping, and color tinting.
 * 
 * @param {THREE.Object3D} scene - Scene object
 * @param {Object|Array<Object>} finishOrFinishes - A finish or array of finishes to apply
 * @param {Object} product - Product definition with materialMapping
 * @param {Object} availableMaterials - Dictionary of all materials in the GLB scene (gltf.materials + embedded variants)
 * @returns {Array<string>} list of modified material/mesh identifiers
 */
export function applyFinishToModel(scene, finishOrFinishes, product, availableMaterials = {}) {
  if (!scene || !finishOrFinishes) return [];

  const finishList = Array.isArray(finishOrFinishes)
    ? finishOrFinishes
    : typeof finishOrFinishes === 'object' && (finishOrFinishes.fabric || finishOrFinishes.wood)
    ? Object.values(finishOrFinishes).filter(Boolean)
    : [finishOrFinishes];

  if (finishList.length === 0) return [];

  // If 'original', restore the pristine original materials
  const hasOriginal = finishList.some((f) => f?.id === 'original');
  if (hasOriginal) {
    scene.traverse((node) => {
      if (node.isMesh && originalMaterialMap.has(node)) {
        node.material = originalMaterialMap.get(node);
        if (Array.isArray(node.material)) {
          node.material.forEach((m) => { if (m) m.needsUpdate = true; });
        } else if (node.material) {
          node.material.needsUpdate = true;
        }
      }
    });
    return ['original'];
  }

  const modified = [];

  // Helper to determine if a material matches a target group strictly by material name
  const isTargetMatch = (matName, targetGroup) => {
    if (!targetGroup || targetGroup === 'all') return true;
    const lowerMat = (matName || '').toLowerCase();

    if (targetGroup === 'fabric') {
      return (
        lowerMat.includes('fabric') ||
        lowerMat.includes('cloth') ||
        lowerMat.includes('hessain') ||
        lowerMat.includes('cushion') ||
        lowerMat.includes('seat') ||
        lowerMat.includes('upholstery')
      );
    }

    if (targetGroup === 'wood') {
      return (
        lowerMat.includes('wood') ||
        lowerMat.includes('oak') ||
        lowerMat.includes('leg') ||
        lowerMat.includes('base') ||
        lowerMat.includes('frame')
      );
    }

    if (targetGroup === 'marble') {
      return (
        lowerMat.includes('marble') ||
        lowerMat.includes('stone') ||
        lowerMat.includes('plane') ||
        lowerMat.includes('top')
      );
    }

    if (targetGroup === 'gold' || targetGroup === 'metal') {
      return (
        lowerMat.includes('gold') ||
        lowerMat.includes('metal') ||
        lowerMat.includes('brass') ||
        lowerMat.includes('cube')
      );
    }

    const mappingKeywords = product?.materialMapping?.[targetGroup] || [targetGroup];
    return mappingKeywords.some((keyword) => lowerMat.includes(keyword.toLowerCase()));
  };

  // Find matching variant material from availableMaterials (variant name first, then fallback to index)
  const findVariantMaterial = (finish) => {
    if (!finish) return null;

    // 1. By variant name first (safe across models where material order may differ)
    const targetVariantName = finish.variantName;
    if (targetVariantName) {
      if (availableMaterials[targetVariantName]) return availableMaterials[targetVariantName];

      const tv = targetVariantName.toLowerCase().trim();
      const foundByName = Object.values(availableMaterials).find((m) => {
        const n = (m?.name || '').toLowerCase().trim();
        return (
          n === tv ||
          n.replace(/[\s_.-]/g, '') === tv.replace(/[\s_.-]/g, '') ||
          n.includes(tv) ||
          tv.includes(n)
        );
      });
      if (foundByName) return foundByName;
    }

    // 2. Fallback by exact material index
    if (finish.materialIndex !== undefined && availableMaterials[finish.materialIndex]) {
      return availableMaterials[finish.materialIndex];
    }

    return null;
  };

  scene.traverse((node) => {
    if (node.isMesh && node.material) {
      // Save pristine original material in WeakMap on first encounter
      if (!originalMaterialMap.has(node)) {
        originalMaterialMap.set(node, node.material);
      }

      const materials = Array.isArray(node.material) ? [...node.material] : [node.material];

      // For each finish in finishList, apply to matching material slots
      finishList.forEach((finish) => {
        if (!finish) return;
        const targetGroup = finish.target?.toLowerCase() || finish.group?.toLowerCase() || 'all';

        for (let i = 0; i < materials.length; i++) {
          const mat = materials[i];
          const matName = mat?.name || '';
          const meshName = node.name || '';

          if (isTargetMatch(matName, targetGroup)) {
            // A) Dynamic high-resolution texture replacement (when explicit textureUrl is configured)
            if (finish.textureUrl) {
              const baseMat = findVariantMaterial(finish) || mat;
              const clonedMat = baseMat.clone();
              clonedMat.name = matName;
              const repeat = finish.textureRepeat || [2, 2];
              clonedMat.map = getOrCreateTexture(finish.textureUrl, repeat, false);

              if (finish.tint) {
                clonedMat.color = new THREE.Color(finish.tint);
              } else if (finish.color && finish.id?.startsWith('custom-color')) {
                clonedMat.color = new THREE.Color(finish.color);
              } else {
                clonedMat.color = new THREE.Color('#FFFFFF');
              }

              clonedMat.roughness = 0.72;
              clonedMat.metalness = 0.05;
              clonedMat.needsUpdate = true;
              materials[i] = clonedMat;
              modified.push(`${meshName} Slot ${i} (Custom Texture: ${finish.textureUrl})`);
              continue;
            }

            // B) GLTF Embedded Material Variant (Direct swap from designer's GLB)
            const foundVariantMat = findVariantMaterial(finish);

            if (foundVariantMat) {
              // Ensure fabric materials have realistic diffuse matte behavior and prevent glossy specular glare/artifacts
              const isFabric =
                targetGroup === 'fabric' ||
                (foundVariantMat.name && /fabric|cloth|hessain|cushion|seat|upholstery/i.test(foundVariantMat.name));

              if (isFabric) {
                foundVariantMat.roughness = 0.95;
                foundVariantMat.metalness = 0.0;
                if (foundVariantMat.normalScale) {
                  foundVariantMat.normalScale.set(0.8, 0.8);
                }
              }

              foundVariantMat.needsUpdate = true;
              materials[i] = foundVariantMat;
              modified.push(`${meshName} Slot ${i} (Variant: ${finish.variantName})`);
              continue;
            }

            // C) Custom Color Tint (only when explicitly requested as a custom color)
            if (finish.color && finish.id?.startsWith('custom-color')) {
              const clonedMat = mat.clone();
              clonedMat.name = matName;
              clonedMat.color = new THREE.Color(finish.color);
              clonedMat.needsUpdate = true;
              materials[i] = clonedMat;
              modified.push(`${meshName} Slot ${i} (Color: ${finish.color})`);
              continue;
            }
          }
        }
      });

      node.material = Array.isArray(node.material) ? materials : materials[0];
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
