# 🥋 Jiu-Jitsu Academy Manager

A comprehensive management system for Jiu-Jitsu academies built with React and TypeScript.

## 🚀 Features

- **Dashboard** - Overview of academy statistics and quick actions
- **Student Management** - Manage student information and enrollments
- **Instructor Management** - Handle instructor profiles and schedules
- **Martial Arts Setup** - Configure different martial art types and programs
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Dark Theme** - Modern dark UI for better user experience

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Fluent UI** components for enhanced UI
- **GitHub Actions** for automated deployment
- **GitHub Pages** for hosting

## 📁 Project Structure

```
src/
├── App.tsx                    # Main application component with routing
├── main.tsx                   # Application entry point
├── index.css                  # Global styles with Tailwind
├── components/
│   ├── Header.tsx            # Top navigation header
│   └── Sidebar.tsx           # Collapsible sidebar navigation
└── pages/
    ├── Dashboard.tsx         # Main dashboard with statistics
    ├── Students.tsx          # Student management page
    ├── Instructors.tsx       # Instructor management page
    └── MartialArtTypes.tsx   # Martial arts configuration
```

## 🔄 Automated Deployment

The project uses GitHub Actions for automated deployment:

- **Trigger**: Pushes to the `main` branch
- **Process**: Builds the React app and deploys to GitHub Pages
- **Workflow**: `.github/workflows/deploy.yml`

## 🌐 Live Demo

Your app is live at: [https://tonisvasconcelos.github.io/jiu-jitsu-academy-manager/](https://tonisvasconcelos.github.io/jiu-jitsu-academy-manager/)

## 🎯 Current Status

✅ **Completed:**
- Basic application structure
- Responsive sidebar navigation
- Dashboard with statistics cards
- Dark theme implementation
- Automated deployment workflow

🔄 **In Progress:**
- Student management functionality
- Instructor management features
- Martial arts configuration

## 🚀 Next Steps

1. Implement CRUD operations for students
2. Add instructor management features
3. Set up martial arts configuration
4. Add authentication system
5. Implement data persistence
6. Add reporting and analytics

---

**Built with ❤️ for the Jiu-Jitsu community** 🥋
