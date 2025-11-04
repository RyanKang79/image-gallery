import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import ImageUpload from './components/ImageUpload'
import ImageGallery from './components/ImageGallery'
import './App.css'

function App() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUploaded = () => {
    fetchImages()
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Image Donation Platform</h1>
        <p>Share your images and receive support from visitors</p>
      </header>

      <main className="main">
        <ImageUpload onImageUploaded={handleImageUploaded} />

        {loading ? (
          <div className="loading">Loading images...</div>
        ) : (
          <ImageGallery images={images} onDonationComplete={fetchImages} />
        )}
      </main>
    </div>
  )
}

export default App
