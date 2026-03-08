import { useState, useEffect, useRef } from "react";
import { fallbackProducts } from "../data/fallbackProducts";

import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiStar,
  FiShoppingCart,
  FiHeart,
  FiChevronLeft,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast from "react-hot-toast";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [zoom, setZoom] = useState({ active: false, x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
        setRelated(data.related || []);
        setSelectedImage(0);
        window.scrollTo(0, 0);
      } catch {
        // Check if ID is a fallback product ID
        const allFallbacks = Object.values(fallbackProducts).flat();
        const fallback = allFallbacks.find((p) => p._id === id);
        if (fallback) {
          setProduct(fallback);
          setRelated([]);
          setSelectedImage(0);
          window.scrollTo(0, 0);
        } else {
          toast.error("Product not found");
          navigate("/products");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoom({ active: true, x, y });
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product._id, quantity);
  };

  if (loading)
    return (
      <>
        <Navbar />
        <div className="page-loader" style={{ minHeight: "100vh" }}>
          <div className="spinner" />
        </div>
        <Footer />
      </>
    );

  if (!product) return null;
  const inWishlist = wishlist.includes(product._id);

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FiStar
        key={i}
        className={i < Math.round(rating) ? "star star--filled" : "star"}
      />
    ));

  return (
    <>
      <Helmet>
        <title>{product.name} | Vertex Hair Care</title>
        <meta
          name="description"
          content={
            product.shortDescription || product.description.slice(0, 160)
          }
        />
      </Helmet>
      <Navbar />
      <main className="product-detail">
        <div className="container">
          {/* Breadcrumb */}
          <nav className="breadcrumb">
            <Link to="/products" className="breadcrumb__link">
              <FiChevronLeft /> Products
            </Link>
            <span>/</span>
            <span>{product.category?.replace("-", " ")}</span>
            <span>/</span>
            <span className="breadcrumb__current">{product.name}</span>
          </nav>

          <div className="product-detail__grid">
            {/* Images */}
            <div className="product-detail__images">
              <div
                ref={imageRef}
                className={`product-detail__main-image-wrap ${zoom.active ? "zoom-active" : ""}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setZoom({ active: false, x: 0, y: 0 })}
              >
                <img
                  src={product.images?.[selectedImage]?.url}
                  alt={product.name}
                  className="product-detail__main-image"
                  style={
                    zoom.active
                      ? {
                        transformOrigin: `${zoom.x}% ${zoom.y}%`,
                        transform: "scale(2)",
                      }
                      : {}
                  }
                />
                {product.isBestSeller && (
                  <span
                    className="product-card__badge product-card__badge--bestseller"
                    style={{ position: "absolute", top: 16, left: 16 }}
                  >
                    Best Seller
                  </span>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="product-detail__thumbnails">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`product-detail__thumb ${selectedImage === i ? "product-detail__thumb--active" : ""}`}
                    >
                      <img src={img.url} alt={img.alt} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="product-detail__info">
              <p className="product-detail__category">
                {product.category?.replace("-", " ")}
              </p>
              <h1 className="product-detail__name">{product.name}</h1>
              <div className="product-detail__rating">
                <div className="star-rating">
                  {renderStars(product.ratings)}
                </div>
                <span>({product.numReviews} reviews)</span>
              </div>
              <div className="product-detail__price">
                <span className="product-detail__price-current">
                  ₹{product.price}
                </span>
                <span className="product-detail__weight">{product.weight}</span>
              </div>
              <p className="product-detail__short-desc">
                {product.shortDescription}
              </p>

              {/* Stock */}
              <div className="product-detail__stock">
                {product.stock > 0 ? (
                  <span className="badge badge-success">
                    ✓ In Stock ({product.stock} left)
                  </span>
                ) : (
                  <span className="badge badge-danger">Out of Stock</span>
                )}
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="product-detail__quantity">
                  <span className="form-label">Quantity</span>
                  <div className="quantity-control">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    >
                      <FiMinus />
                    </button>
                    <span>{quantity}</span>
                    <button
                      onClick={() =>
                        setQuantity((q) => Math.min(product.stock, q + 1))
                      }
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              )}

              <div className="product-detail__actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <FiShoppingCart />
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  className={`btn btn-outline btn-lg ${inWishlist ? "btn--wishlist-active" : ""}`}
                  onClick={() => toggleWishlist(product._id)}
                >
                  <FiHeart style={inWishlist ? { fill: "var(--gold)" } : {}} />
                  {inWishlist ? "Wishlisted" : "Wishlist"}
                </button>
              </div>

              {/* Benefits */}
              {product.benefits?.length > 0 && (
                <div className="product-detail__benefits">
                  <h4>Key Benefits</h4>
                  <ul>
                    {product.benefits.map((b) => (
                      <li key={b}>
                        <span>✦</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="product-detail__tabs">
            {["description", "ingredients", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`product-detail__tab-btn ${activeTab === tab ? "active" : ""}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="product-detail__tab-content glass-card">
            {activeTab === "description" && (
              <div>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.9 }}>
                  {product.description}
                </p>
              </div>
            )}
            {activeTab === "ingredients" && (
              <div>
                <h3 style={{ marginBottom: 16, color: "var(--gold)" }}>
                  Key Ingredients
                </h3>
                <div className="ingredients-list">
                  {product.ingredients?.map((ingredient) => (
                    <span key={ingredient} className="ingredient-tag">
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <p style={{ color: "var(--text-secondary)" }}>
                  See all reviews on our{" "}
                  <Link to="/reviews" style={{ color: "var(--gold)" }}>
                    Reviews page
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div style={{ marginTop: 64 }}>
              <h2 className="section-title">
                You May Also <span className="text-gold">Like</span>
              </h2>
              <div className="gold-divider" />
              <div className="products-grid">
                {related.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
