import { getAreaUnit } from "@/constants/farms";

/**
 * Farm-details API contract (MOCKED — backend route not built yet).
 *
 * The future endpoint this file stands in for:
 *
 *   GET /farms/:id   (fields.view on the farm's tenant)
 *
 * Target response — the page renders straight out of `data`, so when the
 * backend lands, swapping the mock queryFn for the real request changes
 * nothing in the UI:
 *
 * {
 *   "success": true,
 *   "timestamp": "2026-09-13T10:00:00Z",
 *   "data": {
 *     "id": "0c4a32d5-085c-44f6-b1a5-f263585de942",
 *     "name": "Salinas Valley Mixed Crops",
 *     "location": "Salinas, CA",
 *     "latitude": 36.6777,
 *     "longitude": -121.6555,
 *     "totalArea": 240,
 *     "areaUnit": "acre",
 *     "notes": "Cool-season rotation…",
 *     "isActive": true,
 *     "createdAt": "2026-08-22T09:00:00Z",
 *     "updatedAt": "2026-09-01T14:30:00Z",
 *     "farmTypeId": "uuid",
 *     "farmTypeName": "mixed",
 *     "farmTypeDisplayName": "Mixed Farm",
 *     "stats": {
 *       "totalFields": 6,               // all fields on the farm
 *       "activeFields": 5,              // is_active = true
 *       "inactiveFields": 1,
 *       "fieldsByCultivationMode": {    // keyed by zone_types.cultivation_mode
 *         "soil": 2,
 *         "hydro": 2,
 *         "other": 2
 *       },
 *       "areaAllocated": 120.57,        // Σ field areas converted into the
 *       "areaUnit": "acre",             // farm's area unit
 *       "areaUtilizationPct": 50.24     // areaAllocated / totalArea * 100
 *     }
 *   }
 * }
 *
 * Until the route exists, buildFarmDetails assembles the exact shape from
 * data the app already has: the farm row (selectedFarm / GET /farms) and
 * the farm's fields (GET /zones?farmID=… — both real endpoints), with
 * stats computed here. When the backend ships, delete the queryFn in
 * farmApi and let the endpoint return `stats` server-side.
 */

/** Convert an area value between AREA_UNITS ids via their m² factors. */
const convertArea = (value, fromUnit, toUnit) => {
  if (value == null) return 0;
  const from = getAreaUnit(fromUnit);
  const to = getAreaUnit(toUnit);
  if (!from.factor || !to.factor) return Number(value) || 0;
  return (Number(value) * from.factor) / to.factor;
};

/**
 * Assemble the farm-details contract from a farm row and its fields.
 * `farm`  — a row from GET /farms (FarmInfo shape)
 * `zones` — rows from GET /zones?farmID=… (ListZonesInfo shape)
 */
export const buildFarmDetails = (farm, zones = []) => {
  const modeCounts = { soil: 0, hydro: 0, other: 0 };
  let activeFields = 0;
  let areaAllocated = 0;

  zones.forEach((z) => {
    if (z.isActive) activeFields += 1;
    const mode = z.cultivationMode in modeCounts ? z.cultivationMode : "other";
    modeCounts[mode] += 1;
    areaAllocated += convertArea(z.area, z.areaUnit, farm.areaUnit);
  });

  const allocated = Math.round(areaAllocated * 100) / 100;
  const total = Number(farm.totalArea) || 0;
  const utilization = total > 0 ? Math.min(100, (allocated / total) * 100) : 0;

  return {
    ...farm,
    stats: {
      totalFields: zones.length,
      activeFields,
      inactiveFields: zones.length - activeFields,
      fieldsByCultivationMode: modeCounts,
      areaAllocated: allocated,
      areaUnit: farm.areaUnit,
      areaUtilizationPct: Math.round(utilization * 100) / 100,
    },
  };
};
