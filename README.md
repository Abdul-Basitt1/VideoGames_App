# 🎮 GameVerse - Video Games Discovery App

A modern, immersive React Native app for discovering and exploring video games using the RAWG Video Games Database API. Built with React Native CLI and JavaScript.

## ✨ Features

- 🏠 **Home Screen**: Browse trending games with beautiful cards and smooth animations
- 🔍 **Search**: Real-time game search with instant results
- 📰 **News**: Stay updated with upcoming game releases
- ⭐ **Favorites**: Save and manage your favorite games
- 🎨 **Modern UI**: Dark theme with neon accents for an immersive gaming experience
- 🎬 **Onboarding**: Interactive animated introduction for new users
- 📱 **Game Details**: Rich, detailed views of each game with screenshots and info

## 🏗️ Tech Stack

- **React Native**: 0.81.4
- **React Navigation**: Stack & Bottom Tabs navigation
- **Reanimated**: Smooth animations and transitions
- **Axios**: HTTP client for API calls
- **AsyncStorage**: Local data persistence
- **RAWG API**: Video games database

## 📦 Dependencies

### Core Navigation
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `react-native-screens`
- `react-native-safe-area-context`

### Animation & UI
- `react-native-reanimated`
- `react-native-gesture-handler`
- `react-native-vector-icons`
- `react-native-linear-gradient`

### Data & Storage
- `axios`
- `@react-native-async-storage/async-storage`

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- React Native development environment set up
- Xcode (for iOS)
- Android Studio (for Android)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd VideoGames_List
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file in the root directory
echo "RAWG_API_KEY=your_api_key_here" > .env
```
**Note**: Get your free API key from [RAWG.io](https://rawg.io/apidocs)

4. For iOS, install CocoaPods dependencies:
```bash
cd ios
bundle install
bundle exec pod install
cd ..
```

### Running the App

1. Start Metro bundler:
```bash
npm start
```

2. Run on iOS:
```bash
npm run ios
```

3. Run on Android:
```bash
npm run android
```

## 📁 Project Structure

```
VideoGames_List/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Main games list
│   │   ├── GameDetailsScreen.js   # Individual game details
│   │   ├── NewsScreen.js          # Upcoming games
│   │   ├── FavoritesScreen.js     # Saved favorites
│   │   └── OnboardingScreen.js    # First-time user intro
│   ├── navigation/
│   │   └── AppNavigator.js        # Navigation setup
│   ├── services/
│   │   └── api.js                 # RAWG API integration
│   ├── utils/
│   │   └── storage.js             # AsyncStorage helpers
│   └── constants/
│       ├── colors.js              # Theme colors
│       └── api.js                 # API configuration
├── App.js                         # Root component
├── index.js                       # Entry point
└── package.json
```

## 🔌 API Configuration

The app uses the RAWG Video Games Database API:
- **Base URL**: `https://api.rawg.io/api`
- **API Key**: Configured in `.env` file (see Installation step 3)

### Get Your API Key

1. Visit [RAWG.io](https://rawg.io/apidocs)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

### Available Endpoints

- **Games**: Get trending, upcoming, and all games
- **Search**: Real-time game search
- **Details**: Comprehensive game information
- **Genres**: Filter by game genre
- **Platforms**: Filter by platform

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler cache issues**:
```bash
npm start -- --reset-cache
```

2. **iOS build issues**:
```bash
cd ios
rm -rf Pods Podfile.lock
bundle exec pod install
cd ..
```

3. **Android build issues**:
```bash
cd android
./gradlew clean
cd ..
```

4. **Module not found errors**:
```bash
npm install
```

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- RAWG API for providing the comprehensive game database
- React Native community for excellent documentation
- All the open-source libraries that made this possible

---

Built with ❤️ using React Native
