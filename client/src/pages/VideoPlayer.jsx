import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ThumbsUp, ThumbsDown, Share, Save } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import CommentSection from '../components/CommentSection'

const VideoPlayer = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchVideo()
    }
  }, [id])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:5000/api/videos/${id}`)
      setVideo(response.data)
      setError('')
    } catch (err) {
      setError('Failed to load video')
      console.error('Error fetching video:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like videos')
      return
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/videos/${id}/like`)
      setVideo(prev => ({
        ...prev,
        likes: response.data.likes,
        dislikes: response.data.dislikes
      }))
      toast.success('Video liked!')
    } catch (error) {
      toast.error('Failed to like video')
    }
  }

  const handleDislike = async () => {
    if (!user) {
      toast.error('Please sign in to dislike videos')
      return
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/videos/${id}/dislike`)
      setVideo(prev => ({
        ...prev,
        likes: response.data.likes,
        dislikes: response.data.dislikes
      }))
      toast.success('Video disliked!')
    } catch (error) {
      toast.error('Failed to dislike video')
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="w-full h-96 bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
          <div className="flex space-x-4 mb-6">
            <div className="h-10 bg-gray-300 rounded w-20"></div>
            <div className="h-10 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error || 'Video not found'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden mb-4">
            <video
              controls
              className="w-full h-96 object-contain"
              poster={video.thumbnailUrl}
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="bg-white rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h1>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{formatDate(video.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <ThumbsUp size={18} />
                  <span>{video.likes}</span>
                </button>
                
                <button
                  onClick={handleDislike}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <ThumbsDown size={18} />
                  <span>{video.dislikes}</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <Share size={18} />
                  <span>Share</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Channel Info */}
            <div className="flex items-center space-x-4 mb-4">
              <img
                src="https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=60"
                alt={video.channelId.channelName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{video.channelId.channelName}</h3>
                <p className="text-sm text-gray-600">{video.channelId.subscribers} subscribers</p>
              </div>
              <button className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-wrap">{video.description}</p>
            </div>
          </div>

          {/* Comments Section */}
          <CommentSection videoId={video._id} />
        </div>

        {/* Sidebar - Related Videos */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Related Videos</h3>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex space-x-3">
                  <img
                    src={`https://images.pexels.com/photos/257897/pexels-photo-257897.jpeg?auto=compress&cs=tinysrgb&w=168&h=94`}
                    alt="Related video"
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-2 mb-1">
                      Sample Related Video Title {index + 1}
                    </h4>
                    <p className="text-xs text-gray-600">Channel Name</p>
                    <p className="text-xs text-gray-600">100K views • 2 days ago</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer