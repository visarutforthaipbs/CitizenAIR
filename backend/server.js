const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Client } = require("@notionhq/client");
const { MongoClient } = require("mongodb");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Initialize MongoDB client
let mongoClient;
let db;

async function connectToMongoDB() {
  try {
    mongoClient = new MongoClient(process.env.MONGODB_URI);
    await mongoClient.connect();
    db = mongoClient.db("citizenair");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
}

// Connect to MongoDB on startup
connectToMongoDB();

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "CitizenAIR Backend API is running" });
});

// Get all citizen solutions from Notion database
app.get("/api/solutions", async (req, res) => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
      return res.status(500).json({
        error: "Database ID not configured",
      });
    }

    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    // Transform Notion data to our format
    const solutions = response.results.map((page) => {
      const properties = page.properties;

      // Debug: Log the raw properties for the first entry to see structure
      if (response.results.indexOf(page) === 0) {
        console.log(
          "🔍 Debug - First entry properties:",
          JSON.stringify(properties, null, 2)
        );
        console.log(
          "🔍 Debug - Category property:",
          JSON.stringify(properties.Category, null, 2)
        );
        console.log(
          "🔍 Debug - Province property:",
          JSON.stringify(properties.Province, null, 2)
        );
      }

      // Helper function to get value from select or multi_select field
      const getSelectValue = (field) => {
        if (!field) return null;
        if (field.select) return field.select.name;
        if (field.multi_select && field.multi_select.length > 0) {
          return field.multi_select[0].name;
        }
        return null;
      };

      // Helper function to get values from multi_select field as array
      const getMultiSelectValues = (field) => {
        if (!field || !field.multi_select) return [];
        return field.multi_select.map((item) => item.name);
      };

      return {
        id: page.id,
        name: properties.Name?.title?.[0]?.text?.content || "ไม่ระบุชื่อ",
        category: getSelectValue(properties.Category) || "ไม่ระบุหมวดหมู่",
        province: getSelectValue(properties.Province) || "ไม่ระบุจังหวัด",
        district:
          properties.District?.rich_text?.[0]?.text?.content || "ไม่ระบุอำเภอ",
        description:
          properties.Description?.rich_text?.[0]?.text?.content ||
          "ไม่มีคำอธิบาย",
        image:
          properties.Image?.files?.[0]?.file?.url ||
          properties.Image?.files?.[0]?.external?.url ||
          null,
        sourceUrl: properties["Source URL"]?.url || null,
        date: properties.Date?.date?.start || null,
        author:
          properties["Organization / Author"]?.rich_text?.[0]?.text?.content ||
          "ไม่ระบุผู้พัฒนา",
        status:
          properties["Implementation Status"]?.select?.name || "ไม่ระบุสถานะ",
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      };
    });

    res.json({
      success: true,
      count: solutions.length,
      data: solutions,
    });
  } catch (error) {
    console.error("Error fetching solutions from Notion:", error);

    // Fallback to mock data when Notion fails
    const mockSolutions = [
      {
        id: "mock-1",
        name: "ปลูกต้นไผ่รอบบ้าน",
        category: "พืชปรับอากาศ",
        province: "เชียงใหม่",
        district: "แม่ริม",
        description:
          "ปลูกต้นไผ่รอบบ้านเพื่อกรองฝุ่น PM2.5 และเพิ่มออกซิเจนให้อากาศบริสุทธิ์ขึ้น ไผ่มีความสามารถในการกรองอากาศได้ดีและเติบโตเร็ว",
        image: null,
        sourceUrl: null,
        date: "2024-01-15",
        author: "ชุมชนแม่ริม",
        status: "ใช้งานจริง",
        createdTime: "2024-01-15T10:00:00.000Z",
        lastEditedTime: "2024-01-15T10:00:00.000Z",
      },
      {
        id: "mock-2",
        name: "เครื่องกรองอากาศ DIY",
        category: "เทคโนโลยี",
        province: "กรุงเทพฯ",
        district: "ห้วยขวาง",
        description:
          "สร้างเครื่องกรองอากาศจากพัดลมใหม่และไส้กรอง HEPA ใช้งบประมาณต่ำแต่ได้ประสิทธิภาพดี สามารถลดฝุ่น PM2.5 ในห้องได้ถึง 80%",
        image: null,
        sourceUrl: null,
        date: "2024-01-10",
        author: "ชมรมวิศวกรรมชุมชน",
        status: "ทดลองใช้",
        createdTime: "2024-01-10T14:30:00.000Z",
        lastEditedTime: "2024-01-10T14:30:00.000Z",
      },
      {
        id: "mock-3",
        name: "โครงการไร้เผาใส",
        category: "พฤติกรรม",
        province: "เชียงราย",
        district: "เมืองเชียงราย",
        description:
          "รณรงค์ให้เกษตรกรหยุดเผาใส หันมาใช้วิธีการย่อยสลายหรือทำปุ่ยหมักแทน ลดปัญหาหมอกควันและฝุ่น PM2.5 ในฤดูเผา",
        image: null,
        sourceUrl: null,
        date: "2024-01-05",
        author: "เทศบาลเมืองเชียงราย",
        status: "กำลังดำเนินการ",
        createdTime: "2024-01-05T09:15:00.000Z",
        lastEditedTime: "2024-01-05T09:15:00.000Z",
      },
    ];

    res.json({
      success: true,
      count: mockSolutions.length,
      data: mockSolutions,
      note: "ข้อมูลจำลอง - กรุณาตรวจสอบการเชื่อมต่อ Notion Database",
    });
  }
});

