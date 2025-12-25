import React, { useState, useEffect, useCallback } from "react";
import {
  getAirlineReviews,
  getAirlineReviewSummary,
} from "../../../../services/AirlineServices/reviewService";

const AirlineReviews = ({ airlineId, airlineName }) => {
  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 10;

  const fetchSummary = useCallback(async () => {
    try {
      const response = await getAirlineReviewSummary(airlineId);
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [airlineId]);

  const fetchReviews = useCallback(
    async (page) => {
      try {
        setLoading(true);
        const response = await getAirlineReviews(airlineId, page, pageSize);
        setReviews(response.data.content);
        setTotalPages(response.data.totalPages);
        setTotalElements(response.data.totalElements);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    },
    [airlineId, pageSize]
  );

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchReviews(currentPage);
  }, [fetchReviews, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderCategoryBar = (label, score) => {
    const percentage = (score / 10) * 100;
    return (
      <div className="flex items-center gap-3">
        <span className="min-w-[120px] text-sm text-gray-700">{label}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="min-w-[32px] text-right font-semibold text-sm text-gray-900">
          {score?.toFixed(1) || "N/A"}
        </span>
      </div>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            className={`text-lg ${
              index < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!summary && !loading) {
    return (
      <div className="text-center py-12 text-gray-600 text-base">
        No reviews available
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900">
          Guest reviews for {airlineName}
        </h2>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-5 text-gray-900">
            Categories:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              {renderCategoryBar("On-Time Performance", summary.onTimeAvg)}
              {renderCategoryBar("Comfort", summary.comfortAvg)}
            </div>
            <div className="flex flex-col gap-4">
              {renderCategoryBar("Amenities", summary.amenitiesAvg)}
              {renderCategoryBar("Staff", summary.staffAvg)}
            </div>
          </div>
        </div>
      )}

      {/* Guest Reviews Section */}
      <div className="mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-gray-200 gap-2">
          <h3 className="text-xl font-semibold text-gray-900">Guest reviews</h3>
          <span className="text-sm text-gray-600">
            Showing {reviews.length > 0 ? currentPage * pageSize + 1 : 0} -{" "}
            {Math.min((currentPage + 1) * pageSize, totalElements)} of{" "}
            {totalElements} reviews
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 text-base">
            Loading reviews...
          </div>
        ) : (
          <>
            {/* Reviews List */}
            <div className="flex flex-col gap-6">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="p-6 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow duration-200"
                >
                  {/* Review Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-semibold text-base">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-base text-gray-900">
                          {review.userName}
                        </span>
                      </div>
                    </div>
                    <div className="bg-sky-600 text-white px-3 py-1.5 rounded-md font-bold text-base min-w-[40px] text-center">
                      {review.rating?.toFixed(1)}
                    </div>
                  </div>

                  {/* Review Metadata */}
                  <div className="flex flex-wrap gap-4 mb-4 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <span className="text-base">✈️</span>
                      <span>{review.tripType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <span className="text-base">🛩️</span>
                      <span>{review.planeType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <span className="text-base">📅</span>
                      <span>Reviewed: {formatDate(review.createdAt)}</span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="flex flex-col gap-3">
                    {renderStars(review.rating)}
                    <p className="text-base leading-relaxed text-gray-700">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-8 pt-6 border-t border-gray-200">
                <button
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    if (
                      index === 0 ||
                      index === totalPages - 1 ||
                      (index >= currentPage - 2 && index <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={index}
                          className={`min-w-[36px] px-3 py-2 border rounded text-sm transition-colors ${
                            index === currentPage
                              ? "bg-sky-600 text-white border-sky-600 font-semibold"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                          }`}
                          onClick={() => handlePageChange(index)}
                        >
                          {index + 1}
                        </button>
                      );
                    } else if (
                      index === currentPage - 3 ||
                      index === currentPage + 3
                    ) {
                      return (
                        <span
                          key={index}
                          className="px-1 py-2 text-gray-600 text-sm"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AirlineReviews;
