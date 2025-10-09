# 🎯 Step-by-Step Testing Guide

## What We're Testing
**User Story 1**: A new fight academy wants to buy a license of the Oss365 app to create and manage their own data with 20 students.

## Prerequisites ✅
- Node.js v22.20.0 ✅
- npm v10.9.3 ✅

## Let's Test Step by Step!

### Step 1: Set Up the Backend

1. **Open PowerShell and navigate to the server folder:**
   ```powershell
   cd server
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```
   *This will install all the required packages including SQLite*

3. **Create environment file:**
   ```powershell
   copy env.example .env
   ```

4. **Edit the .env file** (open with Notepad):
   ```
   PORT=5000
   DATABASE_URL="sqlite://test-academy.db"
   JWT_SECRET="your_jwt_secret_key_for_testing_12345"
   JWT_EXPIRES_IN="1h"
   ```

### Step 2: Set Up the Database

1. **Run the SQLite setup script:**
   ```powershell
   npm run setup-sqlite
   ```

   **Expected Output:**
   ```
   🗄️ Setting up SQLite database for testing...
   ✅ Database tables created
   ✅ Elite Combat Academy tenant created
   ✅ Main Dojo branch created
   ✅ System manager created: admin@elite-combat.com
   ✅ Branch manager created: manager@elite-combat.com
   ✅ Coach created: Marcus Rodriguez (Brazilian Jiu-Jitsu)
   ✅ Coach created: Jessica Chen (Muay Thai)
   ✅ Coach created: David Thompson (Boxing)
   👥 Creating 20 students...
      ✅ EC001: Emma Williams (blue)
      ✅ EC002: James Brown (white)
      ✅ EC003: Sophia Davis (kids-yellow)
      ... (continues for all 20 students)
   📅 Creating sample classes...
      ✅ Beginner BJJ - Brazilian Jiu-Jitsu ($30)
      ✅ Advanced BJJ - Brazilian Jiu-Jitsu ($35)
      ✅ Kids BJJ - Brazilian Jiu-Jitsu ($25)
      ✅ Muay Thai Fundamentals - Muay Thai ($32)
      ✅ Boxing Basics - Boxing ($28)
   🎉 Elite Combat Academy setup completed successfully!
   ```

### Step 3: Start the Backend Server

1. **Start the API server:**
   ```powershell
   npm run dev
   ```

   **Expected Output:**
   ```
   Server running on port 5000
   ```

2. **Keep this terminal open** - the server needs to keep running

### Step 4: Test the Frontend

1. **Open a NEW PowerShell window** and navigate to the project root:
   ```powershell
   cd ..
   ```

2. **Start the React app:**
   ```powershell
   npm run dev
   ```

3. **Open your browser and go to:**
   ```
   http://localhost:5173/login
   ```

### Step 5: Test Login

1. **On the login page, enter these credentials:**
   - **Domain:** `elite-combat.jiu-jitsu.com`
   - **Email:** `admin@elite-combat.com`
   - **Password:** `EliteAdmin2024!`

2. **Click "Sign In"**

3. **You should see:**
   - ✅ Login successful
   - ✅ Redirect to dashboard
   - ✅ Elite Combat Academy data displayed

### Step 6: Verify the Data

1. **Check Students:**
   - Click on "Students" in the sidebar
   - You should see 20 students listed
   - Each student should have complete information

2. **Check Classes:**
   - Click on "Classes" in the sidebar
   - You should see 5 sample classes
   - Each class should have details like time, price, etc.

3. **Check User Management:**
   - Look for user management options
   - You should see different user roles

## 🎉 Success Indicators

✅ **Backend Setup:**
- SQLite database created successfully
- Elite Combat Academy tenant created
- 25 users created (1 system manager, 1 branch manager, 3 coaches, 20 students)
- 5 sample classes created

✅ **Frontend Testing:**
- Can log in with admin credentials
- Dashboard loads with Elite Combat Academy data
- Can see 20 students in Students section
- Can see 5 classes in Classes section
- Navigation works properly

✅ **Multi-Tenancy:**
- Data is isolated from original OSS365 Academy
- Only Elite Combat Academy data is visible
- Different tenant domains work correctly

## 🔐 Test Credentials

**System Manager (Full Access):**
- Domain: `elite-combat.jiu-jitsu.com`
- Email: `admin@elite-combat.com`
- Password: `EliteAdmin2024!`

**Branch Manager:**
- Domain: `elite-combat.jiu-jitsu.com`
- Email: `manager@elite-combat.com`
- Password: `EliteManager2024!`

**Coach:**
- Domain: `elite-combat.jiu-jitsu.com`
- Email: `marcus@elite-combat.com`
- Password: `EliteCoach2024!`

**Student:**
- Domain: `elite-combat.jiu-jitsu.com`
- Email: `emma.w@email.com`
- Password: `EliteStudent2024!`

## 🐛 Troubleshooting

**If you get errors:**

1. **"Module not found" error:**
   ```powershell
   npm install
   ```

2. **"Port already in use" error:**
   - Change PORT in .env to 5001
   - Or close other applications using port 5000

3. **"Database connection failed":**
   - Make sure you ran `npm run setup-sqlite` first
   - Check that the .env file is created correctly

4. **"Login failed":**
   - Check the credentials exactly as written above
   - Make sure the backend server is running
   - Check the browser console for errors

## 📋 What This Proves

✅ **User Story 1 is successful when:**
1. New academy (Elite Combat Academy) is created with professional license
2. 20 students are set up with complete profiles
3. Academy can log in and manage their own data
4. Data is completely isolated from other academies
5. All features work for the new academy

## 🚀 Ready to Start?

**Just follow the steps above one by one!**

1. Start with Step 1 (Set Up Backend)
2. Move to Step 2 (Set Up Database)
3. Continue through each step
4. Test the login and verify the data

**If you get stuck at any step, let me know and I'll help you!** 🤝
