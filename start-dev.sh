#!/bin/bash

# Export environment variable for Vite
export VITE_API_BASE_URL="http://localhost:3001/api"

# Start backend in background
cd backend && node server.js &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 3

# Start frontend (this will be the main process)
cd ..
echo "Starting frontend on port 5000..."
npm run dev

# Clean up backend on exit
kill $BACKEND_PID 2>/dev/null
