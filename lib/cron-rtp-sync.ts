import { syncGameRTPToDatabase } from "@/lib/game-rtp";

let syncInterval: NodeJS.Timeout | null = null;
let isRunning = false;

export function startRTPSyncCron() {
  if (syncInterval) {
    stopRTPSyncCron();
  }

  console.log("Starting RTP data sync cron job (every 5 minutes)");
  executeSync();
  syncInterval = setInterval(() => {
    executeSync();
  }, 5 * 60 * 1000);
}

export function stopRTPSyncCron() {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
    console.log("Stopped RTP data sync cron job");
  }
}

async function executeSync() {
  if (isRunning) {
    console.log("RTP sync task is already running, skipping this execution");
    return;
  }

  isRunning = true;
  const startTime = Date.now();

  try {
    console.log(`[${new Date().toISOString()}] Starting RTP data sync to database...`);
    const result = await syncGameRTPToDatabase();
    const duration = Date.now() - startTime;

    if (result.success) {
      console.log(`[${new Date().toISOString()}] RTP data sync successful: ${result.message}, duration: ${duration}ms`);
    } else {
      console.error(`[${new Date().toISOString()}] RTP data sync failed: ${result.message}, duration: ${duration}ms`);
    }
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[${new Date().toISOString()}] RTP data sync error:`, error, `duration: ${duration}ms`);
  } finally {
    isRunning = false;
  }
}

export function getSyncStatus() {
  return {
    isRunning,
    isActive: syncInterval !== null,
    lastSyncTime: new Date().toISOString(),
  };
}
