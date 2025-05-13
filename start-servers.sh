#!/bin/bash

# Start the Python Flask server
echo "Starting Python Flask server..."
cd python-backend
python3 app.py &
PYTHON_PID=$!
echo "Python server started with PID: $PYTHON_PID"

# Wait a moment for Python server to initialize
sleep 2

# Start the Node.js server
echo "Starting Node.js server..."
cd ../server
npm run dev &
NODE_PID=$!
echo "Node.js server started with PID: $NODE_PID"

# Start the React frontend
echo "Starting React frontend..."
cd ../Client
npm run dev &
REACT_PID=$!
echo "React frontend started with PID: $REACT_PID"

# Function to handle Ctrl+C and clean up processes
function cleanup {
    echo "Shutting down servers..."
    kill $PYTHON_PID
    kill $NODE_PID
    kill $REACT_PID
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT

# Keep script running
echo "All servers started. Press Ctrl+C to stop all servers."
wait 