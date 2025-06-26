# Whisper Web Backend

This is the backend service for the Whisper Web application, which provides speech-to-text transcription using OpenAI's Whisper models.

## Architecture

The backend follows a clean architecture with the following structure:

```
backend/
├── app/
│   ├── api/             # API routes and endpoints
│   ├── core/            # Core configuration and utilities
│   ├── schemas/         # Pydantic data models
│   ├── services/        # Business logic services
│   ├── utils/           # Utility functions
│   └── main.py          # Application entry point
└── requirements.txt     # Dependencies
```

## Getting Started

### Prerequisites

- Python 3.8+
- CUDA-compatible GPU (optional, for faster transcription)

### Installation

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

### Running the Server

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running, you can access the auto-generated API documentation at:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# API settings
CORS_ORIGINS=["http://localhost:5173"]

# Model settings
DEFAULT_MODEL=openai/whisper-small
```

## Running Tests

```bash
pytest
```
