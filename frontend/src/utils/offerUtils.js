/**
 * Utility functions for handling offers and price calculations
 */

/**
 * Check if an offer is currently active based on start and end dates
 * @param {string} startDate - ISO date string for offer start
 * @param {string} endDate - ISO date string for offer end
 * @returns {boolean} - True if offer is active
 */
export const isOfferActive = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  return now >= start && now <= end;
};

/**
 * Calculate discounted price based on original price and discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountPercentage - Discount percentage (0-100)
 * @returns {number} - Discounted price
 */
export const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
  return originalPrice * (1 - discountPercentage / 100);
};

/**
 * Get the best active offer from a list of offers
 * @param {Array} offers - Array of offer objects
 * @returns {Object|null} - Best active offer or null
 */
export const getBestActiveOffer = (offers) => {
  if (!offers || offers.length === 0) return null;

  const activeOffers = offers.filter(offer =>
    isOfferActive(offer.startDate, offer.endDate)
  );

  if (activeOffers.length === 0) return null;

  // Return the offer with the highest discount percentage
  return activeOffers.reduce((best, current) =>
    current.discountPercentage > best.discountPercentage ? current : best
  );
};

/**
 * Format price display with original and discounted prices
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Discounted price
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {Object} - Object with displayPrice and originalPrice properties
 */
export const formatPriceDisplay = (originalPrice, discountedPrice, currency = '$') => {
  if (discountedPrice && discountedPrice < originalPrice) {
    return {
      displayPrice: `${currency}${discountedPrice.toFixed(2)}`,
      originalPrice: `${currency}${originalPrice.toFixed(2)}`,
      isDiscounted: true
    };
  }
  return {
    displayPrice: `${currency}${originalPrice.toFixed(2)}`,
    originalPrice: null,
    isDiscounted: false
  };
};

/**
 * Get offer badge text based on discount percentage
 * @param {number} discountPercentage - Discount percentage
 * @returns {string} - Badge text
 */
export const getOfferBadgeText = (discountPercentage) => {
  return `${discountPercentage}% OFF`;
};