import "./SideBar.css";
import { DashboardIcon, ChecklistIcon, ReportIcon } from "./Icons";
import tempLogo from "./TempLogo.svg";

function SideBar() {
  return (
    <nav className="side-bar">
        <div className="side-bar__logo">
            <img src={tempLogo} alt="로고" width={200} />
        </div>

        <ul className="side-bar__nav">
            <li className="side-bar__nav-item side-bar__nav-item--active">
                <span className="side-bar__nav-item-icon">
                    <DashboardIcon />
                </span>
                대시보드
            </li>
            <li className="side-bar__nav-item">
                <span className="side-bar__nav-item-icon">
                    <ChecklistIcon />
                </span>
                배터리 목록
            </li>
            <li className="side-bar__nav-item">
                <span className="side-bar__nav-item-icon">
                    <ReportIcon />
                </span>
                리포트 목록
            </li>
        </ul>
    </nav>
  );
}

export { SideBar };
