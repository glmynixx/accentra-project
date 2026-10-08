export default function CardHeader({
  title,
  description,
  actionText = "View All",
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-[#DCE4EC]
        bg-gradient-to-r
        from-[#DCE6F0]
        to-white
        px-5
        py-4
        max-[600px]:items-start
      "
    >
      {/* TITLE + DESCRIPTION */}
      <div className="min-w-0">
        <h3
          className="
            text-[15px]
            font-bold
            tracking-tight
            text-[#243A52]
          "
        >
          {title}
        </h3>

        <p
          className="
            mt-0.5
            text-xs
            text-[#7A8999]
          "
        >
          {description}
        </p>
      </div>

      {/* ACTION */}
      <a
        href="#"
        className="
          inline-flex
          shrink-0
          items-center
          justify-center
          rounded-lg
          border
          border-[#263B55]
          bg-[#142A43]
          px-3
          py-1.5
          text-xs
          font-semibold
          text-white
          shadow-sm
          transition-all
          duration-200
          hover:border-[#36506B]
          hover:bg-[#1D3855]
          hover:shadow
          active:scale-[0.98]
        "
        onClick={(event) => event.preventDefault()}
      >
        {actionText}
      </a>
    </div>
  );
}

