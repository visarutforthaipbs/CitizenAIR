// Main map page displaying Thailand districts with PM2.5 data and responsive sidebar
import React, { useState, useEffect, memo } from "react";
import {
  MapContainer,
  GeoJSON,
  CircleMarker,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";
import Sidebar from "../components/SidebarHTML";

const MapPage = memo(function MapPage() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countryBoundary, setCountryBoundary] = useState(null);
  const [neighboringCountries, setNeighboringCountries] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile/tablet
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Create GeoJSON features from CSV data
  const createGeoJsonFromCsv = (csvData) => {
    const features = csvData.map((district, index) => ({
      type: "Feature",
      properties: {
        name: district.amphoe_name,
        province: district.province_name,
        pm25_mean: district.pm25_mean,
        pm25_std: district.pm25_std,
        pm25_min: district.pm25_min,
        pm25_max: district.pm25_max,
        data_points: district.data_points,
        air_quality_category: district.air_quality_category,
        air_quality_color: district.air_quality_color,
        latitude: district.latitude,
        longitude: district.longitude,
      },
      geometry: {
        type: "Point",
        coordinates: [district.longitude, district.latitude],
      },
      id: index,
    }));

    return {
      type: "FeatureCollection",
      features: features,
    };
  };

  // Load CSV data - using updated 926-amphoe-1.csv (more accurate dataset)
  useEffect(() => {
    const loadCsvData = async () => {
      try {
        const response = await fetch("/926-amphoe-1.csv");
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            // Convert numerical fields to numbers
            const processedData = results.data
              .map((row) => ({
                ...row,
                pm25_mean: parseFloat(row.pm25_mean),
                pm25_std: parseFloat(row.pm25_std),
                pm25_min: parseFloat(row.pm25_min),
                pm25_max: parseFloat(row.pm25_max),
                latitude: parseFloat(row.latitude),
                longitude: parseFloat(row.longitude),
                data_points: parseInt(row.data_points),
                // Keep color and category as strings
                air_quality_color: row.air_quality_color,
                air_quality_category: row.air_quality_category,
              }))
              .filter((row) => row.amphoe_name && row.province_name); // Filter out empty rows

            setCsvData(processedData);

            // Create GeoJSON from CSV data instead of using mock data
            const geoJsonFromCsv = createGeoJsonFromCsv(processedData);
            setGeoJsonData(geoJsonFromCsv);

            console.log(`Loaded ${processedData.length} districts from CSV`);
            console.log("Sample data:", processedData.slice(0, 3)); // Log first 3 entries for debugging
          },
          error: (error) => {
            console.error("Error parsing CSV:", error);
          },
        });
      } catch (error) {
        console.error("Error loading CSV file:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCsvData();
  }, []);

  // Load Thailand country boundary
  useEffect(() => {
    const loadCountryBoundary = async () => {
      try {
        const response = await fetch("/thai-boundary.geojson");
        const boundaryData = await response.json();
        setCountryBoundary(boundaryData);
        console.log("Thailand boundary loaded successfully");
      } catch (error) {
        console.error("Error loading country boundary:", error);
      }
    };

    loadCountryBoundary();
  }, []);

  // Load neighboring countries boundaries
  useEffect(() => {
    const loadNeighboringCountries = async () => {
      try {
        // Try different possible filenames for neighboring countries
        const possibleFiles = [
          "/southeast-asia-boundaries.geojson",
          "/SEA-boundary-country.geojson",
          "/country_boundary.json",
        ];

        for (const filename of possibleFiles) {
          try {
            const response = await fetch(filename);
            if (response.ok) {
              const neighboringData = await response.json();
              setNeighboringCountries(neighboringData);
              console.log(`Neighboring countries loaded from: ${filename}`);
              return;
            }
          } catch {
            continue;
          }
        }

        console.log("No neighboring countries file found, skipping...");
      } catch (error) {
        console.log("Neighboring countries not available:", error.message);
      }
    };

    loadNeighboringCountries();
  }, []);

  // Get unique air quality categories and their symbols for legend
  const getAirQualityLegend = () => {
    if (!csvData.length) return [];

    const legendItems = [
      {
        category: "Good",
        thaiCategory: "ดี",
        symbol: "✓",
        svgPath: "/image/ดี.svg",
        color: "#10b981",
        bg: "#ecfdf5",
      },
      {
        category: "Moderate",
        thaiCategory: "ปานกลาง",
        symbol: "○",
        svgPath: "/image/ปานกลาง.svg",
        color: "#f59e0b",
        bg: "#fffbeb",
      },
      {
        category: "Unhealthy for Sensitive",
        thaiCategory: "เริ่มมีผลกระทบ",
        symbol: "⚠",
        svgPath: "/image/เริ่มมีผลกระทบ.svg",
        color: "#ef4444",
        bg: "#fef2f2",
      },
      {
        category: "Unhealthy",
        thaiCategory: "มีผลกระทบต่อสุขภาพ",
        symbol: "×",
        svgPath: "/image/มีผลกระทบต่อสุขภาพ.svg",
        color: "#dc2626",
        bg: "#fef2f2",
      },
      {
        category: "Hazardous",
        thaiCategory: "อันตราย",
        symbol: "☠",
        svgPath: "/image/อันตราย.svg",
        color: "#7c2d12",
        bg: "#450a0a",
      },
    ];

    // Only return items that exist in the data
    const dataCategories = new Set(
      csvData.map((row) => row.air_quality_category).filter(Boolean)
    );
    return legendItems.filter((item) => dataCategories.has(item.category));
  };

  // Thai translations for air quality categories
  const getThaiCategory = (category) => {
    const translations = {
      Good: "ดี",
      Moderate: "ปานกลาง",
      "Unhealthy for Sensitive": "เริ่มมีผลกระทบ",
      Unhealthy: "มีผลกระทบต่อสุขภาพ",
      Hazardous: "อันตราย",
    };
    return translations[category] || category;
  };

  // Custom marker symbols for different PM2.5 levels - Using custom SVG files
  const createCustomMarker = (feature) => {
    const category = feature.properties.air_quality_category || "Moderate";

    // Define colors and SVG paths for each category
    const markerConfig = {
      Good: {
        color: "#10b981", // Green
        svgPath: "/image/ดี.svg",
        size: 24,
        bg: "#ecfdf5",
      },
      Moderate: {
        color: "#f59e0b", // Amber
        svgPath: "/image/ปานกลาง.svg",
        size: 26,
        bg: "#fffbeb",
      },
      "Unhealthy for Sensitive": {
        color: "#ef4444", // Red
        svgPath: "/image/เริ่มมีผลกระทบ.svg",
        size: 28,
        bg: "#fef2f2",
      },
      Unhealthy: {
        color: "#dc2626", // Dark red
        svgPath: "/image/มีผลกระทบต่อสุขภาพ.svg",
        size: 30,
        bg: "#fef2f2",
      },
      Hazardous: {
        color: "#7c2d12", // Very dark red
        svgPath: "/image/อันตราย.svg",
        size: 32,
        bg: "#450a0a",
      },
    };

    const config = markerConfig[category] || markerConfig["Moderate"];

    // Create custom divIcon using SVG file
    const iconHtml = `
      <div style="
        width: ${config.size}px;
        height: ${config.size}px;
        position: relative;
        cursor: pointer;
        transition: all 0.3s ease;
        filter: drop-shadow(2px 3px 4px rgba(0,0,0,0.15));
        transform: rotate(${Math.random() * 6 - 3}deg);
      " class="custom-pm25-marker hand-drawn-marker" data-category="${category}">
        <img src="${config.svgPath}" 
             alt="${category}" 
             style="
               width: 100%;
               height: 100%;
               object-fit: contain;
             " />
      </div>
    `;

    return L.divIcon({
      html: iconHtml,
      className: "custom-marker-container hand-drawn-container",
      iconSize: [config.size, config.size],
      iconAnchor: [config.size / 2, config.size / 2],
      popupAnchor: [0, -config.size / 2],
    });
  };

  // Handle neighboring country interactions
  const onEachNeighboringCountry = (feature, layer) => {
    // Get country name from various possible properties in the new GeoJSON structure
    const englishName =
      feature.properties.NAME_ENGLI ||
      feature.properties.ADM0_EN ||
      feature.properties.Name ||
      feature.properties.name_th ||
      feature.properties.name ||
      "Unknown Country";

    // Map English country names to Thai
    const countryNameMapping = {
      Cambodia: "กัมพูชา",
      "Lao People's Democratic Republic (the)": "ลาว",
      Myanmar: "เมียนมาร์",
      Malaysia: "มาเลเซีย",
      Vietnam: "เวียดนาม",
    };

    const countryName = countryNameMapping[englishName] || englishName;

    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2.5,
          opacity: 0.7,
          fillOpacity: 0.1,
        });

        // Create a simple tooltip
        layer
          .bindTooltip(countryName, {
            permanent: false,
            direction: "center",
            className: "country-tooltip",
            style: {
              backgroundColor: "var(--primary-color)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-light)",
              borderRadius: "8px",
              padding: "4px 8px",
              fontSize: "12px",
              fontFamily: "'DB Helvethaica X', system-ui, sans-serif",
            },
          })
          .openTooltip();
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle({
          weight: 1.5,
          opacity: 0.4,
          fillOpacity: 0.05,
        });
        layer.closeTooltip();
      },
    });
  };

  // Handle district interactions
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;

        // Scale up the marker on hover with hand-drawn wobble effect
        const markerElement = layer._icon?.querySelector(".hand-drawn-marker");
        if (markerElement) {
          markerElement.style.transform =
            "scale(1.2) rotate(" + (Math.random() * 8 - 4) + "deg)";
          markerElement.style.filter =
            "drop-shadow(3px 5px 8px rgba(0,0,0,0.25))";
          markerElement.style.zIndex = "1000";
        }

        // Show district name tooltip on hover
        const districtName = feature.properties.name;
        const provinceName = feature.properties.province;
        const pm25Value = feature.properties.pm25_mean?.toFixed(1) || "N/A";
        const category = feature.properties.air_quality_category || "N/A";

        layer
          .bindTooltip(
            `<div style="text-align: center;">
              <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 2px;">
                ${districtName}
              </div>
              <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 4px;">
                จ.${provinceName}
              </div>
              <div style="font-size: 12px; color: var(--secondary-color); font-weight: 600;">
                PM2.5: ${pm25Value} μg/m³
              </div>
              <div style="font-size: 10px; color: var(--text-secondary); margin-top: 2px;">
                ${getThaiCategory(category)}
              </div>
            </div>`,
            {
              permanent: false,
              direction: "top",
              className: "district-tooltip",
              offset: [0, -10],
            }
          )
          .openTooltip();
      },
      mouseout: (e) => {
        const layer = e.target;

        // Reset marker scale with slight random rotation
        const markerElement = layer._icon?.querySelector(".hand-drawn-marker");
        if (markerElement) {
          markerElement.style.transform =
            "scale(1) rotate(" + (Math.random() * 4 - 2) + "deg)";
          markerElement.style.filter =
            "drop-shadow(2px 3px 4px rgba(0,0,0,0.15))";
          markerElement.style.zIndex = "auto";
        }

        layer.closeTooltip();
      },
      click: () => {
        const districtName = feature.properties.name;
        const provinceName = feature.properties.province;

        console.log(`Clicked district: ${districtName}, ${provinceName}`);

        const districtData = {
          name: districtName,
          province: provinceName,
          pm25_5yr_avg: feature.properties.pm25_mean,
          pm25_std: feature.properties.pm25_std,
          pm25_min: feature.properties.pm25_min,
          pm25_max: feature.properties.pm25_max,
          data_points: feature.properties.data_points,
          air_quality_category: feature.properties.air_quality_category,
          air_quality_color: feature.properties.air_quality_color,
          population: 50000, // Default since CSV doesn't have population data
          yearlyData: [],
          monthlyTrend: [],
          coordinates: {
            lat: feature.properties.latitude,
            lng: feature.properties.longitude,
          },
          hasRealData: true, // All data is now real CSV data
        };
        setSelectedDistrict(districtData);

        // Open sidebar on mobile when district is selected
        if (isMobile) {
          setIsSidebarOpen(true);
        }
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - var(--navbar-height-mobile))",
        width: "100%",
        fontFamily: "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
        background: "var(--primary-color)",
        position: "relative",
      }}
      className="mappage-container"
    >
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 998,
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar */}
      <div
        style={{
          width: isMobile ? "85vw" : "var(--sidebar-width-desktop)",
          maxWidth: isMobile ? "400px" : "none",
          backgroundColor: "var(--primary-color)",
          borderRight: "1px solid var(--border-light)",
          overflowY: "auto",
          position: isMobile ? "fixed" : "relative",
          top: isMobile ? 0 : "auto",
          left: isMobile ? (isSidebarOpen ? 0 : "-100%") : "auto",
          height: isMobile ? "100vh" : "auto",
          zIndex: isMobile ? 999 : "auto",
          transition: isMobile ? "left 0.3s ease-in-out" : "none",
          boxShadow:
            isMobile && isSidebarOpen ? "var(--sketch-shadow-hover)" : "none",
        }}
        className="mappage-sidebar"
      >
        {/* Mobile close button */}
        {isMobile && (
          <div
            style={{
              position: "sticky",
              top: 0,
              right: 0,
              padding: "16px",
              backgroundColor: "var(--primary-color)",
              borderBottom: "1px solid var(--border-light)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <span
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "var(--text-primary)",
              }}
            >
              ข้อมูลอำเภอ
            </span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "8px",
                transition: "background-color 0.2s ease",
                minHeight: "var(--touch-target-min)",
                minWidth: "var(--touch-target-min)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        )}

        <Sidebar
          selectedDistrict={selectedDistrict}
          onWordCloudUpdate={() => {}}
        />
      </div>

      {/* Map Area */}
      <div
        style={{
          flex: 1,
          position: "relative",
          width: isMobile ? "100%" : "auto",
        }}
        className="mappage-map-container"
      >
        {/* Mobile info button - shows when district selected */}
        {isMobile && selectedDistrict && !isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              backgroundColor: "var(--secondary-color)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              zIndex: 400,
              boxShadow: "var(--sketch-shadow-hover)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              minHeight: "var(--touch-target-min)",
            }}
          >
            <span>ℹ️</span>
            <span>ดูข้อมูล</span>
          </button>
        )}

        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "var(--primary-color)",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              zIndex: 1000,
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "15px",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                border: "2px solid var(--border-light)",
                borderTop: "2px solid var(--secondary-color)",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            กำลังโหลดข้อมูล PM2.5...
          </div>
        )}
        <div
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        >
          {/* SVG Filter for sketch effect */}
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <filter id="roughPaper" x="0%" y="0%" width="100%" height="100%">
                <feTurbulence
                  baseFrequency="0.04"
                  numOctaves="5"
                  result="noise"
                  seed="1"
                />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                <feGaussianBlur stdDeviation="0.2" result="blur" />
              </filter>
            </defs>
          </svg>

          <MapContainer
            center={[15.8, 100.0]}
            zoom={7}
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "var(--light-bg)",
              backgroundImage: `radial-gradient(circle at 25px 25px, var(--border-light) 1px, transparent 0),
                               radial-gradient(circle at 75px 75px, rgba(229, 229, 229, 0.3) 0.5px, transparent 0)`,
              backgroundSize: "100px 100px, 50px 50px",
            }}
          >
            {/* ArcGIS World Terrain Base Map - Reliable and works without API key */}
            <TileLayer
              url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              maxZoom={18}
              opacity={0.7}
            />
            {/* Neighboring Countries - Hand-drawn sketch style with subtle appearance */}
            {neighboringCountries && (
              <GeoJSON
                data={neighboringCountries}
                style={{
                  fillColor: "rgba(254, 80, 0, 0.03)",
                  weight: 1.5,
                  opacity: 0.4,
                  color: "var(--text-secondary)",
                  fillOpacity: 0.05,
                  dashArray: "6, 3, 2, 3",
                  lineCap: "round",
                  lineJoin: "round",
                }}
                onEachFeature={onEachNeighboringCountry}
              />
            )}
            {/* Thailand Country Boundary - Hand-drawn sketch style */}
            {countryBoundary && (
              <GeoJSON
                data={countryBoundary}
                style={{
                  fillColor: "transparent",
                  weight: 2,
                  opacity: 0.6,
                  color: "var(--text-secondary)",
                  fillOpacity: 0,
                  dashArray: "8, 4, 2, 4",
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            )}
            {/* PM2.5 Data Points */}
            {geoJsonData && (
              <GeoJSON
                data={geoJsonData}
                pointToLayer={(feature, latlng) => {
                  return L.marker(latlng, {
                    icon: createCustomMarker(feature),
                  });
                }}
                onEachFeature={onEachFeature}
              />
            )}
          </MapContainer>
        </div>

        {/* Floating Legend */}
        <div
          className="map-legend"
          style={{
            position: "absolute",
            bottom: "100px",
            right: "32px",
            backgroundColor: "var(--primary-color)",
            borderRadius: "20px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            border: "2px dotted var(--border-light)",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                background: "var(--secondary-color)",
                borderRadius: "50%",
              }}
            />
            <h3
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                fontWeight: "600",
                margin: 0,
              }}
            >
              หมวดหมู่คุณภาพอากาศ
            </h3>
          </div>
          {csvData.length > 0 && (
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                marginBottom: "16px",
                padding: "8px 12px",
                backgroundColor: "var(--light-bg)",
                borderRadius: "12px",
                opacity: 0.9,
              }}
            >
              แสดงข้อมูลจริง {csvData.length} อำเภอ
              <br />
              สัญลักษณ์แสดงระดับ PM2.5
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              fontSize: "12px",
            }}
          >
            {getAirQualityLegend().map((item, index) => (
              <div
                key={item.category}
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    position: "relative",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.svgPath}
                    alt={item.thaiCategory}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transform: `rotate(${index * 2 - 1}deg)`,
                    }}
                  />
                </div>
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "'DB Helvethaica X', system-ui, sans-serif",
                  }}
                >
                  {item.thaiCategory}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom tooltip and marker styles */}
      <style>{`
        /* Responsive MapPage Styles */
        .mappage-container {
          height: calc(100vh - var(--navbar-height-mobile));
        }
        
        /* Hide map legend on mobile and tablet devices */
        @media (max-width: 768px) {
          .map-legend {
            display: none !important;
          }
        }
        
        @media (min-width: 769px) {
          .mappage-container {
            height: calc(100vh - var(--navbar-height));
          }
          
          .mappage-sidebar {
            width: var(--sidebar-width-desktop) !important;
            max-width: none !important;
            position: relative !important;
            left: auto !important;
            height: auto !important;
            transition: none !important;
            box-shadow: none !important;
          }
          
          .mappage-map-container {
            width: auto !important;
          }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
          .mappage-container {
            height: calc(100vh - var(--navbar-height-mobile));
          }
          
          .mappage-sidebar {
            width: 90vw !important;
            max-width: 450px !important;
          }
        }
        
        @media (max-width: 480px) {
          .mappage-sidebar {
            width: 95vw !important;
            max-width: 350px !important;
          }
          
          .leaflet-container {
            font-size: 12px;
          }
          
          .custom-pm25-marker {
            transform: scale(0.8);
          }
        }
        
        /* Touch improvements for mobile */
        @media (hover: none) and (pointer: coarse) {
          .custom-pm25-marker {
            transform: scale(1.1);
          }
          
          .leaflet-popup-content {
            font-size: 16px;
            line-height: 1.5;
          }
        }

        .custom-marker-container, .hand-drawn-container {
          background: transparent !important;
          border: none !important;
        }
        
        .hand-drawn-marker {
          animation: gentle-wobble 3s ease-in-out infinite;
        }
        
        .hand-drawn-marker:hover {
          animation: hover-wobble 0.5s ease-in-out !important;
          z-index: 1000 !important;
        }
        
        @keyframes gentle-wobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(0.5deg) scale(1.01); }
          50% { transform: rotate(-0.3deg) scale(0.99); }
          75% { transform: rotate(0.2deg) scale(1.005); }
        }
        
        @keyframes hover-wobble {
          0% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.15) rotate(2deg); }
          100% { transform: scale(1.2) rotate(-1deg); }
        }
        
        .country-tooltip {
          background-color: var(--primary-color) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border-light) !important;
          border-radius: 8px !important;
          padding: 4px 8px !important;
          font-size: 12px !important;
          font-family: 'DB Helvethaica X', system-ui, sans-serif !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
        }
        
        .country-tooltip::before {
          border-top-color: var(--primary-color) !important;
        }

        .district-tooltip {
          background-color: var(--primary-color) !important;
          color: var(--text-primary) !important;
          border: 1px solid var(--border-light) !important;
          border-radius: 12px !important;
          padding: 8px 12px !important;
          font-size: 13px !important;
          font-family: 'DB Helvethaica X', system-ui, sans-serif !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
          min-width: 120px !important;
        }
        
        .district-tooltip::before {
          border-top-color: var(--primary-color) !important;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

export default MapPage;
