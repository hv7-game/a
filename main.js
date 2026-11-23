/* ==========================================================================
   HV7 GAME — JavaScript
   Mobile nav, carousel, back-to-top, smooth scroll, download button, year
   ========================================================================== */

(function () {
  "use strict";

  // ---------- Dynamic Footer Year ----------
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // ---------- Mobile Navigation ----------
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const isOpen = navLinks.classList.contains("open");
      navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", !isOpen);
      navToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  // ---------- Carousel / Slider ----------
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  const indicators = document.querySelectorAll(".indicator");
  const slides = document.querySelectorAll(".carousel-slide");

  let currentIndex = 0;
  let slideWidth = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 5000;

  if (track && slides.length) {
    function updateSlideWidth() {
      slideWidth = track.clientWidth;
      updateTransform();
    }

    function updateTransform() {
      track.style.transform = "translateX(-" + currentIndex * slideWidth + "px)";
      updateIndicators();
    }

    function updateIndicators() {
      indicators.forEach(function (ind, i) {
        const active = i === currentIndex;
        ind.classList.toggle("active", active);
        ind.setAttribute("aria-current", active ? "true" : "false");
        ind.setAttribute("aria-label", "Screenshot " + (i + 1));
      });
    }

    function goToSlide(index) {
      currentIndex = (index + slides.length) % slides.length;
      updateTransform();
      resetAutoplay();
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", prevSlide);
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", nextSlide);
    }

    indicators.forEach(function (ind) {
      ind.addEventListener("click", function () {
        const idx = parseInt(ind.getAttribute("data-slide"), 10);
        if (!isNaN(idx)) {
          goToSlide(idx);
        }
      });
    });

    // Pause autoplay on hover
    track.addEventListener("mouseenter", function () {
      clearInterval(autoplayTimer);
    });

    track.addEventListener("mouseleave", function () {
      startAutoplay();
    });

    function startAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    window.addEventListener("resize", function () {
      updateSlideWidth();
    });

    // Touch swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
      clearInterval(autoplayTimer);
    });

    track.addEventListener("touchend", function (e) {
      if (!isDragging) return;
      isDragging = false;
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextSlide();
        else prevSlide();
      } else {
        startAutoplay();
      }
    });

    // Initialize
    updateSlideWidth();
    startAutoplay();
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        // Close mobile menu if open
        if (navLinks) {
          navLinks.classList.remove("open");
          if (navToggle) {
            navToggle.setAttribute("aria-expanded", "false");
            navToggle.setAttribute("aria-label", "Open menu");
          }
        }
      }
    });
  });

  // ---------- Back to Top Button ----------
  const toTopBtn = document.getElementById("toTop");

  if (toTopBtn) {
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        toTopBtn.classList.add("visible");
        toTopBtn.removeAttribute("hidden");
      } else {
        toTopBtn.classList.remove("visible");
        toTopBtn.setAttribute("hidden", "");
      }
    }

    window.addEventListener("scroll", toggleBackToTop);
    // Initial check
    toggleBackToTop();

    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---------- Download Button Behavior ----------
  const downloadBtn = document.getElementById("downloadBtn");

  if (downloadBtn) {
    downloadBtn.addEventListener("click", function () {
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "polite");
      announcement.className = "sr-only";
      announcement.textContent = "Redirecting to HV7 GAME official download page.";
      document.body.appendChild(announcement);
      setTimeout(function () {
        if (announcement.parentNode) {
          announcement.parentNode.removeChild(announcement);
        }
      }, 5000);
    });
  }
})();