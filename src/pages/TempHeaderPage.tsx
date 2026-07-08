import { useState } from "react";
import { TopAppBar, SideBar } from "../features/header";

function TempHeaderPage() {
    const [searchValue, setSearchValue] = useState("");

    return (<div style={{ display: "flex", height: "100vh" }}>
        <SideBar />
        <div style={{ flex: 1 }}>
            <TopAppBar
                onSearch = {setSearchValue}
                onSettingsClick = {() => console.log("설정 클릭")}
            />
            <p>검색어 입력 확인(돋보기 버튼으로 입력완료): {searchValue}</p>
        </div>
    </div>)
}

export { TempHeaderPage };