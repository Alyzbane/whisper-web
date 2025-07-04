# Whisper Web

A modern web application for audio transcription and translation using [faster-whisper](https://github.com/SYSTRAN/faster-whisper). This application provides a user-friendly interface for transcribing audio files with support for multiple languages and models.

## Features

- **Audio Transcription**: Convert audio files to text using state-of-the-art Whisper models
- **Translation**: Translate audio content to English
- **Multiple Models**: Support for various Whisper model sizes (tiny, small, etc.)
- **Language Detection**: Automatic language detection or manual selection
- **Batch Processing**: Configurable batch sizes for optimal performance
- **Caching**: Redis-based caching with encryption for improved performance
- **History Management**: Keep track of previous transcriptions
- **Real-time Playback**: Audio preview with playback controls
- **Modern UI**: Clean, responsive interface built with Next.js and Tailwind CSS
- **Docker Support**: Easy deployment with Docker Compose

## Tech Stack

### Backend (FastAPI)
- **FastAPI**: Modern Python web framework
- **Faster Whisper**: Optimized Whisper implementation
- **Redis**: Caching and session management
- **Cryptography**: Encrypted caching for security
- **Pydantic**: Data validation and settings management

### Frontend (Next.js)
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Modern icon library

## Quick Start

### Prerequisites
- Docker and Docker Compose
- At least 4GB RAM for model loading
- CUDA-compatible GPU (optional, for faster processing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whisper-web
   ```

2. **Set up environment variables**
   ```bash
   # Copy example environment files
   cp api/.env.example api/.env.fastapi
   cp frontend/.env.example frontend/.env.local
   ```

3. **Configure API environment** (`api/.env.fastapi`)
   ```bash
   API_VERSION=/api/v1
   PROJECT_NAME=Whisper Web API
   
   CORS_ORIGINS=["http://localhost:3000"]
   
   REDIS_SCHEME=redis://
   REDIS_USERNAME=
   REDIS_PASSWORD=
   REDIS_HOST=redis
   REDIS_PORT=6379
   
   ADMIN_API_KEY=your_secure_admin_key_here
   CACHE_ENCRYPTION_KEYS=["your_32_character_base64_key_here"]
   CACHE_VERSION=v1
   UPLOAD_LIMIT=104857600  # 100MB in bytes
   ```

4. **Configure Frontend environment** (`frontend/.env.local`)
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_UPLOAD_MAX_SIZE=100
   API_VERSION=/api/v1
   ```

5. **Start the application**
   ```bash
   docker-compose up -d
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - API Documentation: http://localhost:8000/docs
   - Redis Insight: http://localhost:8001

## Development

### Running in Development Mode

The Docker Compose setup includes hot-reload for both frontend and backend:

```bash
# Start development services
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development Setup

If you prefer to run services locally:

#### Backend Setup
```bash
cd api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
pnpm install
pnpm dev
```

### Environment Variables

#### API Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `API_VERSION` | API version prefix | `/api/v1` |
| `PROJECT_NAME` | Application name | `Whisper Web API` |
| `CORS_ORIGINS` | Allowed CORS origins | `["http://localhost:3000"]` |
| `REDIS_HOST` | Redis server host | `redis` |
| `REDIS_PORT` | Redis server port | `6379` |
| `ADMIN_API_KEY` | Admin API key | Required (e.g. Fernet) |
| `CACHE_ENCRYPTION_KEYS` | Encryption keys for caching | Required (e.g. Fernet) |
| `UPLOAD_LIMIT` | Max file size in bytes | `104857600` |

#### Frontend Configuration
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_UPLOAD_MAX_SIZE` | Max upload size (MB) | `100` |

## API Endpoints

### Transcription
- `POST /api/v1/transcription/transcribe` - Transcribe audio file
- `GET /api/v1/transcription/models` - Get available models

### Admin
- `GET /api/v1/admin/rotate-tokens` - Rotate encryption keys (requires admin key)

### General
- `GET /health` - Health check endpoint

## Usage

1. **Upload Audio File**: Select an audio file (MP3, WAV, M4A, etc.)
2. **Configure Settings**:
   - Choose Whisper model (tiny, small, etc.)
   - Select task (transcribe or translate)
   - Set language (auto-detect or specific)
   - Adjust advanced settings (chunk length, batch size)
3. **Process**: Click transcribe to start processing
4. **Results**: View transcribed text and download if needed
5. **History**: Access previous transcriptions from the sidebar

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Redis         │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   (Cache)       │
│   Port: 3000    │    │   Port: 8000    │    │   Port: 6379    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Whisper       │
                    │   Models        │
                    └─────────────────┘
```

## Performance Considerations

- **GPU Support**: The application will automatically use CUDA if available
- **Model Caching**: Models are cached in memory for faster subsequent processing
- **Result Caching**: Transcription results are cached in Redis to avoid reprocessing
- **Batch Processing**: Configurable batch sizes for optimal throughput

## Security Features

- **Encrypted Caching**: All cached data is encrypted using Fernet encryption
- **Admin API Protection**: Admin endpoints require API key authentication
- **CORS Configuration**: Configurable CORS origins for security
- **File Size Limits**: Configurable upload size limits
- **Key Rotation**: Support for encryption key rotation

## Troubleshooting

### Common Issues

1. **Out of Memory**: Reduce batch size or use smaller models
2. **Model Loading Errors**: Ensure sufficient disk space and internet connectivity
3. **Redis Connection**: Verify Redis is running and accessible
4. **CORS Errors**: Check CORS_ORIGINS configuration

### Logs

```bash
# View API logs
docker-compose logs fastapi

# View Frontend logs
docker-compose logs nextjs-app

# View Redis logs
docker-compose logs redis
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for the Whisper model
- Faster Whisper for the optimized implementation
- The open-source community for the amazing tools and libraries