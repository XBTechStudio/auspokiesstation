import { NextResponse } from 'next/server';
import { cachedQuery } from '@/lib/db';
import { cachedJsonResponse } from '@/lib/cache-utils';

export const revalidate = 3600;
export const runtime = 'nodejs';

// GET - Fetch testimonials from both databases
export async function GET() {
  try {
    // 88group has testimonials table, wildgroupau might not have it
    let testimonials88: any[] = [];
    let testimonialsWild: any[] = [];

    try {
      const sql88 = 'SELECT name, casino, text, rating, date FROM testimonials WHERE is_active = TRUE ORDER BY display_order ASC, date DESC LIMIT 50';
      const results88 = await cachedQuery<any[]>('88group', sql88, undefined, 'testimonials-88group', 3600);
      testimonials88 = (results88 as any[]).map((row: any) => ({
        name: row.name,
        casino: row.casino,
        text: row.text,
        rating: row.rating,
        date: row.date ? new Date(row.date).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' }) : '',
        source: '88group',
      }));
    } catch (error: any) {
      if (error?.code !== 'ER_NO_SUCH_TABLE') {
        console.log('88group testimonials not available:', error);
      }
    }

        // Skip wildgroup database - testimonials table doesn't exist
        // Use hardcoded testimonials for wildgroup instead

    // If no database testimonials, use hardcoded ones from wildgroupau
    if (testimonialsWild.length === 0) {
      testimonialsWild = [
        { name: "Daniel Wright", casino: "WildGroup", text: "Everything worked exactly as promised. Smooth process from start to finish.", rating: 5, source: 'wildgroup', title: "Where Trust Meets Performance" },
        { name: "Jason Miller", casino: "WildGroup", text: "No delays, no confusion. Withdrawals were processed quickly and clearly.", rating: 5, source: 'wildgroup', title: "Fast Wins, Faster Withdrawals" },
        { name: "Andrew Collins", casino: "WildGroup", text: "Registration was simple and the platform felt stable right away.", rating: 5, source: 'wildgroup', title: "Reliable From Day One" },
        { name: "Matthew Brooks", casino: "WildGroup", text: "Clear information, fair system, and reliable payouts every time.", rating: 5, source: 'wildgroup', title: "Exactly What a Player Needs" },
        { name: "Chris Walker", casino: "WildGroup", text: "What you see is what you get. A very transparent experience.", rating: 5, source: 'wildgroup', title: "No Surprises, Just Results" },
        { name: "Steven Hall", casino: "WildGroup", text: "The overall operation feels structured and trustworthy.", rating: 5, source: 'wildgroup', title: "Professional and Well-Managed" },
        { name: "Ryan Thompson", casino: "WildGroup", text: "I've used many platforms, this one stands out for consistency.", rating: 5, source: 'wildgroup', title: "Consistent and Dependable" },
        { name: "Luke Anderson", casino: "WildGroup", text: "Deposits and withdrawals were handled without issues.", rating: 5, source: 'wildgroup', title: "Smooth Payments Every Time" },
        { name: "Nathan Scott", casino: "WildGroup", text: "Seeing real activity and records made the decision easy.", rating: 5, source: 'wildgroup', title: "Confidence From Transparency" },
        { name: "Michael Turner", casino: "WildGroup", text: "This platform doesn't feel rushed or short-term focused.", rating: 5, source: 'wildgroup', title: "Built for Long-Term Players" },
        { name: "Ben Harris", casino: "WildGroup", text: "No unnecessary steps. Everything works as expected.", rating: 5, source: 'wildgroup', title: "Simple, Clean, and Reliable" },
        { name: "Adam Lewis", casino: "WildGroup", text: "Rules are clear and payouts are handled professionally.", rating: 5, source: 'wildgroup', title: "Fast, Fair, and Clear" },
        { name: "James Carter", casino: "WildGroup", text: "Stable performance and timely transactions gave me confidence.", rating: 5, source: 'wildgroup', title: "A Platform You Can Rely On" },
        { name: "Oliver Reed", casino: "WildGroup", text: "The experience was smoother than I expected.", rating: 5, source: 'wildgroup', title: "Well Above Expectations" },
        { name: "Thomas Green", casino: "WildGroup", text: "Feels designed with players in mind, not just promotions.", rating: 5, source: 'wildgroup', title: "Transparent and Player-Focused" },
        { name: "Peter Wilson", casino: "WildGroup", text: "No gimmicks, no confusion, just solid service.", rating: 5, source: 'wildgroup', title: "Straightforward Experience" },
        { name: "Samuel Brown", casino: "WildGroup", text: "After my first withdrawal, trust was established.", rating: 5, source: 'wildgroup', title: "Trust Built Through Results" },
        { name: "David Morgan", casino: "WildGroup", text: "Everything from login to withdrawal was seamless.", rating: 5, source: 'wildgroup', title: "Clear System, Fast Results" },
        { name: "Jonathan Price", casino: "WildGroup", text: "The entire flow feels well thought out and secure.", rating: 5, source: 'wildgroup', title: "Professional From Start to Finish" },
        { name: "Kevin Roberts", casino: "WildGroup", text: "Consistency and transparency make a big difference here.", rating: 5, source: 'wildgroup', title: "One of the More Reliable Platforms" },
      ];
    }

    // Combine and shuffle randomly
    const allTestimonials = [...testimonials88, ...testimonialsWild];
    
    // Fisher-Yates shuffle algorithm for random order
    for (let i = allTestimonials.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allTestimonials[i], allTestimonials[j]] = [allTestimonials[j], allTestimonials[i]];
    }
    
    // Cache for 6 hours, stale-while-revalidate for 12 hours
    return cachedJsonResponse(allTestimonials);
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json([]);
  }
}
