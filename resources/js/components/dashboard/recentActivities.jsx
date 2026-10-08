import Icon from "../common/icon";
import CardHeader from "../common/cardHeader";

export default function RecentActivities({ activities }) {
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
        title="Recent Activities"
        description="Latest system activities"
      />

      {/* ACTIVITIES */}
      <div className="divide-y divide-[#E5EBF1]">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={`${activity.actor}-${index}`}
              className="
                flex
                min-w-0
                items-center
                gap-3.5
                px-5
                py-4
                transition-colors
                duration-200
                hover:bg-[#F7F9FB]
              "
            >
              {/* ACTIVITY ICON */}
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#36534E]/10
                  text-[#36534E]
                "
              >
                <Icon
                  name={activity.icon}
                  className="h-4 w-4"
                />
              </div>

              {/* ACTIVITY INFORMATION */}
              <div className="min-w-0 flex-1">
                <div
                  className="
                    text-sm
                    leading-5
                    text-[#536477]
                  "
                >
                  <strong
                    className="
                      font-semibold
                      text-[#243A52]
                    "
                  >
                    {activity.actor}
                  </strong>{" "}
                  {activity.action}
                </div>

                <div
                  className="
                    mt-1
                    truncate
                    text-xs
                    text-[#9AA7B5]
                  "
                >
                  {activity.detail}
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
            No recent activities.
          </div>
        )}
      </div>
    </div>
  );
}