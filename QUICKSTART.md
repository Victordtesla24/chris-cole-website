# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Visit [http://localhost:3000](http://localhost:3000)

## 📝 Customize Your Portfolio

### 1. Update Personal Info

**Hero Section** (`src/components/HeroSection.tsx`)
```typescript
// Change your title and tagline
<h1>Your Name &<br /><span>Your Title</span></h1>
<p>Your personal description...</p>
```

**About Section** (`src/components/AboutSection.tsx`)
```typescript
// Update your bio
<p>Your professional background...</p>

// Add your skills
const skills = [
  'Your Skill 1',
  'Your Skill 2',
  // ...
];
```

### 2. Add Your Projects

**WorkGrid Component** (`src/components/WorkGrid.tsx`)
```typescript
const projects = [
  {
    title: 'Your Project Name',
    description: 'Brief project description',
    image: '/assets/images/your-project.jpg',
    tags: ['Tech1', 'Tech2'],
    link: 'https://your-project-url.com',
  },
  // Add more projects...
];
```

### 3. Update Social Links

**Footer Component** (`src/components/Footer.tsx`)
```typescript
const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/yourusername', icon: '🔗' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/yourprofile', icon: '💼' },
  { name: 'Email', url: 'mailto:your@email.com', icon: '✉️' },
];
```

### 4. Add Project Images

Place your images in:
```
public/assets/images/
├── project1.jpg
├── project2.jpg
├── project3.jpg
└── ...
```

### 5. Customize Colors

**Tailwind Config** (`tailwind.config.js`)
```javascript
colors: {
  primary: {
    DEFAULT: '#000000',  // Your primary color
    light: '#1a1a1a',
  },
  accent: {
    DEFAULT: '#ffffff',  // Your accent color
    muted: '#cccccc',
  },
}
```

## 🎨 Design Tips

### Color Schemes
- **Minimal Dark**: Black background with white accents (default)
- **Minimal Light**: White background with dark text
- **Bold**: Vibrant colors with high contrast
- **Gradient**: Use gradient backgrounds for modern look

### Typography
Change fonts in `src/pages/_app.tsx`:
```typescript
import { YourFont } from 'next/font/google';
```

### Animations
- Keep animations subtle and smooth
- Use `fadeInUp` for entry animations
- Add hover effects for interactivity
- Ensure 60fps performance

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📱 Testing Responsiveness

### Browser DevTools
1. Open DevTools (F12)
2. Click device toolbar icon
3. Test on different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1440px

### Real Devices
Test on actual phones and tablets for best results

## 🚢 Deploy to Render.com

### Quick Deploy
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push

# 2. Connect to Render
# Visit: https://dashboard.render.com
# Click: New + → Blueprint
# Select your repository

# 3. Deploy!
# Render auto-detects render.yaml
```

See `DEPLOYMENT.md` for detailed instructions.

## 🐛 Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

### TypeScript Errors
```bash
# Check types
npm run type-check
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Pro Tips

1. **Images**: Use WebP format for better performance
2. **Animations**: Test on slower devices
3. **Content**: Write clear, concise copy
4. **SEO**: Update meta tags in `_document.tsx`
5. **Testing**: Check on multiple browsers

## 🎯 Next Steps

- [ ] Customize content and styling
- [ ] Add your project images
- [ ] Test on different devices
- [ ] Update SEO meta tags
- [ ] Deploy to Render.com
- [ ] Share your portfolio!

---

**Need Help?** Check the README.md for more detailed documentation.

