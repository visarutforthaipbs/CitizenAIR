// Sidebar component for displaying district information and controls
import React, { useState, useEffect, useCallback } from "react";
import WordCloudComponent from "./WordCloudComponent";
import PM25YearlyChart from "./PM25YearlyChart";
import {
  getPm25ByLatLng,
  getAirQualityStatus,
  getPm25Color,
  formatPm25Value,
} from "../utils/pm25Api";
import { API_BASE_URL } from "../config/constants";

const SidebarHTML = ({ selectedDistrict, onWordCloudUpdate }) => {
  const [crowdsourceData, setCrowdsourceData] = useState({
    ideas: [],
    wordCloudData: [],
  });
  const [newIdea, setNewIdea] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCrowdsource, setShowCrowdsource] = useState(false);

  // Real-time PM2.5 state
  const [currentPm25, setCurrentPm25] = useState(null);
  const [pm25Loading, setPm25Loading] = useState(false);
  const [pm25Error, setPm25Error] = useState(null);

  // Fetch crowdsource data for a district
  const fetchCrowdsourceData = useCallback(
    async (districtName) => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/crowdsource/ideas/${encodeURIComponent(
            districtName
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          setCrowdsourceData(data);
          if (onWordCloudUpdate) {
            onWordCloudUpdate(data.wordCloudData);
          }
        } else {
          setCrowdsourceData({ ideas: [], wordCloudData: [] });
        }
      } catch (error) {
        console.error("Error fetching crowdsource data:", error);
        setCrowdsourceData({ ideas: [], wordCloudData: [] });
      }
    },
    [onWordCloudUpdate]
  );

  // Fetch crowdsource data when district changes
  useEffect(() => {
    if (selectedDistrict?.name) {
      fetchCrowdsourceData(selectedDistrict.name);
      setShowCrowdsource(true);

      // Fetch real-time PM2.5 data if coordinates are available
      if (
        selectedDistrict.coordinates?.lat &&
        selectedDistrict.coordinates?.lng
      ) {
        const fetchPm25Data = async () => {
          setPm25Loading(true);
          setPm25Error(null);

          try {
            const pm25Data = await getPm25ByLatLng(
              selectedDistrict.coordinates.lat,
              selectedDistrict.coordinates.lng
            );
            setCurrentPm25(pm25Data);
          } catch (error) {
            console.error("Error fetching current PM2.5:", error);
            setPm25Error("ไม่สามารถดึงข้อมูล PM2.5 ขณะนี้ได้");
            setCurrentPm25(null);
          } finally {
            setPm25Loading(false);
          }
        };

        fetchPm25Data();
      }
    } else {
      setShowCrowdsource(false);
      setCrowdsourceData({ ideas: [], wordCloudData: [] });
      setCurrentPm25(null);
      setPm25Error(null);
    }
  }, [selectedDistrict, fetchCrowdsourceData]);

  // Submit new idea
  const submitIdea = async () => {
    if (!newIdea.trim() || !selectedDistrict?.name) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/crowdsource/ideas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district: selectedDistrict.name,
          province: selectedDistrict.province,
          idea: newIdea.trim(),
          author: authorName.trim() || "ไม่ระบุชื่อ",
        }),
      });

      if (response.ok) {
        setNewIdea("");
        setAuthorName("");
        // Refresh data
        await fetchCrowdsourceData(selectedDistrict.name);
      } else {
        console.error("Failed to submit idea");
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get air quality status in Thai
  const getAirQualityStatusThai = (category) => {
    const statusMap = {
      Good: "ดี",
      Moderate: "ปานกลาง",
      "Unhealthy for Sensitive": "เริ่มมีผลกระทบ",
      Unhealthy: "มีผลกระทบต่อสุขภาพ",
      Hazardous: "อันตราย",
    };
    return statusMap[category] || category;
  };

  // Function to get status color
  const getStatusColor = (category) => {
    const colorMap = {
      Good: "rgba(254, 80, 0, 0.2)",
      Moderate: "rgba(254, 80, 0, 0.4)",
      "Unhealthy for Sensitive": "rgba(254, 80, 0, 0.6)",
      Unhealthy: "rgba(254, 80, 0, 0.8)",
      Hazardous: "rgba(254, 80, 0, 1.0)",
    };
    return colorMap[category] || "rgba(254, 80, 0, 0.5)";
  };

  return (
    <div
      style={{
        height: "100%",
        padding: "16px",
        fontFamily: "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
        backgroundColor: "var(--primary-color)",
        borderRight: "2px solid var(--secondary-color)",
        color: "var(--text-primary)",
      }}
      className="sidebar-container"
    >
      {/* Current PM2.5 Level */}
      {selectedDistrict && (
        <div
          style={{
            backgroundColor: "var(--light-bg)",
            borderRadius: "16px",
            padding: "20px",
            border: "1px solid var(--border-light)",
            marginBottom: "24px",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "12px",
            }}
          >
            ฝุ่น PM2.5 ในอำเภอ{selectedDistrict.name} ขณะนี้
          </h3>

          {pm25Loading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid var(--border-light)",
                  borderTop: "2px solid var(--secondary-color)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <span
                style={{ fontSize: "14px", color: "var(--text-secondary)" }}
              >
                กำลังโหลดข้อมูล...
              </span>
            </div>
          ) : pm25Error ? (
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(244, 67, 54, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(244, 67, 54, 0.2)",
              }}
            >
              <span style={{ fontSize: "14px", color: "#d32f2f" }}>
                {pm25Error}
              </span>
            </div>
          ) : currentPm25 ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "28px",
                      fontWeight: "900",
                      color: getPm25Color(currentPm25.value),
                    }}
                  >
                    {formatPm25Value(currentPm25.value)}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "var(--text-secondary)",
                      fontWeight: "500",
                    }}
                  >
                    μg/m³
                  </span>
                </div>
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: getPm25Color(currentPm25.value),
                    color: "white",
                    padding: "6px 12px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {getAirQualityStatus(currentPm25.value)}
                </div>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  margin: 0,
                }}
              >
                อัปเดตล่าสุด:{" "}
                {new Date(currentPm25.timestamp).toLocaleString("th-TH")}
              </p>
            </div>
          ) : (
            <div
              style={{
                padding: "12px",
                backgroundColor: "rgba(158, 158, 158, 0.1)",
                borderRadius: "8px",
                textAlign: "center",
              }}
            >
              <span
                style={{ fontSize: "14px", color: "var(--text-secondary)" }}
              >
                ไม่มีข้อมูล PM2.5 ขณะนี้
              </span>
            </div>
          )}
        </div>
      )}
      {/* PM2.5 Yearly Chart */}
      <PM25YearlyChart selectedDistrict={selectedDistrict} />

      {/* Crowdsourcing Section */}
      {showCrowdsource && selectedDistrict && (
        <div
          className="crowdsource-section"
          style={{
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          {/* Section Header */}
          <div style={{ marginBottom: "16px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                color: "var(--secondary-color)",
                marginBottom: "8px",
              }}
            >
              ฝุ่นควัน {selectedDistrict.name} ต้องแก้ยังไง?
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: "1.5",
              }}
            >
              แบ่งปันไอเดียการแก้ปัญหาฝุ่น PM2.5 ในอำเภอนี้
            </p>
          </div>

          {/* Word Cloud */}
          {crowdsourceData.wordCloudData &&
            crowdsourceData.wordCloudData.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "8px",
                  }}
                >
                  คำที่ใช้บ่อย ({crowdsourceData.count} ไอเดีย)
                </h4>
                <WordCloudComponent
                  words={crowdsourceData.wordCloudData}
                  width={280}
                  height={150}
                />
              </div>
            )}

          {/* Idea Submission Form */}
          <div style={{ marginBottom: "16px" }}>
            <h4
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--text-primary)",
                marginBottom: "8px",
              }}
            >
              แชร์ไอเดียของคุณ
            </h4>

            {/* Author Name Input */}
            <input
              type="text"
              placeholder="ชื่อของคุณ (ไม่บังคับ)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="crowdsource-input"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--border-light)",
                borderRadius: "8px",
                fontSize: "14px",
                marginBottom: "8px",
                fontFamily: "'DB Helvethaica X', system-ui, sans-serif",
              }}
            />

            {/* Idea Textarea */}
            <textarea
              placeholder={`เช่น ปลูกต้นไผ่รอบบ้าน, ใช้เครื่องกรองอากาศ, รณรงค์ไม่เผาใส...`}
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              rows={3}
              className="crowdsource-input"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid var(--border-light)",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "'DB Helvethaica X', system-ui, sans-serif",
                resize: "vertical",
                marginBottom: "8px",
              }}
            />

            {/* Submit Button */}
            <button
              onClick={submitIdea}
              disabled={!newIdea.trim() || isSubmitting}
              className="crowdsource-button"
              style={{
                backgroundColor: newIdea.trim()
                  ? "var(--secondary-color)"
                  : "var(--border-light)",
                color: newIdea.trim() ? "white" : "var(--text-secondary)",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: newIdea.trim() ? "pointer" : "not-allowed",
                width: "100%",
                fontFamily: "'DB Helvethaica X', system-ui, sans-serif",
              }}
            >
              {isSubmitting ? "กำลังส่ง..." : "แชร์ไอเดีย"}
            </button>
          </div>

          {/* Recent Ideas List */}
          {crowdsourceData.ideas && crowdsourceData.ideas.length > 0 && (
            <div>
              <h4
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "8px",
                }}
              >
                ไอเดียล่าสุด
              </h4>
              <div
                className="ideas-list"
                style={{
                  maxHeight: "150px",
                  overflowY: "auto",
                  border: "1px solid var(--border-light)",
                  borderRadius: "8px",
                  padding: "8px",
                }}
              >
                {crowdsourceData.ideas.slice(0, 5).map((idea, index) => (
                  <div
                    key={idea._id || index}
                    className="idea-item"
                    style={{
                      padding: "8px",
                      borderBottom:
                        index < Math.min(4, crowdsourceData.ideas.length - 1)
                          ? "1px solid var(--border-light)"
                          : "none",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        marginBottom: "4px",
                        lineHeight: "1.4",
                      }}
                    >
                      {idea.idea}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      โดย {idea.author} •{" "}
                      {new Date(idea.timestamp).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Responsive CSS */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .sidebar-container {
          padding: 16px;
        }
        
        .sidebar-title {
          font-size: 22px;
        }
        
        @media (min-width: 481px) {
          .sidebar-container {
            padding: 20px;
          }
          
          .sidebar-title {
            font-size: 24px;
          }
        }
        
        @media (min-width: 769px) {
          .sidebar-container {
            padding: 24px;
          }
          
          .sidebar-title {
            font-size: 28px;
          }
        }
        
        /* Touch improvements for mobile */
        @media (hover: none) and (pointer: coarse) {
          .sidebar-container button {
            min-height: var(--touch-target-min);
            min-width: var(--touch-target-min);
            padding: 12px 16px;
            font-size: 16px;
          }
          
          .sidebar-container input, 
          .sidebar-container textarea {
            min-height: var(--touch-target-min);
            font-size: 16px;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SidebarHTML;
