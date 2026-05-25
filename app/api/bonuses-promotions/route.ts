import { NextResponse } from 'next/server';
import { cachedQuery } from '@/lib/db';
import { cachedJsonResponse } from '@/lib/cache-utils';

export const revalidate = 3600;
export const runtime = 'nodejs';

// GET - Fetch bonuses separately for split layout
export async function GET() {
  try {
    let wildGroupBonuses: any[] = [];
    let group88Bonuses: any[] = [];

    // Fetch from wildgroupau
    try {
      const sqlWild = `
        SELECT bc.id, bc.title, bc.icon, bc.display_order,
               b.id as bonus_id, b.name, b.description, b.icon as bonus_icon, b.display_order as bonus_display_order
        FROM bonus_categories bc
        LEFT JOIN bonuses b ON bc.id = b.category_id
        ORDER BY bc.display_order ASC, b.display_order ASC
      `;
      
      const resultsWild = await cachedQuery<any[]>('wildgroup', sqlWild, undefined, 'bonuses-wildgroup', 3600);
      
      // Group by category
      const categoryMap = new Map();
      resultsWild.forEach((row: any) => {
        if (!categoryMap.has(row.id)) {
          categoryMap.set(row.id, {
            id: `category-${row.id}`,
            title: row.title,
            icon: row.icon,
            bonuses: [],
            source: 'wildgroup',
          });
        }
        if (row.bonus_id) {
          categoryMap.get(row.id).bonuses.push({
            name: row.name,
            description: row.description,
            icon: row.bonus_icon || row.icon,
          });
        }
      });
      wildGroupBonuses = Array.from(categoryMap.values());
    } catch (error) {
      console.log('WildGroup bonuses not available:', error);
    }

    // Fetch from 88group
    try {
      const sql88 = `
        SELECT bc.id, bc.title, bc.icon, bc.description, bc.display_order,
               b.id as bonus_id, b.name, b.description, b.icon as bonus_icon, b.display_order as bonus_display_order
        FROM bonus_categories bc
        LEFT JOIN bonuses b ON bc.id = b.category_id
        ORDER BY bc.display_order ASC, b.display_order ASC
      `;
      
      const results88 = await cachedQuery<any[]>('88group', sql88, undefined, 'bonuses-88group', 3600);
      
      // Group by category
      const categoryMap = new Map();
      results88.forEach((row: any) => {
        if (!categoryMap.has(row.id)) {
          categoryMap.set(row.id, {
            id: row.id,
            title: row.title,
            icon: row.icon,
            description: row.description,
            displayOrder: row.display_order,
            bonuses: [],
            source: '88group',
          });
        }
        if (row.bonus_id) {
          categoryMap.get(row.id).bonuses.push({
            id: row.bonus_id,
            name: row.name,
            description: row.description,
            icon: row.bonus_icon || row.icon,
            displayOrder: row.bonus_display_order,
          });
        }
      });
      group88Bonuses = Array.from(categoryMap.values());
    } catch (error) {
      console.log('88group bonuses not available:', error);
    }

    // Cache for 6 hours, stale-while-revalidate for 12 hours
    return cachedJsonResponse({
      wildgroup: wildGroupBonuses,
      '88group': group88Bonuses,
    });
  } catch (error: any) {
    console.error('Error fetching bonuses:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bonuses' },
      { status: 500 }
    );
  }
}
