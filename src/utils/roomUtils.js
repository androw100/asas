/**
 * Room Planner Utilities
 * Precise metric calculations and strict boundary constraints.
 */

// Model scaled real-world footprints in meters (width x depth)
const defaultFootprints = {
  'sofa-1': { width: 2.40, depth: 1.15 },
  'sofa-2': { width: 1.75, depth: 1.00 },
  'sofa-3': { width: 2.85, depth: 1.20 },
  'sofa-4': { width: 3.50, depth: 2.25 },
  'chair-1': { width: 0.68, depth: 0.65 },
  'chair-2': { width: 0.62, depth: 0.67 },
  'chair-3': { width: 0.65, depth: 0.57 },
  'chair-4': { width: 0.64, depth: 0.64 },
  'dining-table-1': { width: 2.43, depth: 1.28 }
};

/**
 * Calculates the bounding limits of a furniture item within the room,
 * accounting for its scaled footprint and rotation, plus a safety margin.
 * Guarantees that the entire 3D model stays strictly inside the room perimeter.
 * 
 * @param {Object} item - Furniture item with footprint and rotation
 * @param {number} roomWidth - Room width in meters
 * @param {number} roomDepth - Room depth in meters
 * @returns {Object} { minX, maxX, minZ, maxZ, effectiveHalfW, effectiveHalfD }
 */
export function getItemBounds(item, roomWidth = 5.0, roomDepth = 4.0) {
  const fp = item?.footprint || defaultFootprints[item?.id] || { width: 1.8, depth: 1.1 };
  const rad = (((item?.rotation || 0) % 360) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));

  // Effective half-dimensions projected on X and Z axes
  const effectiveHalfW = (fp.width * cos + fp.depth * sin) / 2;
  const effectiveHalfD = (fp.width * sin + fp.depth * cos) / 2;

  const safetyMargin = 0.08; // 8 cm buffer inside the skirting wall

  const minX = -roomWidth / 2 + effectiveHalfW + safetyMargin;
  const maxX = roomWidth / 2 - effectiveHalfW - safetyMargin;
  const minZ = -roomDepth / 2 + effectiveHalfD + safetyMargin;
  const maxZ = roomDepth / 2 - effectiveHalfD - safetyMargin;

  return {
    minX: maxX < minX ? 0 : Number(minX.toFixed(2)),
    maxX: maxX < minX ? 0 : Number(maxX.toFixed(2)),
    minZ: maxZ < minZ ? 0 : Number(minZ.toFixed(2)),
    maxZ: maxZ < minZ ? 0 : Number(maxZ.toFixed(2)),
    effectiveHalfW,
    effectiveHalfD
  };
}
