# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CitizenAIR is a Thai air quality monitoring web application that displays PM2.5 data for Thailand districts and crowdsources air pollution solutions from citizens. The application features an interactive map showing real-time air quality data and a solutions database with filtering capabilities.

## Development Commands

```bash
npm run dev          # Start development server on localhost:5173
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Run ESLint to check code quality
```

## UI Framework Migration

**Current Status**: Migrating from Tailwind CSS to Chakra UI for better component consistency and accessibility.

### Chakra UI Components Used
- **Layout**: `Box`, `Flex`, `Grid`, `Stack`, `HStack`, `VStack`
- **Typography**: `Text`, `Heading`, `Badge`
- **Forms**: `Input`, `Button`, `Select`, `Textarea`
- **Feedback**: `Alert`, `AlertIcon`, `Spinner`, `Progress`
- **Navigation**: `Tabs`, `Breadcrumb`
- **Data Display**: `Card`, `CardHeader`, `CardBody`, `CardFooter`
- **Overlay**: `Modal`, `Drawer`, `Popover`
- **Media**: `Image`, `Avatar`
- **Color**: `useColorMode` for dark/light theme support

### Migration Pattern
Replace Tailwind classes with Chakra UI props:
- `className="flex items-center justify-between"` → `<Flex justify="space-between" align="center">`
- `className="bg-white rounded-lg shadow-lg"` → `<Card bg="white" shadow="lg">`
- `className="text-sm font-medium text-gray-600"` → `<Text fontSize="sm" fontWeight="medium" color="gray.600">`

### Color System
Using Chakra UI's color tokens instead of custom colors:
- `purple-600` → `purple.600`
- `gray-500` → `gray.500`
- Custom gradients → Chakra's `gradient` utilities

## Architecture

### Core Technologies
- **Frontend**: React 19 with Vite
- **Routing**: React Router DOM v7
- **Maps**: React Leaflet with OpenStreetMap tiles
- **Charts**: Recharts for PM2.5 trend visualization
- **Styling**: Tailwind CSS + Chakra UI components
- **Language**: Thai UI with English code comments

### Application Structure
- **App.jsx**: Main routing component with two primary routes
- **MapPage.jsx**: Interactive map with Thailand districts colored by PM2.5 levels
- **SolutionPage.jsx**: Searchable/filterable solutions database
- **API Layer**: Mock APIs in `src/api/` (ready for real API integration)

### Key Components
- **Sidebar.jsx**: District information panel with PM2.5 data, trends, and word cloud
- **PM25Now.jsx**: Current air quality display with Thai status indicators
- **PM25TrendChart.jsx**: 5-year historical trend visualization
- **WordCloudInput.jsx**: Citizen idea submission interface
- **SolutionCard.jsx**: Solution display with metadata (cost, difficulty, effectiveness)

### Data Sources
- **Thailand Districts**: GeoJSON data in `src/data/thailand-districts.js`
- **PM2.5 Historical Data**: Mock 5-year trend data in `src/data/pm25-5yr.json`
- **Solutions Database**: Mock data from Notion API simulation

## API Integration Points

### PM2.5 Data (`src/api/pm25Api.js`)
Currently uses mock data but designed to integrate with:
- GISTDA API: `https://api.gistda.or.th/get_latest_dust/`
- Air4Thai API: `https://www.air4thai.com/forweb/api/`

### Solutions Data (`src/api/notionApi.js`)
Mock implementation ready for Notion database integration. Requires:
- `VITE_NOTION_DATABASE_ID` environment variable
- `VITE_NOTION_TOKEN` environment variable

## PM2.5 Color Standards

The application uses Thai air quality standards for district coloring:
- **Green** (≤25): ดีมาก (Very Good)
- **Light Green** (26-37): ดี (Good)
- **Yellow** (38-50): ปานกลาง (Moderate)
- **Orange** (51-90): เริ่มมีผลกระทบต่อสุขภาพ (Unhealthy for Sensitive)
- **Red** (>90): มีผลกระทบต่อสุขภาพ (Unhealthy)

## Development Notes

### Code Style
- ESLint configuration ignores unused variables starting with capital letters
- Components use functional React patterns with hooks
- Thai language for UI elements, English for code comments
- Consistent use of Tailwind utility classes with Chakra UI components

### Data Flow
- District selection triggers sidebar updates with mock PM2.5 data
- Solutions page implements client-side filtering and sorting
- All API calls are mocked with realistic delays for development

### Environment Variables
Create `.env` file for production:
```
VITE_NOTION_DATABASE_ID=your-database-id
VITE_NOTION_TOKEN=your-notion-token
```

### Testing
No formal testing framework is currently set up. Manual testing through browser is primary method.

## File Conventions

- Component files use PascalCase (e.g., `MapPage.jsx`)
- Utility functions use camelCase (e.g., `getAQIStatus`)
- Data files use kebab-case (e.g., `pm25-5yr.json`)
- All components export default except utility functions