// Get unique filter options (MUST be before /:id route)
app.get("/api/solutions/filters", async (req, res) => {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    const response = await notion.databases.query({
      database_id: databaseId,
    });

    const categories = new Set();
    const provinces = new Set();
    const statuses = new Set();

    // Helper function to get value from select or multi_select field
    const getSelectValue = (field) => {
      if (!field) return null;
      if (field.select) return field.select.name;
      if (field.multi_select && field.multi_select.length > 0) {
        return field.multi_select[0].name;
      }
      return null;
    };

    response.results.forEach((page) => {
      const properties = page.properties;

      const category = getSelectValue(properties.Category);
      const province = getSelectValue(properties.Province);
      const status = properties["Implementation Status"]?.select?.name;

      if (category && category !== "ไม่ระบุหมวดหมู่") categories.add(category);
      if (province && province !== "ไม่ระบุจังหวัด") provinces.add(province);
      if (status && status !== "ไม่ระบุสถานะ") statuses.add(status);
    });

    res.json({
      success: true,
      filters: {
        categories: Array.from(categories).sort(),
        provinces: Array.from(provinces).sort(),
        statuses: Array.from(statuses).sort(),
      },
    });
  } catch (error) {
    console.error("Error fetching filter options:", error);
    res.json({
      success: true,
      filters: {
        categories: [
          "ทั้งหมด",
          "ป่าไม้",
          "เกษตรกรรม",
          "เมือง/ข้ามแดน/อื่นๆ",
          "คมนาคม",
        ],
        provinces: ["กรุงเทพ", "เชียงใหม่", "เชียงราย", "ลำปาง", "ทั่วประเทศ"],
        statuses: ["Active", "Piloting", "Proposed", "Completed"],
      },
    });
  }
});

// Search solutions with multiple filters (MUST be before /:id route)
app.get("/api/solutions/search", async (req, res) => {
  try {
    const { category, province, status, search } = req.query;
    const databaseId = process.env.NOTION_DATABASE_ID;

    // Build filter conditions
    const filters = [];

    if (category && category !== "all") {
      filters.push({
        property: "Category",
        multi_select: {
          contains: category,
        },
      });
    }

    if (province && province !== "all") {
      filters.push({
        property: "Province",
        multi_select: {
          contains: province,
        },
      });
    }

    if (status && status !== "all") {
      filters.push({
        property: "Implementation Status",
        select: {
          equals: status,
        },
      });
    }

    if (search) {
      filters.push({
        or: [
          {
            property: "Name",
            title: {
              contains: search,
            },
          },
          {
            property: "Description",
            rich_text: {
              contains: search,
            },
          },
        ],
      });
    }

    const queryOptions = {
      database_id: databaseId,
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    };

    // Add filters if any exist
    if (filters.length > 0) {
      queryOptions.filter =
        filters.length === 1 ? filters[0] : { and: filters };
    }

    const response = await notion.databases.query(queryOptions);

    const solutions = response.results.map((page) => {
      const properties = page.properties;

      // Helper function to get value from select or multi_select field
      const getSelectValue = (field) => {
        if (!field) return null;
        if (field.select) return field.select.name;
        if (field.multi_select && field.multi_select.length > 0) {
          return field.multi_select[0].name;
        }
        return null;
      };

      return {
        id: page.id,
        name: properties.Name?.title?.[0]?.text?.content || "ไม่ระบุชื่อ",
        category: getSelectValue(properties.Category) || "ไม่ระบุหมวดหมู่",
        province: getSelectValue(properties.Province) || "ไม่ระบุจังหวัด",
        district:
          properties.District?.rich_text?.[0]?.text?.content || "ไม่ระบุอำเภอ",
        description:
          properties.Description?.rich_text?.[0]?.text?.content ||
          "ไม่มีคำอธิบาย",
        image:
          properties.Image?.files?.[0]?.file?.url ||
          properties.Image?.files?.[0]?.external?.url ||
          null,
        sourceUrl: properties["Source URL"]?.url || null,
        date: properties.Date?.date?.start || null,
        author:
          properties["Organization / Author"]?.rich_text?.[0]?.text?.content ||
          "ไม่ระบุผู้พัฒนา",
        status:
          properties["Implementation Status"]?.select?.name || "ไม่ระบุสถานะ",
        createdTime: page.created_time,
        lastEditedTime: page.last_edited_time,
      };
    });

    res.json({
      success: true,
      count: solutions.length,
      filters: { category, province, status, search },
      data: solutions,
    });
  } catch (error) {
    console.error("Error searching solutions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search solutions",
      details: error.message,
    });
  }
});

