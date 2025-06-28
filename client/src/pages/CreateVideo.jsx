import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const CreateVideo = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnailUrl: '',
    category: 'Entertainment'
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const categories = [
    'Technology',
    'Education',
    'Entertainment',
    'Music',
    'Gaming',
    'Sports',
    'News'
  ]

  const sampleThumbnails = [
    'https://images.pexels.com/photos/257897/pexels-photo-257897.jpeg?auto=compress&cs=tinysrgb&w=640',
    'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=640',
    'https://images.pexels.com/photos/374631/pexels-photo-374631.jpeg?auto=compress&cs=tinysrgb&w=640',
    'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=640',
    'https://images.pexels.com/photos/443383/pexels-photo-443383.jpeg?auto=compress&cs=tinysrgb&w=640',
    'https://images.pexels.com/photos/261579/pexels-photo-261579.jpeg?auto=compress&cs=tinysrgb&w=640'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/videos', formData)
      toast.success('Video created successfully!')
      navigate(`/watch/${response.data._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create video')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const selectThumbnail = (url) => {
    setFormData(prev => ({ ...prev, thumbnailUrl: url }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Upload className="text-red-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Create New Video</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your video title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Describe your video..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Or Select from Sample Thumbnails
            </label>
            <div className="grid grid-cols-3 gap-3">
              {sampleThumbnails.map((url, index) => (
                <div
                  key={index}
                  onClick={() => selectThumbnail(url)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-colors ${
                    formData.thumbnailUrl === url
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {formData.thumbnailUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="max-w-xs">
                <img
                  src={formData.thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200"
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/channel')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.description}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateVideo