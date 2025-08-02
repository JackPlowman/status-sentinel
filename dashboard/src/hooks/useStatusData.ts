import { useState, useEffect, useCallback } from 'react';
import { StatusDataService, TrackerData, StatusStats, UrlConfig } from '../lib/statusDataService';

export interface UseStatusDataOptions {
  breakpoint?: 'mobile' | 'tablet' | 'desktop';
  refreshInterval?: number; // in milliseconds
}

export function useStatusData(options: UseStatusDataOptions = {}) {
  const { breakpoint = 'desktop', refreshInterval } = options;

  const [data, setData] = useState<TrackerData[]>([]);
  const [stats, setStats] = useState<StatusStats | null>(null);
  const [urls, setUrls] = useState<UrlConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const statusData = await StatusDataService.getStatusData();

      // Get tracker data based on breakpoint
      const trackerData = StatusDataService.getTrackerDataForBreakpoint(
        statusData.trackerData,
        breakpoint
      );

      setData(trackerData);
      setStats(statusData.stats);
      setUrls(statusData.urls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load status data');
      console.error('Error loading status data:', err);
    } finally {
      setLoading(false);
    }
  }, [breakpoint]);

  useEffect(() => {
    fetchData();

    // Set up refresh interval if specified
    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  return {
    data,
    stats,
    urls,
    loading,
    error,
    refresh: fetchData
  };
}
