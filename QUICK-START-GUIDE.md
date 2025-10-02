# Quick Start Guide - User Management System

## 🚀 **Get Started in 3 Minutes**

### **Step 1: Access the Application**
Visit: **https://tonisvasconcelos.github.io/jiu-jitsu-academy-manager/**

### **Step 2: Login**
Use these credentials to test different roles:

**System Administrator (Full Access)**
- Email: `tonisvasconcelos@hotmail.com`
- Password: `password123`

**Fight Team Admin (Limited Access)**
- Email: `parioca@gfteam.com.br`
- Password: `password123`

### **Step 3: Explore Features**

#### **As System Administrator:**
1. Click "User Management" in the sidebar
2. See all users in the system
3. Click "Add User" to create a new user
4. Fill in the form and click "Create User"
5. Note the credentials shown in the alert
6. Try editing or deleting a user

#### **As Fight Team Admin:**
1. Notice "User Management" is not visible (no permission)
2. Access "Students" and "Teachers" pages
3. Try adding/editing students
4. View your profile in the header

## 📱 **Key Features**

### **Navigation**
- **Dashboard**: Main overview (students list)
- **Students**: Manage students
- **Teachers**: Manage teachers
- **User Management**: Manage users (System Admin only)
- **Settings**: Application settings
- **Profile**: User profile

### **Header**
- **User Avatar**: Shows your initials
- **User Name & Role**: Displays your information
- **Language Toggle**: Switch between English/Portuguese
- **Logout Button**: Sign out of the application

### **User Management** (System Admin Only)
- **Search**: Find users by name or email
- **Filter**: Filter by role
- **Add User**: Create new user accounts
- **Edit User**: Modify user details
- **Delete User**: Remove users from system
- **Refresh**: Reload user list

## 🔐 **User Roles**

| Role | Can Manage Users | Can Add/Edit Students | Can View Students |
|------|-----------------|----------------------|------------------|
| System Administrator | ✅ Yes | ✅ Yes | ✅ Yes |
| Academy Manager | ❌ No | ✅ Yes | ✅ Yes |
| Teacher / Coach | ❌ No | ✅ Yes | ✅ Yes |
| Student / Fighter | ❌ No | ❌ No | ✅ Yes |
| Fight Team Admin | ❌ No | ✅ Yes | ✅ Yes |

## 📝 **Creating a New User**

1. Login as System Administrator
2. Go to "User Management"
3. Click "Add User"
4. Fill in:
   - **Full Name**: User's complete name
   - **Email**: Valid email address
   - **Password**: At least 6 characters (default: password123)
   - **Role**: Select from dropdown
   - **Status**: Active/Inactive/Suspended
5. Click "Create User"
6. **Important**: Copy the login credentials from the alert!
7. Share credentials with the new user

## 🔄 **Common Actions**

### **Logout**
- Click the red "Logout" button in the header
- You'll be redirected to the login page
- Your session will be cleared

### **Change Language**
- Click the "English"/"Português" button in the header
- The entire interface will switch languages
- Your preference is saved

### **Search Users**
- Type in the search box at the top of User Management
- Searches by name or email
- Updates instantly as you type

### **Filter by Role**
- Use the dropdown next to the search box
- Select a specific role or "All Roles"
- Table updates to show filtered results

### **Refresh Data**
- Click the "Refresh" button
- Reloads the latest data from storage
- Useful after making changes in another tab

## ⚠️ **Important Notes**

### **Data Persistence**
- All data is stored in your browser's localStorage
- Data persists across page refreshes
- Clearing browser cache will reset to demo users
- Each browser has its own data (Chrome vs Firefox)

### **Access Control**
- Only System Administrators can access User Management
- Other roles will see "Access Denied" message
- Attempting to access restricted routes redirects to login

### **Session Management**
- Your session persists until you logout
- Closing the browser doesn't log you out
- Session data is stored in localStorage

## 🛠️ **Troubleshooting**

### **Can't Login?**
- Check email and password are correct
- Ensure user status is "Active"
- Try the demo credentials above

### **Don't See User Management?**
- Only System Administrators have access
- Login with: tonisvasconcelos@hotmail.com / password123

### **Changes Not Showing?**
- Click the "Refresh" button
- Clear browser cache and reload
- Check if you're in the correct tab/window

### **Forgot Password?**
- Use demo credentials to login as System Admin
- Edit the user and set a new password
- Note: No "forgot password" feature yet

## 🎯 **Quick Tips**

1. **Always note the credentials** when creating a new user
2. **Use descriptive names** to identify users easily
3. **Set appropriate roles** based on user responsibilities
4. **Keep System Admin credentials secure**
5. **Test new users** after creation to ensure they work
6. **Use "Inactive" status** instead of deleting users you might need later

## 📞 **Need Help?**

- Check the detailed documentation in `USER-MANAGEMENT-IMPLEMENTATION.md`
- Review the summary in `USER-MANAGEMENT-SUMMARY.md`
- Test with demo credentials to explore features safely

## ✅ **Checklist for New Users**

- [ ] Access the application URL
- [ ] Login with System Admin credentials
- [ ] Explore the dashboard and navigation
- [ ] Visit User Management page
- [ ] Create a test user
- [ ] Note the login credentials
- [ ] Logout and login with the new user
- [ ] Test different roles and permissions
- [ ] Change language to see translations
- [ ] Logout when done

**You're all set! Start managing users now at: https://tonisvasconcelos.github.io/jiu-jitsu-academy-manager/**


