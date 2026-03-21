# School Subdomain Setup Guide

## 🎯 Overview

Each school runs on its own subdomain with school-specific content, header, and footer.

```
Main Site:         http://dulwich.loc
Beijing School:    http://beijing.dulwich.loc
Shanghai School:   http://shanghai.dulwich.loc
Suzhou School:     http://suzhou.dulwich.loc
```

---

## 🏗️ Architecture

### **Hostname-Based School Detection**

The system automatically detects the school from the hostname:

```javascript
Hostname: beijing.dulwich.loc
└─ School: "beijing"

Hostname: shanghai.dulwich.loc
└─ School: "shanghai"

Hostname: dulwich.loc
└─ School: null (main site)
```

---

## 📂 File Structure

```
src/
├── utils/
│   └── schoolDetection.js         # Hostname parsing logic
├── components/
│   ├── DynamicPageRenderer.js     # Auto-detects school from hostname
│   ├── PageRenderer.js            # Main site renderer
│   └── school/
│       └── SchoolPageRenderer.js  # School site renderer
└── api/
    ├── pageService.js             # Main site API
    └── schoolPageService.js       # School site API
```

---

## 🚀 Setup Instructions

### **Step 1: Configure Local Hosts File**

Add school subdomains to your `/etc/hosts` (Mac/Linux) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

```bash
# Open hosts file
sudo nano /etc/hosts

# Add these lines
127.0.0.1   dulwich.loc
127.0.0.1   beijing.dulwich.loc
127.0.0.1   shanghai.dulwich.loc
127.0.0.1   suzhou.dulwich.loc
127.0.0.1   seoul.dulwich.loc
127.0.0.1   singapore.dulwich.loc
```

Save and close.

---

### **Step 2: Update App.js Routing**

Replace your current routing with `DynamicPageRenderer`:

```javascript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DynamicPageRenderer from './components/DynamicPageRenderer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Single route handles both main site and school sites */}
        <Route path="/*" element={<DynamicPageRenderer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

### **Step 3: Start Development Server**

```bash
npm start
```

The app runs on port 3000 and responds to all subdomains.

---

## 🌐 How It Works

### **Request Flow**

```
User visits: http://beijing.dulwich.loc:3000/admissions/overview

     ↓

DynamicPageRenderer detects hostname
└─ Hostname: "beijing.dulwich.loc"
└─ Extracted School: "beijing"

     ↓

Routes to SchoolPageRenderer
└─ school: "beijing"
└─ slug: "admissions/overview"

     ↓

useSchoolPageBySlug hook
└─ API Call: /api/school/page?slug=admissions/overview&school=beijing

     ↓

Renders Beijing-specific page
└─ Beijing header
└─ Beijing content
└─ Beijing footer
```

---

## 📊 URL Examples

### **Beijing School**

| URL | School | Slug | API Call |
|-----|--------|------|----------|
| `http://beijing.dulwich.loc:3000/` | `beijing` | `home` | `/api/school/page?slug=home&school=beijing` |
| `http://beijing.dulwich.loc:3000/admissions/overview` | `beijing` | `admissions/overview` | `/api/school/page?slug=admissions/overview&school=beijing` |
| `http://beijing.dulwich.loc:3000/zh/admissions/overview` | `beijing` | `admissions/overview` | `/api/school/page?locale=zh&slug=admissions/overview&school=beijing` |

---

### **Shanghai School**

| URL | School | Slug | API Call |
|-----|--------|------|----------|
| `http://shanghai.dulwich.loc:3000/` | `shanghai` | `home` | `/api/school/page?slug=home&school=shanghai` |
| `http://shanghai.dulwich.loc:3000/academics/curriculum` | `shanghai` | `academics/curriculum` | `/api/school/page?slug=academics/curriculum&school=shanghai` |

---

### **Main Site**

| URL | School | Slug | API Call |
|-----|--------|------|----------|
| `http://dulwich.loc:3000/` | `null` | `home` | `/api/page?slug=home` |
| `http://dulwich.loc:3000/about-dulwich` | `null` | `about-dulwich` | `/api/page?slug=about-dulwich` |

---

## 🔧 Configuration

### **Add New Schools**

Edit `src/utils/schoolDetection.js`:

```javascript
const validSchools = [
  'beijing',
  'shanghai',
  'suzhou',
  'seoul',
  'singapore',
  'yangon',
  'tokyo',      // Add new school
  'hongkong'    // Add new school
];
```

Then add to `/etc/hosts`:

```bash
127.0.0.1   tokyo.dulwich.loc
127.0.0.1   hongkong.dulwich.loc
```

---

## 🎨 Component Usage

### **Option 1: Automatic Detection (Recommended)**

```javascript
// App.js
<Route path="/*" element={<DynamicPageRenderer />} />

// Automatically detects school from hostname
// No manual configuration needed
```

---

### **Option 2: Manual School Prop**

```javascript
// If you want to override hostname detection
<SchoolPageRenderer school="beijing" slug="admissions/overview" />
```

---

## 🐛 Testing

### **Test Main Site**

```bash
# Open browser
http://dulwich.loc:3000/about-dulwich

# Should see main site with main header/footer
```

---

### **Test Beijing School**

```bash
# Open browser
http://beijing.dulwich.loc:3000/admissions/overview

# Should see Beijing school with Beijing header/footer
```

---

### **Test with Locale**

```bash
# Chinese version
http://beijing.dulwich.loc:3000/zh/admissions/overview

# English version
http://beijing.dulwich.loc:3000/en/admissions/overview
```

---

## 📱 Debug Mode

In development, a debug panel shows detection info:

```
School: beijing | Slug: admissions/overview | Locale: en
Hostname: beijing.dulwich.loc
```

Located at bottom-right corner of page.

---

## 🔒 Production Setup

### **DNS Configuration**

Add DNS records for each school:

```
A Record:  dulwich.com           → Your Server IP
CNAME:     beijing.dulwich.com   → dulwich.com
CNAME:     shanghai.dulwich.com  → dulwich.com
CNAME:     suzhou.dulwich.com    → dulwich.com
```

---

### **Nginx Configuration**

```nginx
server {
    listen 80;
    server_name dulwich.com *.dulwich.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 🎯 API Endpoint Mapping

### **Main Site**

```javascript
Hostname: dulwich.loc
API Service: pageService.js
Endpoint: /api/page?slug={slug}
```

---

### **School Sites**

```javascript
Hostname: beijing.dulwich.loc
API Service: schoolPageService.js
Endpoint: /api/school/page?slug={slug}&school=beijing
```

Each school gets:
- ✅ Unique header
- ✅ Unique footer
- ✅ School-specific content
- ✅ Same URL structure across all schools

---

## ✅ Checklist

- [ ] Add school subdomains to `/etc/hosts`
- [ ] Update `App.js` to use `DynamicPageRenderer`
- [ ] Configure valid schools in `schoolDetection.js`
- [ ] Start dev server: `npm start`
- [ ] Test main site: `http://dulwich.loc:3000`
- [ ] Test Beijing: `http://beijing.dulwich.loc:3000`
- [ ] Test Shanghai: `http://shanghai.dulwich.loc:3000`
- [ ] Verify API calls in Network tab

---

## 🎉 Benefits

✅ **Clean URLs** - No `/school/beijing/` prefix needed
✅ **SEO Friendly** - Each school has its own domain
✅ **Automatic Detection** - No manual routing configuration
✅ **Scalable** - Easy to add new schools
✅ **Locale Support** - Works with `/zh/`, `/en/` prefixes
✅ **Unified Codebase** - Single React app for all schools

Your subdomain-based school system is ready! 🚀