// Get specific solution by ID (MUST be after specific routes)
app.get("/api/solutions/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const response = await notion.pages.retrieve({
      page_id: id,
    });

    const properties = response.properties;

    // Helper function to get value from select or multi_select field
    const getSelectValue = (field) => {
      if (!field) return null;
      if (field.select) return field.select.name;
      if (field.multi_select && field.multi_select.length > 0) {
        return field.multi_select[0].name;
      }
      return null;
    };

    const solution = {
      id: response.id,
      name: properties.Name?.title?.[0]?.text?.content || "ไม่ระบุชื่อ",
      category: getSelectValue(properties.Category) || "ไม่ระบุหมวดหมู่",
      province: getSelectValue(properties.Province) || "ไม่ระบุจังหวัด",
      district:
        properties.District?.rich_text?.[0]?.text?.content || "ไม่ระบุอำเภอ",
      description:
        properties.Description?.rich_text?.[0]?.text?.content ||
        "ไม่มีคำอธิบาย",
      image:
        properties.Image?.files?.[0]?.file?.url ||
        properties.Image?.files?.[0]?.external?.url ||
        null,
      sourceUrl: properties["Source URL"]?.url || null,
      date: properties.Date?.date?.start || null,
      author:
        properties["Organization / Author"]?.rich_text?.[0]?.text?.content ||
        "ไม่ระบุผู้พัฒนา",
      status:
        properties["Implementation Status"]?.select?.name || "ไม่ระบุสถานะ",
      createdTime: response.created_time,
      lastEditedTime: response.last_edited_time,
    };

    res.json({
      success: true,
      data: solution,
    });
  } catch (error) {
    console.error("Error fetching solution from Notion:", error);
    res.status(404).json({
      success: false,
      error: "Solution not found",
      details: error.message,
    });
  }
});

// Crowdsourcing API endpoints for district ideas

// Submit a new idea for a district
app.post("/api/crowdsource/ideas", async (req, res) => {
  try {
    const { district, province, idea, author } = req.body;

    if (!district || !idea) {
      return res.status(400).json({
        success: false,
        error: "District and idea are required",
      });
    }

    const ideaDocument = {
      district: district.trim(),
      province: province?.trim() || "",
      idea: idea.trim(),
      author: author?.trim() || "ไม่ระบุชื่อ",
      timestamp: new Date(),
      approved: true, // Auto-approve for now
    };

    const result = await db
      .collection("district_ideas")
      .insertOne(ideaDocument);

    res.json({
      success: true,
      message: "ความคิดเห็นถูกส่งเรียบร้อยแล้ว",
      id: result.insertedId,
    });
  } catch (error) {
    console.error("Error submitting idea:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit idea",
      details: error.message,
    });
  }
});

// Get ideas for a specific district (for word cloud)
app.get("/api/crowdsource/ideas/:district", async (req, res) => {
  try {
    const { district } = req.params;

    if (!district) {
      return res.status(400).json({
        success: false,
        error: "District parameter is required",
      });
    }

    const ideas = await db
      .collection("district_ideas")
      .find({
        district: district,
        approved: true,
      })
      .sort({ timestamp: -1 })
      .toArray();

    // Process ideas for word cloud
    const wordCloudData = processIdeasForWordCloud(ideas);

    res.json({
      success: true,
      district: district,
      count: ideas.length,
      ideas: ideas,
      wordCloudData: wordCloudData,
    });
  } catch (error) {
    console.error("Error fetching ideas:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch ideas",
      details: error.message,
    });
  }
});

