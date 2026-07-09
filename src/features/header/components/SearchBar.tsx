import { SearchIcon } from "./Icons";
import { useState } from "react";

type SearchBarProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
};

function SearchBar ({ placeholder, onSearch }: SearchBarProps) {
    const [inputValue, setInputValue] = useState("");

    const handleSearch = () => {onSearch(inputValue);};

    return (
        <div className="top-app-bar__search">
            <input
                className="top-app-bar__search-input"
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="button" onClick={handleSearch} aria-label="검색">
                <SearchIcon />
            </button>
        </div>
    );
}

export { SearchBar };