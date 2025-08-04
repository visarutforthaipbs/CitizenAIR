# CitizenAIR - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a Vite-powered React application for air quality monitoring in Thailand, featuring:

- **UI Framework**: Chakra UI for all styling
- **Language**: All user-facing text must be in Thai
- **Maps**: React Leaflet for interactive Thailand district maps
- **Charts**: Recharts for PM2.5 trend visualization
- **Data Visualization**: Word clouds for crowdsourced solutions
- **Routing**: React Router for navigation

## Code Guidelines

1. **Language Requirements**:

   - All UI text, labels, buttons, headings must be in Thai
   - Use English for file names, component names, and code comments
   - Variable names and functions should be in English camelCase

2. **Component Structure**:

   - Use functional components with hooks
   - Implement proper error handling
   - Follow Chakra UI patterns for consistent styling

3. **File Organization**:

   - Keep components modular and reusable
   - Separate API logic into dedicated files
   - Use proper prop types and default values

4. **Thai Text Examples**:
   - "ฝุ่นตอนนี้" = Current PM2.5
   - "ฝุ่นช่วงไหน" = Historical PM2.5
   - "ถ้าแก้ปัญหาในบ้านคุณ" = If you solve the problem in your home
   - "แผนที่คุณภาพอากาศ" = Air Quality Map
   - "วิธีแก้ปัญหา" = Solutions
