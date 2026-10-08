export default function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();

  const isActive = normalizedStatus === "active";

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        border
        px-2.5
        py-1
        text-[11px]
        font-semibold
        ${
          isActive
            ? "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]"
            : "border-[#CBD3DC] bg-[#E7EBEF] text-[#647181]"
        }
      `}
    >
      <span
        className={`
          h-1.5
          w-1.5
          rounded-full
          ${
            isActive
              ? "bg-[#31805E]"
              : "bg-[#7C8794]"
          }
        `}
      />

      {status}
    </span>
  );
}