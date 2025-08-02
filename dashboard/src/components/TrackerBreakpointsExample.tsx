import { Tracker } from "./Tracker";
import { useStatusData } from "../hooks/useStatusData";

export const StatusUptimeTracker = () => {
  const {
    data,
    stats,
    urls,
    loading,
    error
  } = useStatusData({
    breakpoint: 'desktop',
    refreshInterval: 30000 // Refresh every 30 seconds
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Project Status</h2>
          <div className="text-sm text-gray-500">Loading...</div>
        </div>
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Project Status</h2>
          <div className="text-sm text-red-500">Error loading data</div>
        </div>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const currentUrl = urls?.[0]; // Assuming we're tracking the first URL
  const uptimePercentage = stats?.successRate || 0;

  // Determine status color based on uptime percentage
  let statusColor = 'text-red-600';
  if (uptimePercentage >= 99) {
    statusColor = 'text-green-600';
  } else if (uptimePercentage >= 95) {
    statusColor = 'text-yellow-600';
  }

  return (
    <div className="space-y-4">
      {/* Header with current status */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Project Uptime</h2>
          {currentUrl && (
            <p className="text-sm text-gray-600">{currentUrl.alias} - {currentUrl.url}</p>
          )}
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${statusColor}`}>
            {uptimePercentage.toFixed(2)}%
          </div>
          <div className="text-sm text-gray-500">Uptime</div>
        </div>
      </div>

      {/* Status tracker - responsive design */}
      <div>
        {/* Desktop view - shows all data points */}
        <div className="hidden lg:block">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Last 150 checks:</span>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
              <span>Online</span>
              <div className="w-3 h-3 bg-red-600 rounded-sm ml-2"></div>
              <span>Offline</span>
            </div>
          </div>
          <Tracker
            className="w-full"
            data={data}
            hoverEffect={true}
          />
        </div>

        {/* Tablet view - shows last 60 checks */}
        <div className="hidden sm:block lg:hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Last 60 checks:</span>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-emerald-600 rounded-sm"></div>
              <span>Online</span>
              <div className="w-3 h-3 bg-red-600 rounded-sm ml-2"></div>
              <span>Offline</span>
            </div>
          </div>
          <Tracker
            className="w-full"
            data={data.slice(-60)}
            hoverEffect={true}
          />
        </div>

        {/* Mobile view - shows last 30 checks */}
        <div className="block sm:hidden">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-gray-600">Last 30 checks:</span>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-2 h-2 bg-emerald-600 rounded-sm"></div>
              <span>Up</span>
              <div className="w-2 h-2 bg-red-600 rounded-sm ml-2"></div>
              <span>Down</span>
            </div>
          </div>
          <Tracker
            className="w-full"
            data={data.slice(-30)}
            hoverEffect={true}
          />
        </div>
      </div>

      {/* Stats summary */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-xl font-semibold text-green-600">{stats.successful}</div>
            <div className="text-xs text-gray-500">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-red-600">{stats.failed}</div>
            <div className="text-xs text-gray-500">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-semibold text-gray-900">{stats.total}</div>
            <div className="text-xs text-gray-500">Total Checks</div>
          </div>
        </div>
      )}
    </div>
  );
};

// Keep the old export name for backward compatibility
export const TrackerBreakpointsExample = StatusUptimeTracker;
