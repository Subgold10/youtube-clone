import { useState, useEffect } from 'react'
import { Edit2, Trash2 } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const CommentSection = ({ videoId }) => {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
  }, [videoId])

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/comments/video/${videoId}`)
      setComments(response.data)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please sign in to comment')
      return
    }

    if (!newComment.trim()) return

    try {
      const response = await axios.post('http://localhost:5000/api/comments', {
        videoId,
        text: newComment.trim()
      })
      
      setComments(prev => [response.data, ...prev])
      setNewComment('')
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return

    try {
      const response = await axios.put(`http://localhost:5000/api/comments/${commentId}`, {
        text: editText.trim()
      })
      
      setComments(prev => prev.map(comment => 
        comment._id === commentId ? response.data : comment
      ))
      
      setEditingComment(null)
      setEditText('')
      toast.success('Comment updated!')
    } catch (error) {
      toast.error('Failed to update comment')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return

    try {
      await axios.delete(`http://localhost:5000/api/comments/${commentId}`)
      setComments(prev => prev.filter(comment => comment._id !== commentId))
      toast.success('Comment deleted!')
    } catch (error) {
      toast.error('Failed to delete comment')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-6">{comments.length} Comments</h3>
      
      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleAddComment} className="mb-8">
          <div className="flex space-x-4">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a public comment..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setNewComment('')}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex space-x-4">
              <img
                src={comment.userId.avatar}
                alt={comment.userId.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-semibold text-sm">{comment.userId.username}</span>
                  <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                </div>
                
                {editingComment === comment._id ? (
                  <div>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows="2"
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleEditComment(comment._id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingComment(null)
                          setEditText('')
                        }}
                        className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 mb-2">{comment.text}</p>
                    {user && user.id === comment.userId._id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingComment(comment._id)
                            setEditText(comment.text)
                          }}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 text-sm transition-colors"
                        >
                          <Edit2 size={14} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-600 text-sm transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {comments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CommentSection