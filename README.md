# 88 GROUP × WILD GROUP PARTNERSHIP

A combined Next.js project integrating WildGroup and 88 Group platforms.

## Features

- Dual database support (xbtech14 and xbtech17)
- Merged content from both platforms
- Split layout for Partner Casinos and Bonuses & Promotions pages
- Unified admin panel with source switching
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env.local` file with:
```env
# WildGroup Database
WG_DB_HOST=45.32.122.230
WG_DB_PORT=3306
WG_DB_USER=xbtech14
WG_DB_PASSWORD=VugpICWuRg7xVIzhpvid
WG_DB_NAME=xbtech14

# 88Group Database
G88_DB_HOST=45.32.122.230
G88_DB_PORT=3306
G88_DB_USER=xbtech17
G88_DB_PASSWORD=VugpICWuRg7xVIzhpvid
G88_DB_NAME=xbtech17

# SMTP Configuration (for contact form)
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
SMTP_FROM=your-email@example.com
```

3. Run development server:
```bash
npm run dev
```

## Pages

- `/` - Home (merged content)
- `/about-us` - About Us (merged content)
- `/partner-casinos` - Partner Casinos (split layout: left WildGroup, right 88 Group)
- `/bonuses-promotions` - Bonuses & Promotions (split layout)
- `/announcements` - Announcements (merged from both sources)
- `/testimonials` - Testimonials (merged from both sources)
- `/faq` - FAQ (merged content)
- `/contact-us` - Contact Us (unified form)
- `/admin` - Admin login

## API Routes

- `/api/brands` - Get all brands from both databases
- `/api/brands/split` - Get brands separately for split layout
- `/api/bonuses-promotions` - Get bonuses separately for split layout
- `/api/announcements` - Get merged announcements
- `/api/testimonials` - Get merged testimonials
- `/api/contact` - Submit contact form
- `/api/settings` - Get merged settings
- `/api/admin/login` - Admin authentication

## Database Structure

The project connects to two separate databases:
- `xbtech14` (WildGroup)
- `xbtech17` (88 Group)

Data is merged at the API layer, with a `source` field added to identify the origin.

## Components

- `ConditionalLayout` - Layout wrapper with Navigation and Footer
- `SplitLayout` - Left-right split layout component
- `BrandCard` - Brand card component
- `AnimatedSection` - Scroll-triggered animations
- `MeteorAnimation` - Background meteor animation

## Admin Panel

Access at `/admin`. Default credentials:
- Username: `xbtech`
- Password: `xbtech`

The admin panel supports switching between data sources (WildGroup and 88 Group).
