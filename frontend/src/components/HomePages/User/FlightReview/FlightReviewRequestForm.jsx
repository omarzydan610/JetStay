import { useState } from 'react';
import { Star, Smile, Frown, Meh, Heart, ThumbsUp } from 'lucide-react';
import { addAirlineReview } from '../../../../services/Airline/reviewService';
import { toast } from 'react-toastify';

export default function FlightReviewRequestForm({ ticketId}) {
  const [formData, setFormData] = useState({
    ticketId: ticketId || null,
    onTimeRate: 0,
    comfortRate: 0,
    staffRate: 0,
    amenitiesRate: 0,
    comment: ''
  });

  const [hoveredRatings, setHoveredRatings] = useState({
    onTimeRate: 0,
    comfortRate: 0,
    staffRate: 0,
    amenitiesRate: 0
  });

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emotions = [
    { icon: Smile, label: 'Happy', color: 'text-green-500', bgColor: 'bg-green-50' },
    { icon: Heart, label: 'Love', color: 'text-red-500', bgColor: 'bg-red-50' },
    { icon: ThumbsUp, label: 'Great', color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { icon: Meh, label: 'Okay', color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { icon: Frown, label: 'Disappointed', color: 'text-orange-500', bgColor: 'bg-orange-50' }
  ];

  const ratingCategories = [
    { key: 'onTimeRate', label: 'On-Time Performance', icon: '⏰' },
    { key: 'comfortRate', label: 'Comfort', icon: '💺' },
    { key: 'staffRate', label: 'Staff Service', icon: '👨‍✈️' },
    { key: 'amenitiesRate', label: 'Amenities', icon: '🎧' }
  ];

  const handleRatingClick = (category, rating) => {
    setFormData(prev => ({ ...prev, [category]: rating }));
  };

  const handleRatingHover = (category, rating) => {
    setHoveredRatings(prev => ({ ...prev, [category]: rating }));
  };

  const handleRatingLeave = (category) => {
    setHoveredRatings(prev => ({ ...prev, [category]: 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.ticketId) {
      toast.error('Ticket ID is required');
      return;
    }
    
    if (formData.onTimeRate === 0 || formData.comfortRate === 0 || 
        formData.staffRate === 0 || formData.amenitiesRate === 0) {
      toast.error('Please rate all categories');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the review data to match the backend format
      const reviewData = {
        ticketId: parseInt(formData.ticketId),
        onTimeRate: formData.onTimeRate,
        comfortRate: formData.comfortRate,
        staffRate: formData.staffRate,
        amenitiesRate: formData.amenitiesRate,
        comment: formData.comment || ''
      };

      console.log('Submitting review:', reviewData);
      
      // Call the API
      const response = await addAirlineReview(reviewData);
      
      console.log(response);

      // Reset form
      setFormData({
        ticketId: ticketId || null,
        onTimeRate: 0,
        comfortRate: 0,
        staffRate: 0,
        amenitiesRate: 0,
        comment: ''
      });
      setSelectedEmotion(null);

    } catch (error) {
      console.error('Error submitting review:', error);
      // Error is already handled by the service with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ category, label, icon }) => {
    const currentRating = formData[category];
    const hoveredRating = hoveredRatings[category];

    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span className="text-2xl">{icon}</span>
          {label}
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => handleRatingClick(category, rating)}
              onMouseEnter={() => handleRatingHover(category, rating)}
              onMouseLeave={() => handleRatingLeave(category)}
              className="transition-transform hover:scale-110 focus:outline-none"
              disabled={isSubmitting}
            >
              <Star
                className={`w-8 h-8 ${
                  rating <= (hoveredRating || currentRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600 self-center">
            {currentRating > 0 ? `${currentRating}/5` : 'Not rated'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">✈️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Airline Review</h1>
            <p className="text-gray-600">Share your flight experience with us</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ticket ID - Show only if not provided as prop */}
            {!ticketId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ticket ID
                </label>
                <input
                  type="number"
                  value={formData.ticketId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticketId: e.target.value }))}
                  placeholder="Enter your ticket ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Display Ticket ID if provided as prop */}
            {ticketId && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Ticket ID:</span> {ticketId}
                </p>
              </div>
            )}

            {/* Ratings */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Rate Your Experience</h2>
              {ratingCategories.map((category) => (
                <StarRating
                  key={category.key}
                  category={category.key}
                  label={category.label}
                  icon={category.icon}
                />
              ))}
            </div>

            {/* Emotion Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How did you feel about your flight?
              </label>
              <div className="flex gap-3 flex-wrap">
                {emotions.map((emotion) => {
                  const Icon = emotion.icon;
                  const isSelected = selectedEmotion?.label === emotion.label;
                  return (
                    <button
                      key={emotion.label}
                      type="button"
                      onClick={() => setSelectedEmotion(emotion)}
                      disabled={isSubmitting}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? `${emotion.bgColor} border-current ${emotion.color} shadow-md scale-105`
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? emotion.color : 'text-gray-400'}`} />
                      <span className={`text-sm font-medium ${isSelected ? emotion.color : 'text-gray-600'}`}>
                        {emotion.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Comments
              </label>
              <div className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                selectedEmotion 
                  ? `border-current ${selectedEmotion.color.replace('text-', 'border-')} ${selectedEmotion.bgColor}` 
                  : 'border-gray-300 bg-white'
              }`}>
                {selectedEmotion && (
                  <div className={`absolute top-3 right-3 ${selectedEmotion.color} opacity-20`}>
                    {(() => {
                      const Icon = selectedEmotion.icon;
                      return <Icon className="w-16 h-16" />;
                    })()}
                  </div>
                )}
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Tell us more about your experience... What went well? What could be improved?"
                  rows="6"
                  className="w-full px-4 py-3 bg-transparent outline-none resize-none relative z-10 placeholder-gray-400"
                  disabled={isSubmitting}
                  style={{
                    fontFamily: selectedEmotion ? "'Quicksand', sans-serif" : 'inherit',
                    fontSize: selectedEmotion ? '16px' : '14px'
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Select an emotion above to style your comment
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}