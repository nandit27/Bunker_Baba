# Bunker Baba 📚

A smart attendance management platform for CHARUSAT University students to optimize their lecture attendance strategy.

## Overview

Bunker Baba helps students make informed decisions about which lectures to attend by analyzing their current attendance data from eGovernance screenshots and calculating optimal attendance patterns to meet their target attendance goals.

## Features

### 📊 Attendance Analysis
- Upload eGovernance attendance screenshots
- Automatic parsing of attendance data
- Subject-wise attendance breakdown
- Current attendance percentage calculation

### 🎯 Goal Setting
- Set target attendance percentage
- Specify timeline/duration to achieve goal
- Customize priorities for different subjects

### 💡 Smart Recommendations
- Calculate maximum lectures you can skip
- Identify must-attend lectures
- Subject-wise attendance optimization
- Weekly attendance planning
- Risk assessment for each skip decision

### 📱 User Interface
- Clean, modern dashboard
- Mobile responsive design
- Easy screenshot upload
- Interactive attendance planner
- Visual attendance tracking

## How to Use

1. **Upload Attendance Data**
   - Login to CHARUSAT eGovernance
   - Take screenshot of attendance page
   - Upload screenshot to Bunker Baba
   - Verify extracted attendance data

2. **Set Your Goals**
   - Enter target attendance percentage (e.g. 75%)
   - Specify achievement timeline
   - Set subject priorities (optional)
   - Configure notification preferences

3. **Get Recommendations**
   - View maximum skippable lectures
   - See must-attend lectures
   - Check subject-wise recommendations
   - Plan your weekly attendance

## Technical Requirements

### Frontend
- React.js
- Tailwind CSS
- Chart.js for attendance visualization
- Tesseract.js for OCR

### Backend
- Node.js
- Express.js

### APIs
- OCR API for screenshot parsing


## Installation

1. Clone the repository:
```bash
git clone https://github.com/nandit27/Bunker_Baba.git
```
2. install Dependecies
#### Frontend (React)
```bash
cd client
npm install
```

#### Backend (Node.js)
```bash
cd ../server
npm install
```
3. Run development server:
### Start the Backend Server

```bash
cd server
npm run dev
```

### Start the Frontend Development Server

```bash
cd client
npm run dev
```


## Disclaimer

This tool is for educational purposes only. Students are responsible for maintaining their required attendance as per university guidelines.
