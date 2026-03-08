import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import productsData from "../data/productsData";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FiChevronRight,
  FiDroplet,
  FiShield,
  FiAward,
  FiStar,
} from "react-icons/fi";
import "./HomePage.css";

import shampooImg from "../images/shampoo.jpeg";
import conditionerImg from "../images/conditioner.jpeg";
import maskImg from "../images/mask.jpeg";
import serumImg from "../images/serum.jpeg";
import oilImg from "../images/oil.jpeg";

const categoryList = [
  { title: "Shampoo", image: shampooImg, link: "/products/shampoo", alt: "Premium Vertex Shampoo" },
  { title: "Conditioner", image: conditionerImg, link: "/products/conditioner", alt: "Nourishing Vertex Conditioner" },
  { title: "Hair Mask", image: maskImg, link: "/products/mask", alt: "Repairing Vertex Hair Mask" },
  { title: "Serum", image: serumImg, link: "/products/serum", alt: "Glossy Vertex Hair Serum" },
  { title: "Hair Oil", image: oilImg, link: "/products/hair-oil", alt: "Pure Vertex Hair Oil" },
];

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Priya S.",
    rating: 5,
    text: "The Vertex Gold Hair Mask completely transformed my hair. It's softer than ever before. Worth every rupee!",
    location: "Mumbai",
  },
  {
    name: "Ananya M.",
    rating: 5,
    text: "I've tried countless premium brands but nothing compares to Vertex. The shampoo gives such a luxurious lather!",
    location: "Delhi",
  },
  {
    name: "Rohit K.",
    rating: 5,
    text: "My wife recommended the Elixir Serum and I'm obsessed. Frizz completely gone in one use.",
    location: "Bangalore",
  },
];

