import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type SideBarTabProps = {
    icon: ReactNode;
    label: string;
    to: string;
    active?: boolean;
};

function SideBarTab({ icon, label, to }: SideBarTabProps) {
    return (
        <li>
          <NavLink to={to}
          className={({ isActive }) => isActive ? 'side-bar__nav-item side-bar__nav-item--active' : 'side-bar__nav-item'}>
            <span className="side-bar__nav-item-icon">{icon}</span>
            {label}
          </NavLink>
        </li>
    );
}

export { SideBarTab };
