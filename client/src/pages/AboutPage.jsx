import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AboutPage.css';

gsap.registerPlugin(ScrollTrigger);

const timeline = [
    { year: '2018', title: 'The Vision', desc: 'Vertex was born from a simple belief: premium hair care should be accessible to everyone who values quality.' },
    { year: '2020', title: 'First Formula', desc: 'Our founding chemist perfected the first Vertex Gold Serum after 18 months of research with rare botanicals.' },
    { year: '2022', title: 'National Launch', desc: 'Vertex launched across India to overwhelming acclaim, selling out our first collection within 48 hours.' },
    { year: '2024', title: 'Award Winning', desc: 'Recognized by Indian Beauty Awards as the Best Luxury Hair Care Brand with 100,000+ loyal customers.' },
];

const values = [
    { icon: '🌿', title: 'Clean Beauty', desc: 'Zero sulfates, zero parabens, zero compromise on ingredient integrity.' },
    { icon: '🔬', title: 'Science + Nature', desc: 'Every formula is backed by clinical research and the finest natural extracts.' },
    { icon: '♾️', title: 'Sustainability', desc: 'Our packaging is fully recyclable and we offset 100% of our carbon footprint.' },
    { icon: '💛', title: 'Cruelty Free', desc: 'Never tested on animals. Always tested on humans who love their hair.' },
];

const AboutPage = () => {
    const heroRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(heroRef.current, { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 });

        gsap.utils.toArray('.scroll-reveal').forEach((el) => {
            gsap.fromTo(el, { opacity: 0, y: 40 }, {
                opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%' },
            });
        });

        return () => ScrollTrigger.getAll().forEach((t) => t.kill());
    }, []);

    return (
        <>
            <Helmet>
                <title>About Us | Vertex Hair Care</title>
                <meta name="description" content="Learn the story behind Vertex Hair Care – our founding vision, values, and commitment to luxury hair care science." />
            </Helmet>
            <Navbar />

            {/* Hero */}
            <section className="about-hero">
                <div className="about-hero__bg" />
                <div className="container about-hero__content" ref={heroRef}>
                    <span className="hero__eyebrow">Our Story</span>
                    <h1 className="about-hero__title">The Gold Standard <span className="text-gold">Was Our Goal</span></h1>
                    <p className="about-hero__text">
                        Vertex was created for people who refuse to compromise on what they put in their hair.
                        We believe luxury and science are inseparable — and we've spent years proving it.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="section">
                <div className="container">
                    <h2 className="section-title scroll-reveal">Our Core <span className="text-gold">Values</span></h2>
                    <div className="gold-divider" />
                    <div className="about-values-grid">
                        {values.map((v) => (
                            <div key={v.title} className="about-value-card glass-card scroll-reveal">
                                <div className="about-value-card__icon">{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story / timeline */}
            <section className="section about-timeline-section">
                <div className="about-timeline-section__bg" />
                <div className="container">
                    <h2 className="section-title scroll-reveal">Our <span className="text-gold">Journey</span></h2>
                    <div className="gold-divider" />
                    <div className="about-timeline">
                        {timeline.map((item, i) => (
                            <div key={item.year} className={`about-timeline__item scroll-reveal ${i % 2 === 1 ? 'about-timeline__item--right' : ''}`}>
                                <div className="about-timeline__card glass-card">
                                    <span className="about-timeline__year">{item.year}</span>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                                <div className="about-timeline__dot" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section scroll-reveal">
                <div className="cta-section__glow" />
                <div className="container cta-section__content">
                    <h2 className="cta-section__title">Ready to Experience Vertex?</h2>
                    <p className="cta-section__sub">Explore our full collection crafted for your unique hair journey.</p>
                    <Link to="/products" className="btn btn-primary btn-lg">Shop Collection</Link>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default AboutPage;
