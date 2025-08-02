import { useStatusData } from "../hooks/useStatusData";

export const StatusDashboard = () => {
  const { stats, urls, loading, error, refresh } = useStatusData({
    breakpoint: 'desktop',
    refreshInterval: 60000 // Refresh every minute
  });

  if (loading) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="text-sm text-gray-500">Loading status data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 border-red-200">
        <div className="text-sm text-red-600">Error: {error}</div>
        <button
          onClick={refresh}
          className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Statistics */}
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-3">System Status</h3>
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-500">Total Checks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.successful}</div>
              <div className="text-sm text-gray-500">Successful</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.successRate}%</div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
          </div>
        )}
      </div>

      {/* Monitored URLs */}
      <div className="p-4 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-3">Monitored Services</h3>
        {urls && urls.length > 0 ? (
          <div className="space-y-2">
            {urls.map(url => (
              <div key={url.url_id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{url.alias}</div>
                  <div className="text-sm text-gray-500">{url.url}</div>
                </div>
                <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">No URLs configured</div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};
