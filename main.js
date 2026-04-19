document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navAnchors = document.querySelectorAll(".nav-links a");

  const updateNavbar = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 80);
  };

  updateNavbar();
  window.addEventListener("scroll", updateNavbar, { passive: true });

  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.classList.toggle("open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  if (window.AOS) {
    AOS.init({ duration: 700, once: true, offset: 100 });
  }

  if (window.particlesJS) {
    particlesJS("hero-particles", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 850 } },
        color: { value: "#4f8ef7" },
        shape: { type: "circle" },
        opacity: { value: 0.45, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#4f8ef7",
          opacity: 0.28,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "repulse" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          repulse: { distance: 120, duration: 0.4 },
          push: { particles_nb: 4 }
        }
      },
      retina_detect: true
    });
  }

  if (window.Typed) {
    new Typed("#typed-name", {
      strings: ["Wang Ziyu", "王子煜", "a UAV Researcher", "an Autonomous Driving PhD"],
      typeSpeed: 64,
      backSpeed: 34,
      backDelay: 1500,
      loop: true
    });
  }

  const showToast = (message, type = "success") => {
    const existing = document.querySelector(".toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 2000);
  };

  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.target);
      const suffix = element.dataset.suffix || "";
      const duration = 1100;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      observer.unobserve(element);
    });
  }, { threshold: 0.35 });

  document.querySelectorAll(".stat-number").forEach((number) => statObserver.observe(number));

  const skillsSection = document.getElementById("skills");
  const progressObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      document.querySelectorAll(".bar span").forEach((bar) => {
        bar.style.setProperty("--target-width", bar.dataset.width);
        bar.classList.add("animate");
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  if (skillsSection) progressObserver.observe(skillsSection);

  const copyButton = document.getElementById("copy-bibtex");
  const bibtexTemplate = document.getElementById("bibtex-template");

  copyButton.addEventListener("click", async () => {
    const bibtex = bibtexTemplate.innerHTML.trim();

    try {
      await navigator.clipboard.writeText(bibtex);
      showToast("✓ Copied!", "success");
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = bibtex;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      showToast("✓ Copied!", "success");
    }
  });

  const contactForm = document.getElementById("contact-form");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      showToast("Please complete all required fields.", "error");
      return;
    }

    const submitButton = contactForm.querySelector("button[type='submit']");
    const originalText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending';

    try {
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm)
      });

      if (!response.ok) throw new Error("Formspree request failed");

      contactForm.reset();
      showToast("Message sent successfully.", "success");
    } catch (error) {
      showToast("Message could not be sent. Replace YOUR_FORM_ID first.", "error");
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
    }
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      navAnchors.forEach((anchor) => anchor.classList.remove("active"));
      if (activeLink) activeLink.classList.add("active");
    });
  }, {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  });

  document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));
});
