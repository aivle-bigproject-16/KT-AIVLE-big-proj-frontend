import "./SideBar.css";
import { DashboardIcon, ChecklistIcon, ReportIcon, BrandIcon, HelpIcon, SettingsIcon } from "./Icons";
import tempLogo from "./TempLogo.svg";
import { SideBarTab } from "./SideBarTab";
import { ROUTES } from "@/core/navigation/routes";

function SideBar() {
  return (
    <nav className="side-bar">
        <div className="side-bar__logo">
            <div className="side-bar__logo-icon">
                <BrandIcon />
            </div>
            <div className="side-bar__logo-text">
                <img src={tempLogo} alt="PrecisionScan 로고" width={140} />
                <span className="side-bar__logo-subtitle">배터리 정밀 진단 시스템</span>
            </div>
        </div>

        <ul className="side-bar__nav">
            <SideBarTab icon={<DashboardIcon />} label="대시보드" to={ROUTES.DASHBOARD}/>
            <SideBarTab icon={<ChecklistIcon />} label="배터리 목록" to={ROUTES.BATTERY}/>
            <SideBarTab icon={<ReportIcon />} label="리포트 목록" to={ROUTES.REPORT_DAILY}/>
        </ul>

        <ul className="side-bar__nav side-bar__nav--bottom">
            <SideBarTab icon={<HelpIcon />} label="고객 지원" to={ROUTES.HELP}/>
            <SideBarTab icon={<SettingsIcon />} label="설정" to={ROUTES.SETTINGS}/>
        </ul>
    </nav>
  );
}

export { SideBar };
