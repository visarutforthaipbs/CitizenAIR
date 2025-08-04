// PM2.5 Yearly Chart Component for displaying district daily data
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Thai month names
const thaiMonths = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

const PM25YearlyChart = ({ selectedDistrict }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("monthly"); // 'daily' or 'monthly'

  // Function to normalize Thai text for filename matching
  const normalizeThaiText = (text) => {
    if (!text) return "";
    return text
      .replace(/ั/g, "") // Remove sara a
      .replace(/่/g, "") // Remove mai ek (tone mark)
      .replace(/้/g, "") // Remove mai tho (tone mark)
      .replace(/๊/g, "") // Remove mai tri (tone mark)
      .replace(/๋/g, "") // Remove mai chattawa (tone mark)
      .replace(/์/g, "") // Remove thanthakhat
      .replace(/ํ/g, "") // Remove nikkhahit
      .replace(/ฺ/g, "") // Remove phinthu
      .trim();
  };

  // Load PM2.5 data for selected district
  useEffect(() => {
    if (!selectedDistrict?.name || !selectedDistrict?.province) {
      setChartData([]);
      return;
    }

    const loadDistrictData = async () => {
      setLoading(true);
      setError(null);

      try {
        // With cleaned up filenames, try direct match first, then fallback to normalized version
        const possibleFilenames = [
          `${selectedDistrict.name}_${selectedDistrict.province}.json`,
          `${normalizeThaiText(selectedDistrict.name)}_${normalizeThaiText(
            selectedDistrict.province
          )}.json`,
        ];

        let response = null;
        let successfulFilename = null;

        // Try each filename variation
        for (const filename of possibleFilenames) {
          console.log(`Trying file: ${filename}`);
          try {
            response = await fetch(`/data/districts_json/${filename}`);
            if (response.ok) {
              successfulFilename = filename;
              break;
            }
          } catch {
            // Continue to next filename
            continue;
          }
        }

        if (!response || !response.ok) {
          throw new Error("ไม่พบข้อมูล PM2.5 สำหรับอำเภอนี้");
        }

        console.log(`Successfully loaded: ${successfulFilename}`);

        if (!response.ok) {
          throw new Error("ไม่พบข้อมูล PM2.5 สำหรับอำเภอนี้");
        }

        const data = await response.json();

        if (viewMode === "monthly") {
          // Process monthly data
          const monthlyData = data.district_data.monthly_data.map((month) => ({
            month: thaiMonths[month.month - 1],
            monthNumber: month.month,
            pm25: parseFloat(month.average_pm25.toFixed(1)),
            min: parseFloat(month.min_pm25.toFixed(1)),
            max: parseFloat(month.max_pm25.toFixed(1)),
            air_quality: getAirQualityCategory(month.average_pm25),
          }));
          setChartData(monthlyData);
        } else {
          // Process daily data (showing all 365 days)
          const dailyData = [];
          data.district_data.monthly_data.forEach((month) => {
            month.daily_measurements.forEach((day) => {
              dailyData.push({
                date: `${month.month}/${day.day}`,
                day: dailyData.length + 1,
                pm25: parseFloat(day.pm25.toFixed(1)),
                air_quality: day.air_quality,
                month: thaiMonths[month.month - 1],
              });
            });
          });
          setChartData(dailyData);
        }
      } catch (err) {
        console.error("Error loading district PM2.5 data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDistrictData();
  }, [selectedDistrict, viewMode]);

  // Get air quality category based on PM2.5 value
  const getAirQualityCategory = (pm25) => {
    if (pm25 <= 25) return "ดี";
    if (pm25 <= 37) return "ปานกลาง";
    if (pm25 <= 50) return "เริ่มมีผลกระทบ";
    if (pm25 <= 90) return "มีผลกระทบต่อสุขภาพ";
    return "อันตราย";
  };

  // Get color for PM2.5 level
  const getPM25Color = (pm25) => {
    if (pm25 <= 25) return "#10b981"; // Green
    if (pm25 <= 37) return "#f59e0b"; // Amber
    if (pm25 <= 50) return "#ef4444"; // Red
    if (pm25 <= 90) return "#dc2626"; // Dark red
    return "#7c2d12"; // Very dark red
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "var(--primary-color)",
            border: "1px solid var(--border-light)",
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "var(--sketch-shadow)",
            fontSize: "12px",
          }}
        >
          <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>
            {viewMode === "monthly" ? `เดือน${label}` : `วันที่ ${label}`}
          </p>
          <p style={{ margin: "0 0 4px 0", color: getPM25Color(data.pm25) }}>
            PM2.5: {data.pm25} µg/m³
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "11px",
              color: "var(--text-secondary)",
            }}
          >
            {data.air_quality}
          </p>
          {viewMode === "monthly" && (
            <>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                }}
              >
                ต่ำสุด: {data.min} µg/m³
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "11px",
                  color: "var(--text-secondary)",
                }}
              >
                สูงสุด: {data.max} µg/m³
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  if (!selectedDistrict) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          color: "var(--text-secondary)",
          fontSize: "14px",
          backgroundColor: "var(--light-bg)",
          borderRadius: "12px",
          border: "1px solid var(--border-light)",
          marginBottom: "20px",
        }}
      >
        คลิกที่อำเภอบนแผนที่เพื่อดูกราฟ PM2.5
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "var(--light-bg)",
        borderRadius: "16px",
        padding: "20px",
        border: "1px solid var(--border-light)",
        marginBottom: "24px",
      }}
    >
      {/* Chart Header */}
      <div style={{ marginBottom: "16px" }}>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "8px",
          }}
        >
          PM2.5 เฉลี่ย 5 ปี
        </h3>
        <p
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            marginBottom: "12px",
          }}
        >
          อำเภอ{selectedDistrict.name} จังหวัด{selectedDistrict.province}
        </p>

        {/* View Mode Toggle */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <button
            onClick={() => setViewMode("monthly")}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              borderRadius: "6px",
              border: "1px solid var(--border-light)",
              backgroundColor:
                viewMode === "monthly"
                  ? "var(--secondary-color)"
                  : "var(--primary-color)",
              color: viewMode === "monthly" ? "white" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            รายเดือน
          </button>
          <button
            onClick={() => setViewMode("daily")}
            style={{
              padding: "6px 12px",
              fontSize: "12px",
              borderRadius: "6px",
              border: "1px solid var(--border-light)",
              backgroundColor:
                viewMode === "daily"
                  ? "var(--secondary-color)"
                  : "var(--primary-color)",
              color: viewMode === "daily" ? "white" : "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            รายวัน
          </button>
        </div>
      </div>

      {/* Chart Content */}
      {loading && (
        <div
          style={{
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              width: "20px",
              height: "20px",
              border: "2px solid var(--border-light)",
              borderTop: "2px solid var(--secondary-color)",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              marginRight: "8px",
            }}
          />
          กำลังโหลดข้อมูล...
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            color: "#dc2626",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}

      {!loading && !error && chartData.length > 0 && (
        <div style={{ height: "250px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-light)"
              />
              <XAxis
                dataKey={viewMode === "monthly" ? "month" : "day"}
                tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                interval={viewMode === "daily" ? 30 : 0}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
                label={{
                  value: "PM2.5 (µg/m³)",
                  angle: -90,
                  position: "insideLeft",
                  style: { textAnchor: "middle", fontSize: "10px" },
                }}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Reference lines for air quality standards */}
              <ReferenceLine
                y={25}
                stroke="#10b981"
                strokeDasharray="2 2"
                opacity={0.7}
              />
              <ReferenceLine
                y={37}
                stroke="#f59e0b"
                strokeDasharray="2 2"
                opacity={0.7}
              />
              <ReferenceLine
                y={50}
                stroke="#ef4444"
                strokeDasharray="2 2"
                opacity={0.7}
              />
              <ReferenceLine
                y={90}
                stroke="#dc2626"
                strokeDasharray="2 2"
                opacity={0.7}
              />

              <Line
                type="monotone"
                dataKey="pm25"
                stroke="var(--secondary-color)"
                strokeWidth={2}
                dot={{ fill: "var(--secondary-color)", strokeWidth: 0, r: 2 }}
                activeDot={{ r: 4, fill: "var(--secondary-color)" }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Air Quality Legend */}
          <div
            style={{
              marginTop: "0px",
              fontSize: "10px",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "#10b981" }}>≤25 ดี</span>
              <span style={{ color: "#f59e0b" }}>26-37 ปานกลาง</span>
              <span style={{ color: "#ef4444" }}>38-50 เริ่มมีผลกระทบ</span>
              <span style={{ color: "#dc2626" }}>51-90 มีผลกระทบ</span>
              <span style={{ color: "#7c2d12" }}>&gt;90 อันตราย</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PM25YearlyChart;
