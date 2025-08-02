import { useStatusData } from "../hooks/useStatusData";

export const StatusStats = () => {
  const { stats, loading, error } = useStatusData({ breakpoint: 'desktop' });

  if (loading) {
    return (
      <div className="flex gap-4 text-sm text-gray-600">
        <span>Loading stats...</span>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex gap-4 text-sm text-red-600">
        <span>Failed to load statistics</span>
      </div>
    );
  }

  return (
    <div className="flex gap-6 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
        <span className="text-gray-700">
          Successful: <span className="font-semibold text-emerald-600">{stats.successful}</span>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-red-600 rounded-full"></div>
        <span className="text-gray-700">
          Failed: <span className="font-semibold text-red-600">{stats.failed}</span>
        </span>
      </div>

      <div className="text-gray-700">
        Success Rate: <span className="font-semibold text-blue-600">{stats.successRate}%</span>
      </div>

      <div className="text-gray-700">
        Total Checks: <span className="font-semibold">{stats.total}</span>
      </div>
    </div>
  );
};
