// countup.js - Scroll animation for numbers in "Why Choose LIC?" section

function formatNumber(value, decimalPlaces) {
    return value.toLocaleString(undefined, { minimumFractionDigits: decimalPlaces, maximumFractionDigits: decimalPlaces });
}

function easeOutQuad(t) {
    return t * (2 - t);
}

function animateCountUp(el, target, decimalPlaces = 0, duration = 1500, delay = 0) {
    let start = 0;
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const elapsed = timestamp - startTimestamp;
        if (elapsed < delay) {
            window.requestAnimationFrame(step);
            return;
        }
        const progress = Math.min((elapsed - delay) / duration, 1);
        const easedProgress = easeOutQuad(progress);
        const value = start + (target - start) * easedProgress;
        el.textContent = formatNumber(value, decimalPlaces);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            el.textContent = formatNumber(target, decimalPlaces);
        }
    };
    window.requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', function() {
    const countUps = document.querySelectorAll('.count-up');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    const target = parseFloat(entry.target.dataset.target);
                    const decimal = entry.target.dataset.decimal ? parseInt(entry.target.dataset.decimal) : 0;
                    animateCountUp(entry.target, target, decimal, 1500, 0);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });
        countUps.forEach(el => observer.observe(el));
    } else {
        // Fallback for old browsers
        countUps.forEach(el => {
            if (!el.dataset.animated) {
                el.dataset.animated = 'true';
                const target = parseFloat(el.dataset.target);
                const decimal = el.dataset.decimal ? parseInt(el.dataset.decimal) : 0;
                animateCountUp(el, target, decimal, 1500, 0);
            }
        });
    }
});
