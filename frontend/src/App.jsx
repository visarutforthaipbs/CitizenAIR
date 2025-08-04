// Main application component with routing
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import MapPage from "./pages/MapPage";
import SolutionPage from "./pages/SolutionPage";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #faf5ff 0%, #fdf2f8 50%, #eef2ff 100%)",
        fontFamily: "'DB Helvethaica X', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/solutions" element={<SolutionPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
