(() => {
  const body = document.body;
  body.classList.add("loading");

  const loader = document.getElementById("loader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      loader?.classList.add("done");
      body.classList.remove("loading");
    }, 750);
  });

  const nav = document.getElementById("nav");
  const ham = document.getElementById("ham");
  const mob = document.getElementById("mob");

  const setNav = () => {
    nav?.classList.toggle("scrolled", window.scrollY > 18);
  };
  setNav();
  window.addEventListener("scroll", setNav, { passive: true });

  ham?.addEventListener("click", () => {
    const open = mob?.classList.toggle("open");
    ham.setAttribute("aria-expanded", String(Boolean(open)));
  });

  mob?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mob.classList.remove("open");
      ham?.setAttribute("aria-expanded", "false");
    });
  });

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -50px" });

  document.querySelectorAll(".rev").forEach((el) => reveal.observe(el));

  const twText = document.getElementById("twText");
  const phrases = [
    "servicio de taller",
    "refacciones premium",
    "llantas y suspensión",
    "asesoría para ciclistas",
    "accesorios de alto desempeño"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const type = () => {
    if (!twText) return;
    const current = phrases[phraseIndex];
    twText.textContent = current.slice(0, charIndex);

    if (!deleting && charIndex < current.length) {
      charIndex += 1;
      setTimeout(type, 62);
      return;
    }

    if (!deleting && charIndex === current.length) {
      deleting = true;
      setTimeout(type, 1300);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(type, 34);
      return;
    }

    deleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    setTimeout(type, 240);
  };
  type();

  const countEls = document.querySelectorAll("[data-hero-count], [data-count]");
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.heroCount || el.dataset.count || 0);
      const prefix = el.dataset.prefix || "";
      const suffix = el.dataset.suffix || "";
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${prefix}${value}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  countEls.forEach((el) => countObserver.observe(el));

  const makeParticles = (canvasId, density = 34) => {
    const canvas = document.getElementById(canvasId);
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    const colors = ["rgba(255,215,0,0.9)", "rgba(255,42,42,0.65)", "rgba(255,255,255,0.55)"];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: Math.max(12, Math.floor(width / density)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.7,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(255,215,0,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();
  };

  makeParticles("pcanvas", 26);
  makeParticles("pcanvasWhy", 38);
  makeParticles("pcanvasGaleria", 34);

  const form = document.getElementById("cForm");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const required = form.querySelectorAll("[required]");
    let valid = true;

    required.forEach((field) => {
      const input = field;
      const empty = !String(input.value || "").trim();
      input.classList.toggle("invalid", empty);
      if (empty) valid = false;
    });

    if (!valid) return;

    const nombre = String(data.get("nombre") || "").trim();
    const telefono = String(data.get("telefono") || "").trim();
    const tipo = String(data.get("tipo") || "").trim();
    const mensaje = String(data.get("mensaje") || "").trim();
    const text = [
      "Hola D'ANDA Bikes, quiero solicitar atención.",
      `Nombre: ${nombre}`,
      `Teléfono: ${telefono}`,
      `Necesito: ${tipo}`,
      mensaje ? `Mensaje: ${mensaje}` : ""
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/526673111524?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    form.reset();
  });
})();
