# ASAS 3D Model Assets Directory

Place your `.glb` and `.gltf` 3D files here.

### Expected Files:
- `chair.glb` - The Atelier Chair model
- `table.glb` - The Monolith Dining Table model
- `sofa.glb` - Kanso Daybed model
- `armchair.glb` - Noura Armchair model
- `coffee-table.glb` - Sora Coffee Table model
- `vessel.glb` - Kyoto Bronze Vessel model

### Model Preparation Tips:
1. **Format**: Binary GLTF (`.glb`) recommended for faster single-file loading.
2. **Origin & Orientation**:
   - Set the pivot/origin at the bottom center of the furniture piece so it sits naturally on the ground plane.
   - Y-axis is UP.
3. **Materials & Naming**:
   - Give meaningful names to materials (e.g. `Wood_Oak`, `Fabric_Seat`, `Metal_Legs`, `Marble_Top`).
   - The customizer automatically matches keywords configured in `src/data/products.js` under `materialMapping`.
