import StatCard from "./statCard";

export default function StatsGrid({ stats = [], compact = false }) {
    return (
        <div
            className={`grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 ${
                compact ? "xl:grid-cols-4" : "xl:grid-cols-4"
            }`}
        >
            {stats.map((stat, index) => (
                <StatCard
                    key={stat.label ?? stat.title ?? index}
                    {...stat}
                    compact={compact}
                />
            ))}
        </div>
    );
}  