# 🌤️ Weather Dashboard

A modern, responsive weather application built with Next.js 15, React 19, and TypeScript. Track multiple cities with beautiful, interactive weather widgets featuring real-time weather data, forecasts, and smooth animations.
- **Hourly Forecast**: Next 8 periods (3-hour intervals) with temperature and conditions
- **Daily Forecast**: 5-day outlook with high/low temperatures and conditions
- **Weather Descriptions**: Detailed condition descriptions
- **Temperature Trends**: Visual temperature patterns

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - Latest React with new features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[TailwindCSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Smooth animations and transitions

### State Management & Data Fetching
- **[TanStack Query (React Query)](https://tanstack.com/query/latest)** - Server state management
- **React Hooks** - Local state management
- **localStorage** - Client-side persistence

### UI Components & Icons
- **[Lucide React](https://lucide.dev/)** - Beautiful, customizable icons
- **Custom Components** - Modular, reusable weather components

### API Integration
- **[OpenWeatherMap API](https://openweathermap.org/api)** - Weather data source
- **Fetch API** - HTTP client for API requests

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- OpenWeatherMap API key (free at [openweathermap.org](https://openweathermap.org/api))

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:GiaLuongNgo/weather-app.git
   cd weather-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📜 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run test:e2e     # Run end-to-end tests (production)
npm run test:e2e:dev # Run E2E tests (development)
```

## 🧪 Testing

### Unit Testing
- **Jest** - Testing framework
- **React Testing Library** - Component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers
- **Coverage**: Comprehensive test coverage for all components and utilities

### End-to-End Testing
- **Cypress** - E2E testing framework
- **Custom Commands** - Reusable test utilities
- **CI/CD Integration** - Automated testing in GitHub Actions

## 🎨 Features Deep Dive

### Responsive Design
- **Mobile-first approach** with TailwindCSS
- **Breakpoint system**: sm, md, lg, xl viewports
- **Flexible grid layout** that adapts to screen size
- **Touch-friendly interactions** for mobile users

### Performance Optimization
- **React Query caching** for efficient data fetching
- **Automatic stale-while-revalidate** strategy
- **Error boundaries** for graceful error handling
- **Optimistic updates** for better user experience

## 🔧 Configuration

### Environment Variables
```bash
# Required
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key

# Optional
NEXT_PUBLIC_API_BASE_URL=https://api.openweathermap.org/data/2.5
```

### TailwindCSS Configuration
The app uses TailwindCSS 4 with custom configurations for:
- Color palette
- Typography scales
- Spacing system
- Animation presets

**Built with ❤️ using Next.js and modern web technologies**
