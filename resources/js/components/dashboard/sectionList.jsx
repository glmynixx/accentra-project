import Icon from "../common/icon";
import CardHeader from "../common/cardHeader";
import StatusBadge from "../common/statusBadge";

export default function SectionList({ sections }) {
  return (
    <div
      className="
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-[#C9D5E2]
        bg-white
        shadow-[0_5px_25px_rgba(27,53,83,0.08)]
      "
    >
      {/* HEADER */}
      <CardHeader
        title="Section List"
        description="Current academic sections"
      />

      {/* SECTION LIST */}
      <div className="divide-y divide-[#E5EBF1]">
        {sections.length > 0 ? (
          sections.map((section, index) => (
            <div
              key={`${section.name}-${index}`}
              className="
                flex
                min-w-0
                items-center
                gap-4
                px-5
                py-4
                transition-colors
                duration-200
                hover:bg-[#F7F9FB]
                max-[600px]:items-start
              "
            >
              {/* SECTION ICON */}
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#36534E]/10
                  text-[#36534E]
                "
              >
                <Icon
                  name="layers-3"
                  className="h-5 w-5"
                />
              </div>

              {/* SECTION INFORMATION */}
              <div className="flex min-w-0 flex-1 flex-col">
                <strong
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-[#243A52]
                  "
                >
                  {section.name}
                </strong>

                <span
                  className="
                    mt-1
                    truncate
                    text-xs
                    text-[#7A8999]
                  "
                >
                  {section.program} • {section.year}
                </span>

                <span
                  className="
                    mt-0.5
                    truncate
                    text-xs
                    text-[#9AA7B5]
                  "
                >
                  Adviser: {section.adviser}
                </span>
              </div>

              {/* SECTION META */}
              <div
                className="
                  flex
                  min-w-[80px]
                  shrink-0
                  flex-col
                  items-end
                  gap-1
                  max-[600px]:items-start
                "
              >
                <strong
                  className="
                    text-sm
                    font-bold
                    text-[#243A52]
                  "
                >
                  {section.students}
                </strong>

                <span
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-[#9AA7B5]
                  "
                >
                  Students
                </span>

                <div className="mt-1">
                  <StatusBadge status={section.status} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="
              px-5
              py-10
              text-center
              text-sm
              text-[#7A8999]
            "
          >
            No sections found.
          </div>
        )}
      </div>
    </div>
  );
}