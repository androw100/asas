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
  'dining-table-1': { width: 2.43, depth: 1.28 },
  'arch-door-1': { width: 0.95, depth: 0.20 },
  'arch-window-1': { width: 1.40, depth: 0.20 },
  'arch-column-square': { width: 0.45, depth: 0.45 },
  'arch-column-round': { width: 0.45, depth: 0.45 }
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

  // Doors and windows can reach right up against the room walls (2cm margin)
  const safetyMargin = item?.structuralType ? 0.02 : 0.08;

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

/**
 * Snaps a structural item (like an architectural window or door)
 * strictly to the nearest room wall (North, South, East, or West),
 * clamping it within that wall's length and auto-orienting it facing into the room.
 * 
 * @param {number} rawX - Pointer X coordinate
 * @param {number} rawZ - Pointer Z coordinate
 * @param {Object} item - Item object with footprint
 * @param {number} roomWidth - Room width in meters
 * @param {number} roomDepth - Room depth in meters
 * @returns {Object} { x, z, rotation, wall }
 */
export function snapToRoomWall(rawX, rawZ, item, roomWidth = 5.0, roomDepth = 4.0) {
  const halfW = roomWidth / 2;
  const halfD = roomDepth / 2;
  const itemWidth = item?.footprint?.width || 1.40;
  const margin = itemWidth / 2 + 0.08;

  // Perpendicular distance to each of the 4 room walls
  const distNorth = Math.abs(rawZ - (-halfD));
  const distSouth = Math.abs(rawZ - halfD);
  const distWest = Math.abs(rawX - (-halfW));
  const distEast = Math.abs(rawX - halfW);

  const minDist = Math.min(distNorth, distSouth, distWest, distEast);
  const wallOffset = 0.03; // Sits 3cm right along the inner wall plane

  if (minDist === distNorth) {
    // Snap to North (Back) Wall - Faces +Z into room (rotation 0°)
    const clampedX = Math.max(-halfW + margin, Math.min(halfW - margin, rawX));
    return {
      x: Number(clampedX.toFixed(2)),
      z: Number((-halfD + wallOffset).toFixed(2)),
      rotation: 0,
      wall: 'north'
    };
  } else if (minDist === distSouth) {
    // Snap to South (Front) Wall - Faces -Z into room (rotation 180°)
    const clampedX = Math.max(-halfW + margin, Math.min(halfW - margin, rawX));
    return {
      x: Number(clampedX.toFixed(2)),
      z: Number((halfD - wallOffset).toFixed(2)),
      rotation: 180,
      wall: 'south'
    };
  } else if (minDist === distWest) {
    // Snap to West (Left) Wall - Faces +X into room (rotation 90°)
    const clampedZ = Math.max(-halfD + margin, Math.min(halfD - margin, rawZ));
    return {
      x: Number((-halfW + wallOffset).toFixed(2)),
      z: Number(clampedZ.toFixed(2)),
      rotation: 90,
      wall: 'west'
    };
  } else {
    // Snap to East (Right) Wall - Faces -X into room (rotation 270°)
    const clampedZ = Math.max(-halfD + margin, Math.min(halfD - margin, rawZ));
    return {
      x: Number((halfW - wallOffset).toFixed(2)),
      z: Number(clampedZ.toFixed(2)),
      rotation: 270,
      wall: 'east'
    };
  }
}

