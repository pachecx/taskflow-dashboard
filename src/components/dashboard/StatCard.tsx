import { CircleCheck, Clock3, FolderKanban, UsersRound } from "lucide-react";
import type { DashboardData } from "../../types";

const iconMap = { FolderKanban, CircleCheck, Clock3, UsersRound };

export function StatCard({ stat }: { stat: DashboardData["stats"][number] }) {
  const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? FolderKanban;
  return (
    <article className="flex min-h-37 flex-col items-start rounded-lg border border-(--line) bg-(--surface) px-4.5 pt-4.25 pb-3.75 max-[1150px]:px-3.5 max-[900px]:min-h-33.75 max-[650px]:min-h-32.25 max-[650px]:p-3.25 max-[380px]:p-2.75">
      <div
        className={`mb-3 grid h-8.25 w-8.25 place-items-center rounded-[7px] max-[650px]:mb-2 max-[650px]:h-7.25 max-[650px]:w-7.25 [&>svg]:max-[650px]:w-4.25 ${stat.color === "green" ? "bg-[#edf5ed] text-[#43825e] dark:bg-[#2b4132] dark:text-[#9ad0a8]" : stat.color === "blue" ? "bg-[#edf3f7] text-[#537d9a] dark:bg-[#2c3d47] dark:text-[#a2c1d7]" : stat.color === "orange" ? "bg-[#fbf1e8] text-[#b7794a] dark:bg-[#493a2e] dark:text-[#deb28c]" : "bg-[#f1eff7] text-[#796e9a] dark:bg-[#3b354b] dark:text-[#c2b3e0]"}`}
      >
        <Icon size={19} />
      </div>
      <span className="text-[10px] text-(--muted) max-[650px]:text-[9px]">
        {stat.label}
      </span>
      <strong className="mt-0.75 font-['Manrope',sans-serif] text-2xl leading-[1.4] font-bold text-(--text) max-[650px]:text-[21px]">
        {stat.value}
      </strong>
      <span className="mt-auto pt-1.5 text-[9px] text-(--muted) max-[650px]:text-[8px] max-[380px]:max-w-30">
        <span className="text-xs font-bold text-[#438b60]">↗</span> {stat.delta}
      </span>
    </article>
  );
}
