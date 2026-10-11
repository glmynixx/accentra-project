
import StatCard from "./statCard";

export default function StatsGrid({ stats, compact = false }) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          {...stat}
          compact={compact}
        />
      ))}
    </div>
  );
}