import { NextResponse } from 'next/server';
import { cachedQuery } from '@/lib/db';
import { query as queryLocal } from '@/lib/db-local';
import { cachedJsonResponse } from '@/lib/cache-utils';

export const revalidate = 3600;
export const runtime = 'nodejs';

// GET - Fetch settings (local database first, then external databases)
export async function GET() {
  try {
    const sql = 'SELECT `key`, `value` FROM site_settings';
    
    // Get from local database first (highest priority)
    let localRows: any[] = [];
    try {
      localRows = await queryLocal(sql) as any[];
    } catch (error) {
      console.log('Local settings not available, using external databases');
    }

    // Get from external databases (cached)
    const [wildGroupRows, group88Rows] = await Promise.all([
      cachedQuery<any[]>('wildgroup', sql, undefined, 'settings-wildgroup', 3600),
      cachedQuery<any[]>('88group', sql, undefined, 'settings-88group', 3600),
    ]);

    // Merge settings: local (highest priority) > 88group > wildgroup
    const settings: any = {
      socialMedia: {},
      contact: {},
      footer: {},
      footerDescription: '',
      whatsapp: {},
      telegram: '',
      feedbackDocs: '',
      complaintHotline: {},
      contactEmail: '',
      contactFormEmail: '',
      registerUrl: '',
      loginUrl: '',
      marquee: '',
      logoUrl: '',
      heroTitle: '',
      heroSubtitle: '',
      contactPageTitle: '',
      contactPageSubtitle: '',
      responsibleGamingText: '',
    };

    // Process wildgroup settings first (lowest priority)
    wildGroupRows.forEach((row: any) => {
      try {
        // String values (not JSON)
        if (row.key === 'contactEmail' || 
            row.key === 'registerUrl' || 
            row.key === 'loginUrl' ||
            row.key === 'logoUrl' ||
            row.key === 'heroTitle' ||
            row.key === 'heroSubtitle' ||
            row.key === 'contactPageTitle' ||
            row.key === 'contactPageSubtitle' ||
            row.key === 'responsibleGamingText' ||
            row.key === 'footerDescription') {
          if (!settings[row.key]) {
            settings[row.key] = row.value;
          }
        } else {
          // JSON values
          const value = JSON.parse(row.value);
          if (row.key === 'socialMedia') {
            settings.socialMedia = { ...settings.socialMedia, ...value };
          } else if (row.key === 'contact') {
            settings.contact = { ...settings.contact, ...value };
          } else if (row.key === 'footer') {
            settings.footer = { ...settings.footer, ...value };
            if (value.description && !settings.footerDescription) {
              settings.footerDescription = value.description;
            }
          } else if (row.key === 'whatsapp') {
            settings.whatsapp = { ...settings.whatsapp, ...value };
          } else if (row.key === 'complaintHotline') {
            settings.complaintHotline = { ...settings.complaintHotline, ...value };
          }
        }
      } catch (e) {
        console.error(`Error parsing setting ${row.key}:`, e);
      }
    });

    // Process 88group settings (medium priority)
    group88Rows.forEach((row: any) => {
      try {
        // String values (not JSON)
        if (row.key === 'contactEmail' || 
            row.key === 'contactFormEmail' || 
            row.key === 'telegram' || 
            row.key === 'feedbackDocs' || 
            row.key === 'marquee' ||
            row.key === 'logoUrl' ||
            row.key === 'heroTitle' ||
            row.key === 'heroSubtitle' ||
            row.key === 'contactPageTitle' ||
            row.key === 'contactPageSubtitle' ||
            row.key === 'responsibleGamingText' ||
            row.key === 'footerDescription') {
          if (!settings[row.key]) {
            settings[row.key] = row.value;
          }
        } else {
          // JSON values
          const value = JSON.parse(row.value);
          if (row.key === 'socialMedia') {
            settings.socialMedia = { ...settings.socialMedia, ...value };
          } else if (row.key === 'contact') {
            settings.contact = { ...settings.contact, ...value };
          } else if (row.key === 'footer') {
            settings.footer = { ...settings.footer, ...value };
            if (value.description && !settings.footerDescription) {
              settings.footerDescription = value.description;
            }
          } else if (row.key === 'whatsapp') {
            settings.whatsapp = { ...settings.whatsapp, ...value };
          } else if (row.key === 'complaintHotline') {
            settings.complaintHotline = { ...settings.complaintHotline, ...value };
          }
        }
      } catch (e) {
        console.error(`Error parsing setting ${row.key}:`, e);
      }
    });

    // Process local settings last (highest priority - overrides everything)
    localRows.forEach((row: any) => {
      try {
        // String values (not JSON)
        if (row.key === 'contactEmail' || 
            row.key === 'contactFormEmail' || 
            row.key === 'telegram' || 
            row.key === 'feedbackDocs' || 
            row.key === 'marquee' || 
            row.key === 'registerUrl' || 
            row.key === 'loginUrl' ||
            row.key === 'logoUrl' ||
            row.key === 'heroTitle' ||
            row.key === 'heroSubtitle' ||
            row.key === 'contactPageTitle' ||
            row.key === 'contactPageSubtitle' ||
            row.key === 'responsibleGamingText' ||
            row.key === 'footerDescription') {
          settings[row.key] = row.value;
        } else {
          // JSON values
          const value = JSON.parse(row.value);
          if (row.key === 'socialMedia') {
            settings.socialMedia = value; // Override completely
          } else if (row.key === 'contact') {
            settings.contact = value; // Override completely
          } else if (row.key === 'footer') {
            settings.footer = value; // Override completely
            if (value.description) {
              settings.footerDescription = value.description;
            }
          } else if (row.key === 'whatsapp') {
            settings.whatsapp = value; // Override completely
          } else if (row.key === 'complaintHotline') {
            settings.complaintHotline = value; // Override completely
          }
        }
      } catch (e) {
        console.error(`Error parsing local setting ${row.key}:`, e);
      }
    });

    // Cache for 6 hours, stale-while-revalidate for 12 hours
    return cachedJsonResponse(settings);
  } catch (error: any) {
    console.error('Error reading settings:', error);
    return NextResponse.json({
      socialMedia: {},
      contact: {},
      contactEmail: '',
      contactFormEmail: '',
      whatsapp: {},
      telegram: '',
      feedbackDocs: '',
      complaintHotline: {},
      marquee: '',
      logoUrl: '',
      heroTitle: '',
      heroSubtitle: '',
      contactPageTitle: '',
      contactPageSubtitle: '',
      responsibleGamingText: '',
      footerDescription: '',
    });
  }
}
