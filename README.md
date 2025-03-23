# SoundScore - Music Rating Platform

SoundScore is a web application that allows users to rate, review, and discover music through Spotify integration. Users can track their listening history, rate albums, and share their musical taste with friends.

## Features

- 🎵 Spotify Integration
- ⭐ Album Rating System
- 📊 Personal Music Statistics
- 🎧 Track Preview Functionality
- 👥 User Profiles
- 📱 Responsive Design
- 🌙 Dark Mode Interface

## Tech Stack

- Frontend:
  - React.js
  - Tailwind CSS
  - Axios for API calls
  - React Router for navigation
  - React Hot Toast for notifications

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Spotify Web API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance
- Spotify Developer Account

### Environment Variables

Create a `.env` file in both frontend and backend directories:

```env
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SPOTIFY_CLIENT_ID=your_spotify_client_id

# Backend (.env)
PORT=5000
MONGODB_URI=your_mongodb_uri
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
JWT_SECRET=your_jwt_secret
```

### Installation

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

3. Start the development servers:
```bash
# Backend
cd backend
npm run dev

# Frontend (in a new terminal)
cd frontend
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 