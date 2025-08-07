@echo off
echo Starting M7RNetworking Platform...

REM Start backend
echo Starting backend server...
cd backend
start "Backend" node index.js
cd ..

REM Wait a moment
timeout /t 2 /nobreak >nul

REM Start frontend
echo Starting frontend server...
start "Frontend" npm run dev

echo Both servers are starting...
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173
pause
