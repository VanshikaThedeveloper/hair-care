import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { gsap } from "gsap";
import "./ProductCard.css";

const placeholderImg = new URL("../images/placeholder.svg", import.meta.url)
  .href;

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart, toggleWishlist, wishlist } = useCart();
  const { user } = useAuth();
  const cardRef = useRef(null);
  const inWishlist = wishlist.includes(product._id);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
        delay: index * 0.08,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
        },
      },
    );
  }, [index]);

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    addToCart(product._id);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product._id);
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FiStar
        key={i}
        className={i < Math.round(rating) ? "star star--filled" : "star"}
      />
    ));

  // Resolve image URL: prefer absolute URLs, otherwise map local '/images/...' to import-resolved files
  const getImageSrc = () => {
    const src = product.images?.[0]?.url;
    if (!src) return placeholderImg;
    // already an absolute url (http/https)
    if (/^https?:\/\//.test(src)) {
      if (process.env.NODE_ENV === "development") {
        if (
          (product.category || "").includes("mask") ||
          (product.name || "").toLowerCase().includes("mask") ||
          product._id === "3"
        ) {
          // eslint-disable-next-line no-console
          console.debug(
            "ProductCard raw src (absolute):",
            src,
            "for",
            product._id,
          );
        }
      }
      return src;
    }
    // If it's a bundler-generated href (contains import base), use as is
    if (src.startsWith("data:") || (src.startsWith("/") && src.includes("src")))
      return src;
    // If it's a root-based path like '/images/xxx' or './images/xxx'
    const fileName = src.split("/").pop();
    try {
      const resolved = new URL(`../images/${fileName}`, import.meta.url).href;
      if (process.env.NODE_ENV === "development") {
        if (
          (product.category || "").includes("mask") ||
          (product.name || "").toLowerCase().includes("mask") ||
          product._id === "3"
        ) {
          // eslint-disable-next-line no-console
          console.debug("ProductCard image mapping for", product._id, {
            raw: src,
            fileName,
            resolved,
          });
        }
      }
      return resolved;
    } catch (e) {
      if (process.env.NODE_ENV === "development" && product._id === "3") {
        // eslint-disable-next-line no-console
        console.error("ProductCard failed to resolve image for product 3:", e);
      }
      return placeholderImg;
    }
  };

  return (
    <div ref={cardRef} className="product-card glass-card">
      <Link
        to={`/products/${product._id}`}
        className="product-card__image-wrap"
      >
        {
          // fallback to a placeholder image when product image is missing
        }
        <img
          src={getImageSrc()}
          alt={product.images?.[0]?.alt || product.name}
          className="product-card__image"
          loading="lazy"
        />
        {product.isBestSeller && (
          <span className="product-card__badge product-card__badge--bestseller">
            Best Seller
          </span>
        )}
        {product.isFeatured && !product.isBestSeller && (
          <span className="product-card__badge product-card__badge--featured">
            Featured
          </span>
        )}
        {product.stock === 0 && (
          <span className="product-card__badge product-card__badge--oos">
            Out of Stock
          </span>
        )}
        <div className="product-card__overlay">
          <button
            className={`product-card__overlay-btn ${inWishlist ? "product-card__overlay-btn--active" : ""}`}
            onClick={handleWishlist}
            aria-label="Toggle Wishlist"
          >
            <FiHeart />
          </button>
        </div>
      </Link>

      <div className="product-card__body">
        <p className="product-card__category">
          {product.category?.replace("-", " ")}
        </p>
        <Link to={`/products/${product._id}`}>
          <h3 className="product-card__name">{product.name}</h3>
        </Link>
        <div className="product-card__rating">
          <div className="star-rating">{renderStars(product.ratings)}</div>
          <span className="product-card__review-count">
            ({product.numReviews})
          </span>
        </div>
        <div className="product-card__footer">
          <div className="product-card__price">
            <span className="product-card__price-current">
              ₹{product.price}
            </span>
            {product.discountPrice > 0 && (
              <span className="product-card__price-original">
                ₹{product.discountPrice}
              </span>
            )}
          </div>
          <button
            className="product-card__add-btn btn btn-primary btn-sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <FiShoppingCart />
            {product.stock === 0 ? "Sold Out" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
