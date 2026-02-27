# Bethel Family Choir Website - Complete Technical Documentation

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Frontend Components](#frontend-components)
4. [Backend Components](#backend-components)
5. [API Reference](#api-reference)
6. [Database Schema](#database-schema)
7. [Security Considerations](#security-considerations)
8. [Deployment Guide](#deployment-guide)
9. [Troubleshooting](#troubleshooting)

---

## 1. System Overview

### Project Description

The Bethel Family Choir website is a comprehensive content management system (CMS) built for a Christian choir organization based in Rwanda, Africa. The choir was founded in 2005 at Groupe Scolaire Officiel de Butare (Indatwa n' Inkesha School) in Huye, Rwanda.

### Key Features

- **Public Website**: Responsive design with dynamic content including hero sliders, gallery, history, services, and contact information
- **Admin Dashboard**: Secure authentication with full CRUD operations for all website content
- **Content Management**: Manage hero sections, scriptures, president messages, gallery images, songs, committees, and achievements
- **Media Management**: Upload and organize images and videos
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Dynamic content loading without page refreshes

### Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+ with modules)
- **Backend**: PHP 8.0+, MySQL 5.7+
- **Libraries**: Font Awesome 6.5.2, Google Fonts (Playfair Display, Inter)
- **Architecture**: RESTful API with AJAX/Fetch communication

---

## 2. Architecture

### High-Level Architecture

```
┌─────────────────────────┐      HTTP/AJAX       ┌─────────────────────────┐
│    Frontend Browser     │◄─────────────────────►│   Backend Server        │
│    (HTML/CSS/JS)       │                      │   (PHP + MySQL)         │
└─────────────────────────┘                      └─────────────────────────┘
         │                                                 │
         │                                                 │
         ▼                                                 ▼
┌─────────────────────────┐                      ┌─────────────────────────┐
│  - index.html          │                      │  - admin/backend/       │
│  - websections/*.html  │                      │    main.php (API)      │
│  - javascript/*.js      │                      │    manager.php (DB)    │
│  - css/*.css           │                      │  - Database (MySQL)    │
└─────────────────────────┘                      └─────────────────────────┘
```

### Data Flow Diagram

```
User Action (click/form)
        │
        ▼
┌───────────────────┐
│  JavaScript      │ ◄── API call (fetch)
│  Event Handler   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  admin/backend/   │ ◄── HTTP Request
│  main.php         │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  manager.php      │ ◄── SQL Query
│  (Database Ops)   │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│  MySQL Database   │
└────────┬──────────┘
         │
         ▼
    JSON Response
         │
         ▼
┌───────────────────┐
│  DOM Update       │
│  (UI Refresh)     │
└───────────────────┘
```

### Directory Structure

```
bethel-family-choir/
├── index.html                          # Main homepage
├── README.md                           # Project overview
├── Technical_Documentation.md          # This file
│
├── admin/                              # Admin panel directory
│   ├── login.html                      # Admin login page
│   ├── dashboard.html                  # Main admin dashboard
│   ├── login.css                       # Login page styles
│   ├── junk.html                       # Unused/placeholder
│   │
│   ├── css/
│   │   └── admin.css                   # Admin panel styling
│   │
│   ├── javascript/
│   │   ├── dashboard.js                # Admin functionality (650+ lines)
│   │   └── login.js                    # Login form handling
│   │
│   └── backend/                        # Server-side functionality
│       ├── api.js                      # Frontend API client
│       ├── main.php                    # API router (500+ lines)
│       └── manager.php                 # Database operations (800+ lines)
│
├── websections/                        # Public page sections
│   ├── about.html                      # About us page
│   ├── service.html                    # Services page
│   ├── gallery.html                   # Gallery page
│   └── history.html                   # History page
│
├── css/                                # Stylesheets
│   ├── index.css                       # Main import (imports initial.css)
│   ├── initial.css                     # Core styles (~1000 lines)
│   └── initial2.css                    # Additional styles
│
├── javascript/                         # Client-side scripts
│   ├── main.js                         # Mobile navigation, core utilities
│   ├── home.js                         # Homepage specific functionality
│   ├── about.js                        # About page interactions
│   ├── service.js                      # Service page functionality
│   ├── gallery.js                      # Gallery features & lightbox
│   ├── history.js                      # History page components
│   │
│   └── api/
│       └── renderApi.js               # API calls & data rendering (~300 lines)
│
├── media/                              # Media assets
│   ├── icons/                          # Logo and icons
│   ├── placeholders/                   # Sample/placeholder images
│   └── [various images]                # Uploaded content images
│
└── .git/                              # Git repository
```

---

## 3. Frontend Components

### 3.1 JavaScript Modules

#### main.js

**Purpose**: Core navigation and utilities

| Function        | Description                             |
| --------------- | --------------------------------------- |
| `openNav()`     | Opens mobile navigation drawer          |
| `closeNav()`    | Closes mobile navigation drawer         |
| Event Listeners | Attaches click handlers for nav buttons |

---

#### home.js

**Purpose**: Homepage-specific functionality

| Function                          | Description                                                         |
| --------------------------------- | ------------------------------------------------------------------- |
| `showSlides()`                    | Rotates hero slider images every 7 seconds                          |
| `animateCounter(element, target)` | Animates statistics counters from 0 to target                       |
| `initStatsObserver()`             | Uses IntersectionObserver to trigger counter animation when visible |
| `renderHomePage()`                | Main initialization - calls all home page data loaders              |

**Key Features**:

- Automatic slideshow with 7-second intervals
- Animated number counters (5+ songs, 60+ members, 200+ alumni)
- Lazy loading of content via API calls

---

#### gallery.js

**Purpose**: Gallery page and lightbox functionality

| Function            | Description                               |
| ------------------- | ----------------------------------------- |
| `openViewer(index)` | Opens image lightbox at specified index   |
| `showImage(index)`  | Displays image with fade transition       |
| `closeViewer()`     | Closes lightbox with fade effect          |
| `nextImage()`       | Navigate to next image (wraps around)     |
| `prevImage()`       | Navigate to previous image (wraps around) |
| `renderGallery_2()` | Fetches and renders gallery grid          |
| Keyboard Navigation | Escape (close), Arrow keys (navigate)     |

**Key Features**:

- Touch-friendly image navigation
- Keyboard shortcuts (Escape, Left, Right arrows)
- Click outside to close
- Animated transitions

---

#### renderApi.js (API Interface)

**Purpose**: Central API communication layer

##### Data Fetching Functions

| Function               | API Endpoint        | Description                                                         |
| ---------------------- | ------------------- | ------------------------------------------------------------------- |
| `Slideshow()`          | `Slideshow`         | Loads hero background images (slideshow=1)                          |
| `Slideshow_2()`        | `Slideshow`         | Same as above, but with relative path adjustment for subdirectories |
| `flyerRender()`        | `flyer`             | Loads service flyer, shows/hides based on status                    |
| `HeroContent(page)`    | `CTA`               | Gets hero heading/caption for specific page                         |
| `BibleVerse()`         | `Scripture`         | Gets daily scripture                                                |
| `renderGallery()`      | `picture`           | Gets gallery images (first 4)                                       |
| `PresidentMessage()`   | `PresidentWord`     | Gets president's message                                            |
| `renderVideoGallery()` | `song`              | Gets YouTube video embeds                                           |
| `BethelCommittee()`    | `Committee`         | Gets most recent committee                                          |
| `CommitteeSlideshow()` | `Committee`         | Gets all committees for slideshow                                   |
| `createYearDetails()`  | `AnnualAchievement` | Gets yearly achievements                                            |

##### Page Rendering Functions

| Function               | Calls                                                                            |
| ---------------------- | -------------------------------------------------------------------------------- |
| `renderHomePage()`     | Slideshow, flyerRender, HeroContent, BibleVerse, renderGallery, PresidentMessage |
| `renderServicesPage()` | Slideshow_2, HeroContent, renderVideoGallery                                     |
| `renderaboutPage()`    | Slideshow_2, HeroContent, BethelCommittee                                        |
| `renderGalleryPage()`  | Slideshow_2, HeroContent                                                         |
| `renderHistoryPage()`  | Slideshow_2, HeroContent, CommitteeSlideshow, createYearDetails                  |

##### Helper Function

```
javascript
highlightByPattern(originalText)
```

- Splits text by spaces
- Wraps every other word in `<span>` tags
- Used for visual hero text effects

---

#### api.js (Admin Backend API Client)

**Purpose**: HTTP request handler for admin operations

| Function                                    | Method | Purpose                |
| ------------------------------------------- | ------ | ---------------------- |
| `fetchData(resource, id)`                   | GET    | Generic data retrieval |
| `postData(resource, payload, id)`           | POST   | Create/update data     |
| `putData(resource, id, payload)`            | POST   | Update data            |
| `deleteData(resource, id)`                  | DELETE | Delete data            |
| `showMessageBox(title, message, isConfirm)` | -      | Display modal dialog   |

**API Base URL**: `http://localhost:3000/admin/backend/main.php`

---

#### dashboard.js (Admin Panel)

**Purpose**: Admin dashboard functionality

##### Panel Management

```
javascript
show_div2(panelId)  // Switch between admin panels
```

##### Admin Panels

| Panel ID             | Description                  |
| -------------------- | ---------------------------- |
| `intro`              | Welcome dashboard with stats |
| `HomeCTA`            | Edit hero call-to-action     |
| `scriptureOfDay`     | Manage daily scripture       |
| `presidentMessage`   | President's message editor   |
| `servicesbody`       | Service flyer management     |
| `bethel_songs`       | Song library management      |
| `picture`            | Gallery image management     |
| `memories`           | Memory album creation        |
| `updates`            | News/updates posts           |
| `B_commit`           | Committee management         |
| `annual_achivements` | Yearly achievements          |
| `remarkable`         | Special events               |

##### Data Render Functions

| Function                     | Purpose                                   |
| ---------------------------- | ----------------------------------------- |
| `loadOverview()`             | Fetch and display dashboard statistics    |
| `renderSongs()`              | Populate songs table                      |
| `renderPictures()`           | Populate gallery table with status toggle |
| `renderEra()`                | Populate committee era selector           |
| `renderCommitteeForm(data)`  | Render committee edit form                |
| `renderAnnualAchievements()` | Populate achievements list                |
| `renderFlyer()`              | Load and display service flyer            |

##### Form Handlers

- CTA Form submission
- Scripture update
- President's word update
- Song add/edit/delete
- Picture upload/edit/delete
- Committee save
- Annual achievement save
- Flyer upload

---

### 3.2 CSS Styling

#### initial.css (Core Styles)

**Structure**:

1. **Root Variables** - Color palette and typography
2. **Navbar** - Fixed header, mobile drawer
3. **Hero Section** - Full-screen slider
4. **Content Sections** - Cards, grids
5. **Gallery** - Grid layout, lightbox
6. **Footer** - Contact info, links

**Color Palette**:

```
css
--color-primary-black: #0F0F0F;     /* Deep Charcoal */
--color-secondary-gold: #FFD700;     /* Gold accent */
--color-accent-olive: #8F9779;       /* Olive green */
--color-text-light: #FFFFFF;
--color-text-dark: #222222;
--color-background-dark: #0F0F0F;
```

**Typography**:

- Headings: 'Playfair Display', serif
- Body: 'Inter', sans-serif

---

## 4. Backend Components

### 4.1 main.php (API Router)

**Location**: `admin/backend/main.php`

**Purpose**: Central API entry point that routes all requests

#### Request Flow

```
HTTP Request
    │
    ▼
$_GET['action'] + $_GET['id']
    │
    ▼
switch ($action)
    │
    ├── login ──────────► User::login()
    ├── logout ─────────► User::logout()
    ├── CTA ────────────► Manager::getCTA() / updateCTA()
    ├── Scripture ───────► Manager::getScripture() / updateScripture()
    ├── PresidentWord ──► Manager::getWord() / updateWord()
    ├── song ───────────► Manager::getSong() / addSong() / updateSong() / deleteSong()
    ├── picture ────────► Manager::getPicture() / addPicture() / updatePicture() / deletePicture()
    ├── Slideshow ──────► Manager::getSlideshowImages() / updateSlideshowImage()
    ├── Committee ──────► Manager::getCommittee() / addCommittee() / updateCommittee() / deleteCommittee()
    ├── AnnualAchievement ─► Manager::getAnnualAchievements() / addAnnualAchievement() / updateAnnualAchievement() / deleteAnnualAchievement()
    └── flyer ─────────► Manager::getFlyer() / updateFlyer()
    │
    ▼
JSON Response
```

#### Key Features

- **CORS Handling**: OPTIONS preflight support
- **Error Handling**: try-catch with JSON error responses
- **File Uploads**: Image upload to media/ directory
- **Session Management**: PHP session for auth

#### Code Structure

```
php
// 1. Session start
session_start();

// 2. CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// 3. Upload function
function uploadImage($files) { /* ... */ }

// 4. Database connection
$conn = new mysqli($servername, $username, $password, $dbname);

// 5. Action router
switch ($action) {
    case 'login': /* ... */
    case 'CTA': /* ... */
    // etc.
}

// 6. JSON output
echo json_encode($response);
```

---

### 4.2 manager.php (Database Operations)

**Location**: `admin/backend/manager.php`

**Classes**: `User` and `Manager`

#### User Class Methods

| Method                                    | Purpose                        |
| ----------------------------------------- | ------------------------------ |
| `register(email, passkey)`                | Create new admin user          |
| `login(email, passkey)`                   | Authenticate user, set session |
| `logout()`                                | Destroy session                |
| `changePassword(userId, current, new)`    | Update password                |
| `changeEmail(userId, password, newEmail)` | Update email                   |

#### Manager Class Methods

| Category         | Method                             | SQL Operation                                     |
| ---------------- | ---------------------------------- | ------------------------------------------------- |
| **CTA**          | `getCTA(page)`                     | SELECT from cta                                   |
|                  | `updateCTA(data)`                  | UPDATE cta                                        |
| **Scripture**    | `getScripture(id)`                 | SELECT from scriptureofday                        |
|                  | `updateScripture(data)`            | UPDATE scriptureofday                             |
| **President**    | `getWord(id)`                      | SELECT from presidentsword                        |
|                  | `updateWord(data)`                 | UPDATE presidentsword                             |
| **Songs**        | `getSong(id)`                      | SELECT from songs                                 |
|                  | `addSong(data)`                    | INSERT into songs                                 |
|                  | `updateSong(id, data)`             | UPDATE songs                                      |
|                  | `deleteSong(id)`                   | DELETE from songs                                 |
| **Pictures**     | `getPicture(id)`                   | SELECT from pictures                              |
|                  | `addPicture(data)`                 | INSERT into pictures                              |
|                  | `updatePicture(id, data)`          | UPDATE pictures                                   |
|                  | `deletePicture(id)`                | DELETE from pictures                              |
|                  | `updateSlideshowImage(id, status)` | UPDATE pictures SET slideshow                     |
| **Committee**    | `getAllCommittees()`               | SELECT from bethelcommitte + bethelcommittemember |
|                  | `getCommittee(id)`                 | SELECT single committee with members              |
|                  | `addCommittee(data)`               | INSERT (transaction)                              |
|                  | `updateCommittee(id, data)`        | UPDATE + DELETE/INSERT (transaction)              |
|                  | `deleteCommittee(id)`              | DELETE (transaction)                              |
| **Achievements** | `getAnnualAchievements(id)`        | SELECT from annualachievements                    |
|                  | `addAnnualAchievement(data)`       | INSERT into annualachievements                    |
|                  | `updateAnnualAchievement(data)`    | UPDATE annualachievements                         |
|                  | `deleteAnnualAchievement(id)`      | DELETE from annualachievements                    |
| **Flyer**        | `getFlyer()`                       | SELECT from flyer                                 |
|                  | `updateFlyer(data)`                | UPDATE flyer                                      |
| **Slideshow**    | `getSlideshowImages()`             | SELECT pictures WHERE slideshow=1                 |

---

## 5. API Reference

### 5.1 Authentication Endpoints

#### POST /admin/backend/main.php?action=login

```
http
POST /admin/backend/main.php?action=login
Content-Type: application/x-www-form-urlencoded

email=admin@example.com&password=password123
```

**Response**:

```
json
{
  "success": true,
  "message": "Login successful",
  "data": { "user_id": 1, "email": "admin@example.com" }
}
```

#### POST /admin/backend/main.php?action=logout

```
http
POST /admin/backend/main.php?action=logout
```

**Response**:

```
json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5.2 Content Endpoints

#### GET /admin/backend/main.php?action=CTA&id=Home

**Response**:

```
json
{
  "success": true,
  "data": {
    "id": 1,
    "page": "Home",
    "heading": "Welcome to Bethel Family Choir",
    "caption": "Glorifying God through music since 2005"
  }
}
```

#### POST /admin/backend/main.php?action=CTA

**Request**: FormData with `heading`, `caption`, `page`

#### GET /admin/backend/main.php?action=Scripture

**Response**:

```
json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "John 3:16",
    "content": "For God so loved the world..."
  }
}
```

#### GET /admin/backend/main.php?action=picture

**Response**:

```
json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "caption": "Choir performance",
      "link": "media/abc123image.jpg",
      "slideshow": 1,
      "created_at": "2024-01-15 10:30:00"
    }
  ]
}
```

#### GET /admin/backend/main.php?action=song

**Response**:

```
json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Amazing Grace",
      "link": "https://youtube.com/embed/abc123"
    }
  ]
}
```

#### GET /admin/backend/main.php?action=Committee

**Response**:

```
json
{
  "success": true,
  "data": [
    {
      "commit_id": 1,
      "era": "2024-2025",
      "ecree": "Bethel niferme",
      "picture": "media/committee2024.jpg",
      "members": [
        { "names": "John Doe", "post": "President" },
        { "names": "Jane Smith", "post": "Vice President" }
      ]
    }
  ]
}
```

---

## 6. Database Schema

### Database Name: `bethelfinal`

#### Table: `users`

```
sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    passkey VARCHAR(255) NOT NULL,
    timetable_enabled TINYINT DEFAULT 1,
    hard_switch_enabled TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `cta`

