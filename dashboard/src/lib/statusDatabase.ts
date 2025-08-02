import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface StatusResult {
  result_id: number;
  url_id: number;
  success: boolean;
  date_time_stamp: string;
}

export interface UrlConfig {
  url_id: number;
  alias: string;
  url: string;
}

export interface TrackerData {
  color: string;
  tooltip: string;
}

class StatusDatabase {
  private readonly db: Database.Database;

  constructor(dbPath?: string) {
    const defaultPath = join(__dirname, '..', 'status-checker-database.db');
    this.db = new Database(dbPath || defaultPath, { readonly: true });
  }

  /**
   * Get all URL configurations
   */
  getUrls(): UrlConfig[] {
    return this.db.prepare('SELECT * FROM url ORDER BY url_id').all() as UrlConfig[];
  }

  /**
   * Get recent status results for a specific URL
   */
  getRecentResults(urlId: number, limit: number = 100): StatusResult[] {
    return this.db.prepare(`
      SELECT * FROM results
      WHERE url_id = ?
      ORDER BY date_time_stamp DESC
      LIMIT ?
    `).all(urlId, limit) as StatusResult[];
  }

  /**
   * Get all recent results across all URLs
   */
  getAllRecentResults(limit: number = 100): StatusResult[] {
    return this.db.prepare(`
      SELECT r.*, u.alias
      FROM results r
      JOIN url u ON r.url_id = u.url_id
      ORDER BY r.date_time_stamp DESC
      LIMIT ?
    `).all(limit) as (StatusResult & { alias: string })[];
  }

  /**
   * Transform status results to tracker data format
   */
  transformToTrackerData(results: StatusResult[], urlAlias?: string): TrackerData[] {
    return results.map(result => {
      const timestamp = new Date(result.date_time_stamp).toLocaleString();
      const status = result.success ? 'Success' : 'Error';
      const color = result.success ? 'bg-emerald-600' : 'bg-red-600';

      const tooltip = urlAlias
        ? `${urlAlias}: ${status} at ${timestamp}`
        : `${status} at ${timestamp}`;

      return {
        color,
        tooltip
      };
    });
  }

  /**
   * Get tracker data for the most recent results
   */
  getTrackerData(limit: number = 100): TrackerData[] {
    const results = this.getAllRecentResults(limit);

    // Reverse to show oldest first (left to right)
    results.reverse();

    return this.transformToTrackerData(results);
  }

  /**
   * Get tracker data for a specific URL
   */
  getUrlTrackerData(urlId: number, limit: number = 100): TrackerData[] {
    const urls = this.getUrls();
    const url = urls.find(u => u.url_id === urlId);

    if (!url) {
      throw new Error(`URL with ID ${urlId} not found`);
    }

    const results = this.getRecentResults(urlId, limit);

    // Reverse to show oldest first (left to right)
    results.reverse();

    return this.transformToTrackerData(results, url.alias);
  }

  /**
   * Get summary statistics
   */
  getStats() {
    const totalChecks = this.db.prepare('SELECT COUNT(*) as count FROM results').get() as { count: number };
    const successfulChecks = this.db.prepare('SELECT COUNT(*) as count FROM results WHERE success = 1').get() as { count: number };
    const failedChecks = this.db.prepare('SELECT COUNT(*) as count FROM results WHERE success = 0').get() as { count: number };

    const successRate = totalChecks.count > 0 ? (successfulChecks.count / totalChecks.count) * 100 : 0;

    return {
      total: totalChecks.count,
      successful: successfulChecks.count,
      failed: failedChecks.count,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  /**
   * Close the database connection
   */
  close() {
    this.db.close();
  }
}

export default StatusDatabase;
