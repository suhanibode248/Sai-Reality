@echo off
echo ==========================================
echo  Certified Properties — FastAPI Backend
echo ==========================================
echo.
echo Starting FastAPI on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
cd /d "%~dp0backend"
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