```
sql
CREATE TABLE cta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    page VARCHAR(50) NOT NULL,
    heading TEXT,
    caption TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Pages: Home, Service, Gallery, History, About
```

#### Table: `scriptureofday`

```
sql
CREATE TABLE scriptureofday (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    content TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table: `presidentsword`

```
sql
CREATE TABLE presidentsword (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    message TEXT,
    image VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Table: `pictures`

```
sql
CREATE TABLE pictures (
    id INT PRIMARY KEY AUTO_INCREMENT,
    caption VARCHAR(255),
    link VARCHAR(255),
    slideshow TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `songs`

```
sql
CREATE TABLE songs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `bethelcommitte`

```
sql
CREATE TABLE bethelcommitte (
    commit_id INT PRIMARY KEY AUTO_INCREMENT,
    era VARCHAR(50),
    ecree VARCHAR(255),
    picture VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `bethelcommittemember`

```
sql
CREATE TABLE bethelcommittemember (
    id INT PRIMARY KEY AUTO_INCREMENT,
    commit_id INT,
    names VARCHAR(255),
    post VARCHAR(255),
    FOREIGN KEY (commit_id) REFERENCES bethelcommitte(commit_id) ON DELETE CASCADE
);
```

#### Table: `annualachievements`

```
sql
CREATE TABLE annualachievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    year VARCHAR(20),
    summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table: `flyer`

```
sql
CREATE TABLE flyer (
    id INT PRIMARY KEY AUTO_INCREMENT,
    link VARCHAR(255),
    status TINYINT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 7. Security Considerations

### Authentication

- Session-based authentication with PHP `$_SESSION`
- Password hashing using `password_hash()` (bcrypt)
- Password verification using `password_verify()`

### SQL Injection Prevention

- Prepared statements throughout all queries
- Parameter binding with `$stmt->bind_param()`

### File Upload Security

- Unique filename generation using `uniqid()`
- File type validation
- Movement to designated upload directory

### CORS Configuration

```
php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### Error Handling

- Try-catch blocks for all operations
- Generic error messages to clients
- Detailed logging with `error_log()`

---

## 8. Deployment Guide

### Prerequisites

- PHP 8.0 or higher
- MySQL 5.7 or higher
- Web server (Apache/Nginx)
- Composer (optional)

### Installation Steps

1. **Database Setup**

```
sql
CREATE DATABASE bethelfinal;
USE bethelfinal;
-- Run CREATE TABLE statements from Section 6
```

2. **Configuration**
   Edit `admin/backend/main.php`:

```
php
$servername = "localhost";
$username = "root";
$password = "";      // Your MySQL password
$dbname = "bethelfinal";
```

3. **File Permissions**

```
bash
chmod 755 media/
chown www-data:www-data media/
```

4. **Start PHP Server**

```
bash
cd admin/backend
php -S localhost:3000
```

5. **Access**

- Public site: http://localhost/
- Admin panel: http://localhost/admin/login.html

---

## 9. Troubleshooting

### Common Issues

| Issue                      | Solution                                                        |
| -------------------------- | --------------------------------------------------------------- |
| 500 Internal Server Error  | Check PHP error logs; verify database connection                |
| Images not uploading       | Check media/ folder permissions; verify php.ini upload settings |
| API calls failing          | Verify PHP server is running on port 3000; check API_BASE_URL   |
| Database connection failed | Verify MySQL credentials in main.php                            |
| CORS errors                | Update allowed origins in main.php                              |
| Login not working          | Check session_start() is called; verify password hash           |

### Debug Mode

```
php
// Add to top of main.php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

### Performance Tips

- Enable PHP OPcache
- Add indexes to frequently queried columns
- Compress images before upload
- Use CDN for static assets

---

**Document Version**: 1.0
**Last Updated**: 2024
**For**: Bethel Family Choir Website
**Developed by**: Tris Tech Hub

_End of Technical Documentation_
