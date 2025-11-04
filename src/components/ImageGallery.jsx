import { useState } from 'react'
import ImageCard from './ImageCard'
import DonationModal from './DonationModal'
import './ImageGallery.css'

function ImageGallery({ images, onDonationComplete }) {
  const [selectedImage, setSelectedImage] = useState(null)

  const handleDonateClick = (image) => {
    setSelectedImage(image)
  }

  const handleCloseModal = () => {
    setSelectedImage(null)
  }

  const handleDonationSuccess = () => {
    onDonationComplete()
    setSelectedImage(null)
  }

  if (images.length === 0) {
    return (
      <div className="empty-state">
        <p>No images yet. Be the first to upload!</p>
      </div>
    )
  }

  return (
    <div className="gallery-container">
      <h2>Gallery</h2>
      <div className="gallery-grid">
        {images.map((image) => (
          <ImageCard
            key={image.id}
            image={image}
            onDonateClick={handleDonateClick}
          />
        ))}
      </div>

      {selectedImage && (
        <DonationModal
          image={selectedImage}
          onClose={handleCloseModal}
          onSuccess={handleDonationSuccess}
        />
      )}
    </div>
  )
}

export default ImageGallery
