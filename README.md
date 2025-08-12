Job Tracker Frontend
A professional Next.js application for tracking job applications with a Django REST API backend.

Features
Dashboard: Overview of all application statistics
Pipeline: Kanban-style view of applications by status
Analytics: Charts and insights with time-based filtering
Application Management: Add, edit, and track individual applications
Timeline Tracking: Add events and notes to track application progress
Responsive Design: Works on desktop, tablet, and mobile devices
Tech Stack
Frontend: Next.js 14, React 18, TypeScript
UI Library: Material-UI (MUI) v5
Charts: Recharts
Date Handling: Day.js with MUI Date Pickers
HTTP Client: Axios
Styling: Material-UI Theme + Custom Global Styles
Getting Started
Prerequisites
Node.js 16+
npm or yarn
Django backend running (see backend README)
Installation
Clone the repository and navigate to the frontend directory:
bash
git clone <your-repo-url>
cd job-tracker-frontend
Install dependencies:
bash
npm install
# or
yarn install
Create environment file:
bash
cp .env.local.example .env.local
Update the API URL in .env.local:
bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
Run the development server:
bash
npm run dev
# or
yarn dev
Open http://localhost:3000 in your browser.
Project Structure
├── components/
│   └── Layout.tsx          # Main layout with navigation
├── lib/
│   └── api.ts             # API client and type definitions
├── pages/
│   ├── _app.tsx           # App configuration with theme
│   ├── index.tsx          # Dashboard page
│   ├── pipeline.tsx       # Pipeline kanban view
│   ├── analytics.tsx      # Analytics dashboard
│   ├── add-application.tsx # Add new application form
│   └── application/
│       └── [id].tsx       # Application details page
├── .env.local.example     # Environment variables template
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies
└── tsconfig.json          # TypeScript configuration
API Integration
The app integrates with your Django REST API through:

Applications: CRUD operations for job applications
Statistics: Dashboard metrics and analytics data
Files: Resume and cover letter uploads (if implemented)
Timeline: Application progress tracking
API Endpoints Used
GET /api/applications/ - List all applications
POST /api/applications/ - Create new application
GET /api/applications/{id}/ - Get specific application
PUT /api/applications/{id}/ - Update application
DELETE /api/applications/{id}/ - Delete application
PUT /api/applications/{id}/status/ - Update application status
POST /api/applications/{id}/timeline/ - Add timeline event
GET /api/stats/dashboard/ - Get dashboard statistics
GET /api/stats/analytics/ - Get analytics data
Features Overview
Dashboard
Total applications count
Applications this month
Interview and offer rates
Recent applications list
Pipeline
Kanban board with status columns
Drag-and-drop status updates (via context menu)
Quick application overview cards
Filter and search capabilities
Analytics
Time-based charts (7, 30, 90 days)
Application trends over time
Interview and offer tracking
Success rate calculations
Application Details
Complete application information
Inline editing capabilities
Timeline/progress tracking
Status management
Notes and documentation
Add Application
Clean form interface
Required field validation
Date picker integration
Status selection
URL validation
Responsive Design
The application is fully responsive and works on:

Desktop: Full sidebar navigation
Tablet: Collapsible navigation
Mobile: Hamburger menu navigation
Error Handling
API error interceptors
User-friendly error messages
Loading states for all operations
Form validation feedback
Network timeout handling
Performance Features
TypeScript for type safety
Component lazy loading
Optimized Material-UI bundle
Efficient chart rendering
Minimal re-renders
Build and Deploy
Development Build
bash
npm run dev
Production Build
bash
npm run build
npm start
Linting
bash
npm run lint
Customization
Theme
Edit the Material-UI theme in pages/_app.tsx to customize:

Colors
Typography
Component styles
Spacing
API Configuration
Update lib/api.ts to:

Add new endpoints
Modify request/response handling
Add authentication headers
Handle different response formats
Troubleshooting
Common Issues
API Connection Failed
Check if Django backend is running on port 8000
Verify CORS settings in Django
Check the API URL in .env.local
Charts Not Rendering
Ensure recharts is properly installed
Check console for JavaScript errors
Verify data format matches chart expectations
Date Picker Issues
Verify Day.js adapter is properly configured
Check for timezone-related issues
Ensure date format matches API expectations
Contributing
Follow TypeScript best practices
Use Material-UI components consistently
Maintain responsive design principles
Add proper error handling
Update this README for new features
License
This project is licensed under the MIT License.

