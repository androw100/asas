import * as THREE from 'three';

/**
 * Applies a chosen finish to the cloned 3D model hierarchy based on configured targets.
 * 
 * @param {THREE.Object3D} scene - Cloned scene object
 * @param {Object} finish - { id, name, color, target, roughness, metalness }
 * @param {Object} product - Product definition with materialMapping
 * @returns {Array<string>} list of modified material/mesh identifiers
 */
export function applyFinishToModel(scene, finish, product) {
  if (!scene || !finish || !finish.color) return [];

  const modified = [];
  const targetGroup = finish.target?.toLowerCase();
  const mappingKeywords = product?.materialMapping?.[targetGroup] || [targetGroup];

  // Helper to determine if a mesh or material name matches the target group
  const isTargetMatch = (name) => {
    if (!name) return false;
    const lower = name.toLowerCase();
    return mappingKeywords.some((keyword) => lower.includes(keyword.toLowerCase()));
  };

  scene.traverse((node) => {
    if (node.isMesh && node.material) {
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      const newMaterials = materials.map((mat) => {
        const matName = mat.name || '';
        const meshName = node.name || '';

        // Check if material name or mesh name matches the finish target group
        // If no specific keywords match, but this is the only target for a 1-group product, apply gracefully
        const matches = isTargetMatch(matName) || isTargetMatch(meshName);

        if (matches) {
          // Clone material if it hasn't been cloned yet on this instance
          const clonedMat = mat.userData?.isCloned ? mat : mat.clone();
          clonedMat.userData = { ...clonedMat.userData, isCloned: true };

          // Update color while preserving existing maps (diffuse, normal, roughness)
          clonedMat.color = new THREE.Color(finish.color);

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

  // Fallback: If no material matched specific keywords (e.g. model has generic names like 'Material_001')
  // and there's only 1 finish target or the user selected the primary finish, tint all non-metal meshes gracefully
  if (modified.length === 0) {
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        const mat = node.material;
        if (!mat.userData?.isCloned) {
          node.material = mat.clone();
          node.material.userData = { ...node.material.userData, isCloned: true };
        }
        node.material.color = new THREE.Color(finish.color);
        node.material.needsUpdate = true;
        modified.push(`${node.name || 'Mesh'} (General Match)`);
      }
    });
  }

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
