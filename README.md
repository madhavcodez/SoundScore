# SoundScore 🎵

A modern music rating and discovery platform built with the MERN stack, featuring Spotify integration and a beautiful, responsive UI.

## 🌟 Features

### Core Features
- **Spotify Integration**: Seamless authentication and album discovery
- **Album Ratings & Reviews**: Rate and review your favorite albums
- **Custom Top 6 Albums**: Curate and showcase your favorite albums on your profile
- **Friend System**: Connect with other music enthusiasts
- **Lists**: Create and share custom album lists
- **Comments & Likes**: Engage with other users' reviews and lists

### Technical Features
- **Real-time Updates**: Instant feedback on ratings and interactions
- **Responsive Design**: Beautiful UI that works on all devices
- **Secure Authentication**: Protected routes and secure API endpoints
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Search & Filter**: Find albums, users, and lists easily

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- React Beautiful DnD
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Spotify Web API

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Spotify Developer Account
- npm or yarn

### Environment Variables
Create a `.env` file in the backend directory:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/SoundScore.git
cd SoundScore
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Start the development servers
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## 📱 Screenshots

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Album Details
![Album Details](screenshots/album-details.png)

### Profile Page
![Profile](screenshots/profile.png)

### Lists
![Lists](screenshots/lists.png)

## 🔒 Security

- JWT-based authentication
- Secure password hashing
- Protected API routes
- Environment variable protection
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Spotify](https://www.spotify.com/) for their amazing API
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful styling
- All contributors and users of SoundScore

## 📞 Support

For support, email support@soundscore.com or join our Discord server.

---

Made with ❤️ by [Your Name] 