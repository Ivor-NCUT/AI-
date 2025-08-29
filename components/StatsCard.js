function StatsCard({ title, value, icon, className = "" }) {
  try {
    return (
      <div className={`card ${className}`} data-name="stats-card" data-file="components/StatsCard.js">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-1">{title}</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          </div>
          <div className="w-12 h-12 bg-[var(--secondary-color)] rounded-lg flex items-center justify-center">
            <div className={`icon-${icon} text-xl text-white`}></div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('StatsCard component error:', error);
    return null;
  }
}