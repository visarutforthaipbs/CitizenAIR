// Thailand districts GeoJSON data for CitizenAIR application
// Integrated with PM2.5 5-year average data from thailand-districts.js
import pm25Data from "./pm25-5yr.json";

// Create a mapping function to merge PM2.5 data with GeoJSON
const mergeDistrictData = () => {
  const pm25Map = new Map();
  pm25Data.districts.forEach((district) => {
    pm25Map.set(district.districtName, district);
  });

  return pm25Map;
};

const pm25DataMap = mergeDistrictData();

const thailandDistricts = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "เขตบางรัก",
        province: "กรุงเทพมหานคร",
        pm25_5yr_avg: pm25DataMap.get("เขตบางรัก")?.pm25_5yr_avg || 85,
        population: 48000,
        yearlyData: pm25DataMap.get("เขตบางรัก")?.yearlyData || [],
        monthlyTrend: pm25DataMap.get("เขตบางรัก")?.monthlyTrend || [],
        coordinates: pm25DataMap.get("เขตบางรัก")?.coordinates || {
          lat: 13.725,
          lng: 100.52,
        },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.515, 13.72],
            [100.525, 13.72],
            [100.525, 13.73],
            [100.515, 13.73],
            [100.515, 13.72],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "เขตปทุมวัน",
        province: "กรุงเทพมหานคร",
        pm25_5yr_avg: pm25DataMap.get("เขตปทุมวัน")?.pm25_5yr_avg || 78,
        population: 52000,
        yearlyData: pm25DataMap.get("เขตปทุมวัน")?.yearlyData || [],
        monthlyTrend: pm25DataMap.get("เขตปทุมวัน")?.monthlyTrend || [],
        coordinates: pm25DataMap.get("เขตปทุมวัน")?.coordinates || {
          lat: 13.735,
          lng: 100.525,
        },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.52, 13.73],
            [100.53, 13.73],
            [100.53, 13.74],
            [100.52, 13.74],
            [100.52, 13.73],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "เขตวัฒนา",
        province: "กรุงเทพมหานคร",
        pm25_5yr_avg: pm25DataMap.get("เขตวัฒนา")?.pm25_5yr_avg || 72,
        population: 65000,
        yearlyData: pm25DataMap.get("เขตวัฒนา")?.yearlyData || [],
        monthlyTrend: pm25DataMap.get("เขตวัฒนา")?.monthlyTrend || [],
        coordinates: pm25DataMap.get("เขตวัฒนา")?.coordinates || {
          lat: 13.725,
          lng: 100.535,
        },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.53, 13.72],
            [100.54, 13.72],
            [100.54, 13.73],
            [100.53, 13.73],
            [100.53, 13.72],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "เขตคลองเตย",
        province: "กรุงเทพมหานคร",
        pm25_5yr_avg: 82,
        population: 44000,
        yearlyData: [
          { year: 2019, avg: 80, max: 152, min: 26 },
          { year: 2020, avg: 77, max: 148, min: 23 },
          { year: 2021, avg: 85, max: 162, min: 29 },
          { year: 2022, avg: 88, max: 168, min: 32 },
          { year: 2023, avg: 80, max: 155, min: 27 },
        ],
        monthlyTrend: [
          { month: 1, avg: 102 },
          { month: 2, avg: 108 },
          { month: 3, avg: 95 },
          { month: 4, avg: 85 },
          { month: 5, avg: 62 },
          { month: 6, avg: 55 },
          { month: 7, avg: 58 },
          { month: 8, avg: 65 },
          { month: 9, avg: 70 },
          { month: 10, avg: 76 },
          { month: 11, avg: 92 },
          { month: 12, avg: 105 },
        ],
        coordinates: { lat: 13.715, lng: 100.545 },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.54, 13.71],
            [100.55, 13.71],
            [100.55, 13.72],
            [100.54, 13.72],
            [100.54, 13.71],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "อำเภอเมืองเชียงใหม่",
        province: "เชียงใหม่",
        pm25_5yr_avg:
          pm25DataMap.get("อำเภอเมืองเชียงใหม่")?.pm25_5yr_avg || 125,
        population: 120000,
        yearlyData: pm25DataMap.get("อำเภอเมืองเชียงใหม่")?.yearlyData || [],
        monthlyTrend:
          pm25DataMap.get("อำเภอเมืองเชียงใหม่")?.monthlyTrend || [],
        coordinates: pm25DataMap.get("อำเภอเมืองเชียงใหม่")?.coordinates || {
          lat: 18.8,
          lng: 99.0,
        },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [98.98, 18.78],
            [99.02, 18.78],
            [99.02, 18.82],
            [98.98, 18.82],
            [98.98, 18.78],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "อำเภอหางดง",
        province: "เชียงใหม่",
        pm25_5yr_avg: pm25DataMap.get("อำเภอหางดง")?.pm25_5yr_avg || 115,
        population: 85000,
        yearlyData: pm25DataMap.get("อำเภอหางดง")?.yearlyData || [],
        monthlyTrend: pm25DataMap.get("อำเภอหางดง")?.monthlyTrend || [],
        coordinates: pm25DataMap.get("อำเภอหางดง")?.coordinates || {
          lat: 18.72,
          lng: 98.97,
        },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [98.95, 18.7],
            [98.99, 18.7],
            [98.99, 18.74],
            [98.95, 18.74],
            [98.95, 18.7],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "อำเภอเมืองลำพูน",
        province: "ลำพูน",
        pm25_5yr_avg: pm25DataMap.get("อำเภอเมืองลำพูน")?.pm25_5yr_avg || 98,
        population: 75000,
        yearlyData: pm25DataMap.get("อำเภอเมืองลำพูน")?.yearlyData || [],
        monthlyTrend: pm25DataMap.get("อำเภอเมืองลำพูน")?.monthlyTrend || [],
        coordinates: pm25DataMap.get("อำเภอเมืองลำพูน")?.coordinates || {
          lat: 18.57,
          lng: 99.02,
        },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [99.0, 18.55],
            [99.04, 18.55],
            [99.04, 18.59],
            [99.0, 18.59],
            [99.0, 18.55],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "อำเภอเมืองกำแพงเพชร",
        province: "กำแพงเพชร",
        pm25_5yr_avg: 105,
        population: 68000,
        yearlyData: [
          { year: 2019, avg: 102, max: 195, min: 15 },
          { year: 2020, avg: 98, max: 188, min: 12 },
          { year: 2021, avg: 108, max: 205, min: 18 },
          { year: 2022, avg: 112, max: 215, min: 22 },
          { year: 2023, avg: 105, max: 198, min: 16 },
        ],
        monthlyTrend: [
          { month: 1, avg: 125 },
          { month: 2, avg: 142 },
          { month: 3, avg: 168 },
          { month: 4, avg: 135 },
          { month: 5, avg: 85 },
          { month: 6, avg: 45 },
          { month: 7, avg: 52 },
          { month: 8, avg: 68 },
          { month: 9, avg: 78 },
          { month: 10, avg: 95 },
          { month: 11, avg: 118 },
          { month: 12, avg: 142 },
        ],
        coordinates: { lat: 16.5, lng: 99.52 },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [99.5, 16.48],
            [99.54, 16.48],
            [99.54, 16.52],
            [99.5, 16.52],
            [99.5, 16.48],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "อำเภอเมืองพิษณุโลก",
        province: "พิษณุโลก",
        pm25_5yr_avg: 88,
        population: 95000,
        yearlyData: [
          { year: 2019, avg: 85, max: 165, min: 18 },
          { year: 2020, avg: 82, max: 158, min: 15 },
          { year: 2021, avg: 92, max: 175, min: 22 },
          { year: 2022, avg: 95, max: 182, min: 25 },
          { year: 2023, avg: 86, max: 168, min: 19 },
        ],
        monthlyTrend: [
          { month: 1, avg: 108 },
          { month: 2, avg: 118 },
          { month: 3, avg: 132 },
          { month: 4, avg: 105 },
          { month: 5, avg: 75 },
          { month: 6, avg: 52 },
          { month: 7, avg: 58 },
          { month: 8, avg: 68 },
          { month: 9, avg: 75 },
          { month: 10, avg: 85 },
          { month: 11, avg: 102 },
          { month: 12, avg: 118 },
        ],
        coordinates: { lat: 16.82, lng: 100.27 },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [100.25, 16.8],
            [100.29, 16.8],
            [100.29, 16.84],
            [100.25, 16.84],
            [100.25, 16.8],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "อำเภอเมืองสุโขทัย",
        province: "สุโขทัย",
        pm25_5yr_avg: 92,
        population: 58000,
        yearlyData: [
          { year: 2019, avg: 89, max: 172, min: 16 },
          { year: 2020, avg: 86, max: 165, min: 13 },
          { year: 2021, avg: 96, max: 185, min: 19 },
          { year: 2022, avg: 99, max: 192, min: 22 },
          { year: 2023, avg: 90, max: 175, min: 17 },
        ],
        monthlyTrend: [
          { month: 1, avg: 112 },
          { month: 2, avg: 125 },
          { month: 3, avg: 145 },
          { month: 4, avg: 118 },
          { month: 5, avg: 78 },
          { month: 6, avg: 48 },
          { month: 7, avg: 55 },
          { month: 8, avg: 65 },
          { month: 9, avg: 72 },
          { month: 10, avg: 88 },
          { month: 11, avg: 105 },
          { month: 12, avg: 125 },
        ],
        coordinates: { lat: 17.02, lng: 99.82 },
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [99.8, 17.0],
            [99.84, 17.0],
            [99.84, 17.04],
            [99.8, 17.04],
            [99.8, 17.0],
          ],
        ],
      },
    },
  ],
};

export default thailandDistricts;
