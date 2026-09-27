import { CircleCheck, Clock3, FolderKanban, UsersRound } from "lucide-react";
import type { DashboardData } from "../../types";

const iconMap = { FolderKanban, CircleCheck, Clock3, UsersRound };

export function StatCard({ stat }: { stat: DashboardData["stats"][number] }) {
  const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? FolderKanban;
  return (
    <article className="stat-card">
      <div className={`stat-icon icon-${stat.color}`}>
        <Icon size={19} />
      </div>
      <span className="stat-label">{stat.label}</span>
      <strong className="stat-value">{stat.value}</strong>
      <span className="stat-delta">
        <span>↗</span> {stat.delta}
      </span>
    </article>
  );
}
