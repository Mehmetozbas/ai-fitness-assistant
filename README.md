# AI Fitness Assistant

A modern, AI-powered fitness application where users can upload photos, receive an AI-based body/posture assessment, and get personalized workout plans.

## Features

- 👤 **User Authentication** - Secure signup, login, and profile management
- 📸 **AI Body Analysis** - Upload 4 photos for posture and symmetry assessment
- 🏋️ **Personalized Workouts** - Custom workout plans based on goals and equipment
- 📊 **Progress Tracking** - Track workouts, photos, and consistency
- 🍎 **Nutrition Guidance** - Personalized nutrition recommendations
- 💬 **AI Fitness Coach** - Ask questions about exercises and training
- 📚 **Exercise Library** - Comprehensive database of exercises
- 🔔 **Notifications** - Workout reminders and streak tracking

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI**: OpenAI API
- **Storage**: Supabase

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- OpenAI API key
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/Mehmetozbas/ai-fitness-assistant.git
cd ai-fitness-assistant
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your credentials

5. Set up the database
```bash
npm run prisma:migrate
```

6. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
.
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and helpers
├── prisma/          # Database schema
├── services/        # Business logic and API calls
├── types/           # TypeScript type definitions
└── public/          # Static assets
```

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/user/profile` - Update user profile
- `POST /api/body-analysis/upload` - Upload photos for analysis
- `GET /api/workouts` - Get user's workouts
- `POST /api/workouts/complete` - Mark workout as complete
- `POST /api/ai/analyze` - Get AI body analysis
- `POST /api/ai/coach` - Chat with AI coach

## Development

### Database commands
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (GUI)
npm run prisma:studio
```

### Code style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

## Privacy & Security

- User data is encrypted and securely stored
- Body photos are private and only accessible to the user
- API keys are stored in environment variables
- JWT-based authentication
- CSRF protection

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time workout tracking
- [ ] Social features (sharing progress)
- [ ] Advanced nutrition tracking
- [ ] Video demonstrations for exercises
- [ ] Push notifications
- [ ] Wearable integration

## Contributing

Contributions are welcome! Please create a pull request with your changes.

## License

MIT License - see LICENSE file for details

## Support

For support, email support@example.com or create an issue on GitHub.
