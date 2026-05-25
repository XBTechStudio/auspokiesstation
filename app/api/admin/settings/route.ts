import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db-local';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET - Fetch all settings
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await query('SELECT `key`, `value` FROM site_settings') as any[];

    const settings: any = {
      logoUrl: '',
      socialMedia: {},
      contact: {},
      contactEmail: '',
      contactFormEmail: '',
      telegram: '',
      whatsapp: {},
      complaintHotline: {},
      marquee: '',
      footerDescription: '',
      heroTitle: '',
      heroSubtitle: '',
      contactPageTitle: '',
      contactPageSubtitle: '',
      responsibleGamingText: '',
    };

    rows.forEach((row: any) => {
      try {
        if (row.key === 'logoUrl' || row.key === 'contactEmail' || row.key === 'contactFormEmail' || row.key === 'telegram' || row.key === 'feedbackDocs' || row.key === 'marquee' || row.key === 'footerDescription' || row.key === 'heroTitle' || row.key === 'heroSubtitle' || row.key === 'contactPageTitle' || row.key === 'contactPageSubtitle' || row.key === 'responsibleGamingText') {
          settings[row.key] = row.value;
        } else {
          const value = JSON.parse(row.value);
          if (row.key === 'socialMedia') {
            settings.socialMedia = value;
          } else if (row.key === 'contact') {
            settings.contact = value;
          } else if (row.key === 'whatsapp') {
            settings.whatsapp = value;
          } else if (row.key === 'complaintHotline') {
            settings.complaintHotline = value;
          } else if (row.key === 'footer') {
            settings.footer = value;
            if (value.description) {
              settings.footerDescription = value.description;
            }
          }
        }
      } catch (e) {
        console.error(`Error parsing setting ${row.key}:`, e);
      }
    });

    return NextResponse.json(settings);
  } catch (error: any) {
    console.error('Error reading settings:', error);
    return NextResponse.json(
      { error: 'Failed to read settings' },
      { status: 500 }
    );
  }
}

// POST - Update settings
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Update or insert settings
    if (body.socialMedia) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['socialMedia', JSON.stringify(body.socialMedia), JSON.stringify(body.socialMedia)]
      );
    }

    if (body.contact) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['contact', JSON.stringify(body.contact), JSON.stringify(body.contact)]
      );
    }

    if (body.contactEmail !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['contactEmail', body.contactEmail, body.contactEmail]
      );
    }

    if (body.contactFormEmail !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['contactFormEmail', body.contactFormEmail, body.contactFormEmail]
      );
    }

    if (body.whatsapp) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['whatsapp', JSON.stringify(body.whatsapp), JSON.stringify(body.whatsapp)]
      );
    }

    if (body.telegram !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['telegram', body.telegram, body.telegram]
      );
    }

    if (body.feedbackDocs !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['feedbackDocs', body.feedbackDocs, body.feedbackDocs]
      );
    }

    if (body.complaintHotline) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['complaintHotline', JSON.stringify(body.complaintHotline), JSON.stringify(body.complaintHotline)]
      );
    }

    if (body.marquee !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['marquee', body.marquee, body.marquee]
      );
    }

    if (body.footerDescription !== undefined) {
      const footerValue = { description: body.footerDescription };
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['footer', JSON.stringify(footerValue), JSON.stringify(footerValue)]
      );
    }

    // Homepage content
    if (body.heroTitle !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['heroTitle', body.heroTitle, body.heroTitle]
      );
    }

    if (body.heroSubtitle !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['heroSubtitle', body.heroSubtitle, body.heroSubtitle]
      );
    }

    // Contact page content
    if (body.contactPageTitle !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['contactPageTitle', body.contactPageTitle, body.contactPageTitle]
      );
    }

    if (body.contactPageSubtitle !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['contactPageSubtitle', body.contactPageSubtitle, body.contactPageSubtitle]
      );
    }

    // Footer content
    if (body.responsibleGamingText !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['responsibleGamingText', body.responsibleGamingText, body.responsibleGamingText]
      );
    }

    // Logo
    if (body.logoUrl !== undefined) {
      await query(
        'INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = ?',
        ['logoUrl', body.logoUrl, body.logoUrl]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings: ' + error.message },
      { status: 500 }
    );
  }
}
