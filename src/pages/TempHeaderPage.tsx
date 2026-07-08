import { useState } from "react";
import { TopAppBar } from "../features/header";

function TempHeaderPage() {
    const [searchValue, setSearchValue] = useState("");

    return (<div>
        <TopAppBar
            onSearch = {setSearchValue}
            onSettingsClick = {() => console.log("설정 클릭")}
        />
        <p>확정된 검색어: {searchValue}</p>
    </div>)
}

export { TempHeaderPage };