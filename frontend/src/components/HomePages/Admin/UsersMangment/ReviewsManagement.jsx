import { useState, useEffect, useCallback } from 'react';
import {
    getHotelFlaggedReviews,
    getAirlineFlaggedReviews,
    deleteHotelFlaggedReview,
    deleteFlightFlaggedReview,
    approveHotelFlaggedReview,
    approveFlightFlaggedReview
} from '../../../../services/SystemAdminService/reviewsService';

const FlaggedReviewsManager = () => {
    const [activeTab, setActiveTab] = useState('airline');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [processingId, setProcessingId] = useState(null);
    const size = 10;

    const fetchReviews = useCallback(async () => {
        setLoading(true);
        try {
            const response = activeTab === 'airline'
                ? await getAirlineFlaggedReviews(page, size)
                : await getHotelFlaggedReviews(page, size);

            setReviews(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, page, size]); 

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]); 

    const handleDelete = async (reviewId) => {
        setProcessingId(reviewId);
        try {
            if (activeTab === 'airline') {
                await deleteFlightFlaggedReview(reviewId);
            } else {
                await deleteHotelFlaggedReview(reviewId);
            }
            await fetchReviews();
        } catch (error) {
            console.error('Failed to delete review:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const handleApprove = async (reviewId) => {
        setProcessingId(reviewId);
        try {
            if (activeTab === 'airline') {
                await approveFlightFlaggedReview(reviewId);
            } else {
                await approveHotelFlaggedReview(reviewId);
            }
            await fetchReviews();
        } catch (error) {
            console.error('Failed to approve review:', error);
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-amber-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    return (
        <div className="w-full">
            <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        
        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        
        .review-card {
          animation: slideIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .review-card:nth-child(1) { animation-delay: 0.05s; }
        .review-card:nth-child(2) { animation-delay: 0.1s; }
        .review-card:nth-child(3) { animation-delay: 0.15s; }
        .review-card:nth-child(4) { animation-delay: 0.2s; }
        .review-card:nth-child(5) { animation-delay: 0.25s; }
        .review-card:nth-child(6) { animation-delay: 0.3s; }
        .review-card:nth-child(7) { animation-delay: 0.35s; }
        .review-card:nth-child(8) { animation-delay: 0.4s; }
        .review-card:nth-child(9) { animation-delay: 0.45s; }
        .review-card:nth-child(10) { animation-delay: 0.5s; }
        
        .shimmer-loader {
          background: linear-gradient(
            90deg,
            rgba(148, 163, 184, 0.1) 0%,
            rgba(148, 163, 184, 0.3) 50%,
            rgba(148, 163, 184, 0.1) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

            {/* Tab Buttons */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-sky-50 p-2 mb-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => {
                            setActiveTab('airline');
                            setPage(0);
                        }}
                        className={`flex-1 py-2 px-4 font-medium transition-all flex items-center justify-center gap-2 rounded-lg text-sm ${activeTab === 'airline'
                                ? 'bg-sky-100 text-sky-700 border border-sky-300'
                                : 'text-gray-600 hover:bg-sky-50'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Airline Reviews
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('hotel');
                            setPage(0);
                        }}
                        className={`flex-1 py-2 px-4 font-medium transition-all flex items-center justify-center gap-2 rounded-lg text-sm ${activeTab === 'hotel'
                                ? 'bg-sky-100 text-sky-700 border border-sky-300'
                                : 'text-gray-600 hover:bg-sky-50'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Hotel Reviews
                    </button>
                </div>
            </div>

            {/* Reviews Grid */}
            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white/60 backdrop-blur-sm border border-sky-100 rounded-xl p-6 h-64 shimmer-loader"></div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 animate-fade-in">
                    <div className="inline-block p-6 bg-white/60 backdrop-blur-sm rounded-full mb-4 border border-sky-100">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No Flagged Reviews</h3>
                    <p className="text-gray-500 text-sm">All {activeTab} reviews have been moderated</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review.reviewId}
                            className="review-card bg-white/60 backdrop-blur-sm border border-sky-100 rounded-xl p-6 hover:border-sky-300 hover:shadow-lg transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                            {review.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-gray-900 font-bold text-sm">{review.username}</h3>
                                            <p className="text-gray-600 text-xs font-medium">{review.institutionName}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex gap-1 mb-1 justify-end">{renderStars(review.rating)}</div>
                                    <p className="text-gray-500 text-xs">{formatDate(review.createdAt)}</p>
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <div className="bg-sky-50/50 border border-sky-100 rounded-lg p-4">
                                    <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleApprove(review.reviewId)}
                                    disabled={processingId === review.reviewId}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white rounded-lg font-medium text-sm hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all"
                                >
                                    {processingId === review.reviewId ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Approve
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleDelete(review.reviewId)}
                                    disabled={processingId === review.reviewId}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-lg font-medium text-sm hover:from-rose-500 hover:to-rose-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all"
                                >
                                    {processingId === review.reviewId ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Processing
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-8 animate-fade-in">
                    <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-700 rounded-lg font-medium text-sm hover:bg-white hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-100"
                    >
                        Previous
                    </button>
                    <div className="flex gap-2">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPage(i)}
                                className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${page === i
                                        ? 'bg-sky-100 text-sky-700 border border-sky-300'
                                        : 'bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-md border border-sky-100'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page === totalPages - 1}
                        className="px-4 py-2 bg-white/60 backdrop-blur-sm text-gray-700 rounded-lg font-medium text-sm hover:bg-white hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-sky-100"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default FlaggedReviewsManager;