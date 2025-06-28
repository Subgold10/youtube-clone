import { Link } from 'react-router-dom'
import { Home, Trending, Music, Gaming, Film, Trophy, X } from 'lucide-react'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Trending, label: 'Trending', path: '/?category=Entertainment' },
    { icon: Music, label: 'Music', path: '/?category=Music' },
    { icon: Gaming, label: 'Gaming', path: '/?category=Gaming' },
    { icon: Film, label: 'Movies', path: '/?category=Entertainment' },
    { icon: Trophy, label: 'Sports', path: '/?category=Sports' },
  ]

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-4">
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
          
          <nav className="mt-8 lg:mt-0">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className="flex items-center space-x-4 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-500 mb-4 px-4">CATEGORIES</h3>
            <ul className="space-y-2">
              {['Technology', 'Education', 'News'].map((category) => (
                <li key={category}>
                  <Link
                    to={`/?category=${category}`}
                    onClick={onClose}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar