// Luchopolis — interacciones de la página de descarga.
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Aparición de bloques al entrar en pantalla
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  // Confeti con los colores de la bandera y del juego
  const confetti = document.querySelector(".confetti");
  if (confetti && !reduced) {
    const colors = ["#e0352b", "#f9d020", "#12a150", "#f2a541", "#1f9e89"];
    for (let i = 0; i < 26; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 7 + Math.random() * 9 + "s";
      p.style.animationDelay = -Math.random() * 16 + "s";
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.appendChild(p);
    }
  }

  // Pestañas Android / Windows (abre por defecto la del sistema del visitante)
  const tabs = [...document.querySelectorAll(".tab")];
  const select = (tab) => {
    for (const t of tabs) {
      const on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", on);
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    }
  };
  tabs.forEach((t) => t.addEventListener("click", () => select(t)));
  if (!/android/i.test(navigator.userAgent) && /windows/i.test(navigator.userAgent)) {
    select(document.getElementById("t-windows"));
  }

  // Visor de capturas
  const shots = [...document.querySelectorAll(".shot")];
  const lb = document.getElementById("lightbox");
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector("figcaption");
  let current = 0;
  const show = (i) => {
    current = (i + shots.length) % shots.length;
    const img = shots[current].querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = shots[current].querySelector("figcaption").textContent;
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
  };
  shots.forEach((s, i) => s.addEventListener("click", () => {
    show(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }));
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".prev").addEventListener("click", () => show(current - 1));
  lb.querySelector(".next").addEventListener("click", () => show(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
