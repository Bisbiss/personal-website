# 🚀 Personal Portfolio Website - Bisbiss

A modern, feature-rich personal portfolio website built with React, Vite, Tailwind CSS, and Supabase. Showcasing projects, articles, products, and more with a beautiful dark/light mode interface.

![Portfolio Preview](https://via.placeholder.com/1200x600/020617/06b6d4?text=Bisbiss+Portfolio)

## ✨ Features

### 🎨 Frontend
- **Modern UI/UX** - Clean, responsive design with smooth animations
- **Dark/Light Mode** - Seamless theme switching with persistent preference
- **Responsive Design** - Mobile-first approach, works on all devices
- **Smooth Animations** - Framer Motion for delightful user interactions
- **SEO Optimized** - Dynamic meta tags for all pages
- **404 Page** - Beautiful custom error page

### 📝 Content Management
- **Dynamic Content** - All content managed through Supabase
- **Articles System** - Full blog with markdown support
- **Projects Showcase** - Display your best work
- **Products Section** - Showcase digital products
- **Contact Form** - Math CAPTCHA protected contact form
- **Admin Dashboard** - Full CRUD operations for all content

### 🔐 Admin Features
- **Secure Authentication** - Supabase Auth with email/password
- **Password Reset** - Forgot password functionality
- **Profile Management** - Update bio, skills, avatar, and contact info
- **Content Management** - Manage projects, articles, and products
- **Message Inbox** - View and manage contact form submissions
- **Real-time Notifications** - Unread message badge with live updates
- **Image Upload** - Supabase Storage integration

### 🛡️ Security & Performance
- **Row Level Security (RLS)** - Supabase database security
- **Math CAPTCHA** - Spam protection without external dependencies
- **Optimized Images** - Lazy loading and responsive images
- **Fast Loading** - Vite for lightning-fast development and builds

## 🛠️ Tech Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 3
- **Database & Auth:** Supabase
- **Routing:** React Router DOM v7
- **Animations:** Framer Motion
- **Forms:** React Hook Form
- **Markdown:** React Markdown with remark plugins
- **Icons:** Lucide React
- **SEO:** Custom implementation with native DOM API

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/personal-website.git
cd personal-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Setup Supabase Database

#### Run SQL Schemas
Execute the following SQL files in your Supabase SQL Editor:

1. **Main Schema** (`supabase_schema.sql`)
   - Creates tables: profiles, projects, articles, products
   - Sets up Row Level Security policies

2. **Profile Avatar** (`update_profile_avatar.sql`)
   - Adds avatar_url column to profiles table

3. **Contact Messages** (`contact_messages_schema.sql`)
   - Creates contact_messages table
   - Sets up RLS policies for contact form

4. **Storage Bucket** (`storage_policy.sql`)
   - Creates 'uploads' bucket
   - Sets up storage policies

### 5. Create Admin User
In Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. Confirm email (or disable email confirmation in Auth settings for development)

### 6. Initialize Profile Data
After creating admin user, insert initial profile data:
```sql
INSERT INTO profiles (id, name, email, tagline, about_content, skills, phone, location)
VALUES (
  'your-user-id-from-auth',
  'Your Name',
  'your@email.com',
  'Your Tagline',
  'About you...',
  ARRAY['React', 'JavaScript', 'Node.js'],
  '+1234567890',
  'Your Location'
);
```

### 7. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your website!

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy Options
- **Vercel** (Recommended)
  ```bash
  npm install -g vercel
  vercel
  ```
- **Netlify**
  - Connect your GitHub repository
  - Build command: `npm run build`
  - Publish directory: `dist`

- **GitHub Pages**
  - Update `vite.config.js` with base path
  - Use `gh-pages` package

## 📁 Project Structure

```
personal-website/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── Products.jsx
│   │   ├── Projects.jsx
│   │   ├── SEO.jsx
│   │   └── ThemeToggle.jsx
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin panel pages
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── Articles.jsx
│   │   │   ├── ContactMessages.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Products.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── ResetPassword.jsx
│   │   ├── ArticleDetail.jsx
│   │   ├── Articles.jsx
│   │   └── NotFound.jsx
│   ├── lib/              # Utilities
│   │   └── supabaseClient.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── .env.example          # Environment variables template
├── tailwind.config.js    # Tailwind configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## 🎯 Usage Guide

### Admin Panel Access
1. Navigate to `/admin/login`
2. Login with your Supabase credentials
3. Access dashboard at `/admin/dashboard`

### Managing Content

#### Profile
- Update personal information
- Upload avatar image
- Edit skills and bio
- Update contact details

#### Projects
- Add/Edit/Delete projects
- Upload project images
- Set featured projects
- Add GitHub and demo links

#### Articles
- Write articles in Markdown
- Upload cover images
- Set publish status
- Add excerpts and tags

#### Products
- Showcase digital products
- Add product images
- Set pricing and links
- Feature products

#### Messages
- View contact form submissions
- Mark messages as read/unread
- Delete messages
- Real-time unread count badge

### Contact Form
- Math CAPTCHA for spam protection
- Messages saved to Supabase
- Admin notifications via badge
- No external API dependencies

### Dark/Light Mode
- Toggle in navbar
- Preference saved to localStorage
- Smooth transitions
- Consistent across all pages

## 🔧 Configuration

### Tailwind Colors
Edit `tailwind.config.js` to customize colors:
```javascript
colors: {
  primary: {
    DEFAULT: '#06b6d4', // Cyan-500
    hover: '#0891b2',
  },
  secondary: {
    DEFAULT: '#8b5cf6', // Violet-500
    hover: '#7c3aed',
  },
}
```

### SEO Settings
Update default SEO in `src/components/SEO.jsx`:
```javascript
const siteTitle = 'Your Name | Portfolio';
const defaultDescription = 'Your description...';
```

### Theme Default
Change default theme in `index.html`:
```javascript
// Set to 'light' for light mode default
if (localStorage.theme === 'dark' || (!('theme' in localStorage))) {
  document.documentElement.classList.add('dark')
}
```

## 🐛 Troubleshooting

### Supabase Connection Issues
- Verify `.env` variables are correct
- Check Supabase project URL and anon key
- Ensure RLS policies are set up correctly

### Images Not Uploading
- Check Storage bucket exists (`uploads`)
- Verify storage policies in `storage_policy.sql`
- Ensure file size is under limit

### Dark Mode Not Working
- Clear browser localStorage
- Check `darkMode: 'class'` in `tailwind.config.js`
- Verify ThemeToggle component is imported

### Contact Form Not Saving
- Run `contact_messages_schema.sql`
- Check RLS policies allow INSERT for anon users
- Verify Supabase connection

## 📝 License

MIT License - feel free to use this project for your own portfolio!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

**Bisri Mustofa**
- Website: [bisbiss.com](https://bisbiss.com)
- GitHub: [@bisbiss](https://github.com/bisbiss)
- Email: your@email.com

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Made with ❤️ using React, Vite, Tailwind CSS, and Supabase
