import { useState } from 'react';
import { Star, Smile, Frown, Meh, Heart, ThumbsUp, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { addHotelReview } from '../../../../services/HotelServices/reviewService';

export default function HotelReviewRequestForm({ bookingTransactionId}) {
  const [formData, setFormData] = useState({
    bookingTransactionId: bookingTransactionId || null,
    staffRate: 0,
    comfortRate: 0,
    facilitiesRate: 0,
    cleanlinessRate: 0,
    valueForMoneyRate: 0,
    locationRate: 0,
    comment: ''
  });

  const [hoveredRatings, setHoveredRatings] = useState({
    staffRate: 0,
    comfortRate: 0,
    facilitiesRate: 0,
    cleanlinessRate: 0,
    valueForMoneyRate: 0,
    locationRate: 0
  });

  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emotions = [
    { icon: Heart, label: 'Loved It', color: 'text-red-500', bgColor: 'bg-red-50' },
    { icon: Sparkles, label: 'Amazing', color: 'text-purple-500', bgColor: 'bg-purple-50' },
    { icon: Smile, label: 'Great Stay', color: 'text-green-500', bgColor: 'bg-green-50' },
    { icon: ThumbsUp, label: 'Good', color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { icon: Meh, label: 'Average', color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
    { icon: Frown, label: 'Disappointing', color: 'text-orange-500', bgColor: 'bg-orange-50' }
  ];

  const ratingCategories = [
    { key: 'staffRate', label: 'Staff Service', icon: '👥'},
    { key: 'comfortRate', label: 'Comfort', icon: '🛏️' },
    { key: 'facilitiesRate', label: 'Facilities', icon: '🏊' },
    { key: 'cleanlinessRate', label: 'Cleanliness', icon: '✨' },
    { key: 'valueForMoneyRate', label: 'Value for Money', icon: '💰'},
    { key: 'locationRate', label: 'Location', icon: '📍' }
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
    if (!formData.bookingTransactionId) {
      toast.error('Booking Transaction ID is required');
      return;
    }
    
    // Check if all ratings are provided
    const allRated = ratingCategories.every(cat => formData[cat.key] > 0);
    if (!allRated) {
      toast.error('Please rate all categories');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the review data to match the backend format
      const reviewData = {
        bookingTransactionId: parseInt(formData.bookingTransactionId),
        staffRate: formData.staffRate,
        comfortRate: formData.comfortRate,
        facilitiesRate: formData.facilitiesRate,
        cleanlinessRate: formData.cleanlinessRate,
        valueForMoneyRate: formData.valueForMoneyRate,
        locationRate: formData.locationRate,
        comment: formData.comment || ''
      };

      console.log('Submitting hotel review:', reviewData);
      
      // Call the API
      const response = await addHotelReview(reviewData);
      
      console.log(response);

      // Reset form
      setFormData({
        bookingTransactionId: bookingTransactionId || null,
        staffRate: 0,
        comfortRate: 0,
        facilitiesRate: 0,
        cleanlinessRate: 0,
        valueForMoneyRate: 0,
        locationRate: 0,
        comment: ''
      });
      setSelectedEmotion(null);

    } catch (error) {
      console.error('Error submitting hotel review:', error);
      // Error is already handled by the service with toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ category, label, icon, description }) => {
    const currentRating = formData[category];
    const hoveredRating = hoveredRatings[category];

    return (
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span className="text-2xl">{icon}</span>
          <div className="flex flex-col">
            <span>{label}</span>
            <span className="text-xs text-gray-500 font-normal">{description}</span>
          </div>
        </label>
        <div className="flex gap-1 items-center">
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
                className={`w-7 h-7 ${
                  rating <= (hoveredRating || currentRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                } transition-colors`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {currentRating > 0 ? `${currentRating}/5` : 'Not rated'}
          </span>
        </div>
      </div>
    );
  };

  // Calculate average rating
  const calculateAverage = () => {
    const ratings = [
      formData.staffRate,
      formData.comfortRate,
      formData.facilitiesRate,
      formData.cleanlinessRate,
      formData.valueForMoneyRate,
      formData.locationRate
    ].filter(r => r > 0);
    
    if (ratings.length === 0) return 0;
    return (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  };

  const averageRating = calculateAverage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-3">🏨</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Hotel Review</h1>
            <p className="text-gray-600">Share your stay experience with us</p>
            
            {/* Average Rating Display */}
            {averageRating > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 px-6 py-3 rounded-full border border-amber-200">
                <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                <span className="text-2xl font-bold text-amber-600">{averageRating}</span>
                <span className="text-sm text-gray-600">Overall Rating</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Transaction ID */}
            {!bookingTransactionId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Transaction ID
                </label>
                <input
                  type="number"
                  value={formData.bookingTransactionId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, bookingTransactionId: e.target.value }))}
                  placeholder="Enter your booking transaction ID"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition"
                  required
                  disabled={isSubmitting}
                />
              </div>
            )}

            {/* Display Booking ID if provided as prop */}
            {bookingTransactionId && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Booking Transaction ID:</span> {bookingTransactionId}
                </p>
              </div>
            )}

            {/* Ratings - Split into two columns */}
            <div className="bg-gradient-to-br from-gray-50 to-amber-50 p-6 rounded-xl">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Rate Your Experience</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {ratingCategories.map((category) => (
                  <StarRating
                    key={category.key}
                    category={category.key}
                    label={category.label}
                    icon={category.icon}
                  />
                ))}
              </div>
            </div>

            {/* Emotion Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you describe your stay?
              </label>
              <div className="flex gap-2 flex-wrap">
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
                Tell us more about your stay
              </label>
              <div className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                selectedEmotion 
                  ? `border-current ${selectedEmotion.color.replace('text-', 'border-')} ${selectedEmotion.bgColor}` 
                  : 'border-gray-300 bg-white'
              }`}>
                {selectedEmotion && (
                  <div className={`absolute top-3 right-3 ${selectedEmotion.color} opacity-15`}>
                    {(() => {
                      const Icon = selectedEmotion.icon;
                      return <Icon className="w-20 h-20" />;
                    })()}
                  </div>
                )}
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share details about your experience... What did you love? What could be better?"
                  rows="6"
                  className="w-full px-4 py-3 bg-transparent outline-none resize-none relative z-10 placeholder-gray-400"
                  disabled={isSubmitting}
                  style={{
                    fontFamily: selectedEmotion ? "'Quicksand', sans-serif" : 'inherit',
                    fontSize: selectedEmotion ? '16px' : '14px',
                    lineHeight: '1.6'
                  }}
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">
                  💡 Select an emotion above to style your comment
                </p>
                <p className="text-xs text-gray-400">
                  {formData.comment.length} characters
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Review...
                </span>
              ) : (
                'Submit Hotel Review'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}