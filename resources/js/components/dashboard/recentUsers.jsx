
import CardHeader from "../common/cardHeader";

export default function RecentUsers({ users = [] }) {
    const formattedUsers = users.map((user) => {
        const roleValue =
            typeof user.role === "object"
                ? user.role?.name
                : user.role;

        const role = String(roleValue || "").toLowerCase();

        return {
            ...user,
            displayId:
                user.faculty_number ??
                user.student_number ??
                user.displayId ??
                user.id ??
                "—",
            displayRole: roleValue || "—",
            normalizedRole: role,
        };
    });

    return (
        <section className="min-w-0">
            <CardHeader
                title="Recent Users"
                subtitle="Recently registered accounts"
            />

            <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#071522]/30">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-left">
                        <thead className="border-b border-white/10 bg-white/[0.025]">
                            <tr className="text-xs uppercase tracking-wider text-white/45">
                                <th className="px-5 py-3 font-medium">ID</th>
                                <th className="px-5 py-3 font-medium">User</th>
                                <th className="px-5 py-3 font-medium">Role</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/[0.07]">
                            {formattedUsers.length > 0 ? (
                                formattedUsers.map((user, index) => {
                                    const name =
                                        user.name ||
                                        user.full_name ||
                                        "Unnamed User";

                                    const status = String(
                                        user.status || "Active"
                                    );

                                    const isActive =
                                        status.toLowerCase() === "active";

                                    const role = user.normalizedRole;

                                    return (
                                        <tr
                                            key={`${role}-${user.id ?? index}`}
                                            className="transition-colors hover:bg-white/[0.035]"
                                        >
                                            <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-[#A9E5D2]">
                                                {user.displayId}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-sm font-semibold text-[#A9E5D2]">
                                                        {String(name)
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-white">
                                                            {name}
                                                        </p>

                                                        <p className="mt-1 truncate text-xs text-white/45">
                                                            {user.email ||
                                                                user.username ||
                                                                "No email"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                                                        role === "faculty"
                                                            ? "border-blue-300/20 bg-blue-400/10 text-blue-200"
                                                            : role === "student"
                                                              ? "border-[#A9E5D2]/20 bg-[#A9E5D2]/10 text-[#A9E5D2]"
                                                              : "border-white/10 bg-white/[0.05] text-white/65"
                                                    }`}
                                                >
                                                    {user.displayRole}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-5 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${
                                                        isActive
                                                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                                                            : "border-white/10 bg-white/[0.05] text-white/55"
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${
                                                            isActive
                                                                ? "bg-emerald-400"
                                                                : "bg-white/40"
                                                        }`}
                                                    />
                                                    {status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-5 py-10 text-center text-sm text-white/45"
                                    >
                                        No recent users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
