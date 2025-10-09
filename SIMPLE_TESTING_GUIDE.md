# 🎯 Simple Testing Guide - User Story 1

## What We're Testing
**User Story**: A new fight academy wants to buy a license of the Oss365 app to create and manage their own data with 20 students.

## Prerequisites
- ✅ Node.js (you have v22.20.0)
- ✅ npm (you have v10.9.3)
- ❌ Docker (not needed for this simple test)

## Step-by-Step Testing

### Step 1: Set Up the Backend

1. **Navigate to the server folder:**
   ```powershell
   cd server
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

3. **Create environment file:**
   ```powershell
   copy env.example .env
   ```

4. **Edit the .env file** (you can use Notepad or any text editor):
   ```
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/jiu_jitsu_academy_db"
   JWT_SECRET="your_jwt_secret_key_for_testing"
   JWT_EXPIRES_IN="1h"
   ```

### Step 2: Set Up a Simple Database (SQLite for Testing)

Since you don't have Docker, let's use SQLite for testing. Let me create a simple version:

1. **Install SQLite dependencies:**
   ```powershell
   npm install sqlite3
   ```

2. **Create a simple database setup script**

### Step 3: Test the Academy Creation

1. **Run the academy creation script:**
   ```powershell
   npm run create-academy
   ```

### Step 4: Test the Frontend

1. **Start the React app:**
   ```powershell
   cd ..
   npm run dev
   ```

2. **Open your browser and go to:**
   ```
   http://localhost:5173/login
   ```

3. **Test login with these credentials:**
   - **Domain:** `elite-combat.jiu-jitsu.com`
   - **Email:** `admin@elite-combat.com`
   - **Password:** `EliteAdmin2024!`

## What Should Happen

✅ **Success Indicators:**
- Academy creation script runs without errors
- You can log in to the frontend
- You see the Elite Combat Academy dashboard
- You can see 20 students in the Students section
- You can see 5 classes in the Classes section
- Data is isolated from the original OSS365 Academy

## Troubleshooting

**If you get errors:**
1. Make sure you're in the right folder
2. Check that all dependencies are installed
3. Verify the .env file is created correctly
4. Check the console for error messages

**Common Issues:**
- **Database connection error**: We'll use SQLite instead of PostgreSQL
- **Port already in use**: Change the PORT in .env to 5001
- **Module not found**: Run `npm install` again

## Next Steps After Testing

Once you confirm everything works:
1. ✅ New academy is created
2. ✅ 20 students are set up
3. ✅ You can log in and manage data
4. ✅ Data is isolated between tenants

Then we can move to the next user story!

---

**Ready to start? Let's begin with Step 1!** 🚀
