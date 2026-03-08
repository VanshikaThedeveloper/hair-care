import { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import productsData from "../data/productsData";
import { fallbackProducts } from "../data/fallbackProducts";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiFilter, FiX } from "react-icons/fi";
import "./ProductsPage.css";

const categories = [
  "all",
  "shampoo",
  "conditioner",
  "hair-mask",
  "serum",
  "hair-oil",
];
const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

const ProductsPage = () => {
  const { category: routeCategory } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Normalize category from route params or search params
  let currentCategory = routeCategory || searchParams.get("category") || "all";
  if (currentCategory === "mask") currentCategory = "hair-mask";

  const category = currentCategory;
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ sort, page, limit: 12 });
        if (category !== "all") params.append("category", category);
        if (search) params.append("search", search);
        const { data } = await api.get(`/products?${params}`);

        let fetchedProducts = data.products || [];
        let fetchedTotal = data.total || 0;

        // Fallback to default products if API returns empty array and it's a category page (not search)
        if (fetchedProducts.length === 0 && !search && category !== "all") {
          let fallbackKey = category;
          if (category === "hair-mask") fallbackKey = "mask";
          if (category === "hair-oil") fallbackKey = "oil";

          const fallback = fallbackProducts[fallbackKey];
          if (fallback && fallback.length > 0) {
            fetchedProducts = fallback;
            fetchedTotal = fallback.length;
          }
        }

        setProducts(fetchedProducts);
        setTotal(fetchedTotal);
        setPages(data.pages || 1);
      } catch (err) {
        console.error(
          "Failed to fetch products, falling back to local data:",
          err,
        );
        // Fallback to local sample data when API is unavailable
        let fallback = productsData;
        if (category && category !== "all") {
          fallback = fallback.filter((p) => p.category === category);
        }

        // If sample data also empty for this category, check fallbackProducts
        if (fallback.length === 0 && category !== "all") {
          let fallbackKey = category;
          if (category === "hair-mask") fallbackKey = "mask";
          if (category === "hair-oil") fallbackKey = "oil";
          fallback = fallbackProducts[fallbackKey] || [];
        }

        if (search) {
          const q = search.toLowerCase();
          fallback = fallback.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              (p.shortDescription || "").toLowerCase().includes(q),
          );
        }
        setProducts(fallback);
        setTotal(fallback.length);
        setPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, sort, search, page]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    setPage(1);
    setSearchParams(params);
  };

  return (
    <>
      <Helmet>
        <title>{category !== "all" ? `${category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")} | Vertex Hair Care` : "Shop | Vertex Hair Care"}</title>
        <meta
          name="description"
          content="Shop Vertex Hair Care's premium collection of shampoos, conditioners, hair masks, serums, and hair oils."
        />
      </Helmet>
      <Navbar />
      <main className="products-page">
        {/* Page Header */}
        <div className="products-page__header">
          <div className="products-page__header-bg" />
          <div
            className="container"
            style={{ position: "relative", zIndex: 1 }}
          >
            <h1 className="products-page__title">
              Our <span className="text-gold">Collection</span>
            </h1>
            <p className="products-page__subtitle">
              {search
                ? `Searching for "${search}"`
                : category !== "all"
                  ? `Explore our range of ${category.replace("-", " ")}s`
                  : "Premium luxury hair care for discerning tastes"}
            </p>
          </div>
        </div>

        <div className="container products-page__body">
          {/* Filter bar */}
          <div className="products-filter-bar">
            <div className="products-filter-bar__categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => updateParam("category", cat)}
                  className={`filter-btn ${category === cat ? "filter-btn--active" : ""}`}
                >
                  {cat === "all" ? "All Products" : cat.replace("-", " ")}
                </button>
              ))}
            </div>
            <div className="products-filter-bar__right">
              <span className="products-count">{total} products</span>
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="sort-select"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(search || (category && category !== "all")) && (
            <div className="active-filters">
              {category && category !== "all" && (
                <span className="active-filter-tag">
                  {category.replace("-", " ")}
                  <button onClick={() => updateParam("category", "all")}>
                    <FiX />
                  </button>
                </span>
              )}
              {search && (
                <span className="active-filter-tag">
                  Search: {search}
                  <button
                    onClick={() => {
                      const p = new URLSearchParams(searchParams);
                      p.delete("search");
                      setSearchParams(p);
                    }}
                  >
                    <FiX />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="products-grid">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: 400, borderRadius: 16 }}
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="products-empty">
              <h3>No products available</h3>
              <p>
                {search
                  ? "Try adjusting your filters or search terms."
                  : "We are currently updating our collection. Please check back later."}
              </p>
              {(search || category !== "all") && (
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSearchParams({});
                    // If we were on a route like /products/shampoo, go back to /products
                    if (routeCategory) window.location.href = "/products";
                  }}
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="pagination">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`pagination-btn ${page === i + 1 ? "pagination-btn--active" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductsPage;

