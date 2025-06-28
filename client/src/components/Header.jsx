import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, User, Plus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Header = ({ onMenuClick }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-16">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">YT</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">YouTube</span>
          </Link>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl mx-4">
          <form onSubmit={handleSearch} className="flex">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-l-full focus:border-blue-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors"
            >
              <Search size={20} />
            </button>
          </form>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <Link
                to="/create"
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Create Video"
              >
                <Plus size={20} />
              </Link>
              
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="hidden md:block font-medium">{user.username}</span>
                </button>
                
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-2">
                    <Link
                      to="/channel"
                      className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      Your Channel
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
            >
              <User size={18} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header