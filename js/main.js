const WHATSAPP_NUMBER = "529996465382";

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  const startedAt = performance.now();
  const minLoaderTime = 1600;

  window.addEventListener("load", () => {
    const remaining = Math.max(0, minLoaderTime - (performance.now() - startedAt));
    window.setTimeout(() => {
      loader?.classList.add("loaded");
      document.body.classList.remove("loading");
    }, remaining);
  });

  initNavbar();
  initMobileMenu();
  initReveal();
  initCounters();
  initWhatsAppForm();
  initHeroParticles();
  initTypeAccent();
  initImageMotion();
  document.getElementById("year").textContent = new Date().getFullYear();
});

function initNavbar() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initMobileMenu() {
  const btn = document.getElementById("hamburger");
  const menu = document.getElementById("mob-menu");
  if (!btn || !menu) return;

  btn.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", String(open));
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
}

function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  let hasRun = false;
  const observer = new IntersectionObserver(
    (entries) => {
      if (hasRun) return;
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        hasRun = true;
        counters.forEach((counter) => animateCounter(counter));
      });
    },
    { threshold: 0.35 }
  );

  const stats = document.getElementById("stats");
  if (stats) observer.observe(stats);
}

function animateCounter(node) {
  const target = Number(node.dataset.count || 0);
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    node.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function initWhatsAppForm() {
  const form = document.getElementById("wa-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("f-name").value.trim();
    const interest = document.getElementById("f-interest").value;
    const message = document.getElementById("f-msg").value.trim();

    if (!name || !message) {
      form.reportValidity();
      return;
    }

    const text = [
      "Hola, quiero cotizar la venta de un equipo de aire acondicionado.",
      `Nombre: ${name}`,
      `Equipo: ${interest}`,
      `Detalles: ${message}`
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });
}

function initTypeAccent() {
  const target = document.querySelector(".type-target");
  if (!target) return;

  const finalText = target.dataset.text || target.textContent.trim();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    target.textContent = finalText;
    return;
  }

  target.textContent = "";
  target.classList.add("typing");
  let index = 0;

  window.setTimeout(() => {
    const timer = window.setInterval(() => {
      target.textContent = finalText.slice(0, index + 1);
      index += 1;
      if (index >= finalText.length) window.clearInterval(timer);
    }, 82);
  }, 980);
}

function initImageMotion() {
  const heroBg = document.querySelector(".hero-bg");
  const procesoBg = document.querySelector(".proceso-bg");
  const statsBg = document.querySelector(".stats-bg");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const move = () => {
    const y = window.scrollY;
    if (heroBg) heroBg.style.transform = `translateY(${y * 0.12}px) scale(1.04)`;
    if (procesoBg) procesoBg.style.transform = `translateY(${(y - procesoBg.offsetTop) * 0.06}px) scale(1.05)`;
    if (statsBg) statsBg.style.transform = `translateY(${(y - statsBg.offsetTop) * 0.05}px) scale(1.05)`;
  };

  move();
  window.addEventListener("scroll", move, { passive: true });
}

function initHeroParticles() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  const particles = [];
  const count = reduceMotion ? 24 : 72;
  let width = 0;
  let height = 0;
  let raf = null;

  function resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles.length = 0;

    for (let i = 0; i < count; i += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.7,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: Math.random() > 0.45 ? "108, 179, 63" : "45, 108, 181"
      });
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 115) {
          ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - distance / 115)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    drawLines();

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      ctx.fillStyle = `rgba(${p.color}, 0.72)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) raf = requestAnimationFrame(frame);
  }

  resize();
  frame();
  window.addEventListener("resize", () => {
    if (raf) cancelAnimationFrame(raf);
    resize();
    frame();
  });
}
