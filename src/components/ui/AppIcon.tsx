import Image from "next/image";

const icons = {
  userRound: { src: "/figma-tasks/user-round.svg", size: 16 },
  search: { src: "/figma-tasks/search.svg", size: 19 },
  clock: { src: "/figma-tasks/clock-3.svg", size: 13 },
  todo: { src: "/figma-tasks/circle.svg", size: 15 },
  inProgress: { src: "/figma-tasks/circle-dashed.svg", size: 16 },
  done: { src: "/figma-tasks/circle-check.svg", size: 16 },
  chevronUp: { src: "/figma-tasks/chevron-up.svg", size: 14 },
  chevronDown: { src: "/figma-tasks/chevron-down.svg", size: 14 },
  edit: { src: "/figma-tasks/pencil.svg", size: 16 },
  delete: { src: "/figma-tasks/trash-2.svg", size: 16 },
  check: { src: "/figma-tasks/check.svg", size: 16 },
  selected: { src: "/figma-tasks/circle-dot.svg", size: 16 },
  close: { src: "/figma-tasks/x.svg", size: 20 },
  warning: { src: "/figma-tasks/triangle-alert.svg", size: 26 },
  alert: { src: "/figma-auth/circle-alert.svg", size: 19 },
  document: { src: "/figma-tasks/file-text.svg", size: 19 },
  empty: { src: "/figma-tasks/clipboard-list.svg", size: 36 },
  retry: { src: "/figma-tasks/rotate-cw.svg", size: 18 },
  unavailable: { src: "/figma-tasks/cloud-off.svg", size: 32 },
} as const;

export type AppIconName = keyof typeof icons;

export function AppIcon({ name, className = "" }: { name: AppIconName; className?: string }) {
  const icon = icons[name];

  return (
    <Image
      src={icon.src}
      alt=""
      aria-hidden="true"
      width={icon.size}
      height={icon.size}
      className={`shrink-0 ${className}`}
    />
  );
}
