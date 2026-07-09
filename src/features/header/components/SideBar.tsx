import "./SideBar.css";
import { DashboardIcon, ChecklistIcon, ReportIcon } from "./Icons";
import tempLogo from "./TempLogo.svg";
import { SideBarTab } from "./SideBarTab";

function SideBar() {
  return (
    <nav className="side-bar">
        <div className="side-bar__logo">
            <img src={tempLogo} alt="로고" width={200} />
        </div>

        <ul className="side-bar__nav">
            <SideBarTab icon={<DashboardIcon />} label="대시보드" active />
            <SideBarTab icon={<ChecklistIcon />} label="배터리 목록" />
            <SideBarTab icon={<ReportIcon />} label="리포트 목록" />
        </ul>
    </nav>
  );
}

export { SideBar };
