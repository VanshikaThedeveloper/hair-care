import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import './SplashScreen.css';

const SplashScreen = () => {
    const navigate = useNavigate();
    const splashRef = useRef(null);
    const logoRef = useRef(null);
    const taglineRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Fade out splash and redirect to login
                gsap.to(splashRef.current, {
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.in',
                    onComplete: () => navigate('/login'),
                });
            },
        });

        tl.fromTo(
            logoRef.current,
            { opacity: 0, scale: 0.7, filter: 'blur(10px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power4.out' }
        )
            .fromTo(
                glowRef.current,
                { opacity: 0, scale: 0.5 },
                { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
                '-=0.8'
            )
            .fromTo(
                taglineRef.current,
                { opacity: 0, y: 20, letterSpacing: '2px' },
                { opacity: 1, y: 0, letterSpacing: '6px', duration: 0.8, ease: 'power3.out' },
                '-=0.4'
            )
            .to({}, { duration: 1.2 }); // Hold for 1.2s before exiting

        // Total ≈ 2.8s display time
    }, [navigate]);

    return (
        <div ref={splashRef} className="splash">
            <div ref={glowRef} className="splash__glow" />
            <div className="splash__content">
                <div ref={logoRef} className="splash__logo">
                    {/* [REPLACE] with actual logo image */}
                    <div className="splash__logo-letters">VERTEX</div>
                    <div className="splash__logo-line" />
                    <div className="splash__logo-sub">HAIR CARE</div>
                </div>
                <p ref={taglineRef} className="splash__tagline">THE GOLD STANDARD IN LUXURY</p>
            </div>
        </div>
    );
};

export default SplashScreen;
