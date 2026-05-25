import { NextRequest, NextResponse } from "next/server";
import {
  getGameRTPFromDatabase,
  getProvidersFromDatabase,
} from "@/lib/game-rtp";
import { startRTPSyncCron, getSyncStatus } from "@/lib/cron-rtp-sync";
import { cachedJsonResponse } from "@/lib/cache-utils";

let initPromise: Promise<void> | null = null;

async function ensureRTPCronStarted() {
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const status = getSyncStatus();
      if (!status.isActive) {
        startRTPSyncCron();
        console.log("✅ RTP sync cron job started automatically (every 5 minutes)");
      }
    } catch (error) {
      console.error("❌ Failed to auto-start RTP sync cron job:", error);
    }
  })();

  return initPromise;
}

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    ensureRTPCronStarted().catch(() => {
      // Ignore cron errors
    });

    const searchParams = request.nextUrl.searchParams;
    const provider = searchParams.get("provider");
    const action = searchParams.get("action") || "list";

    console.log(`[Games API] Action: ${action}, Provider: ${provider || 'none'}`);

    if (action === "providers") {
      try {
        const providers = await getProvidersFromDatabase();
        console.log(`[Games API] Found ${providers.length} providers`);
        
        if (providers.length > 0) {
          // Cache for 6 hours, stale-while-revalidate for 12 hours
          return cachedJsonResponse({
            providers,
            cached: true,
            source: "database",
          });
        }

        return cachedJsonResponse({ providers: [], cached: true });
      } catch (error: any) {
        console.error("[Games API] Error fetching providers:", error);
        return NextResponse.json(
          { error: error.message || "Failed to fetch providers" },
          { status: 500 }
        );
      }
    }

    if (action === "games" && provider) {
      try {
        const games = await getGameRTPFromDatabase(provider);
        console.log(`[Games API] Found ${games.length} games for provider: ${provider}`);
        
        if (games.length > 0) {
          // Cache for 6 hours, stale-while-revalidate for 12 hours
          return cachedJsonResponse({
            name: provider,
            games,
            totalPages: 1,
            lastUpdated: new Date().toISOString(),
            cached: true,
            source: "database",
          });
        }

        return NextResponse.json(
          { error: `No games found for ${provider}` },
          { status: 404 }
        );
      } catch (error: any) {
        console.error("[Games API] Error fetching games:", error);
        return NextResponse.json(
          { error: error.message || "Failed to fetch games" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Invalid action. Use: providers or games" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("[Games API] Unexpected error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
