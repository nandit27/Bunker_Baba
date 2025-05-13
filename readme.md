# Bunker Baba - Student Attendance Analysis

Bunker Baba is a comprehensive attendance analysis tool for students. It helps analyze attendance records from screenshots, calculates skip allowances, and provides insights via chat.

## 🏗️ Project Structure

The project is organized into three main components:

1. **React Frontend** (`Client/`)
   - React app with Tailwind CSS and Shadcn UI
   - Uses React Query for API data management

2. **Node.js API Gateway** (`server/`)
   - Express server acting as an API gateway
   - Routes requests between frontend and Python backend
   - Handles attendance data and calculations

3. **Python Backend** (`python-backend/`)
   - Flask API for OCR and LLM processing
   - Uses EasyOCR for text extraction from attendance screenshots
   - MongoDB integration for data storage
   - Chat functionality with LLM (placeholder implementation)

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB

### Python Backend

1. Navigate to the Python backend directory:
   ```
   cd python-backend
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Start the Flask server:
   ```
   python app.py
   ```
   The server will run on http://localhost:5000.

### Node.js Server

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm run dev
   ```
   The server will run on http://localhost:3001.

### React Frontend

1. Navigate to the client directory:
   ```
   cd Client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The app will be available at http://localhost:5173.

### Running All Services Together

For convenience, you can use the included script to start all services:

```
./start-servers.sh
```

This will start the Python backend, Node.js server, and React frontend concurrently.

## 🛠️ Core Features

1. **OCR Processing**
   - Upload attendance screenshots for analysis
   - Extract structured data from images

2. **Attendance Analysis**
   - Calculate current attendance percentage
   - Determine how many classes you can skip while maintaining target attendance

3. **Chat Assistant**
   - Ask questions about your attendance
   - Get insights and recommendations

## 🔄 API Flow

1. Frontend → Node.js API Gateway → Python backend (for OCR/LLM)
2. Python backend → MongoDB (for data storage)
3. Python backend → Node.js API Gateway → Frontend (response)

## 🧩 Technology Stack

- **Frontend**: React, Tailwind CSS, Shadcn UI, React Query
- **API Gateway**: Node.js, Express
- **Backend Processing**: Python, Flask, EasyOCR
- **Database**: MongoDB

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
