import {
  Bell,
  ChevronDown,
  GraduationCap,
  Layers3,
  Layers,
  LayoutDashboard,
  LayoutList,
  LogOut,
  Menu,
  MoreHorizontal,
  Search,
  Settings,
  UserCheck,
  UserCog,
  UserPen,
  UserPlus,
  UserRound,
  UsersRound,
  Eye,
  KeyRound,
  Pencil,
  Plus,
  Trash2,
  UserRoundX,
  UserX,
  Users,
  X,
  NotebookTabs,
  ClipboardList,
  FileClock,
  CalendarClock,
  Files,
  FolderCheck,
  ChartNoAxesColumn,
  FileCheck2,
  Calculator,
  ListTree,
  BookOpen,
  BookCopy,
  Scale,
  Landmark,
  NotebookPen,
  UserRoundPen,

} from "lucide-react";

const icons = {
  bell: Bell,
  "chevron-down": ChevronDown,
  "graduation-cap": GraduationCap,
  "layers-3": Layers3,
  "layout-dashboard": LayoutDashboard,
  "layout-list": LayoutList,
  "log-out": LogOut,
  menu: Menu,
  "more-horizontal": MoreHorizontal,
  search: Search,
  settings: Settings,
  "user-check": UserCheck,
  "user-cog": UserCog,
  "user-pen": UserPen,
  "user-plus": UserPlus,
  "user-round": UserRound,
  "users-round": UsersRound,
  eye: Eye,
  "key-round": KeyRound,
  pencil: Pencil,
  plus: Plus,
  "trash-2": Trash2,
  "user-round-x": UserRoundX,
  "user-x": UserX,
  x: X,
  "users": Users,
  "layers": Layers,
  "notebook-tabs": NotebookTabs,
  "clipboard-list": ClipboardList,
  "file-clock": FileClock,
  "calendar-clock": CalendarClock,
  "files": Files,
  "folder-check": FolderCheck,
  "chart-no-axes-column": ChartNoAxesColumn,
  "file-check-2":FileCheck2,
  "calculator":Calculator,
  "list-tree":ListTree,
  "book-open":BookOpen,
  "book-copy":BookCopy,
  "scale":Scale,
  "landmark":Landmark,
  "notebook-pen":NotebookPen,
  "user-round-pen": UserRoundPen,

};

export default function Icon({
  name,
  className = "",
  size,
  strokeWidth = 2,
}) {
  const LucideIcon = icons[name];

  if (!LucideIcon) return null;

  return (
    <LucideIcon
      className={className}
      {...(size !== undefined ? { size } : {})}
      strokeWidth={strokeWidth}
      aria-hidden="true"
    />
  );
}
