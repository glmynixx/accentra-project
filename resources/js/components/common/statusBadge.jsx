
export default function StatusBadge({ status }) {
    const normalizedStatus = status?.toLowerCase();
    const isActive = normalizedStatus === "active";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                isActive
                    ? "border-[#6FA58D]/40 bg-[#36534E]/45 text-[#C8E9D7]"
                    : "border-white/[0.12] bg-white/[0.055] text-[#D2DCE7]"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-[#9BCAB3]" : "bg-[#A8B8CA]"
                }`}
            />
            {status}
        </span>
    );
}
