@echo off
echo Starting Food Fiesta Microservices...

start "Gateway Service" cmd /k "cd backend\gateway && npm start"
start "Identity Service" cmd /k "cd backend\identity-service && npm start"
start "Order Service" cmd /k "cd backend\order-service && npm start"
start "Frontend" cmd /k "cd frontend && npm run dev"

echo All services started!
echo Frontend: http://localhost:5173
echo Gateway: http://localhost:5000
