import "./TopAppBar.css";
import { BellIcon, SettingsIcon, UserIcon } from "./Icons";
import { SearchBar } from "./SearchBar"

type TopAppBarProps = {
  onSearch: (value: string) => void;
  onSettingsClick: () => void;
};

function TopAppBar({ onSearch, onSettingsClick }: TopAppBarProps) {
  return (
    <header className="top-app-bar">
      <SearchBar placeholder="검색어를 입력해주세요 (날짜, ID 등)" onSearch={onSearch} />

      <div className="top-app-bar__actions">
        <button
          type="button"
          className="top-app-bar__icon-button"
          aria-label="알림"
          onClick = {onSettingsClick}
        >
          <BellIcon />
        </button>
        <button
          type="button"
          className="top-app-bar__icon-button"
          aria-label="설정"
          onClick = {onSettingsClick}
        >
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
