# 💪 PocketGymAI - Your Personal AI Gym Coach

A premium, modern AI-powered fitness coaching webapp built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui. Featuring an agentic AI interface for personalized training, real-time progress tracking, and a premium user experience inspired by Mozart AI.

## 🎯 Features

### 🏠 Landing Page
- **Premium Hero Section** - Compelling call-to-action with animated gradients
- **Features Showcase** - 6 key features with hover animations
- **Social Proof** - Trust indicators with user stats
- **Professional CTA** - Multiple conversion points

### 💬 AI Chat Interface
- **Real-time Chat** - Agentic AI coach interaction
- **Message History** - Persistent conversation tracking
- **Typing Indicators** - Professional UX with loading states
- **Voice Input Ready** - Mic button for voice commands (ready for implementation)

### 🏋️ Workout Programs
- **6 Curated Programs** - Beginner to Advanced levels
- **Program Cards** - Detailed workout information with stats
- **Interactive Filters** - Filter by difficulty level
- **Direct Chat Integration** - Start with selected program

### 📊 Progress Dashboard
- **Analytics Charts** - Weekly activity and progress tracking
- **Performance Metrics** - Weight, body fat, muscle mass, strength
- **Achievements** - Gamification with badges and milestones
- **Body Metrics** - Real-time progress visualization

### 🎨 Premium UI/UX
- **Glassmorphism Effects** - Modern frosted glass aesthetic
- **Gradient Backgrounds** - Dynamic animated gradients
- **Smooth Animations** - 10+ custom animations for polish
- **Dark Theme** - Eye-friendly premium dark interface
- **Responsive Design** - Mobile-first approach

### 🧭 Navigation
- **Fixed Navbar** - Premium branding and quick access
- **Smooth Scrolling** - Enhanced user experience
- **Professional Footer** - Company info and links

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Font**: Geist (optimized by Vercel)

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── chat/page.tsx         # AI chat interface
│   ├── workouts/page.tsx     # Workout programs
│   ├── progress/page.tsx     # Progress dashboard
│   ├── layout.tsx            # Root layout with navbar & footer
│   └── globals.css           # Premium animations & styles
├── components/
│   ├── navbar.tsx            # Navigation header
│   ├── footer.tsx            # Footer component
│   ├── hero.tsx              # Landing hero section
│   ├── features.tsx          # Features grid
│   ├── cta.tsx               # Call-to-action section
│   ├── animated-background.tsx # Animated background
│   └── ui/                   # shadcn/ui components
└── lib/
    └── utils.ts              # Utility functions
```

## 🎬 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎨 Custom Animations

The project includes 10+ premium animations:
- **fade-in** - Smooth opacity transition
- **float** - Gentle elevation effect
- **glow** - Glowing box shadow animation
- **slide-up** - Upward entrance
- **scale-fade-in** - Scale with fade
- **blur-reveal** - Blur to clarity
- **pulse-glow** - Pulsing glow effect
- **shimmer** - Shimmer wave effect
- **rotate-slow** - Slow rotation
- **bounce-elevation** - Bouncy elevation

## 📦 Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
```

## 🌟 Premium Features

✅ Glassmorphism UI with backdrop blur  
✅ Animated gradient backgrounds  
✅ Smooth page transitions  
✅ Real-time chat interface  
✅ Progress analytics with charts  
✅ Responsive mobile design  
✅ Dark theme optimization  
✅ Accessibility ready  
✅ Performance optimized with Turbopack  

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] User authentication
- [ ] Workout video integration
- [ ] Real AI model integration
- [ ] Mobile app (React Native)
- [ ] Community features
- [ ] Social sharing
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Push notifications

## 📝 Git Commits

1. **Initial Setup** - Next.js, TypeScript, Tailwind, shadcn/ui
2. **Navbar** - Premium navigation with glassmorphism
3. **Landing Page** - Hero section, features, CTA
4. **AI Chat** - Chat interface & workout programs
5. **Progress Dashboard** - Analytics and achievements
6. **Animations** - Premium effects and transitions

## 🤝 Contributing

This is an active development project. Feel free to contribute!

## 📄 License

MIT License - Feel free to use this for your projects!

---

**Built with ❤️ using Next.js and modern web technologies**

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
