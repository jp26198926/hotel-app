# Copilot Instructions for Hotel Management System

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a modern hotel and restaurant management system built with Next.js 14, JavaScript, MongoDB, and Tailwind CSS. The application provides comprehensive management capabilities for hotel operations including room bookings, restaurant reservations, guest services, and staff management.

## Key Technologies

- **Frontend**: Next.js 14 with App Router, React, JavaScript
- **Styling**: Tailwind CSS with modern UI components
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Icons**: Lucide React icons
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API and local state
- **Date Handling**: date-fns library

## Project Structure

- `/src/app`: Next.js App Router pages and API routes
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions, database config, and schemas
- `/src/models`: MongoDB/Mongoose models
- `/src/hooks`: Custom React hooks
- `/src/context`: React context providers

## Code Style Guidelines

- Use JavaScript (not TypeScript) for all files
- Follow modern React patterns with hooks and functional components
- Use Tailwind CSS for styling with responsive design principles
- Implement proper error handling and loading states
- Use meaningful component and variable names
- Add proper JSDoc comments for complex functions
- Ensure accessibility with proper ARIA labels and semantic HTML

## Database Models

- **User**: Staff and guest authentication
- **Room**: Hotel room information and availability
- **Booking**: Room reservations and guest stays
- **Guest**: Guest profiles and preferences
- **Restaurant**: Restaurant table and menu management
- **Reservation**: Restaurant table reservations
- **Staff**: Employee management and scheduling

## UI/UX Principles

- Modern, clean, and professional design
- Responsive layout for desktop, tablet, and mobile
- Intuitive navigation with clear visual hierarchy
- Consistent color scheme and typography
- Loading states and error handling
- Accessibility-first approach
- Smooth animations and transitions

## API Design

- RESTful API endpoints using Next.js App Router
- Proper HTTP status codes and error responses
- Input validation and sanitization
- Rate limiting and security measures
- Comprehensive error handling
