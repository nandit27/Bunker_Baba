# Bunker Baba Python Backend

This is the Python backend for the Bunker Baba student attendance analysis project. It provides OCR and LLM chat capabilities.

## Features

- OCR processing of attendance screenshots using EasyOCR
- Structured JSON output of attendance data
- MongoDB integration for data storage
- Chat functionality with LLM (placeholder implementation for now)

## Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

2. Activate the virtual environment:
   ```bash
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with the following content:
   ```
   MONGODB_URI=mongodb://localhost:27017/
   DB_NAME=bunker_baba
   FLASK_ENV=development
   ```

5. Start the server:
   ```bash
   python app.py
   ```

The server will start at `http://localhost:5000`.

## API Endpoints

### OCR Processing

**Endpoint**: `/ocr`
**Method**: POST
**Content-Type**: `multipart/form-data`

**Parameters**:
- `screenshot`: Image file of the attendance screenshot
- `student_id` (optional): Student ID for record association

**Response**:
```json
{
  "success": true,
  "record_id": "record_id_from_mongodb",
  "data": {
    "student_id": "123",
    "records": [
      {
        "subjectName": "DS",
        "classType": "THEORY",
        "attended": 21,
        "total": 24,
        "percentage": 87.5
      },
      {
        "subjectName": "WT",
        "classType": "PRACTICAL",
        "attended": 14,
        "total": 16,
        "percentage": 87.5
      }
    ],
    "overallPercentage": 85.25
  }
}
```

### Chat

**Endpoint**: `/chat`
**Method**: POST
**Content-Type**: `application/json`

**Request Body**:
```json
{
  "message": "How many classes can I miss?",
  "context": {} // Optional context
}
```

**Response**:
```json
{
  "success": true,
  "response": "Based on your attendance data, you should aim to attend more classes to maintain a good percentage."
}
```

## Development

- `models/` - MongoDB schema models
- `routes/` - API route handlers
- `utils/` - Utility functions for OCR and chat processing 