import Icon from "../common/icon";

export default function StatCard({
  label,
  value,
  icon,
  variant = "navy",
}) {
  const variants = {
    navy: {
      border: "border-[#AFC1D4]",
      background:
        "bg-gradient-to-br from-[#E2EAF2] via-[#EDF2F7] to-white",
      bottom: "bg-[#1B3553]/20",

      // SAME AS FACULTY MANAGEMENT — TOTAL FACULTY
      iconBg: "bg-[#1B3553]",
      iconColor: "text-white",
      iconShadow:
        "shadow-[0_5px_12px_rgba(27,53,83,0.20)]",

      label: "text-[#50647A]",
      number: "text-[#142A43]",
    },

    green: {
      border: "border-[#B9D5C8]",
      background:
        "bg-gradient-to-br from-[#E3F0EA] via-[#EFF6F2] to-white",
      bottom: "bg-[#31805E]/30",

      // SAME AS FACULTY MANAGEMENT — ACTIVE ACCOUNTS
      iconBg: "bg-[#31795B]",
      iconColor: "text-white",
      iconShadow:
        "shadow-[0_5px_12px_rgba(49,121,91,0.18)]",

      label: "text-[#587363]",
      number: "text-[#142A43]",
    },

    blue: {
      border: "border-[#AFC2D8]",
      background:
        "bg-gradient-to-br from-[#DFE8F2] via-[#EAF0F6] to-white",
      bottom: "bg-[#294B70]/30",

      // SAME AS FACULTY MANAGEMENT — ASSIGNED FACULTY
      iconBg: "bg-[#294B70]",
      iconColor: "text-white",
      iconShadow:
        "shadow-[0_5px_12px_rgba(41,75,112,0.20)]",

      label: "text-[#50677F]",
      number: "text-[#142A43]",
    },

    teal: {
      border: "border-[#B7D1CE]",
      background:
        "bg-gradient-to-br from-[#DFECEA] via-[#EDF5F3] to-white",
      bottom: "bg-[#36534E]/30",

      // DARK TEAL + WHITE, MATCHING THE FACULTY CARD TREATMENT
      iconBg: "bg-[#36534E]",
      iconColor: "text-white",
      iconShadow:
        "shadow-[0_5px_12px_rgba(54,83,78,0.20)]",

      label: "text-[#58716D]",
      number: "text-[#142A43]",
    },
  };

  const style = variants[variant] || variants.navy;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        ${style.border}
        ${style.background}
        p-6
        shadow-[0_5px_22px_rgba(27,53,83,0.10)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(27,53,83,0.16)]
      `}
    >
      {/* Bottom accent */}
      <div
        className={`
          absolute
          bottom-0
          left-0
          h-1
          w-full
          ${style.bottom}
        `}
      />

      <div className="relative flex items-center gap-5">

        {/* Icon */}
        <div
          className={`
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${style.iconBg}
            ${style.iconColor}
            ${style.iconShadow}
            transition-transform
            duration-200
            group-hover:scale-105
          `}
        >
          <Icon
            name={icon}
            className="h-6 w-6"
          />
        </div>

        {/* Content */}
        <div className="min-w-0">
          <span
            className={`
              block
              text-xs
              font-bold
              uppercase
              tracking-wide
              ${style.label}
            `}
          >
            {label}
          </span>

          <strong
            className={`
              mt-1
              block
              text-3xl
              font-bold
              tracking-tight
              ${style.number}
            `}
          >
            {value}
          </strong>
        </div>

      </div>
    </div>
  );
}