const features = [
  {
    Icon: FiDroplet,
    title: "Pure Formulas",
    desc: "No sulfates, parabens, or harsh chemicals. Only the finest ingredients.",
  },
  {
    Icon: FiShield,
    title: "Dermatologist Tested",
    desc: "Each product is clinically tested and approved for daily use.",
  },
  {
    Icon: FiAward,
    title: "Award Winning",
    desc: "Recognized globally as one of the finest luxury hair care brands.",
  },
];

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const heroRef = useRef(null);
  const heroTitleRef = useRef(null);
  const heroSubRef = useRef(null);
  const heroBtnRef = useRef(null);

  useEffect(() => {
    // Fetch products
    const fetchProducts = async () => {
      try {
        const [featuredRes, bestRes] = await Promise.all([
          api.get("/products?featured=true&limit=4"),
          api.get("/products?bestseller=true&limit=4"),
        ]);
        // Use API results if available, otherwise fallback to local sample data
        const f =
          featuredRes?.data?.products && featuredRes.data.products.length > 0
            ? featuredRes.data.products
            : productsData.filter((p) => p.isFeatured).slice(0, 4);
        const b =
          bestRes?.data?.products && bestRes.data.products.length > 0
            ? bestRes.data.products
            : productsData.filter((p) => p.isBestSeller).slice(0, 4);
        setFeaturedProducts(f);
        setBestSellers(b);
      } catch (err) {
        console.error(
          "Failed to fetch products, using local sample data:",
          err,
        );
        setFeaturedProducts(
          productsData.filter((p) => p.isFeatured).slice(0, 4),
        );
        setBestSellers(productsData.filter((p) => p.isBestSeller).slice(0, 4));
      }
    };
    fetchProducts();

    // Hero GSAP animation
    const tl = gsap.timeline();
    tl.fromTo(
      heroTitleRef.current,
      { opacity: 0, y: 60, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      },
    )
      .fromTo(
        heroSubRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.6",
      )
      .fromTo(
        heroBtnRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
        "-=0.4",
      );

    // ScrollTrigger for sections
    gsap.utils.toArray(".scroll-reveal").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          delay: i * 0.05,
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Vertex | Premium Luxury Hair Care</title>
        <meta
          name="description"
          content="Vertex Hair Care – Experience the gold standard in luxury hair care. Premium shampoos, conditioners, serums, and treatments crafted for radiant hair."
        />
      </Helmet>

      <Navbar />

      {/* ── HERO ── */}
      <section ref={heroRef} className="hero">
        <div className="hero__bg" />
        <div className="hero__particles" />
        <div className="container hero__content">
          <div className="hero__text">
            <span className="hero__eyebrow">
              The Gold Standard in Hair Care
            </span>
            <h1 ref={heroTitleRef} className="hero__title">
              Reveal Your Hair's
              <span className="text-gradient"> Truest Beauty</span>
            </h1>
            <p ref={heroSubRef} className="hero__subtitle">
              Crafted with rare botanical extracts and precious oils. Experience
              the luxury of flawless hair.
            </p>
            <div ref={heroBtnRef} className="hero__actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Collection <FiChevronRight />
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">
                Our Story
              </Link>
            </div>
          </div>
          <div className="hero__image-wrap">
            {/* [REPLACE] with your hero product image */}
            <div className="hero__image-glow" />
            <img
              src="https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=600&q=80"
              alt="Vertex Premium Hair Care"
              className="hero__image"
            />
          </div>
        </div>
        <div className="hero__scroll-hint">
          <div className="hero__scroll-line" />
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="section">
        <div className="container">
          <p className="best-seller-eyebrow scroll-reveal">EDITOR'S CHOICE</p>
          <h2 className="section-title scroll-reveal text-gradient">
            Best Sellers
          </h2>
          <div className="gold-divider" />
          {bestSellers.length > 0 ? (
            <div className="products-grid">
              {bestSellers.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{ height: 400, borderRadius: 16 }}
                />
              ))}
            </div>
          )}
          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link to="/products" className="btn btn-outline scroll-reveal">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY VERTEX ── */}
      <section className="section why-section">
        <div className="why-section__bg" />
        <div className="container">
          <h2 className="section-title scroll-reveal">
            Why Choose <span className="text-gold">Vertex</span>
          </h2>
          <p className="section-subtitle scroll-reveal">
            We believe that extraordinary hair starts with extraordinary
            ingredients.
          </p>
          <div className="gold-divider" />
          <div className="features-grid">
            {features.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="feature-card glass-card scroll-reveal"
              >
                <div className="feature-card__icon">
                  <Icon />
                </div>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__desc">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR COLLECTION (Category Grid) ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title scroll-reveal">
            Our <span className="text-gold">Collection</span>
          </h2>
          <div className="gold-divider" />
          <div className="category-grid">
            {categoryList.map((cat, i) => (
              <Link
                key={cat.title}
                to={cat.link}
                className="category-card scroll-reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="category-card__image-wrap">
                  <img src={cat.image} alt={cat.alt} className="category-card__image" />
                  <div className="category-card__overlay">
                    <span className="btn btn-primary btn-sm">View More</span>
                  </div>
                </div>
                <h3 className="category-card__title">{cat.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testimonials-section">
        <div className="testimonials-section__bg" />
        <div className="container">
          <h2 className="section-title scroll-reveal">
            What Our <span className="text-gold">Clients Say</span>
          </h2>
          <div className="gold-divider" />
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="testimonial-card glass-card scroll-reveal"
              >
                <div className="star-rating" style={{ marginBottom: 12 }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FiStar
                      key={i}
                      style={{ fill: "var(--gold)", color: "var(--gold)" }}
                    />
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <strong>{t.name}</strong>
                  <span>{t.location}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link to="/reviews" className="btn btn-outline scroll-reveal">
              Read All Reviews
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-section scroll-reveal">
        <div className="cta-section__glow" />
        <div className="container cta-section__content">
          <h2 className="cta-section__title">Ready to Transform Your Hair?</h2>
          <p className="cta-section__sub">
            Use code <strong>WELCOME20</strong> for 20% off your first order.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Shop Now
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default HomePage;
