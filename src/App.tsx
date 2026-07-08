import { RouterProvider } from 'react-router-dom'
import { routerMock } from '@/core/navigation/router.mock'

function App() {
  return <RouterProvider router={routerMock} />
}

export default App
