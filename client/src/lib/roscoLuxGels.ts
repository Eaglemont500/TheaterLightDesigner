// Data structure for RoscoLux Gels
export interface RoscoLuxGel {
  id: string;
  name: string;
  color: string;
  category: string;
  number: string; // Gel number for sorting
  transmissionFactor?: number;
  description?: string;
}

// Complete catalog of Rosco Lux series gels
export const roscoLuxGels: RoscoLuxGel[] = [
  // Reds
  {
    id: "rosco-26",
    name: "R26 Light Red",
    color: "#FF0000",
    category: "Reds",
    number: "26",
    transmissionFactor: 0.15,
    description: "Primary red with slight blue correction"
  },
  {
    id: "rosco-27",
    name: "R27 Medium Red",
    color: "#FF3300",
    category: "Reds",
    number: "27",
    transmissionFactor: 0.12
  },
  {
    id: "rosco-24",
    name: "R24 Scarlet",
    color: "#FF2800",
    category: "Reds",
    number: "24",
    transmissionFactor: 0.20
  },
  {
    id: "rosco-25",
    name: "R25 Orange Red",
    color: "#FF3F00",
    category: "Reds",
    number: "25",
    transmissionFactor: 0.22
  },
  {
    id: "rosco-19",
    name: "R19 Fire",
    color: "#FF4400",
    category: "Reds",
    number: "19",
    transmissionFactor: 0.32
  },
  {
    id: "rosco-33",
    name: "R33 No Color Pink",
    color: "#FF6666",
    category: "Reds",
    number: "33",
    transmissionFactor: 0.62
  },

  // Oranges and Ambers
  {
    id: "rosco-20",
    name: "R20 Medium Amber",
    color: "#FF9900",
    category: "Ambers",
    number: "20",
    transmissionFactor: 0.46
  },
  {
    id: "rosco-21",
    name: "R21 Golden Amber",
    color: "#FFCC00",
    category: "Ambers",
    number: "21",
    transmissionFactor: 0.57
  },
  {
    id: "rosco-22",
    name: "R22 Deep Amber",
    color: "#FFFF00",
    category: "Ambers",
    number: "22",
    transmissionFactor: 0.39
  },
  {
    id: "rosco-23",
    name: "R23 Orange",
    color: "#FF8C00",
    category: "Ambers",
    number: "23",
    transmissionFactor: 0.29
  },
  {
    id: "rosco-16",
    name: "R16 Light Amber",
    color: "#FFEEBB",
    category: "Ambers",
    number: "16",
    transmissionFactor: 0.73
  },
  {
    id: "rosco-17",
    name: "R17 Light Flame",
    color: "#FFD700",
    category: "Ambers",
    number: "17",
    transmissionFactor: 0.69
  },

  // Yellows
  {
    id: "rosco-10",
    name: "R10 Medium Yellow",
    color: "#FFFF33",
    category: "Yellows",
    number: "10",
    transmissionFactor: 0.80
  },
  {
    id: "rosco-11",
    name: "R11 Light Straw",
    color: "#FFFACD",
    category: "Yellows",
    number: "11",
    transmissionFactor: 0.85
  },
  {
    id: "rosco-12",
    name: "R12 Straw",
    color: "#FFF8DC",
    category: "Yellows",
    number: "12",
    transmissionFactor: 0.82
  },
  {
    id: "rosco-08",
    name: "R08 Pale Gold",
    color: "#FFEC80",
    category: "Yellows",
    number: "08",
    transmissionFactor: 0.78
  },
  {
    id: "rosco-09",
    name: "R09 Pale Amber Gold",
    color: "#FFE066",
    category: "Yellows",
    number: "09",
    transmissionFactor: 0.76
  },

  // Greens
  {
    id: "rosco-91",
    name: "R91 Primary Green",
    color: "#00FF00",
    category: "Greens",
    number: "91",
    transmissionFactor: 0.12
  },
  {
    id: "rosco-94",
    name: "R94 Kelly Green",
    color: "#33FF33",
    category: "Greens",
    number: "94",
    transmissionFactor: 0.19
  },
  {
    id: "rosco-95",
    name: "R95 Medium Green",
    color: "#66FF66",
    category: "Greens",
    number: "95",
    transmissionFactor: 0.21
  },
  {
    id: "rosco-89",
    name: "R89 Moss Green",
    color: "#98FB98",
    category: "Greens",
    number: "89",
    transmissionFactor: 0.32
  },
  {
    id: "rosco-90",
    name: "R90 Dark Yellow Green",
    color: "#9ACD32",
    category: "Greens",
    number: "90",
    transmissionFactor: 0.30
  },
  {
    id: "rosco-86",
    name: "R86 Pea Green",
    color: "#8FBC8F",
    category: "Greens",
    number: "86",
    transmissionFactor: 0.41
  },

  // Blues
  {
    id: "rosco-68",
    name: "R68 Sky Blue",
    color: "#0000FF",
    category: "Blues",
    number: "68",
    transmissionFactor: 0.10
  },
  {
    id: "rosco-69",
    name: "R69 Brilliant Blue",
    color: "#3333FF",
    category: "Blues",
    number: "69",
    transmissionFactor: 0.15
  },
  {
    id: "rosco-80",
    name: "R80 Primary Blue",
    color: "#6666FF",
    category: "Blues",
    number: "80",
    transmissionFactor: 0.14
  },
  {
    id: "rosco-67",
    name: "R67 Light Sky Blue",
    color: "#87CEEB",
    category: "Blues",
    number: "67",
    transmissionFactor: 0.48
  },
  {
    id: "rosco-64",
    name: "R64 Light Steel Blue",
    color: "#B0C4DE",
    category: "Blues",
    number: "64",
    transmissionFactor: 0.56
  },
  {
    id: "rosco-65",
    name: "R65 Daylight Blue",
    color: "#ADD8E6",
    category: "Blues",
    number: "65",
    transmissionFactor: 0.59
  },

  // Purples and Lavenders
  {
    id: "rosco-58",
    name: "R58 Deep Lavender",
    color: "#8A2BE2",
    category: "Purples",
    number: "58",
    transmissionFactor: 0.28
  },
  {
    id: "rosco-59",
    name: "R59 Indigo",
    color: "#4B0082",
    category: "Purples",
    number: "59",
    transmissionFactor: 0.09
  },
  {
    id: "rosco-49",
    name: "R49 Medium Purple",
    color: "#9370DB",
    category: "Purples",
    number: "49",
    transmissionFactor: 0.23
  },
  {
    id: "rosco-48",
    name: "R48 Rose Purple",
    color: "#CC99CC",
    category: "Purples",
    number: "48",
    transmissionFactor: 0.31
  },
  {
    id: "rosco-52",
    name: "R52 Light Lavender",
    color: "#D8BFD8",
    category: "Purples",
    number: "52",
    transmissionFactor: 0.57
  },
  {
    id: "rosco-54",
    name: "R54 Special Lavender",
    color: "#E6E6FA",
    category: "Purples",
    number: "54",
    transmissionFactor: 0.71
  },

  // CTO and CTB (Color Temperature)
  {
    id: "rosco-3202",
    name: "R3202 Full CTB",
    color: "#99CCFF",
    category: "CTB",
    number: "3202",
    transmissionFactor: 0.36
  },
  {
    id: "rosco-3204",
    name: "R3204 Half CTB",
    color: "#BFE0FF",
    category: "CTB",
    number: "3204",
    transmissionFactor: 0.61
  },
  {
    id: "rosco-3206",
    name: "R3206 Quarter CTB",
    color: "#D9ECFF",
    category: "CTB",
    number: "3206",
    transmissionFactor: 0.72
  },
  {
    id: "rosco-3208",
    name: "R3208 Eighth CTB",
    color: "#E9F5FF",
    category: "CTB",
    number: "3208",
    transmissionFactor: 0.83
  },
  {
    id: "rosco-3407",
    name: "R3407 Roscosun CTO",
    color: "#FFCC99",
    category: "CTO",
    number: "3407",
    transmissionFactor: 0.59
  },
  {
    id: "rosco-3409",
    name: "R3409 Roscosun 1/2 CTO",
    color: "#FFE0BF",
    category: "CTO",
    number: "3409",
    transmissionFactor: 0.73
  },

  // Neutrals
  {
    id: "rosco-00",
    name: "R00 Clear",
    color: "#FFFFFF",
    category: "Neutrals",
    number: "00",
    transmissionFactor: 0.97
  },
  {
    id: "rosco-02",
    name: "R02 Bastard Amber",
    color: "#FFF5EE",
    category: "Neutrals",
    number: "02",
    transmissionFactor: 0.83
  },
  {
    id: "rosco-15",
    name: "R15 Deep Straw",
    color: "#FFEBCD",
    category: "Neutrals",
    number: "15",
    transmissionFactor: 0.71
  },
  {
    id: "rosco-03",
    name: "R03 Dark Bastard Amber",
    color: "#FFE4C4",
    category: "Neutrals",
    number: "03",
    transmissionFactor: 0.68
  },
  {
    id: "rosco-ND3",
    name: "R98 ND.3",
    color: "#CCCCCC",
    category: "Neutrals",
    number: "98",
    transmissionFactor: 0.50
  },
  {
    id: "rosco-ND6",
    name: "R97 ND.6",
    color: "#999999",
    category: "Neutrals",
    number: "97",
    transmissionFactor: 0.25
  },
  
  // Additional Rosco gels
  {
    id: "rosco-01",
    name: "R01 Light Bastard Amber",
    color: "#FFFAF0",
    category: "Neutrals",
    number: "01",
    transmissionFactor: 0.87
  },
  {
    id: "rosco-04",
    name: "R04 Medium Bastard Amber",
    color: "#FFDAB9",
    category: "Neutrals",
    number: "04",
    transmissionFactor: 0.75
  },
  {
    id: "rosco-05",
    name: "R05 Rose Tint",
    color: "#FFE4E1",
    category: "Pinks",
    number: "05",
    transmissionFactor: 0.80
  },
  {
    id: "rosco-06",
    name: "R06 No Color Straw",
    color: "#FFFFF0",
    category: "Yellows",
    number: "06",
    transmissionFactor: 0.85
  },
  {
    id: "rosco-07",
    name: "R07 Pale Yellow",
    color: "#FFFFD3",
    category: "Yellows",
    number: "07",
    transmissionFactor: 0.82
  },
  {
    id: "rosco-30",
    name: "R30 Light Salmon Pink",
    color: "#FFA07A",
    category: "Pinks",
    number: "30",
    transmissionFactor: 0.40
  },
  {
    id: "rosco-31",
    name: "R31 Salmon Pink",
    color: "#FA8072",
    category: "Pinks",
    number: "31",
    transmissionFactor: 0.35
  },
  {
    id: "rosco-32",
    name: "R32 Medium Salmon Pink",
    color: "#FF6347",
    category: "Pinks",
    number: "32",
    transmissionFactor: 0.28
  },
  {
    id: "rosco-34",
    name: "R34 Flesh Pink",
    color: "#FFDAB9",
    category: "Pinks",
    number: "34",
    transmissionFactor: 0.58
  },
  {
    id: "rosco-35",
    name: "R35 Light Pink",
    color: "#FFB6C1",
    category: "Pinks",
    number: "35",
    transmissionFactor: 0.53
  },
  {
    id: "rosco-36",
    name: "R36 Medium Pink",
    color: "#FF69B4",
    category: "Pinks",
    number: "36",
    transmissionFactor: 0.44
  }
];

// Add some utility functions for sorting and filtering gels

// Sort by color (category)
export function sortGelsByColor(gels: RoscoLuxGel[]): RoscoLuxGel[] {
  return [...gels].sort((a, b) => a.category.localeCompare(b.category));
}

// Sort by number
export function sortGelsByNumber(gels: RoscoLuxGel[]): RoscoLuxGel[] {
  return [...gels].sort((a, b) => {
    const numA = parseInt(a.number);
    const numB = parseInt(b.number);
    
    // Handle non-numeric values
    if (isNaN(numA) && isNaN(numB)) return a.number.localeCompare(b.number);
    if (isNaN(numA)) return 1;
    if (isNaN(numB)) return -1;
    
    return numA - numB;
  });
}

// Helper function to get gel details by ID
export function getRoscoLuxGelByAssetId(assetId: string): RoscoLuxGel | undefined {
  return roscoLuxGels.find(gel => gel.id === assetId);
}