// Get all districts with idea counts
app.get("/api/crowdsource/districts", async (req, res) => {
  try {
    const pipeline = [
      { $match: { approved: true } },
      {
        $group: {
          _id: "$district",
          count: { $sum: 1 },
          province: { $first: "$province" },
          lastUpdated: { $max: "$timestamp" },
        },
      },
      { $sort: { count: -1 } },
    ];

    const districts = await db
      .collection("district_ideas")
      .aggregate(pipeline)
      .toArray();

    res.json({
      success: true,
      count: districts.length,
      districts: districts.map((d) => ({
        district: d._id,
        province: d.province,
        ideaCount: d.count,
        lastUpdated: d.lastUpdated,
      })),
    });
  } catch (error) {
    console.error("Error fetching districts:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch districts",
      details: error.message,
    });
  }
});

// Helper function to process ideas for word cloud
function processIdeasForWordCloud(ideas) {
  const wordCount = {};
  const stopWords = new Set([
    "ที่",
    "และ",
    "ใน",
    "การ",
    "ของ",
    "จะ",
    "ให้",
    "มี",
    "เป็น",
    "ได้",
    "จาก",
    "กับ",
    "ไป",
    "มา",
    "ถึง",
    "ก็",
    "ไม่",
    "ใช้",
    "ทำ",
    "ดี",
    "เพื่อ",
    "หรือ",
    "แล้ว",
    "กัน",
    "ทุก",
    "เพิ่ม",
    "ลด",
    "นี้",
    "นั่น",
    "โดย",
    "เพราะ",
    "ถ้า",
    "แต่",
    "ซึ่ง",
    "ผู้",
    "คน",
    "ใคร",
    "อะไร",
    "ไหน",
    "เมื่อ",
    "ยัง",
    "แค่",
    "เพียง",
    "เรา",
    "ฉัน",
    "กิน",
    "ดู",
    "ฟัง",
    "อ่าน",
    "เขียน",
    "วิ่ง",
    "เดิน",
    "นั่ง",
    "ยืน",
    "นอน",
    "ตื่น",
    "เก็บ",
    "อยู่",
    "มาก",
    "น้อย",
    "บ้าง",
    "เท่านั้น",
    "เท่านี้",
    "อีก",
    "หรือ",
    "คือ",
    "แม้",
    "ขณะ",
    "เวลา",
    "หลัง",
    "ก่อน",
  ]);

  // Enhanced keywords for air quality solutions
  const enhancedKeywords = {
    ปลูก: ["ปลูกต้นไม้", "ปลูกไผ่", "ปลูกพืช"],
    กรอง: ["กรองอากาศ", "เครื่องกรอง", "กรองฝุ่น"],
    ลด: ["ลดฝุ่น", "ลดมลพิษ", "ลดการเผา"],
    เผา: ["ไม่เผา", "เผาใส", "เผาขยะ"],
    รณรงค์: ["รณรงค์"],
    DIY: ["DIY", "ทำเอง"],
    HEPA: ["HEPA", "ไส้กรอง"],
    พัดลม: ["พัดลม"],
    ไผ่: ["ไผ่", "ต้นไผ่"],
    ปุ่ย: ["ปุ่ยหมัก", "ปุ่ยชีวภาพ"],
    หมัก: ["หมัก", "ย่อยสลาย"],
    น้ำ: ["น้ำพ่น", "พ่นน้ำ"],
    ถนน: ["ถนน", "ท้องถนน"],
  };

  ideas.forEach((idea) => {
    const text = idea.idea.toLowerCase();

    // Extract enhanced keywords first
    for (const [keyword, variations] of Object.entries(enhancedKeywords)) {
      for (const variation of variations) {
        if (text.includes(variation.toLowerCase())) {
          wordCount[keyword] = (wordCount[keyword] || 0) + 1;
        }
      }
    }

    // Also extract individual meaningful words
    const words = idea.idea
      .replace(/[^\u0E00-\u0E7Fa-zA-Z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => {
        const clean = word.toLowerCase().trim();
        return (
          clean.length > 2 &&
          clean.length < 15 &&
          !stopWords.has(clean) &&
          /[\u0E00-\u0E7F]/.test(clean)
        ); // Contains Thai characters
      });

    words.forEach((word) => {
      const cleanWord = word.toLowerCase().trim();
      // Only add if it's not already covered by enhanced keywords
      const isAlreadyCovered = Object.values(enhancedKeywords)
        .flat()
        .some(
          (keyword) =>
            keyword.toLowerCase().includes(cleanWord) ||
            cleanWord.includes(keyword.toLowerCase())
        );

      if (!isAlreadyCovered && cleanWord.length > 2) {
        wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
      }
    });
  });

  // Convert to word cloud format (top 20 words for better display)
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 20)
    .map(([text, value]) => ({
      text,
      value: Math.max(value * 5, 10), // Boost values for better visualization
    }));
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something went wrong!",
    details: err.message,
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CitizenAIR Backend API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Solutions API: http://localhost:${PORT}/api/solutions`);
});

module.exports = app;
