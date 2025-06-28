import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const FilterButtons = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const navigate = useNavigate()
  const location = useLocation()

  const filters = [
    'All',
    'Technology',
    'Education',
    'Entertainment',
    'Music',
    'Gaming',
    'Sports',
    'News'
  ]

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get('category')
    setActiveFilter(category || 'All')
  }, [location.search])

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    const params = new URLSearchParams(location.search)
    
    if (filter === 'All') {
      params.delete('category')
    } else {
      params.set('category', filter)
    }
    
    const newSearch = params.toString()
    navigate(`/${newSearch ? `?${newSearch}` : ''}`)
  }

  return (
    <div className="flex space-x-3 overflow-x-auto pb-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterClick(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default FilterButtons