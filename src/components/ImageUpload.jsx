import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './ImageUpload.css'

function ImageUpload({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    uploaderName: '',
    imageUrl: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.uploaderName || !formData.imageUrl) {
      alert('Please fill in all required fields')
      return
    }

    setUploading(true)

    try {
      const { error } = await supabase
        .from('images')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            uploader_name: formData.uploaderName,
            image_url: formData.imageUrl
          }
        ])

      if (error) throw error

      setFormData({
        title: '',
        description: '',
        uploaderName: '',
        imageUrl: ''
      })

      onImageUploaded()
      alert('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="upload-container">
      <h2>Upload Your Image</h2>
      <form onSubmit={handleSubmit} className="upload-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="uploaderName">Your Name *</label>
          <input
            type="text"
            id="uploaderName"
            value={formData.uploaderName}
            onChange={(e) => setFormData({ ...formData, uploaderName: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imageUrl">Image URL *</label>
          <input
            type="url"
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <button type="submit" disabled={uploading} className="submit-btn">
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </form>
    </div>
  )
}

export default ImageUpload
