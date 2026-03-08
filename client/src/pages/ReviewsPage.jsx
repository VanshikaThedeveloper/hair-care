import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { FiStar } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./ReviewsPage.css";

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const dummyReviews = [
          {
            _id: "1",
            user: { name: "Ananya Sharma" },
            rating: 5,
            comment:
              "Absolutely love the Vertex shampoo! My hair feels silky and smooth after every wash.",
            verifiedPurchase: true,
            product: { name: "Vertex Luxury Shampoo" },
            createdAt: new Date("2024-01-10"),
          },
          {
            _id: "2",
            user: { name: "Riya Patel" },
            rating: 4,
            comment:
              "The conditioner works really well. It reduced my frizz significantly.",
            verifiedPurchase: true,
            product: { name: "Vertex Nourishing Conditioner" },
            createdAt: new Date("2024-02-15"),
          },
          {
            _id: "3",
            user: { name: "Meera Singh" },
            rating: 5,
            comment:
              "Hair mask is a game changer! My damaged hair looks healthier now.",
            verifiedPurchase: false,
            product: { name: "Vertex Repair Hair Mask" },
            createdAt: new Date("2024-03-20"),
          },
          {
            _id: "4",
            user: { name: "Priya Verma" },
            rating: 3,
            comment:
              "Serum is good but slightly expensive. Still gives a nice shine.",
            verifiedPurchase: true,
            product: { name: "Vertex Shine Serum" },
            createdAt: new Date("2024-04-05"),
          },
        ];

        setReviews(dummyReviews);
        setPages(1);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Reset page when filter or sort changes
  useEffect(() => {
    setPage(1);
  }, [filterRating, sortBy]);

  // ⭐ FILTERING
  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  // ⭐ SORTING
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "highest") return b.rating - a.rating;
    if (sortBy === "lowest") return a.rating - b.rating;
    if (sortBy === "newest")
      return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FiStar key={i} className={i < rating ? "star star--filled" : "star"} />
    ));

  return (
    <>
      <Helmet>
        <title>Customer Reviews | Vertex Hair Care</title>
      </Helmet>

      <Navbar />

      <main>
        <div className="reviews-hero">
          <div className="reviews-hero__bg" />
          <div
            className="container"
            style={{ position: "relative", zIndex: 1 }}
          >
            <h1 className="section-title">
              Customer <span className="text-gold">Reviews</span>
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "1rem" }}>
              Real stories from real Vertex customers
            </p>
          </div>
        </div>

        <div className="container" style={{ padding: "40px 0 80px" }}>
          {/* Filters */}
          <div className="reviews-filter-bar">
            <div className="reviews-filter-bar__ratings">
              <span
                style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}
              >
                Filter by:
              </span>

              {[0, 5, 4, 3].map((r) => (
                <button
                  key={r}
                  onClick={() => setFilterRating(r)}
                  className={`filter-btn ${
                    filterRating === r ? "filter-btn--active" : ""
                  }`}
                >
                  {r === 0 ? "All" : `${r} ★`}
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="reviews-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: 180, borderRadius: 16 }}
                />
              ))}
            </div>
          ) : sortedReviews.length > 0 ? (
            <div className="reviews-grid">
              {sortedReviews.map((r) => (
                <div key={r._id} className="review-card glass-card">
                  <div className="review-card__header">
                    <div className="review-card__avatar">
                      {r.user?.name?.[0]?.toUpperCase()}
                    </div>

                    <div>
                      <p className="review-card__name">{r.user?.name}</p>
                      {r.verifiedPurchase && (
                        <span
                          className="badge badge-success"
                          style={{ fontSize: "0.65rem" }}
                        >
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>

                    <div className="review-card__rating">
                      {renderStars(r.rating)}
                    </div>
                  </div>

                  {r.product?.name && (
                    <p className="review-card__product">
                      On: <strong>{r.product.name}</strong>
                    </p>
                  )}

                  <p className="review-card__comment">{r.comment}</p>

                  <p className="review-card__date">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="products-empty">
              <h3>No reviews found</h3>
              <p>Try changing the filter.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ReviewsPage;
