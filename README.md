# MUJ Unfiltered 🎭

A modern, anonymous social platform built with React, TypeScript, and Firebase. Share your thoughts, confessions, and stories without revealing your identity.

![MUJ Unfiltered](https://img.shields.io/badge/React-19.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38bdf8) ![Firebase](https://img.shields.io/badge/Firebase-12.6.0-orange)

## ✨ Features

- 🎭 **Anonymous Posting** - Share your thoughts without revealing your identity
- 💬 **Real-time Feed** - See posts as they happen with Firebase real-time updates
- ❤️ **Engagement** - Like and comment on posts
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS v4
- 🔐 **Firebase Authentication** - Secure anonymous authentication
- 📱 **Responsive** - Works seamlessly on desktop and mobile
- ✨ **Smooth Animations** - Powered by Framer Motion

## 🚀 Tech Stack

- **Frontend Framework**: React 19.2.0
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.17 + DaisyUI
- **Backend**: Firebase (Firestore, Authentication)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React
- **Build Tool**: Vite 7.2.4

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pranav172/muj-unfiltered.git
   cd muj-unfiltered
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database and Authentication (Anonymous sign-in)
   - Copy your Firebase config and create `src/lib/firebase.ts`:
   
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';
   import { getFirestore } from 'firebase/firestore';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
muj-unfiltered/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   ├── PostModal.tsx
│   │   ├── Onboarding.tsx
│   │   └── LandingPage.tsx
│   ├── pages/           # Page components
│   │   └── SocialFeed.tsx
│   ├── store/           # Zustand state management
│   │   └── useStore.ts
│   ├── lib/             # Utilities and Firebase config
│   │   ├── firebase.ts
│   │   └── cleanupPosts.ts
│   ├── types/           # TypeScript type definitions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Features in Detail

### Anonymous Posting
Users can post confessions anonymously or choose to reveal their identity. All posts are validated for minimum length and spam prevention.

### Real-time Updates
Posts appear instantly using Firebase's real-time listeners, creating a dynamic and engaging experience.

### Engagement System
Users can like posts and add comments, fostering community interaction while maintaining anonymity.

### Auto Cleanup
Old posts are automatically cleaned up to keep the feed fresh and relevant.

## 🔧 Configuration

### Tailwind CSS v4
This project uses Tailwind CSS v4 with the new `@import "tailwindcss";` syntax. Make sure your `postcss.config.js` includes:

```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### Firebase Security Rules
Make sure to set up proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.ownerId;
    }
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## 🚀 Deployment

### Deploy to Vercel
1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add your Firebase environment variables
4. Deploy!

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to [Netlify](https://netlify.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Pranav**
- GitHub: [@pranav172](https://github.com/pranav172)

## 🙏 Acknowledgments

- Built with ❤️ for the MUJ community
- Inspired by the need for anonymous expression
- Thanks to all contributors and users

---

**Note**: This is a student project. Please use responsibly and respect community guidelines.
