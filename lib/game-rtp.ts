import { getPool, cachedQuery } from "@/lib/db";

export interface GameRTP {
  title: string;
  provider: string;
  rtp: string;
  thumbnail?: string;
}

let syncLock = false;

function generateRandomRTP(): string {
  const rtp = 65 + Math.random() * 34;
  return `${rtp.toFixed(1)}%`;
}

export async function syncGameRTPToDatabase(): Promise<{ success: boolean; message: string; count: number }> {
  if (syncLock) {
    return {
      success: false,
      message: "Another sync task is running, please try again later",
      count: 0,
    };
  }

  syncLock = true;
  const pool = getPool("88group");
  let connection: any = null;

  try {
    connection = await pool.getConnection();
    await connection.query("SET innodb_lock_wait_timeout = 5");
    await connection.query("SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED");

    let existingGames: any[] = [];
    try {
      const [rows] = await connection.query(
        "SELECT id, title, provider, thumbnail FROM game_rtp ORDER BY display_order, id LIMIT 10000"
      ) as any[];
      existingGames = rows || [];
    } catch (error: any) {
      if (error.code === "ER_NO_SUCH_TABLE") {
        return {
          success: true,
          message: "game_rtp table does not exist yet, skipping sync",
          count: 0,
        };
      }
      throw error;
    }

    if (!existingGames || existingGames.length === 0) {
      return {
        success: true,
        message: "No games found in database, skipping sync",
        count: 0,
      };
    }

    const BATCH_SIZE = 200;
    const totalGames = existingGames.length;
    let updatedCount = 0;

    await connection.query("SET autocommit = 1");

    for (let i = 0; i < totalGames; i += BATCH_SIZE) {
      const batch = existingGames.slice(i, i + BATCH_SIZE);
      const updates: Array<{ id: number; rtp: string }> = [];

      for (const game of batch) {
        updates.push({
          id: game.id,
          rtp: generateRandomRTP(),
        });
      }

      const whenClauses: string[] = [];
      const values: any[] = [];

      for (const update of updates) {
        whenClauses.push(`WHEN ? THEN ?`);
        values.push(update.id, update.rtp);
      }

      const ids = updates.map((u) => u.id);
      const sql = `
        UPDATE game_rtp
        SET rtp = CASE id
          ${whenClauses.join(" ")}
          ELSE rtp
        END,
        updated_at = NOW()
        WHERE id IN (${ids.map(() => "?").join(",")})
      `;

      try {
        await connection.query(sql, [...values, ...ids]);
        updatedCount += updates.length;
      } catch (err: any) {
        if (err.code === "ER_LOCK_WAIT_TIMEOUT" || err.message?.includes("Lock wait timeout")) {
          console.warn(`Batch ${Math.floor(i / BATCH_SIZE) + 1} update lock timeout, using individual updates`);
          for (const update of updates) {
            try {
              await connection.query(
                "UPDATE game_rtp SET rtp = ?, updated_at = NOW() WHERE id = ?",
                [update.rtp, update.id]
              );
              updatedCount++;
            } catch (singleErr: any) {
              console.warn(`Failed to update game ${update.id}:`, singleErr.message);
            }
          }
        } else {
          throw err;
        }
      }

      if (i + BATCH_SIZE < totalGames) {
        await new Promise((resolve) => setTimeout(resolve, 5));
      }
    }

    return {
      success: true,
      message: `Successfully updated RTP for ${updatedCount} games`,
      count: updatedCount,
    };
  } catch (error: any) {
    console.error("Failed to update game RTP data:", error);
    if (error.code === "ER_LOCK_WAIT_TIMEOUT" || error.message?.includes("Lock wait timeout")) {
      return {
        success: false,
        message: "Database update busy, please try again later. If the problem persists, check if other update tasks are running.",
        count: 0,
      };
    }

    return {
      success: false,
      message: `Update failed: ${error.message}`,
      count: 0,
    };
  } finally {
    if (connection) {
      connection.release();
    }
    syncLock = false;
  }
}

export async function getGameRTPFromDatabase(provider?: string): Promise<GameRTP[]> {
  try {
    let sql = "SELECT title, provider, rtp, thumbnail FROM game_rtp";
    const params: any[] = [];

    if (provider) {
      sql += " WHERE provider = ?";
      params.push(provider);
    }

    sql += " ORDER BY display_order, id";

    const cacheKey = provider ? `game-rtp-${provider}` : 'game-rtp-all';
    // Cache for 5 minutes – RTP values update every 5 minutes via cron
    const rows = await cachedQuery<any[]>("88group", sql, params.length > 0 ? params : undefined, cacheKey, 300);

    return rows.map((row: any) => ({
      title: row.title,
      provider: row.provider,
      rtp: row.rtp,
      thumbnail: row.thumbnail || undefined,
    }));
  } catch (error) {
    console.error("Failed to get game RTP data from database:", error);
    return [];
  }
}

export async function getProvidersFromDatabase(): Promise<string[]> {
  try {
    const sql = `SELECT provider FROM game_rtp 
       GROUP BY provider 
       ORDER BY MIN(display_order), MIN(id)`;
    
    const rows = await cachedQuery<any[]>("88group", sql, undefined, 'game-providers', 300);

    return rows.map((row: any) => row.provider);
  } catch (error) {
    console.error("Failed to get providers list from database:", error);
    return [];
  }
}
