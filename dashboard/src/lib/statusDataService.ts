export interface TrackerData {
  color: string;
  tooltip: string;
}

export interface StatusStats {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
}

export interface UrlConfig {
  url_id: number;
  alias: string;
  url: string;
}

export interface StatusResult {
  result_id: number;
  url_id: number;
  success: boolean;
  date_time_stamp: string;
  alias?: string;
}

/**
 * Service to read SQLite database directly in the browser using @sqlite.org/sqlite-wasm
 */
export class StatusDataService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static sqlite3: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static db: any = null;
  private static initialized = false;

  /**
   * Initialize SQLite WASM and load the database
   */
  static async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🔄 Initializing SQLite WASM...');

      // Import SQLite WASM
      const sqlite3InitModule = (await import('@sqlite.org/sqlite-wasm')).default;

      // Initialize SQLite3
      this.sqlite3 = await sqlite3InitModule({
        print: console.log,
        printErr: console.error,
      });

      console.log('✅ SQLite WASM initialized successfully');
      console.log('🔍 Available SQLite version:', this.sqlite3.version.libVersion);

      // Fetch the database file
      const dbUrl = '/status-sentinel/status-checker-database.db';
      console.log('📦 Fetching database from:', dbUrl);

      const response = await fetch(dbUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch database: ${response.statusText}`);
      }

      const databaseBuffer = await response.arrayBuffer();
      console.log('📊 Database size:', databaseBuffer.byteLength, 'bytes');

      // Create database from buffer
      const uint8Array = new Uint8Array(databaseBuffer);
      this.db = new this.sqlite3.oo1.DB();

      // Load the database data
      const rc = this.sqlite3.capi.sqlite3_deserialize(
        this.db.pointer,
        'main',
        uint8Array,
        uint8Array.length,
        uint8Array.length,
        this.sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE
      );

      if (rc !== this.sqlite3.capi.SQLITE_OK) {
        throw new Error(`Failed to load database: ${this.sqlite3.capi.sqlite3_errstr(rc)}`);
      }

      this.initialized = true;
      console.log('✅ Database loaded successfully');

      // Test the connection by checking tables
      const tables = this.db.selectArrays("SELECT name FROM sqlite_master WHERE type='table'");
      console.log('📋 Available tables:', tables.map((row: string[]) => row[0]));

    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      throw error;
    }
  }

  /**
   * Ensure database is initialized
   */
  private static async ensureInitialized(): Promise<void> {
    if (!this.initialized || !this.db) {
      await this.initialize();
    }
  }

  /**
   * Get all URL configurations
   */
  static async getUrls(): Promise<UrlConfig[]> {
    await this.ensureInitialized();

    const results = this.db.selectArrays('SELECT url_id, alias, url FROM url ORDER BY url_id');

    return results.map((row: (string | number)[]) => ({
      url_id: row[0] as number,
      alias: row[1] as string,
      url: row[2] as string
    }));
  }

  /**
   * Get recent status results
   */
  static async getRecentResults(limit: number = 150): Promise<StatusResult[]> {
    await this.ensureInitialized();

    const results = this.db.selectArrays(`
      SELECT r.result_id, r.url_id, r.success, r.date_time_stamp, u.alias
      FROM results r
      JOIN url u ON r.url_id = u.url_id
      ORDER BY r.date_time_stamp DESC
      LIMIT ?
    `, [limit]);

    // Convert to objects and reverse to show oldest first (left to right)
    const statusResults = results.map((row: (string | number | boolean)[]) => ({
      result_id: row[0] as number,
      url_id: row[1] as number,
      success: Boolean(row[2]),
      date_time_stamp: row[3] as string,
      alias: row[4] as string
    })).reverse();

    return statusResults;
  }

  /**
   * Transform status results to tracker data format
   */
  static transformToTrackerData(results: StatusResult[]): TrackerData[] {
    return results.map(result => {
      const timestamp = new Date(result.date_time_stamp).toLocaleString();
      const status = result.success ? 'Success' : 'Error';
      const color = result.success ? 'bg-emerald-600' : 'bg-red-600';

      const tooltip = `${result.alias}: ${status} at ${timestamp}`;

      return {
        color,
        tooltip
      };
    });
  }

  /**
   * Get tracker data for different breakpoints
   */
  static getTrackerDataForBreakpoint(data: TrackerData[], breakpoint: 'mobile' | 'tablet' | 'desktop'): TrackerData[] {
    const limits = {
      mobile: 30,
      tablet: 60,
      desktop: 150
    };

    const limit = limits[breakpoint];
    return data.slice(-limit); // Get the most recent entries
  }

  /**
   * Get status statistics
   */
  static async getStats(): Promise<StatusStats> {
    await this.ensureInitialized();

    // Get total count
    const totalResult = this.db.selectValue('SELECT COUNT(*) FROM results');
    const total = totalResult || 0;

    // Get successful count
    const successfulResult = this.db.selectValue('SELECT COUNT(*) FROM results WHERE success = 1');
    const successful = successfulResult || 0;

    const failed = total - successful;
    const successRate = total > 0 ? (successful / total) * 100 : 0;

    return {
      total,
      successful,
      failed,
      successRate: Math.round(successRate * 100) / 100
    };
  }

  /**
   * Get complete status data for the tracker
   */
  static async getStatusData(limit: number = 150): Promise<{
    trackerData: TrackerData[];
    stats: StatusStats;
    urls: UrlConfig[];
  }> {
    const [results, stats, urls] = await Promise.all([
      this.getRecentResults(limit),
      this.getStats(),
      this.getUrls()
    ]);

    const trackerData = this.transformToTrackerData(results);

    return {
      trackerData,
      stats,
      urls
    };
  }

  /**
   * Close database connection
   */
  static close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.initialized = false;
    }
  }
}
