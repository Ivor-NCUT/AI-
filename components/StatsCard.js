function StatsCard({ title, value, icon, trend, className = "" }) {
  try {
    const iconColors = {
      'package': 'from-blue-500 to-blue-600',
      'calendar': 'from-green-500 to-green-600',
      'trending-up': 'from-purple-500 to-purple-600',
      'dollar-sign': 'from-yellow-500 to-yellow-600'
    };
    
    return (
      <div className={`stats-card ${className} group`} data-name="stats-card" data-file="components/StatsCard.js">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-[var(--text-muted)] mb-2 font-medium">{title}</p>
            <p className="text-3xl font-bold text-[var(--text-primary)] mb-1">{value}</p>
            {trend && (
              <div className="flex items-center gap-1">
                <div className={`icon-${trend.direction === 'up' ? 'trending-up' : 'trending-down'} text-xs ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}></div>
                <span className={`text-xs font-medium ${trend.direction === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {trend.value}
                </span>
              </div>
            )}
          </div>
          <div className={`w-14 h-14 bg-gradient-to-br ${iconColors[icon] || 'from-gray-500 to-gray-600'} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <div className={`icon-${icon} text-2xl text-white`}></div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('StatsCard component error:', error);
    return null;
  }
}