/**
 * Utility functions for handling offers and price calculations
 */

/**
 * Check if an offer is currently active based on multiple criteria
 * @param {Object} offer - Offer object
 * @returns {boolean} - True if offer is active
 */
export const isOfferActive = (offer) => {
  if (!offer) return false;
  
  // Check if offer is explicitly marked as inactive
  if (offer.isActive === false) return false;
  
  const now = new Date();
  
  // TEMPORARILY DISABLED FOR TESTING - Check start date
  // if (offer.startDate) {
  //   const start = new Date(offer.startDate);
  //   if (now < start) return false;
  // }
  
  // Check end date
  if (offer.endDate) {
    const end = new Date(offer.endDate);
    if (now > end) return false;
  }
  
  // Check usage limits
  if (offer.maxUsage && offer.currentUsage !== undefined) {
    if (offer.currentUsage >= offer.maxUsage) return false;
  }
  
  return true;
};

/**
 * Calculate discounted price based on original price and discount value
 * @param {number} originalPrice - Original price
 * @param {number|string} discountValue - Discount value (percentage)
 * @returns {number} - Discounted price
 */
export const calculateDiscountedPrice = (originalPrice, discountValue) => {
  if (!originalPrice || !discountValue) return originalPrice;
  
  const original = parseFloat(originalPrice);
  const discount = parseFloat(discountValue);
  
  if (isNaN(original) || isNaN(discount)) return originalPrice;
  
  return original * (1 - discount / 100);
};

/**
 * Get the best active offer from a list of offers
 * @param {Array} offers - Array of offer objects
 * @returns {Object|null} - Best active offer or null
 */
export const getBestActiveOffer = (offers) => {
  if (!offers || !Array.isArray(offers) || offers.length === 0) return null;

  const activeOffers = offers.filter(offer => isOfferActive(offer));

  if (activeOffers.length === 0) return null;

  // Return the offer with the highest discount percentage
  return activeOffers.reduce((best, current) => {
    const currentDiscount = parseFloat(current.discountValue) || 0;
    const bestDiscount = parseFloat(best.discountValue) || 0;
    return currentDiscount > bestDiscount ? current : best;
  });
};

/**
 * Format price display with original and discounted prices
 * @param {number|string} originalPrice - Original price
 * @param {number|string|null} discountedPrice - Discounted price (optional)
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {Object} - Object with display properties
 */
export const formatPriceDisplay = (originalPrice, discountedPrice = null, currency = '$') => {
  const original = parseFloat(originalPrice);
  
  if (isNaN(original)) {
    return {
      displayPrice: 'N/A',
      originalPrice: null,
      isDiscounted: false
    };
  }
  
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return isNaN(numPrice) ? 'N/A' : `${currency}${numPrice.toFixed(2)}`;
  };
  
  if (discountedPrice !== null) {
    const discounted = parseFloat(discountedPrice);
    if (!isNaN(discounted) && discounted < original) {
      return {
        displayPrice: formatPrice(discounted),
        originalPrice: formatPrice(original),
        isDiscounted: true,
        savings: original - discounted
      };
    }
  }
  
  return {
    displayPrice: formatPrice(original),
    originalPrice: null,
    isDiscounted: false
  };
};

/**
 * Get offer badge text based on discount value
 * @param {number|string} discountValue - Discount value
 * @returns {string} - Badge text
 */
export const getOfferBadgeText = (discountValue) => {
  if (!discountValue && discountValue !== 0) return 'Offer';
  const discount = parseFloat(discountValue);
  return isNaN(discount) ? 'Offer' : `${discount}% OFF`;
};

/**
 * Sort offers by discount value (highest first)
 * @param {Array} offers - Array of offer objects
 * @returns {Array} - Sorted array of offers
 */
export const sortOffersByDiscount = (offers) => {
  if (!offers || !Array.isArray(offers)) return [];
  
  return [...offers].sort((a, b) => {
    const discountA = parseFloat(a.discountValue) || 0;
    const discountB = parseFloat(b.discountValue) || 0;
    return discountB - discountA; // Descending order
  });
};

/**
 * Get total savings from all active offers
 * @param {Array} offers - Array of offer objects
 * @param {number|string} originalPrice - Original price
 * @returns {number} - Total savings
 */
export const getTotalSavings = (offers, originalPrice) => {
  if (!offers || !Array.isArray(offers) || !originalPrice) return 0;
  
  const activeOffers = offers.filter(offer => isOfferActive(offer));
  if (activeOffers.length === 0) return 0;
  
  const bestOffer = getBestActiveOffer(activeOffers);
  if (!bestOffer) return 0;
  
  const discountedPrice = calculateDiscountedPrice(originalPrice, bestOffer.discountValue);
  const original = parseFloat(originalPrice);
  const discounted = parseFloat(discountedPrice);
  
  if (isNaN(original) || isNaN(discounted)) return 0;
  
  return original - discounted;
};

/**
 * Get formatted date range for an offer
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} - Formatted date range
 */
export const getOfferDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return 'N/A';
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start) || isNaN(end)) return 'N/A';
  
  const formatOptions = { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  const startStr = start.toLocaleDateString('en-US', formatOptions);
  const endStr = end.toLocaleDateString('en-US', formatOptions);
  
  return `${startStr} - ${endStr}`;
};

/**
 * Check if an offer is about to expire (within 24 hours)
 * @param {Object} offer - Offer object
 * @returns {boolean} - True if expiring soon
 */
export const isOfferExpiringSoon = (offer) => {
  if (!offer || !offer.endDate) return false;
  
  const now = new Date();
  const endDate = new Date(offer.endDate);
  const hoursUntilExpiry = (endDate - now) / (1000 * 60 * 60);
  
  return hoursUntilExpiry > 0 && hoursUntilExpiry <= 24;
};