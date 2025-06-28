import { Link } from 'react-router-dom'

const VideoCard = ({ video }) => {
  const formatViews = (views) => {
    if (views >= 1000000) {
      return Math.floor(views / 1000000) + 'M'
    } else if (views >= 1000) {
      return Math.floor(views / 1000) + 'K'
    }
    return views.toString()
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 fade-in">
      <Link to={`/watch/${video._id}`}>
        <div className="relative">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            10:24
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/watch/${video._id}`}>
          <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors mb-2">
            {video.title}
          </h3>
        </Link>
        
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={`https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=40`}
            alt={video.channelId.channelName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
            {video.channelId.channelName}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>{formatViews(video.views)} views</span>
          <span>•</span>
          <span>{formatDate(video.createdAt)}</span>
        </div>
        
        <div className="mt-2">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {video.category}
          </span>
        </div>
      </div>
    </div>
  )
}

export default VideoCard