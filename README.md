# SoundScore

A music rating and discovery platform integrated with Spotify.

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/soundscore.git
cd soundscore
```

2. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in both frontend and backend directories
- Fill in your Spotify API credentials and other configuration

4. Start the development servers:
```bash
# Backend
cd backend
npm run dev

# Frontend (in a new terminal)
cd frontend
npm start
```

5. Visit `http://localhost:3000` in your browser

## Features
- Spotify Integration
- Album Rating System
- User Profiles
- Music Discovery
- Social Features

## Tech Stack
- React
- Node.js/Express
- MongoDB
- Spotify Web API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 