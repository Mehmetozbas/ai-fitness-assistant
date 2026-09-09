# AI Fitness Assistant - Deployment Guide

## Prerequisites

- Node.js 18+ or Docker
- PostgreSQL database
- OpenAI API key (optional, app works with mock data)
- Supabase account (optional, for file storage)

## Local Development

### 1. Clone and Install

```bash
git clone https://github.com/Mehmetozbas/ai-fitness-assistant.git
cd ai-fitness-assistant
npm install
```

### 2. Database Setup

```bash
# Copy environment file
cp .env.example .env.local

# Update .env.local with your database URL
# DATABASE_URL="postgresql://user:password@localhost:5432/fitness_db"

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio to view database
npm run prisma:studio
```

### 3. Configure Environment Variables

Edit `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/fitness_db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# OpenAI (optional)
OPENAI_API_KEY="sk-..."

# Supabase (optional)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Docker Deployment

### Using Docker Compose (Recommended for development)

```bash
# Set environment variables
export OPENAI_API_KEY="your-api-key"

# Start services
docker-compose up -d

# Run migrations
docker-compose exec app npm run prisma:migrate

# Stop services
docker-compose down
```

### Using Production Dockerfile

```bash
# Build image
docker build -f Dockerfile.prod -t ai-fitness-assistant:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="your-database-url" \
  -e NEXTAUTH_SECRET="your-secret" \
  -e OPENAI_API_KEY="your-api-key" \
  ai-fitness-assistant:latest
```

## Deployment Platforms

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
# Vercel CLI
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add OPENAI_API_KEY
vercel deploy
```

### Railway

1. Connect GitHub repository
2. Add PostgreSQL plugin
3. Set environment variables
4. Deploy

### Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# Set environment variables
heroku config:set NEXTAUTH_SECRET="your-secret"
heroku config:set OPENAI_API_KEY="your-api-key"

# Deploy
git push heroku main

# Run migrations
heroku run npm run prisma:migrate
```

### AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Clone repository
git clone https://github.com/Mehmetozbas/ai-fitness-assistant.git
cd ai-fitness-assistant

# Install dependencies
npm ci

# Setup environment variables
nano .env.local

# Run migrations
npm run prisma:migrate

# Build and start
npm run build
npm start
```

## Database Backup

### PostgreSQL Backup

```bash
# Backup database
pg_dump $DATABASE_URL > backup.sql

# Restore database
psql $DATABASE_URL < backup.sql
```

## Monitoring and Maintenance

### Logs

```bash
# View application logs
npm run dev  # Development

# Production logs (depends on hosting platform)
# Vercel: vercel logs
# Heroku: heroku logs --tail
```

### Database Maintenance

```bash
# Update schema (after changes to schema.prisma)
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate
```

## Troubleshooting

### Database Connection Issues

```bash
# Check DATABASE_URL format
# postgresql://user:password@host:port/database

# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### Missing Environment Variables

```bash
# Ensure all required variables are set
echo $DATABASE_URL
echo $NEXTAUTH_SECRET
echo $OPENAI_API_KEY
```

### Prisma Issues

```bash
# Regenerate Prisma Client
rm -rf node_modules/.prisma
npm run prisma:generate
```

## Performance Optimization

1. **Enable Image Optimization**: Vercel automatically optimizes images
2. **Database Indexing**: Add indexes to frequently queried fields
3. **Caching**: Implement Redis for session caching
4. **CDN**: Use CDN for static assets (Vercel/Cloudflare)

## Security Checklist

- [ ] Change NEXTAUTH_SECRET to a secure value
- [ ] Use HTTPS in production
- [ ] Enable CORS protection
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable database backups
- [ ] Monitor for suspicious activity
- [ ] Keep dependencies updated

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with details
3. Contact: support@example.com
