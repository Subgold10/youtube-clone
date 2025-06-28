import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const Channel = () => {
  const { user } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateChannel, setShowCreateChannel] = useState(false)
  const [channelData, setChannelData] = useState({
    channelName: '',
    description: ''
  })

  useEffect(() => {
    fetchChannel()
  }, [])

  const fetchChannel = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/channels/user/me')
      setChannel(response.data)
      setVideos(response.data.videos)
    } catch (error) {
      if (error.response?.status === 404) {
        setShowCreateChannel(true)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChannel = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/channels', channelData)
      setChannel(response.data)
      setShowCreateChannel(false)
      toast.success('Channel created successfully!')
    } catch (error) {
      toast.error('Failed to create channel')
    }
  }

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      await axios.delete(`http://localhost:5000/api/videos/${videoId}`)
      setVideos(prev => prev.filter(video => video._id !== videoId))
      toast.success('Video deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete video')
    }
  }

  const formatViews = (views) => {
    if (views >= 1000000) {
      return Math.floor(views / 1000000) + 'M'
    } else if (views >= 1000) {
      return Math.floor(views / 1000) + 'K'
    }
    return views.toString()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-40 bg-gray-300 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="bg-gray-300 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (showCreateChannel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Create Your Channel</h2>
          <form onSubmit={handleCreateChannel} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Channel Name
              </label>
              <input
                type="text"
                required
                value={channelData.channelName}
                onChange={(e) => setChannelData(prev => ({ ...prev, channelName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your channel name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={channelData.description}
                onChange={(e) => setChannelData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Describe your channel..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Create Channel
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Channel Header */}
      <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
        <div
          className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mb-6"
          style={{
            backgroundImage: `url(${channel.channelBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="flex items-center space-x-6">
          <img
            src={user.avatar}
            alt={channel.channelName}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{channel.channelName}</h1>
            <p className="text-gray-600 mt-1">{channel.subscribers} subscribers</p>
            {channel.description && (
              <p className="text-gray-700 mt-2">{channel.description}</p>
            )}
          </div>
          <Link
            to="/create"
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Create Video</span>
          </Link>
        </div>
      </div>

      {/* Videos Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Videos ({videos.length})</h2>
        
        {videos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">You haven't uploaded any videos yet</p>
            <Link
              to="/create"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              <span>Upload Your First Video</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="bg-gray-50 rounded-lg overflow-hidden">
                <Link to={`/watch/${video._id}`}>
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                
                <div className="p-4">
                  <Link to={`/watch/${video._id}`}>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-2">
                      {video.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <span>{formatViews(video.views)} views</span>
                    <span className="px-2 py-1 bg-gray-200 rounded-full text-xs">
                      {video.category}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video._id)}
                      className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Channel