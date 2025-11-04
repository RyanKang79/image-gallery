import './ImageCard.css'

function ImageCard({ image, onDonateClick }) {
  return (
    <div className="image-card">
      <div className="image-wrapper">
        <img src={image.image_url} alt={image.title} />
      </div>

      <div className="image-info">
        <h3>{image.title}</h3>
        {image.description && <p className="description">{image.description}</p>}
        <p className="uploader">by {image.uploader_name}</p>

        <div className="stats">
          <div className="stat">
            <span className="stat-value">${Number(image.total_donations).toFixed(2)}</span>
            <span className="stat-label">Total Donations</span>
          </div>
          <div className="stat">
            <span className="stat-value">{image.donation_count}</span>
            <span className="stat-label">Supporters</span>
          </div>
        </div>

        <button
          className="donate-btn"
          onClick={() => onDonateClick(image)}
        >
          Support This Image
        </button>
      </div>
    </div>
  )
}

export default ImageCard
