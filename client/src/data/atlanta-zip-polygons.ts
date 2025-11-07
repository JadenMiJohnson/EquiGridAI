export interface ZipPolygon {
  type: "Feature";
  properties: {
    zip: string;
    name: string;
  };
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
}

export const atlantaZipPolygons: ZipPolygon[] = [
  {
    type: "Feature",
    properties: { zip: "30308", name: "Midtown" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3900, 33.7850],
        [-84.3700, 33.7850],
        [-84.3700, 33.7700],
        [-84.3900, 33.7700],
        [-84.3900, 33.7850]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30309", name: "Buckhead South" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3900, 33.8000],
        [-84.3700, 33.8000],
        [-84.3700, 33.7850],
        [-84.3900, 33.7850],
        [-84.3900, 33.8000]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30305", name: "Buckhead" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3900, 33.8300],
        [-84.3600, 33.8300],
        [-84.3600, 33.8000],
        [-84.3900, 33.8000],
        [-84.3900, 33.8300]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30306", name: "Virginia Highland" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3600, 33.7900],
        [-84.3400, 33.7900],
        [-84.3400, 33.7700],
        [-84.3600, 33.7700],
        [-84.3600, 33.7900]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30307", name: "Little Five Points" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3600, 33.7700],
        [-84.3400, 33.7700],
        [-84.3400, 33.7500],
        [-84.3600, 33.7500],
        [-84.3600, 33.7700]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30312", name: "Sweet Auburn" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3700, 33.7600],
        [-84.3500, 33.7600],
        [-84.3500, 33.7450],
        [-84.3700, 33.7450],
        [-84.3700, 33.7600]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30310", name: "West End" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.4300, 33.7400],
        [-84.4000, 33.7400],
        [-84.4000, 33.7150],
        [-84.4300, 33.7150],
        [-84.4300, 33.7400]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30311", name: "Cascade Heights" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.4800, 33.7400],
        [-84.4400, 33.7400],
        [-84.4400, 33.7100],
        [-84.4800, 33.7100],
        [-84.4800, 33.7400]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30314", name: "Downtown West" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.4100, 33.7650],
        [-84.3850, 33.7650],
        [-84.3850, 33.7450],
        [-84.4100, 33.7450],
        [-84.4100, 33.7650]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30315", name: "Mechanicsville" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3900, 33.7350],
        [-84.3650, 33.7350],
        [-84.3650, 33.7150],
        [-84.3900, 33.7150],
        [-84.3900, 33.7350]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30316", name: "East Atlanta" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3500, 33.7350],
        [-84.3200, 33.7350],
        [-84.3200, 33.7100],
        [-84.3500, 33.7100],
        [-84.3500, 33.7350]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30317", name: "Kirkwood" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3200, 33.7600],
        [-84.2900, 33.7600],
        [-84.2900, 33.7350],
        [-84.3200, 33.7350],
        [-84.3200, 33.7600]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30318", name: "Howell Mill" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.4200, 33.8000],
        [-84.3900, 33.8000],
        [-84.3900, 33.7650],
        [-84.4200, 33.7650],
        [-84.4200, 33.8000]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30319", name: "Brookhaven" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3600, 33.8800],
        [-84.3200, 33.8800],
        [-84.3200, 33.8400],
        [-84.3600, 33.8400],
        [-84.3600, 33.8800]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30324", name: "Peachtree Hills" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3700, 33.8400],
        [-84.3500, 33.8400],
        [-84.3500, 33.8100],
        [-84.3700, 33.8100],
        [-84.3700, 33.8400]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30327", name: "Sandy Springs" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3900, 33.9200],
        [-84.3400, 33.9200],
        [-84.3400, 33.8700],
        [-84.3900, 33.8700],
        [-84.3900, 33.9200]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30329", name: "Druid Hills" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.3400, 33.8200],
        [-84.3100, 33.8200],
        [-84.3100, 33.7900],
        [-84.3400, 33.7900],
        [-84.3400, 33.8200]
      ]]
    }
  },
  {
    type: "Feature",
    properties: { zip: "30331", name: "Campbellton" },
    geometry: {
      type: "Polygon",
      coordinates: [[
        [-84.5200, 33.7100],
        [-84.4700, 33.7100],
        [-84.4700, 33.6700],
        [-84.5200, 33.6700],
        [-84.5200, 33.7100]
      ]]
    }
  }
];

export interface FeatureCollection {
  type: "FeatureCollection";
  features: ZipPolygon[];
}

export function getZipPolygonsGeoJSON(): FeatureCollection {
  return {
    type: "FeatureCollection",
    features: atlantaZipPolygons
  };
}
