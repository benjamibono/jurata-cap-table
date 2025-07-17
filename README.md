# Jurata Cap Table Management Platform

> A modern Next.js cap table management application built for venture capital firms. Demonstrates technical excellence with TypeScript, React 19, and professional-grade architecture.

[![Next.js](https://img.shields.io/badge/Next.js-15.4.1-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.11-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)

## 🎯 Assignment Overview

This application fulfills all core requirements for the Next.js cap table management assignment:

### ✅ **Core Requirements Met**
- **Next.js Setup**: Latest Next.js 15 with App Router & Server Components
- **TypeScript**: Full type safety across the entire application
- **Data Model**: Company and Shareholder entities with proper relationships
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Form Validation**: Robust client-side validation with error handling
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Data Persistence**: localStorage integration for data retention

### 🎨 **Enhanced Features**
- **Modern Animations**: Smooth fade-in effects with domino timing
- **Interactive Visualizations**: Custom SVG pie charts with hover effects
- **Professional Design**: Swiss-inspired UI with Jurata brand colors
- **Real-time Calculations**: Automatic ownership percentage updates
- **Error Handling**: Comprehensive error states and user feedback

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or higher
- pnpm (recommended) or npm

### Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd jurata-cap-table

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open in browser
open http://localhost:3000
```

### Production Build
```bash
pnpm build
pnpm start
```

## 📁 Project Structure

```
jurata-cap-table/
├── app/                      # Next.js App Router
│   ├── companies/           # Company management pages
│   │   ├── [id]/           # Dynamic company detail routes
│   │   └── page.tsx        # Portfolio overview page
│   ├── globals.css         # Global styles and animations
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Home page (redirects to companies)
├── components/              # Reusable UI components
│   ├── CompanyCard.tsx     # Company preview cards with animations
│   ├── PieChart.tsx        # Custom SVG pie chart component
│   ├── ShareholderForm.tsx # Shareholder data entry form
│   ├── ShareholderList.tsx # Shareholder table component
│   └── Header.tsx          # Navigation header
├── context/                 # React Context providers
│   └── CompanyContext.tsx  # Company state management
├── types/                   # TypeScript definitions
│   └── index.ts            # Core data models
├── lib/                     # Utility functions
│   └── validations.ts      # Zod validation schemas
└── __tests__/              # Test files (core functionality only)
```

## 🎨 Key Features

### **Portfolio Dashboard**
- Overview of all companies with aggregate statistics
- Interactive pie chart showing portfolio distribution
- Top companies ranked by share volume
- Smooth fade-in animations with staggered timing

### **Company Management**
- Individual company cap table views
- Real-time ownership percentage calculations
- Add/remove shareholders with instant feedback
- Form validation with comprehensive error handling

### **Data Persistence**
- Automatic localStorage synchronization
- Sample data featuring Jurata team members
- Cross-tab data consistency
- Error recovery and data integrity

## 🔧 Technical Implementation

### **Core Technologies**
- **Next.js 15**: App Router with React Server Components
- **React 19**: Latest concurrent features and optimizations
- **TypeScript**: Complete type safety and IntelliSense
- **Tailwind CSS v4**: Utility-first styling with custom design tokens

### **State Management**
- **React Context API**: Centralized state management
- **localStorage**: Persistent data storage
- **Real-time Updates**: Automatic recalculation of ownership percentages

### **Validation & Error Handling**
- **Zod Schemas**: Runtime type checking and validation
- **Form Validation**: Client-side validation with user feedback
- **Error Boundaries**: Graceful error handling throughout the app

## 📊 Data Models

### Company Interface
```typescript
interface Company {
  id: string;
  name: string;
  shareholders: Shareholder[];
}
```

### Shareholder Interface
```typescript
interface Shareholder {
  id: string;
  name: string;
  shares: number;
}
```

## 🎯 Core Functionality

### **Adding Shareholders**
1. Navigate to company detail page
2. Fill out shareholder form with name and shares
3. Form validates input (no empty names, positive shares)
4. Shareholder added with automatic percentage calculation

### **Removing Shareholders**
1. Click delete button in shareholder table
2. Shareholder removed with immediate UI update
3. Ownership percentages recalculated automatically

### **Data Validation**
- **Name validation**: Required, non-empty strings
- **Share validation**: Positive integers only
- **Real-time feedback**: Immediate error display
- **Form reset**: Clear form after successful submission

## 🧪 Testing

### **Test Coverage**
- **ShareholderForm.test.tsx**: Form validation and submission
- **ShareholderList.test.tsx**: Shareholder operations and display
- **CompanyContext.test.tsx**: Core business logic and state management
- **validations.test.ts**: Data validation schemas

### **Running Tests**
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 🎨 Design System

### **Color Palette**
- **Primary**: `#3C5074` (Jurata Blue)
- **Secondary**: `#52525B` (Professional Gray)
- **Accent**: `#A6B2C9` (Light Blue)

### **Animations**
- **Fade-in**: 0.8s ease-out with translateY
- **Staggered timing**: 150ms delay between cards
- **Hover effects**: Smooth transitions on interactive elements

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔄 Available Scripts

```bash
pnpm dev          # Development server with hot reload
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # ESLint code analysis
pnpm test         # Run test suite
```

## 🎯 Assignment Compliance

### **Required Features ✅**
- [x] Next.js with App Router
- [x] TypeScript implementation
- [x] Company and Shareholder data models
- [x] List of companies page
- [x] Company detail page with shareholders
- [x] Add shareholder functionality
- [x] Remove shareholder functionality
- [x] Form validation (no negative shares, required names)
- [x] Responsive design with Tailwind CSS
- [x] Data persistence with localStorage

### **Bonus Features ✅**
- [x] Type-safe form validation with Zod
- [x] Unit tests for critical logic
- [x] Modern UI with animations
- [x] Error handling and user feedback
- [x] Professional design system

## 🚀 Deployment

The application is ready for production deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 📝 Notes

- Sample data includes Jurata team members for demonstration
- All calculations are performed client-side for immediate feedback
- LocalStorage ensures data persistence across browser sessions
- Responsive design works on all screen sizes
- TypeScript provides compile-time error checking
- Modern React patterns with functional components and hooks

---
