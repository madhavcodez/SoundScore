# <img src="frontend/public/ss-logo.png" width="30" alt="SS Logo"> SoundScore

<div align="center">
  <h3>🎵 Rate, Share, and Discover Music</h3>
  <p>A modern web application for music enthusiasts to rate albums, share their musical journey, and connect with like-minded listeners.</p>

  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
  ![Spotify](https://img.shields.io/badge/Spotify-1ED760?style=flat&logo=spotify&logoColor=white)
</div>

## ✨ Features

- 🎧 **Spotify Integration**: Seamlessly connect with your Spotify account
- 📊 **Album Ratings**: Rate and review your favorite albums
- 🔍 **Smart Discovery**: Get personalized album recommendations
- 👥 **Social Features**: Connect with friends and share your music taste
- 📱 **Responsive Design**: Beautiful interface on any device
- 🌙 **Dark Mode**: Easy on the eyes, perfect for night listening sessions

## 🖼️ Screenshots

<div align="center">
  <img src="docs/screenshots/landing.png" width="45%" alt="Landing Page">
  <img src="docs/screenshots/dashboard.png" width="45%" alt="Dashboard">
</div>

<div align="center">
  <img src="docs/screenshots/album-view.png" width="45%" alt="Album View">
  <img src="docs/screenshots/profile.png" width="45%" alt="Profile Page">
</div>

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Spotify Developer Account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/SoundScore.git
cd SoundScore
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Set up environment variables:
```bash
# Backend (.env)
MONGODB_URI=your_mongodb_uri
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
JWT_SECRET=your_jwt_secret

# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## 🛠️ Tech Stack

### Frontend
- React.js
- Framer Motion
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### APIs
- Spotify Web API
- Last.fm API (for additional music data)

## 📱 Key Features Breakdown

### Album Discovery
- Personalized recommendations based on listening history
- Trending albums in your network
- New releases from favorite artists

### Rating System
- Half-star rating system (0.5 to 5 stars)
- Detailed review support
- Rating history and statistics

### Social Features
- Follow other music enthusiasts
- Share ratings and reviews
- Collaborative playlists
- Activity feed

### Profile Customization
- Listening statistics
- Rating distribution
- Favorite genres
- Custom lists and collections

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Last.fm API](https://www.last.fm/api)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">
  <sub>Built with ❤️ by music lovers, for music lovers.</sub>
</div> 