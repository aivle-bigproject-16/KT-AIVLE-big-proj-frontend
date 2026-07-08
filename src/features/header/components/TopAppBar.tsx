import "./TopAppBar.css";
import { SearchIcon, BellIcon, SettingsIcon, UserIcon } from "./Icons";

function TopAppBar() {
  return (
    <header className="top-app-bar">
      <div className="top-app-bar__search">
        <SearchIcon />
        <input
          className="top-app-bar__search-input"
          type="text"
          placeholder="검색어를 입력해주세요 (날짜, ID 등)"
        />
      </div>

      <div className="top-app-bar__actions">
        <button type="button" className="top-app-bar__icon-button" aria-label="알림">
          <BellIcon />
        </button>
        <button type="button" className="top-app-bar__icon-button" aria-label="설정">
          <SettingsIcon />
        </button>

        <div className="top-app-bar__divider" />

        <div className="top-app-bar__profile">
          <div className="top-app-bar__avatar">
            <UserIcon />
          </div>
          <span className="top-app-bar__profile-name">홍길동</span>
        </div>
      </div>
    </header>
  );
}

export { TopAppBar };
