# DrivingForce Motors — Frontend UI Specification

## Project

Build the frontend UI for DrivingForce Motors, a modern automotive dealership platform.

The existing project is:

DrivingForce-Motors/

The frontend is located at:

frontend/

The backend is located at:

backend/

Do NOT modify the backend.

Do NOT modify Salesforce.

For this task, work ONLY inside the frontend directory unless a configuration change is absolutely required.

---

# Technology

Use:

- React
- Vite
- JavaScript
- CSS
- React Router if routing is required

Do not introduce unnecessary frameworks or libraries.

Keep the application component-based and maintainable.

---

# Brand

Brand name:

DrivingForce Motors

Industry:

Automotive dealership

Brand personality:

- Premium
- Modern
- Trustworthy
- Powerful
- Clean
- Professional

The UI should feel like a modern automotive website rather than a generic CRUD application.

---

# Main Pages

Create the following frontend pages:

1. Home
2. Vehicles
3. Vehicle Details
4. About
5. Contact
6. Book Test Drive
7. Login

---

# Homepage

Create a premium automotive homepage.

Sections:

## Navbar

Include:

- DrivingForce Motors logo/name
- Home
- Vehicles
- About
- Contact
- Book Test Drive
- Login

Navbar should be responsive.

---

## Hero Section

Create a visually strong automotive hero section.

Content:

Heading:

"Drive Your Ambition"

Supporting text:

"Discover premium vehicles built for performance, comfort and every journey."

Primary CTA:

"Explore Vehicles"

Secondary CTA:

"Book a Test Drive"

Use a high-quality automotive visual.

The hero should immediately communicate that this is a premium dealership platform.

---

## Featured Vehicles

Display vehicle cards.

Each card should contain:

- Vehicle image
- Brand
- Model
- Variant
- Price
- Fuel type
- Transmission
- CTA

CTA:

"View Details"

Use reusable VehicleCard components.

---

## Why DrivingForce Motors

Create a section with 3–4 benefits:

- Trusted Vehicles
- Easy Test Drives
- Transparent Pricing
- Expert Assistance

Use clean icons and concise descriptions.

---

## Test Drive CTA

Create a visually prominent section:

"Feel the Drive Before You Buy"

Description:

"Book a personalized test drive and experience your vehicle on the road."

Button:

"Book a Test Drive"

---

## Footer

Include:

- DrivingForce Motors
- Navigation
- Contact information
- Social links
- Copyright

---

# Vehicles Page

Create a vehicle discovery page.

Include:

- Search
- Vehicle type filter
- Fuel type filter
- Transmission filter
- Price filter
- Sort option

Display vehicles in a responsive grid.

Example categories:

- SUV
- Sedan
- Hatchback
- Electric

---

# Vehicle Details Page

Create a premium vehicle details layout.

Include:

- Large image gallery
- Vehicle name
- Brand
- Variant
- Price
- Specifications
- Description
- Availability
- "Book Test Drive"
- "Enquire Now"

Specifications:

- Fuel
- Transmission
- Mileage
- Seating
- Year
- Color

---

# Test Drive Page

Create a professional booking form.

Fields:

- Full Name
- Email
- Phone
- Vehicle
- Date
- Time
- Location

CTA:

"Book Test Drive"

Use proper form validation UI.

---

# Contact Page

Include:

- Contact form
- Phone
- Email
- Address
- Business hours
- Map placeholder

---

# About Page

Tell the DrivingForce Motors story.

Sections:

- Who We Are
- Our Mission
- Our Values
- Why Customers Choose Us

Use automotive imagery and clean editorial layouts.

---

# Login Page

Create a modern authentication screen.

Fields:

- Email
- Password

Buttons:

- Login
- Forgot Password
- Create Account

Do not implement authentication yet.

This is UI only.

---

# Design System

Use a consistent design system.

## Colors

Primary:

Deep black / charcoal

Secondary:

White

Accent:

Use a sophisticated automotive accent such as red or electric blue.

Avoid excessive colors.

---

# Typography

Use a modern sans-serif font.

Hierarchy:

- Large bold hero heading
- Medium section headings
- Clean readable body text
- Strong CTA text

---

# Cards

Vehicle cards should have:

- Rounded corners
- High-quality image
- Clear typography
- Subtle shadow
- Hover interaction
- Consistent spacing

---

# Buttons

Primary button:

Strong contrast and rounded corners.

Secondary button:

Outline style.

Buttons should have subtle hover transitions.

---

# Animations

Use subtle animations only.

Examples:

- Fade-in
- Hover elevation
- Image zoom on hover
- Smooth scrolling
- Button transitions

Avoid excessive animations.

---

# Responsive Design

The entire website must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Pay particular attention to:

- Navbar
- Hero
- Vehicle grid
- Forms
- Vehicle details
- Footer

---

# Code Architecture

Use reusable components.

Suggested structure:

frontend/src/

components/
    Navbar.jsx
    Footer.jsx
    VehicleCard.jsx
    Button.jsx
    SectionTitle.jsx

pages/
    Home.jsx
    Vehicles.jsx
    VehicleDetails.jsx
    About.jsx
    Contact.jsx
    TestDrive.jsx
    Login.jsx

layouts/
    MainLayout.jsx

services/
    api.js

hooks/

context/

---

# Important Constraints

1. Do not modify backend code.
2. Do not modify Salesforce code.
3. Do not create fake backend APIs.
4. Use mock vehicle data only for the UI during this phase.
5. Keep mock data separated from components.
6. Build reusable components.
7. Do not hardcode repeated UI.
8. Do not install unnecessary dependencies.
9. Keep the project easy to connect to the existing backend later.
10. Do not implement authentication yet.

---

# API Preparation

Create the frontend API service structure, but do not connect it to Salesforce yet.

The future backend base URL will be:

http://localhost:5000/api

Create:

services/api.js

Prepare the architecture so that API calls can later be connected without rewriting UI components.

---

# Verification

After implementation:

1. Start the frontend.
2. Check all routes.
3. Check responsive behavior.
4. Check browser console for errors.
5. Verify images load.
6. Verify buttons and navigation.
7. Verify forms visually.
8. Verify no broken routes.
9. Verify the application builds successfully.

Use browser-based verification where available.

---

# Expected Result

The final result should look like a polished real-world automotive dealership website.

It should NOT look like:

- A basic student project
- A generic Bootstrap template
- A CRUD dashboard
- A default Vite application

The design should feel premium, modern and production-oriented.

Before making major architectural changes, explain the change and keep the existing project structure intact.