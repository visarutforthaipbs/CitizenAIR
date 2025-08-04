import React, { useEffect, useRef, useState } from "react";
import WordCloud from "wordcloud";

const WordCloudComponent = ({ words, width = 300, height = 200 }) => {
  const canvasRef = useRef(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    console.log("WordCloudComponent useEffect triggered", {
      words,
      wordsLength: words?.length,
    });

    if (!words || words.length === 0 || !canvasRef.current) {
      console.log("Exiting early - no words or canvas");
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Transform data for wordcloud library
    const wordList = words.map((word) => [word.text, word.value]);
    console.log("WordList for wordcloud:", wordList);

    // WordCloud configuration
    const options = {
      list: wordList,
      gridSize: Math.round((16 * width) / 300), // Scale grid size
      weightFactor: function (size) {
        const factor = Math.max((Math.pow(size, 0.8) * width) / 300, 12);
        console.log(`WeightFactor for size ${size}: ${factor}`);
        return factor;
      },
      fontFamily: "DB Helvethaica X, system-ui, sans-serif",
      color: function (word, weight) {
        // Color gradient from orange to dark
        const intensity = Math.min(weight / 20, 1);
        const r = Math.floor(254 * intensity + 100 * (1 - intensity));
        const g = Math.floor(80 * intensity + 50 * (1 - intensity));
        const b = Math.floor(0 * intensity + 50 * (1 - intensity));
        const color = `rgb(${r}, ${g}, ${b})`;
        console.log(`Color for word "${word}" with weight ${weight}: ${color}`);
        return color;
      },
      rotateRatio: 0.2,
      backgroundColor: "transparent",
      minSize: Math.max(width / 25, 10),
      drawOutOfBound: false,
    };

    console.log("WordCloud options:", options);

    try {
      // Generate word cloud
      WordCloud(canvas, options);
      console.log("WordCloud generated successfully");
      setShowFallback(false);
    } catch (error) {
      console.error("Error generating WordCloud:", error);
      setShowFallback(true);
    }
  }, [words, width, height]);

  if (!words || words.length === 0) {
    return (
      <div
        className="wordcloud-container"
        style={{
          width: width,
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-secondary)",
          fontSize: "14px",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        ยังไม่มีความคิดเห็น
        <br />
        เป็นคนแรกที่แบ่งปันไอเดีย!
      </div>
    );
  }

  // Fallback word cloud (if wordcloud library fails)
  if (showFallback) {
    return (
      <div
        className="wordcloud-container"
        style={{
          borderRadius: "8px",
          padding: "12px",
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "center",
          justifyContent: "center",
          minHeight: height,
        }}
      >
        {words.slice(0, 10).map((word, index) => (
          <span
            key={index}
            style={{
              fontSize: `${Math.max(word.value / 2 + 10, 12)}px`,
              fontWeight: word.value > 12 ? "bold" : "normal",
              color: `hsl(${20 + word.value * 2}, 70%, ${60 - word.value}%)`,
              fontFamily: "'DB Helvethaica X', system-ui, sans-serif",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: "rgba(254, 80, 0, 0.1)",
            }}
          >
            {word.text}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="wordcloud-container"
      style={{ borderRadius: "8px", padding: "8px" }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "auto",
          maxWidth: width,
          borderRadius: "8px",
        }}
      />
    </div>
  );
};

export default WordCloudComponent;
