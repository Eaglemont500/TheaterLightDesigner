// Data structure for ETC and Altman lights
export interface ETCLight {
  id: string;
  name: string;
  description: string;
  color: string;
  type: string;
  wattage: number;
  beamAngle?: number;
  manufacturer?: string;
}

// Complete catalog of ETC lights and Altman 360Q
export const etcLights: ETCLight[] = [
  // ETC Source Four fixtures
  {
    id: "source-four-19",
    name: "Source Four 19°",
    description: "575W Ellipsoidal",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 19,
    manufacturer: "ETC"
  },
  {
    id: "source-four-26",
    name: "Source Four 26°",
    description: "575W Ellipsoidal",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 26,
    manufacturer: "ETC"
  },
  {
    id: "source-four-36",
    name: "Source Four 36°",
    description: "575W Ellipsoidal",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 36,
    manufacturer: "ETC"
  },
  {
    id: "source-four-50",
    name: "Source Four 50°",
    description: "575W Ellipsoidal",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 50,
    manufacturer: "ETC"
  },
  {
    id: "source-four-70",
    name: "Source Four 70°",
    description: "575W Ellipsoidal",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 70,
    manufacturer: "ETC"
  },
  {
    id: "source-four-90",
    name: "Source Four 90°",
    description: "575W Ellipsoidal",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 90,
    manufacturer: "ETC"
  },
  {
    id: "source-four-750",
    name: "Source Four 750W",
    description: "750W Ellipsoidal",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 750,
    manufacturer: "ETC"
  },
  {
    id: "source-four-jr",
    name: "Source Four Jr",
    description: "575W Junior Ellipsoidal",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    manufacturer: "ETC"
  },
  {
    id: "source-four-par",
    name: "Source Four PAR",
    description: "575W PAR",
    color: "#ffa500",
    type: "par",
    wattage: 575,
    manufacturer: "ETC"
  },
  {
    id: "source-four-par-mfl",
    name: "Source Four PAR MFL",
    description: "575W PAR Medium Flood",
    color: "#ffa500",
    type: "par",
    wattage: 575,
    manufacturer: "ETC"
  },
  {
    id: "source-four-par-wfl",
    name: "Source Four PAR WFL",
    description: "575W PAR Wide Flood",
    color: "#ffa500",
    type: "par",
    wattage: 575,
    manufacturer: "ETC"
  },
  {
    id: "source-four-led-series-2",
    name: "Source Four LED Series 2",
    description: "LED Profile",
    color: "#4ade80",
    type: "led",
    wattage: 155,
    manufacturer: "ETC"
  },
  {
    id: "source-four-led-lustr",
    name: "Source Four LED Lustr",
    description: "LED Lustr+",
    color: "#4ade80",
    type: "led",
    wattage: 155,
    manufacturer: "ETC"
  },
  {
    id: "colorsource-par",
    name: "ColorSource PAR",
    description: "LED PAR",
    color: "#fbbf24",
    type: "led",
    wattage: 100,
    manufacturer: "ETC"
  },
  {
    id: "colorsource-spot",
    name: "ColorSource Spot",
    description: "LED Spot",
    color: "#fbbf24",
    type: "led",
    wattage: 100,
    manufacturer: "ETC"
  },
  {
    id: "desire-d40",
    name: "Desire D40",
    description: "LED Wash",
    color: "#4ade80",
    type: "led",
    wattage: 125,
    manufacturer: "ETC"
  },
  {
    id: "desire-d60",
    name: "Desire D60",
    description: "LED Wash",
    color: "#4ade80",
    type: "led",
    wattage: 125,
    manufacturer: "ETC"
  },
  {
    id: "source-four-fresnel",
    name: "Source Four Fresnel",
    description: "575W Fresnel",
    color: "#ffa500",
    type: "fresnel",
    wattage: 575,
    manufacturer: "ETC"
  },
  {
    id: "color-source-cyc",
    name: "ColorSource CYC",
    description: "LED Cyc Light",
    color: "#fbbf24",
    type: "cyc",
    wattage: 100,
    manufacturer: "ETC"
  },
  
  // Altman 360Q fixtures with all different degrees
  {
    id: "altman-360q-4-5",
    name: "Altman 360Q 4.5°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 4.5,
    manufacturer: "Altman"
  },
  {
    id: "altman-360q-6",
    name: "Altman 360Q 6°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 6,
    manufacturer: "Altman"
  },
  {
    id: "altman-360q-10",
    name: "Altman 360Q 10°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 10,
    manufacturer: "Altman"
  },
  {
    id: "altman-360q-15",
    name: "Altman 360Q 15°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 15,
    manufacturer: "Altman"
  },
  {
    id: "altman-360q-20",
    name: "Altman 360Q 20°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 20,
    manufacturer: "Altman"
  },
  {
    id: "altman-360q-30",
    name: "Altman 360Q 30°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 30,
    manufacturer: "Altman"
  },
  {
    id: "altman-360q-40",
    name: "Altman 360Q 40°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 40,
    manufacturer: "Altman"
  },
  {
    id: "altman-360q-50",
    name: "Altman 360Q 50°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 50,
    manufacturer: "Altman"
  },
  {
    id: "altman-360q-65",
    name: "Altman 360Q 65°",
    description: "575W Ellipsoidal Spotlight",
    color: "#ffa500",
    type: "ellipsoidal",
    wattage: 575,
    beamAngle: 65,
    manufacturer: "Altman"
  }
];

// Helper function to get light details by ID
export function getEtcLightByAssetId(assetId: string): ETCLight | undefined {
  return etcLights.find(light => light.id === assetId);
}
