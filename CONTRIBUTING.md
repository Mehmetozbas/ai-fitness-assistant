# Contributing to AI Fitness Assistant

## Code of Conduct

Be respectful, inclusive, and professional.

## How to Contribute

### 1. Fork and Clone

```bash
git clone https://github.com/your-username/ai-fitness-assistant.git
cd ai-fitness-assistant
git remote add upstream https://github.com/Mehmetozbas/ai-fitness-assistant.git
```

### 2. Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow TypeScript best practices
- Keep commits atomic and descriptive
- Add comments for complex logic

### 4. Test Your Changes

```bash
npm run dev
npm run lint
```

### 5. Commit and Push

```bash
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 6. Create Pull Request

- Describe changes clearly
- Reference related issues
- Include screenshots for UI changes

## Development Guidelines

### Code Style

- Use TypeScript
- Follow existing patterns
- Keep components small and focused
- Use meaningful variable names

### Component Structure

```typescript
'use client'  // If client component

import { useState } from 'react'
import { SomeIcon } from 'lucide-react'

export default function ComponentName() {
  const [state, setState] = useState()

  const handleAction = () => {
    // Logic here
  }

  return (
    <div className="space-y-4">
      {/* JSX here */}
    </div>
  )
}
```

### API Routes

```typescript
'use server'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Logic here

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

## Areas for Contribution

1. **Features**
   - Mobile app improvements
   - Advanced workout tracking
   - Social features
   - Video tutorials

2. **Bug Fixes**
   - Check "issues" tab
   - Test edge cases
   - Report reproducible steps

3. **Documentation**
   - Improve README
   - Add usage examples
   - Translate documentation

4. **Performance**
   - Optimize queries
   - Reduce bundle size
   - Improve load times

## Getting Help

- Join our Discord/community
- Check existing discussions
- Ask in pull request comments

## Thank You!

Your contributions help make fitness accessible to everyone! 🙏
