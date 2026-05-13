/* ============================================
   GATEWAY INNOTECH - MAIN JAVASCRIPT
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ==========================================
  // NAVIGATION
  // ==========================================
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar on scroll
  function handleScroll() {
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }

    // Active nav link (only relevant on single-page with sections)
    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const icon = this.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('active')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (navMenu) navMenu.classList.remove('active');
      if (mobileToggle) {
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      }
    });
  });

  // Update active nav based on scroll position (single-page only)
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    if (sections.length === 0) return;

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (current && link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ==========================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ==========================================
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter animation if it's a counter
        if (entry.target.classList.contains('counter-animate')) {
          animateCounter(entry.target);
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });

  // ==========================================
  // COUNTER ANIMATION
  // ==========================================
  function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOut * target);

      element.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // Trigger counters on home page
  document.querySelectorAll('.counter-animate').forEach(counter => {
    observer.observe(counter);
  });

  // ==========================================
  // HERO CANVAS PARTICLES
  // ==========================================
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const count = window.innerWidth < 768 ? 30 : 60;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections
      particles.forEach((a, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 150) {
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ==========================================
  // PAGE HEADER CANVAS PARTICLES (Inner Pages)
  // ==========================================
  const pageCanvas = document.getElementById('page-header-canvas');
  if (pageCanvas) {
    const pCtx = pageCanvas.getContext('2d');
    let pParticles = [];

    function resizePageCanvas() {
      pageCanvas.width = pageCanvas.offsetWidth;
      pageCanvas.height = pageCanvas.offsetHeight;
    }
    resizePageCanvas();
    window.addEventListener('resize', resizePageCanvas);

    class PageParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * pageCanvas.width;
        this.y = Math.random() * pageCanvas.height;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.speedY = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.6 + 0.15;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.02;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;
        if (this.x > pageCanvas.width) this.x = 0;
        if (this.x < 0) this.x = pageCanvas.width;
        if (this.y > pageCanvas.height) this.y = 0;
        if (this.y < 0) this.y = pageCanvas.height;
      }
      draw() {
        const currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(this.pulse));
        pCtx.fillStyle = `rgba(147, 197, 253, ${currentOpacity})`;
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
      }
    }

    function initPageParticles() {
      pParticles = [];
      const count = Math.floor((pageCanvas.width * pageCanvas.height) / 8000);
      const finalCount = Math.min(Math.max(count, 20), 80);
      for (let i = 0; i < finalCount; i++) {
        pParticles.push(new PageParticle());
      }
    }
    initPageParticles();

    let frameCount = 0;
    function animatePageParticles() {
      pCtx.clearRect(0, 0, pageCanvas.width, pageCanvas.height);
      frameCount++;

      pParticles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw connections every other frame for performance
      if (frameCount % 2 === 0) {
        pParticles.forEach((a, i) => {
          for (let j = i + 1; j < pParticles.length; j++) {
            const b = pParticles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
              pCtx.strokeStyle = `rgba(147, 197, 253, ${0.2 * (1 - dist / 130)})`;
              pCtx.lineWidth = 0.8;
              pCtx.beginPath();
              pCtx.moveTo(a.x, a.y);
              pCtx.lineTo(b.x, b.y);
              pCtx.stroke();
            }
          }
        });
      }

      requestAnimationFrame(animatePageParticles);
    }
    animatePageParticles();
  }

  // ==========================================
  // FORM HANDLING  (FIXED: use style.display, not hidden class)
  // ==========================================
  const inquiryForm = document.getElementById('inquiryForm');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
        submitBtn.style.background = '#10b981';

        // FIX: use style.display instead of classList.toggle('hidden')
        const successMsg = document.getElementById('successMessage');
        if (successMsg) {
          successMsg.style.display = 'block';
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        setTimeout(() => {
          this.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          if (successMsg) {
            successMsg.style.display = 'none';
          }
        }, 3000);
      }, 1500);
    });
  }

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ==========================================
  // BACK TO TOP
  // ==========================================
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // TIMELINE ANIMATION
  // ==========================================
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length > 0) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
          }, index * 200);
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    timelineItems.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'all 0.6s ease';
      timelineObserver.observe(item);
    });
  }

  // ==========================================
  // PARALLAX EFFECT FOR HERO
  // ==========================================
  const heroSection = document.querySelector('.hero');
  if (heroSection && canvas) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.3;
      if (scrolled < window.innerHeight) {
        canvas.style.transform = `translateY(${rate}px)`;
      }
    });
  }

  // ==========================================
  // CARD HOVER TRANSITION
  // ==========================================
  document.querySelectorAll('.card, .product-card, .service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });

  // ==========================================
  // LAZY LOADING IMAGES
  // ==========================================
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // ==========================================
  // CURRENT YEAR IN FOOTER
  // ==========================================
  document.querySelectorAll('.current-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

});
