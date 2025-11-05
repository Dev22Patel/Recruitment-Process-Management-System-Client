# Recruitment Process Management System - Client

A web-based client application for managing recruitment processes, developed as a pre-internship assignment. This system provides functionality for managing job postings, candidate applications, and the recruitment workflow.

## Project Overview

This is the frontend client for a Recruitment Process Management System that allows organizations to streamline their hiring process. The application is currently in active development and demonstrates proficiency in modern web development technologies and best practices.

**Status**: Under Development  
**Purpose**: Pre-Internship Technical Assignment  
**Type**: Frontend Client Application

## Technology Stack

- **Frontend Framework**: React.js
- **State Management**: Context API / Redux
- **Styling**: CSS3 / Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Authentication**: JWT-based authentication

## Features Implemented

### User Authentication
- User registration with form validation
- Login functionality with JWT token management
- Protected routes for authenticated users
- Session management

### Job Management
- Display list of available job positions
- View detailed job descriptions
- Job posting form (for recruiters)
- Search and filter job listings

### Candidate Management
- Candidate application submission
- Application form with resume upload capability
- View submitted applications
- Application status tracking

### Dashboard
- User dashboard showing relevant information based on role
- Basic analytics and statistics
- Quick access to key features

### Responsive Design
- Mobile-responsive layout
- Cross-browser compatibility
- Optimized user interface for different screen sizes

## Features Under Development

- Interview scheduling module
- Advanced candidate filtering and sorting
- Email notification system
- Admin panel for system management
- Candidate profile management
- Application status workflow management
- Real-time notifications
- Advanced search functionality
- Reports and analytics dashboard
- File management system for documents

## Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn package manager
- Git version control

## Installation and Setup

1. Clone the repository
```bash
git clone https://github.com/Dev22Patel/Recruitment-Process-Management-System-Client.git
cd Recruitment-Process-Management-System-Client
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables

Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_BASE_URL=http://localhost:3000
```

4. Start the development server
```bash
npm start
```

The application will run on `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable React components
├── pages/              # Page-level components
├── services/           # API service functions
├── context/            # Context API providers
├── utils/              # Utility functions and helpers
├── assets/             # Static assets (images, fonts)
├── styles/             # CSS/styling files
├── App.js              # Main application component
└── index.js            # Application entry point
```

## Available Scripts

**Development Server**
```bash
npm start
```

**Build for Production**
```bash
npm run build
```


## API Integration

This client application connects to a backend REST API. The API base URL can be configured in the `.env` file. Key API endpoints include:

- `/auth/register` - User registration
- `/auth/login` - User authentication
- `/jobs` - Job listings and management
- `/applications` - Application submissions and management
- `/users` - User profile management

## Current Limitations

- Some features are still in development phase
- Limited error handling in certain modules
- UI/UX improvements pending in several components
- Testing coverage needs to be expanded
- Performance optimization required for large datasets

## Known Issues

- Form validation needs enhancement in some areas
- Mobile responsiveness requires refinement
- Loading states need consistent implementation across components

## Development Approach

This project follows:
- Component-based architecture
- Modular and reusable code structure
- RESTful API integration patterns
- Modern React hooks and functional components
- Responsive design principles

## Future Enhancements

- Complete implementation of pending features
- Comprehensive error handling
- Unit and integration testing
- Performance optimization
- Accessibility improvements
- Documentation enhancement
- Code refactoring for better maintainability

## Learning Outcomes

This project demonstrates understanding of:
- React.js fundamentals and advanced concepts
- State management techniques
- API integration and asynchronous operations
- Authentication and authorization flows
- Responsive web design
- Git version control and collaboration

## Author

**Dev Patel**  
GitHub: [@Dev22Patel](https://github.com/Dev22Patel)


---

**Note**: This is a work-in-progress project created for evaluation purposes. Feedback and suggestions for improvement are welcome.
