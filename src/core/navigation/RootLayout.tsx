import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopAppBar, SideBar } from '@/features/header'

function RootLayout() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <SideBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <TopAppBar onSearch={setSearchValue} onSettingsClick={() => console.log('설정 클릭')} />
        <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, scrollbarGutter: 'stable' }}>
          <Outlet context={{ searchValue }} />
        </div>
      </div>
    </div>
  )
}

export default RootLayout
