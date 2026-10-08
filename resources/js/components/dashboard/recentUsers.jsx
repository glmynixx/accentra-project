import CardHeader from "../common/cardHeader";
import StatusBadge from "../common/statusBadge";

export default function RecentUsers({ users }) {
  return (
    <section
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
        title="Recent Users Summary"
        description="Recently added users in the system"
      />

      {/* TABLE */}
     <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b border-[#CDD8E3] bg-[#E7EDF3]">
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      ID
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Name
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                     Role
                    </th>

                    <th className="px-5 py-3.5 text-center text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Section
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Status
                    </th>

                    <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wide text-[#40566E]">
                      Date Added
                    </th>
                  </tr>
                </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => {
                const isFaculty = user.role === "Faculty";

                return (
                  <tr
                    key={user.id}
                    className="
                      border-b
                      border-[#E5EBF1]
                      last:border-b-0
                      transition-colors
                      duration-150
                      hover:bg-[#F7F9FB]
                    "
                  >
                    {/* ID */}
                    <td className="px-5 py-4 align-middle">
                      <span
                        className="
                          text-sm
                          font-semibold
                          text-[#294B70]
                        "
                      >
                        {user.id}
                      </span>
                    </td>

                    {/* NAME */}
                    <td className="px-5 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            text-[11px]
                            font-bold
                            ${
                              isFaculty
                                ? "bg-blue-50 text-blue-600"
                                : "bg-[#36534E]/10 text-[#36534E]"
                            }
                          `}
                        >
                          {user.initials}
                        </div>

                        <div className="flex min-w-0 flex-col">
                          <strong
                            className="
                              whitespace-nowrap
                              text-sm
                              font-semibold
                              text-[#243A52]
                            "
                          >
                            {user.name}
                          </strong>

                          <small
                            className="
                              mt-0.5
                              whitespace-nowrap
                              text-xs
                              text-[#9AA7B5]
                            "
                          >
                            {user.username}
                          </small>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-5 py-4 align-middle">
                    <span
                      className={`
                        inline-flex
                        h-[24px]
                        min-w-[68px]
                        items-center
                        justify-center
                        rounded-full
                        border
                        px-2.5
                        text-[11px]
                        font-semibold
                        leading-none
                        ${
                          user.role?.toLowerCase() === "faculty"
                            ? "border-[#C9D8EA] bg-[#EAF1F9] text-[#3B6FA5]"
                            : "border-[#B9D9C8] bg-[#E1F0E8] text-[#267653]"
                        }
                      `}
                    >
                      {user.role}
                    </span>
                    </td>

                    {/* SECTION */}
                    <td
                      className="
                        px-5
                        py-4
                        text-sm
                        font-medium
                        text-[#536477]
                      "
                    >
                      {user.section}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4 align-middle ">
                      <StatusBadge status={user.status} />
                    
                    </td>
                   
                    {/* DATE */}
                    <td
                      className="
                        whitespace-nowrap
                        px-5
                        py-4
                        text-sm
                        text-[#7A8999]
                      "
                    >
                      {user.dateAdded}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="
                    px-5
                    py-10
                    text-center
                    text-sm
                    text-[#7A8999]
                  "
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}