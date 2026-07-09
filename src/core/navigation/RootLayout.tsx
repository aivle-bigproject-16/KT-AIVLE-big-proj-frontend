import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/features/header'

function RootLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  )
}

export default RootLayout
