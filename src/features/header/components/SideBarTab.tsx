import type { ReactNode } from "react";

type SideBarTabProps = {
    icon: ReactNode;
    label: string;
    active?: boolean;
};

function SideBarTab({ icon, label, active }: SideBarTabProps) {
    const className = active
        ? "side-bar__nav-item side-bar__nav-item--active"
        : "side-bar__nav-item";

    return (
        <li className={className}>
        <span className="side-bar__nav-item-icon">{icon}</span>
        {label}
        </li>
    );
}

export { SideBarTab };
