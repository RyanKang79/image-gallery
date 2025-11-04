import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './DonationModal.css'

function DonationModal({ image, onClose, onSuccess }) {
  const [donating, setDonating] = useState(false)
  const [formData, setFormData] = useState({
    donorName: '',
    amount: '',
    message: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.donorName || !formData.amount || Number(formData.amount) <= 0) {
      alert('Please enter your name and a valid donation amount')
      return
    }

    setDonating(true)

    try {
      const { error: donationError } = await supabase
        .from('donations')
        .insert([
          {
            image_id: image.id,
            donor_name: formData.donorName,
            amount: Number(formData.amount),
            message: formData.message
          }
        ])

      if (donationError) throw donationError

      const newTotal = Number(image.total_donations) + Number(formData.amount)
      const newCount = image.donation_count + 1

      const { error: updateError } = await supabase
        .from('images')
        .update({
          total_donations: newTotal,
          donation_count: newCount
        })
        .eq('id', image.id)

      if (updateError) throw updateError

      alert('Thank you for your support!')
      onSuccess()
    } catch (error) {
      console.error('Error processing donation:', error)
      alert('Failed to process donation')
    } finally {
      setDonating(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>Support {image.title}</h2>
        <p className="modal-subtitle">by {image.uploader_name}</p>

        <form onSubmit={handleSubmit} className="donation-form">
          <div className="form-group">
            <label htmlFor="donorName">Your Name *</label>
            <input
              type="text"
              id="donorName"
              value={formData.donorName}
              onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount ($) *</label>
            <input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message (optional)</label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="3"
              placeholder="Leave a message for the creator..."
            />
          </div>

          <button type="submit" disabled={donating} className="submit-btn">
            {donating ? 'Processing...' : 'Send Donation'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default DonationModal
