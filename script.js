/* ─── BarberElite — script.js ─── */
"use strict";

/* ══════════════════════════════════
   1. HAMBURGER / SCISSORS TOGGLE
══════════════════════════════════ */
const hamburger = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobileNav");
const mobileOverlay = document.getElementById("mobileOverlay");
const mobileLinks = document.querySelectorAll(".mobile-link");

function openMenu() {
  hamburger.classList.add("active");
  hamburger.setAttribute("aria-expanded", "true");
  mobileNav.classList.add("active");
  mobileOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  hamburger.classList.remove("active");
  hamburger.setAttribute("aria-expanded", "false");
  mobileNav.classList.remove("active");
  mobileOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

hamburger.addEventListener("click", () => {
  hamburger.classList.contains("active") ? closeMenu() : openMenu();
});

mobileOverlay.addEventListener("click", closeMenu);

mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

/* ══════════════════════════════════
   2. STICKY HEADER
══════════════════════════════════ */
const header = document.getElementById("header");

function handleHeaderScroll() {
  if (window.scrollY > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleHeaderScroll, { passive: true });

/* ══════════════════════════════════
   3. PARALLAX HERO
══════════════════════════════════ */
const heroBg = document.getElementById("heroBg");

function handleParallax() {
  const scrollY = window.scrollY;
  if (heroBg && scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${scrollY * 0.35}px)`;
  }
}

window.addEventListener("scroll", handleParallax, { passive: true });

/* ══════════════════════════════════
   4. SCROLL REVEAL (Intersection Observer)
══════════════════════════════════ */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // stagger sibling reveals slightly
        const siblings = Array.from(
          entry.target.parentElement.querySelectorAll(".reveal:not(.visible)"),
        );
        const siblingIdx = siblings.indexOf(entry.target);
        const delay = siblingIdx >= 0 ? Math.min(siblingIdx * 80, 400) : 0;

        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ══════════════════════════════════
   5. COUNTER ANIMATION (Hero Stats)
══════════════════════════════════ */
const counters = document.querySelectorAll("[data-target]");
let countersDone = false;

function animateCounters() {
  if (countersDone) return;
  const heroSection = document.getElementById("home");
  if (!heroSection) return;

  const rect = heroSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    countersDone = true;
    counters.forEach((counter) => {
      const target = +counter.getAttribute("data-target");
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target.toLocaleString("tr-TR");
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current).toLocaleString("tr-TR");
        }
      }, 16);
    });
  }
}

window.addEventListener("scroll", animateCounters, { passive: true });
animateCounters(); // run once on load

/* ══════════════════════════════════
   6. TESTIMONIALS SLIDER
══════════════════════════════════ */
const track = document.getElementById("testimonialsTrack");
const prevBtn = document.getElementById("sliderPrev");
const nextBtn = document.getElementById("sliderNext");
const dotsWrap = document.getElementById("sliderDots");

let currentSlide = 0;
let slideCount = 0;
let autoplayTimer;

function initSlider() {
  if (!track) return;
  slideCount = track.children.length;

  // Create dots
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement("button");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Yorum ${i + 1}`);
    dot.addEventListener("click", () => goToSlide(i));
    dotsWrap.appendChild(dot);
  }

  startAutoplay();
}

function goToSlide(index) {
  currentSlide = (index + slideCount) % slideCount;
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

function startAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, 5000);
}

prevBtn?.addEventListener("click", () => {
  goToSlide(currentSlide - 1);
  startAutoplay();
});

nextBtn?.addEventListener("click", () => {
  goToSlide(currentSlide + 1);
  startAutoplay();
});

// Touch/swipe support
let touchStartX = 0;
track?.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].clientX;
  },
  { passive: true },
);
track?.addEventListener("touchend", (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    startAutoplay();
  }
});

initSlider();

/* ══════════════════════════════════
   7. APPOINTMENT FORM
══════════════════════════════════ */
const form = document.getElementById("appointmentForm");
const success = document.getElementById("apptSuccess");
const submitBtn = document.getElementById("submitBtn");

// Set minimum date to today
const dateInput = document.getElementById("apptDate");
if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.setAttribute("min", today);
}

function showError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (field && error) {
    field.style.borderColor = "#e74c3c";
    error.textContent = message;
  }
}

function clearErrors() {
  document
    .querySelectorAll(".form-error")
    .forEach((el) => (el.textContent = ""));
  document
    .querySelectorAll(
      ".form-group input, .form-group select, .form-group textarea",
    )
    .forEach((el) => {
      el.style.borderColor = "";
    });
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name = document.getElementById("apptName");
  const phone = document.getElementById("apptPhone");
  const service = document.getElementById("apptService");
  const date = document.getElementById("apptDate");
  const time = document.getElementById("apptTime");

  if (!name.value.trim() || name.value.trim().length < 3) {
    showError("apptName", "nameError", "Lütfen geçerli bir ad soyad giriniz.");
    valid = false;
  }

  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  const cleanPhone = phone.value.replace(/[\s\-\(\)]/g, "");
  if (!phoneRegex.test(cleanPhone)) {
    showError(
      "apptPhone",
      "phoneError",
      "Lütfen geçerli bir telefon numarası giriniz.",
    );
    valid = false;
  }

  if (!service.value) {
    showError("apptService", "serviceError", "Lütfen bir hizmet seçiniz.");
    valid = false;
  }

  if (!date.value) {
    showError("apptDate", "dateError", "Lütfen bir tarih seçiniz.");
    valid = false;
  }

  if (!time.value) {
    showError("apptTime", "timeError", "Lütfen saat seçiniz.");
    valid = false;
  }

  return valid;
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  // Show loading state
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");
  btnText.style.display = "none";
  btnLoading.style.display = "inline";
  submitBtn.disabled = true;

  // Simulate processing (replace with real API call)
  await new Promise((resolve) => setTimeout(resolve, 1800));

  // Show success
  form.style.display = "none";
  success.style.display = "block";

  // Scroll into view
  success.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Real-time validation feedback
document
  .querySelectorAll("#appointmentForm input, #appointmentForm select")
  .forEach((el) => {
    el.addEventListener("input", () => {
      el.style.borderColor = "";
      const errorSpan = document.getElementById(
        el.id.replace("appt", "").toLowerCase() + "Error",
      );
      if (errorSpan) errorSpan.textContent = "";
    });
  });

/* ══════════════════════════════════
   8. SMOOTH SCROLL (Nav links)
══════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: "smooth" });
    }
  });
});

/* ══════════════════════════════════
   9. ACTIVE NAV LINK (scroll spy)
══════════════════════════════════ */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    }
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });

/* ══════════════════════════════════
   10. INIT
══════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  handleHeaderScroll();
  animateCounters();
  updateActiveNav();
});

console.log(
  "%cBarberElite ✂ — Developed with passion",
  "color:#c9a96e;font-size:14px;font-weight:bold;",
);
