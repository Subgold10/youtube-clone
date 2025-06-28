import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import VideoPlayer from './pages/VideoPlayer'
import Auth from './pages/Auth'
import Channel from './pages/Channel'
import CreateVideo from './pages/CreateVideo'
import { useAuth } from './context/AuthContext'
import { useState } from 'react'

function App() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} pt-16`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/watch/:id" element={<VideoPlayer />} />
            <Route path="/auth" element={<Auth />} />
            {user && (
              <>
                <Route path="/channel" element={<Channel />} />
                <Route path="/create" element={<CreateVideo />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App