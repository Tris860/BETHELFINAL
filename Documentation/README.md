# Bethel Family Choir Website

A comprehensive web platform for Bethel Family Choir, a dynamic Christian choir founded in 2005 at Groupe Scolaire Officiel de Butare (Indatwa n' Inkesha School) in Huye, Rwanda. The platform serves as both a public showcase and administrative management system for the choir's activities, performances, and community engagement.

## 🎵 Project Overview

Bethel Family Choir is dedicated to glorifying God through music and worship. This website serves as their digital presence, featuring their history, performances, gallery, services, and administrative tools for content management. The platform includes both public-facing pages and a secure admin dashboard for managing choir content.

### Core Values

- **Truth**: Integrity in all conduct and music
- **Love**: Unconditional support and acceptance
- **Unity**: Harmonious collaboration toward worship excellence

## ✨ Features

### Public Website Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dynamic Hero Slider**: Rotating background images with content
- **Service Information**: Details about worship services and choir activities
- **Gallery**: Visual showcase of choir performances and events
- **History Section**: Complete chronicle of the choir's journey since 2005
- **About Us**: Detailed information about the choir's mission, vision, and structure
- **Contact Information**: Multiple ways to connect with the choir
- **Social Media Integration**: Links to YouTube, Instagram, Facebook, and Threads

### Admin Dashboard Features

- **Content Management**: Full CRUD operations for all website content
- **User Authentication**: Secure login system for administrators
- **Hero CTA Management**: Edit call-to-action sections
- **Scripture Management**: Daily scripture updates
- **President Messages**: Manage leadership communications
- **Service Flyers**: Upload and manage worship service announcements
- **Gallery Management**: Upload and organize photos
- **Song Library**: Manage choir repertoire and performances
- **Committee Management**: Track choir leadership and history
- **Event Management**: Post remarkable events and achievements

### Technical Features

- **Multi-language Support**: Primarily English with Kinyarwanda content
- **SEO Optimized**: Proper meta tags and structured content
- **Performance Optimized**: Efficient loading and caching
- **Security**: Protected admin areas and secure data handling
- **Mobile-First Design**: Responsive across all devices

## 🛠 Technologies Used

### Frontend

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styling with CSS Grid and Flexbox
- **JavaScript (ES6+)**: Interactive functionality and dynamic content
- **Font Awesome**: Icon library for visual elements
- **Google Fonts**: Playfair Display and Inter font families

### Backend

- **PHP**: Server-side processing
- **MySQL**: Database management
- **Laravel Framework**: PHP web framework for robust backend

### Development Tools

- **Git**: Version control
- **VS Code**: Primary development environment
- **Composer**: PHP dependency management
- **NPM**: JavaScript package management

## 📁 Project Structure

```
bethel-family-choir/
├── index.html                 # Main homepage
├── admin/                     # Admin panel directory
│   ├── login.html            # Admin login page
│   ├── dashboard.html        # Main admin dashboard
│   ├── css/
│   │   └── admin.css         # Admin panel styling
│   ├── javascript/
│   │   ├── dashboard.js      # Admin dashboard functionality
│   │   └── login.js          # Admin login logic
│   └── backend/              # Server-side admin functionality
│       ├── api.js
│       ├── main.php
│       └── manager.php
├── websections/              # Public page sections
│   ├── about.html           # About us page
│   ├── service.html         # Services page
│   ├── gallery.html         # Gallery page
│   └── history.html         # History page
├── css/                     # Stylesheets
│   ├── index.css           # Main stylesheet
│   ├── initial.css         # Base styles
│   └── initial2.css        # Additional styles
├── javascript/              # Client-side scripts
│   ├── main.js             # Core functionality
│   ├── home.js             # Homepage specific scripts
│   ├── about.js            # About page scripts
│   ├── service.js          # Service page scripts
│   ├── gallery.js          # Gallery functionality
│   ├── history.js          # History page scripts
│   └── api/                # API interaction scripts
│       └── renderApi.js
├── media/                   # Media assets
│   ├── icons/              # Logo and icons
│   ├── placeholders/       # Sample images
│   └── [various images]    # Gallery and content images
└── README.md               # This file
```

## 🚀 Installation

### Prerequisites

- PHP 8.0 or higher
- MySQL 5.7 or higher
- Composer
- Node.js and NPM
- Web server (Apache/Nginx)

### Setup Instructions

1. **Clone the Repository**

```bash
   git clone [repository-url]
   cd bethel-family-choir

```

2. **Install PHP Dependencies**

```bash
   composer install

```

3. **Install Node Dependencies**

```bash
   npm install

```

4. **Environment Configuration**
   - Copy `.env.example` to `.env`
   - Configure database credentials
   - Set application key

5. **Database Setup**

```bash
   php artisan migrate
   php artisan db:seed

```

6. **Storage Setup**

```bash
   php artisan storage:link

```

7. **Build Assets**

```bash
   npm run build
   # or for development
   npm run dev

```

8. **Start the Server**

```bash
   php artisan serve

```

## 📖 Usage

### Public Access

- Visit the homepage to explore choir information
- Navigate through different sections using the menu
- View gallery images and performance videos
- Access contact information and social media links

### Admin Access

1. Navigate to `/admin/login.html`
2. Use admin credentials to log in
3. Access dashboard for content management
4. Manage all website content through the admin interface

### Content Management

- **Hero Sections**: Update call-to-action content
- **Gallery**: Upload and organize photos
- **Services**: Manage worship service information
- **History**: Update choir timeline and achievements
- **About**: Modify mission, vision, and organizational details

## 🤝 Contributing

We welcome contributions to improve the Bethel Family Choir website!

### Contribution Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Standards

- Follow PSR-12 coding standards for PHP
- Use semantic HTML and accessible markup
- Ensure responsive design across all devices
- Test functionality thoroughly before submission

## 📄 License

This project is proprietary software developed for Bethel Family Choir. All rights reserved.

## 📞 Contact

**Bethel Family Choir**

- **Email**: BethelFamilyChoir@email.com
- **Instagram**: [@BethelFamilyChoir](https://instagram.com/bethelschoolchoir)
- **Facebook**: [Bethel Family Choir](https://facebook.com/BethelFamilyChoir)
- **YouTube**: [Bethel B-TV](https://youtube.com/@bethelb-tv3484)
- **Phone**: +250 780 000 0000

**Technical Support**

- **Developer**: Tris Tech Hub
- **Website**: [tristechhub.org.rw](https://tristechhub.org.rw)
- **Email**: tristechhub@gmail.com

## 🙏 Acknowledgments

- **Groupe Protestant Church**: Spiritual home and foundation
- **Groupe Scolaire Officiel de Butare**: Educational institution where it all began
- **Tris Tech Hub**: Technical development and maintenance
- **Bethel Community**: Dedicated members and supporters

---

_"Binyuze muritwe Imana yigaragarize abandi"_ - Bethel Family Choir
