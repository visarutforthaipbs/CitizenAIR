// Solutions page displaying citizen-contributed air quality solutions
import React, { useState, useEffect } from "react";

const SolutionPage = () => {
  const [solutions, setSolutions] = useState([]);
  const [allSolutions, setAllSolutions] = useState([]); // Keep original data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: "all",
    province: "all",
    status: "all",
    search: "",
  });
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    provinces: [],
    statuses: [],
  });

  // Backend API base URL
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Thai month names for date formatting
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  // Function to format date in Thai
  const formatThaiDate = (dateString) => {
    if (!dateString) return "ไม่ระบุวันที่";

    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = thaiMonths[date.getMonth()];
      const year = date.getFullYear() + 543; // Convert to Buddhist Era
      return `${day} ${month} ${year}`;
    } catch {
      return "ไม่ระบุวันที่";
    }
  };

  // Function to get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "ดำเนินการแล้ว":
        return "rgba(254, 80, 0, 0.8)";
      case "proposed":
      case "เสนอแนะ":
        return "rgba(254, 80, 0, 0.4)";
      case "planning":
      case "วางแผน":
        return "rgba(254, 80, 0, 0.6)";
      default:
        return "rgba(254, 80, 0, 0.2)";
    }
  };

  // Fetch solutions from backend API
  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from backend API
        const response = await fetch(`${API_BASE_URL}/solutions`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to fetch solutions");
        }

        // Use data directly from backend (already transformed)
        const solutionsData = result.data || [];
        setSolutions(solutionsData);
        setAllSolutions(solutionsData);
      } catch (err) {
        console.error("Error fetching solutions:", err);
        setError("ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง");
      } finally {
        setLoading(false);
      }
    };

    const fetchFilterOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/solutions/filters`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setFilterOptions(result.filters);
          }
        }
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };

    fetchSolutions();
    fetchFilterOptions();
  }, [API_BASE_URL]);

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  // Apply filters to solutions
  const applyFilters = (currentFilters) => {
    let filtered = [...allSolutions];

    // Filter by category
    if (currentFilters.category !== "all") {
      filtered = filtered.filter(
        (solution) => solution.category === currentFilters.category
      );
    }

    // Filter by province
    if (currentFilters.province !== "all") {
      filtered = filtered.filter(
        (solution) => solution.province === currentFilters.province
      );
    }

    // Filter by status
    if (currentFilters.status !== "all") {
      filtered = filtered.filter(
        (solution) => solution.status === currentFilters.status
      );
    }

    // Filter by search text
    if (currentFilters.search.trim()) {
      const searchTerm = currentFilters.search.toLowerCase().trim();
      filtered = filtered.filter(
        (solution) =>
          solution.name.toLowerCase().includes(searchTerm) ||
          solution.description.toLowerCase().includes(searchTerm) ||
          solution.author.toLowerCase().includes(searchTerm)
      );
    }

    setSolutions(filtered);
  };

  // Handle search input
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    const newFilters = { ...filters, search: searchValue };
    setFilters(newFilters);

    // Debounce search
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      applyFilters(newFilters);
    }, 300);
  };

  // Clear all filters
  const clearFilters = () => {
    const resetFilters = {
      category: "all",
      province: "all",
      status: "all",
      search: "",
    };
    setFilters(resetFilters);
    setSolutions(allSolutions);
  };

  // Component for expandable description
  const ExpandableDescription = ({ description }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = description.length > 200;
    const displayText =
      shouldTruncate && !isExpanded
        ? description.substring(0, 200) + "..."
        : description;

    return (
      <div>
        <p
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            lineHeight: "1.6",
            marginBottom: shouldTruncate ? "8px" : "0",
          }}
        >
          {displayText}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: "none",
              border: "none",
              color: "var(--secondary-color)",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              textDecoration: "underline",
              fontFamily:
                "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
              padding: "0",
            }}
          >
            {isExpanded ? "แสดงน้อยลง" : "อ่านเพิ่มเติม..."}
          </button>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - var(--navbar-height-mobile))",
        background: "var(--primary-color)",
        padding: "16px",
        fontFamily: "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
      }}
      className="solution-page"
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Header */}
          <div style={{ textAlign: "center" }}>
            <h1
              style={{
                fontSize: "32px",
                fontWeight: "900",
                color: "var(--secondary-color)",
                marginBottom: "12px",
              }}
              className="solution-title"
            >
              Citizen Solution
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "var(--text-secondary)",
                maxWidth: "768px",
                margin: "0 auto",
                lineHeight: "1.6",
                padding: "0 8px",
              }}
              className="solution-subtitle"
            >
              แบ่งปันและเรียนรู้แนวทางการแก้ปัญหาหมอกควันจากประสบการณ์ของชุมชนและพลเมืองทั่วประเทศ
            </p>
          </div>

          {/* Filter Section */}
          {!loading && !error && (
            <div
              style={{
                backgroundColor: "var(--primary-color)",
                borderRadius: "16px",
                padding: "20px",
                border: "1px solid var(--border-light)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
              }}
              className="filter-section"
            >
              {/* Search Bar */}
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="text"
                  placeholder="ค้นหาแนวทางแก้ปัญหา..."
                  value={filters.search}
                  onChange={handleSearchChange}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-light)",
                    fontSize: "16px",
                    fontFamily:
                      "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
                    outline: "none",
                    transition: "border-color 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--secondary-color)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-light)";
                  }}
                />
              </div>

              {/* Filter Controls */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "16px",
                  marginBottom: "16px",
                }}
                className="filter-controls"
              >
                {/* Category Filter */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "8px",
                    }}
                  >
                    หมวดหมู่
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                      fontSize: "14px",
                      fontFamily:
                        "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
                      backgroundColor: "var(--primary-color)",
                      outline: "none",
                    }}
                  >
                    <option value="all">ทั้งหมด</option>
                    {filterOptions.categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Province Filter */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "8px",
                    }}
                  >
                    จังหวัด
                  </label>
                  <select
                    value={filters.province}
                    onChange={(e) =>
                      handleFilterChange("province", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                      fontSize: "14px",
                      fontFamily:
                        "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
                      backgroundColor: "var(--primary-color)",
                      outline: "none",
                    }}
                  >
                    <option value="all">ทั้งหมด</option>
                    {filterOptions.provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "8px",
                    }}
                  >
                    สถานะ
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-light)",
                      fontSize: "14px",
                      fontFamily:
                        "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
                      backgroundColor: "var(--primary-color)",
                      outline: "none",
                    }}
                  >
                    <option value="all">ทั้งหมด</option>
                    {filterOptions.statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Info and Clear Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div
                  style={{ fontSize: "14px", color: "var(--text-secondary)" }}
                >
                  พบ <strong>{solutions.length}</strong> แนวทางแก้ปัญหา
                  {allSolutions.length !== solutions.length &&
                    ` จากทั้งหมด ${allSolutions.length} รายการ`}
                </div>

                {(filters.category !== "all" ||
                  filters.province !== "all" ||
                  filters.status !== "all" ||
                  filters.search.trim()) && (
                  <button
                    onClick={clearFilters}
                    style={{
                      background: "none",
                      border: "1px solid var(--secondary-color)",
                      color: "var(--secondary-color)",
                      padding: "8px 16px",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                      fontFamily:
                        "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "var(--secondary-color)";
                      e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.color = "var(--secondary-color)";
                    }}
                  >
                    ล้างตัวกรอง
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "3px solid var(--border-light)",
                  borderTop: "3px solid var(--secondary-color)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p style={{ color: "var(--text-secondary)", fontSize: "18px" }}>
                กำลังโหลดข้อมูลแนวทางแก้ปัญหา...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              style={{
                backgroundColor: "rgba(254, 80, 0, 0.1)",
                borderLeft: "4px solid var(--secondary-color)",
                padding: "16px 20px",
                borderRadius: "8px",
                border: "1px solid var(--border-light)",
              }}
            >
              <p
                style={{
                  color: "var(--secondary-color)",
                  fontWeight: "500",
                  margin: 0,
                }}
              >
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Solutions Grid */}
          {!loading && !error && solutions.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
              className="solutions-grid"
            >
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  style={{
                    backgroundColor: "var(--primary-color)",
                    borderRadius: "12px",
                    padding: "16px",
                    border: "1px solid var(--border-light)",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.12)";
                    e.target.style.borderColor = "rgba(254, 80, 0, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                    e.target.style.borderColor = "var(--border-light)";
                  }}
                >
                  {/* Image */}
                  {solution.image && (
                    <img
                      src={solution.image}
                      alt={solution.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        marginBottom: "16px",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      marginBottom: "12px",
                      color: "var(--text-primary)",
                      lineHeight: "1.3",
                    }}
                  >
                    {solution.name}
                  </h3>

                  {/* Category and Location */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      marginBottom: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "rgba(254, 80, 0, 0.1)",
                        color: "var(--secondary-color)",
                        padding: "4px 12px",
                        borderRadius: "16px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {solution.category}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {solution.province}
                      {solution.district && ` / ${solution.district}`}
                    </span>
                  </div>

                  {/* Description */}
                  <div style={{ marginBottom: "16px" }}>
                    <ExpandableDescription description={solution.description} />
                  </div>

                  {/* Author and Date */}
                  <div style={{ marginBottom: "16px" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                        marginBottom: "4px",
                      }}
                    >
                      <strong>ผู้พัฒนา:</strong> {solution.author}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <strong>วันที่:</strong> {formatThaiDate(solution.date)}
                    </p>
                  </div>

                  {/* Status and Source */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: getStatusColor(solution.status),
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      {solution.status}
                    </span>

                    {solution.sourceUrl && (
                      <a
                        href={solution.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "var(--secondary-color)",
                          fontWeight: "600",
                          fontSize: "14px",
                          textDecoration: "none",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.textDecoration = "underline";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.textDecoration = "none";
                        }}
                      >
                        แหล่งที่มา ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && solutions.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p
                style={{
                  fontSize: "18px",
                  color: "var(--text-secondary)",
                }}
              >
                ยังไม่มีข้อมูลแนวทางแก้ปัญหา
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        /* Responsive SolutionPage Styles */
        .solution-page {
          min-height: calc(100vh - var(--navbar-height-mobile));
          padding: 16px;
        }
        
        .solution-title {
          font-size: 28px;
        }
        
        .solution-subtitle {
          font-size: 16px;
        }
        
        .solutions-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .filter-section {
          padding: 16px;
        }

        .filter-controls {
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        @media (min-width: 481px) {
          .solution-page {
            padding: 20px;
          }
          
          .solution-title {
            font-size: 32px;
          }
          
          .solutions-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 18px;
          }

          .filter-controls {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 769px) {
          .solution-page {
            min-height: calc(100vh - var(--navbar-height));
            padding: 32px;
          }
          
          .solution-title {
            font-size: 48px;
          }
          
          .solution-subtitle {
            font-size: 18px;
          }
          
          .solutions-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 24px;
          }

          .filter-section {
            padding: 24px;
          }

          .filter-controls {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }
        
        @media (min-width: 1025px) {
          .solutions-grid {
            grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
            gap: 28px;
          }

          .filter-controls {
            gap: 24px;
          }
        }
        
        /* Touch improvements for mobile */
        @media (hover: none) and (pointer: coarse) {
          .solution-page {
            font-size: 16px;
          }
          
          .solutions-grid > div {
            padding: 20px;
            margin-bottom: 8px;
          }
          
          button {
            min-height: var(--touch-target-min);
            min-width: var(--touch-target-min);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SolutionPage;
