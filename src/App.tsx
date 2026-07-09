import { RouterProvider } from 'react-router-dom'
import { router } from '@/core/navigation'

function App() {
  return <RouterProvider router={router} />
}

export default App
