// =============================================
// SHOWCARS — MAIN SCRIPT
// =============================================

// --- LOADER ---
window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("loader").classList.add("oculto");
    }, 2000);
});

// --- CURSOR PERSONALIZADO ---
const cursor = document.getElementById("cursor");
const cursorRing = document.getElementById("cursor-ring");

document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top  = e.clientY + "px";
    setTimeout(() => {
        cursorRing.style.left = e.clientX + "px";
        cursorRing.style.top  = e.clientY + "px";
    }, 60);
});

document.querySelectorAll("a, button, input, .marca-card").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
});

// --- BARRA DE PROGRESO SCROLL ---
const scrollBar = document.getElementById("scroll-progress");

window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    scrollBar.style.width = (scrollTop / docHeight * 100) + "%";
});

// --- BOTÓN VOLVER ARRIBA ---
const backTop = document.getElementById("back-top");

window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
        backTop.classList.add("visible");
    } else {
        backTop.classList.remove("visible");
    }
});

backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// --- ANIMACIONES DE SCROLL ---
const elementos = document.querySelectorAll(".animar");

function mostrarElementos() {
    const h = window.innerHeight;
    elementos.forEach(el => {
        if (el.getBoundingClientRect().top < h - 80) {
            el.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", mostrarElementos);
window.addEventListener("load", mostrarElementos);

// --- CONTROL DE VOLUMEN ---
const video = document.getElementById("videoFondo");
const volumen = document.getElementById("volumen");

if (video && volumen) {
    volumen.addEventListener("input", () => {
        video.muted = false;
        video.volume = parseFloat(volumen.value);
    });
}

const botonMusica = document.getElementById("musica");
if (botonMusica && video) {

    // Al cargar: el video arranca muteado, reflejarlo en el botón
    botonMusica.textContent = "🔇";

    botonMusica.addEventListener("click", () => {
        if (video.muted) {
            video.muted = false;
            video.play();
            botonMusica.textContent = "🔊";
        } else {
            video.muted = true;
            botonMusica.textContent = "🔇";
        }
    });
}

// --- MENÚ HAMBURGUESA ---
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => mobileMenu.classList.toggle("open"));
}

// --- CONTADOR ANIMADO DE STATS ---
const statsSection = document.querySelector(".stats-section");
let statsAnimated = false;

if (statsSection) {
    new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
            statsAnimated = true;
            document.querySelectorAll(".stat-num").forEach(el => {
                const target = parseInt(el.dataset.target, 10);
                let start = 0;
                const step = target / (1800 / 16);
                const timer = setInterval(() => {
                    start += step;
                    if (start >= target) {
                        el.textContent = target.toLocaleString();
                        clearInterval(timer);
                    } else {
                        el.textContent = Math.floor(start).toLocaleString();
                    }
                }, 16);
            });
        }
    }, { threshold: 0.3 }).observe(statsSection);
}

// --- PARALLAX HERO ---
window.addEventListener("scroll", () => {
    const heroContent = document.querySelector(".hero-content");
    if (heroContent) {
        const scrollY = window.scrollY;
        heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
        heroContent.style.opacity = 1 - scrollY / 600;
    }
});

// --- COUNTDOWN TIMERS ---
function updateCountdowns() {
    document.querySelectorAll(".ec-timer").forEach(timer => {
        const target = new Date(timer.dataset.target).getTime();
        const now = Date.now();
        const diff = target - now;

        if (diff <= 0) {
            timer.querySelectorAll(".ec-num").forEach(n => n.textContent = "00");
            return;
        }

        const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs  = Math.floor((diff % (1000 * 60)) / 1000);

        timer.querySelector("[data-type='days']").textContent  = String(days).padStart(2, "0");
        timer.querySelector("[data-type='hours']").textContent = String(hours).padStart(2, "0");
        timer.querySelector("[data-type='mins']").textContent  = String(mins).padStart(2, "0");
        timer.querySelector("[data-type='secs']").textContent  = String(secs).padStart(2, "0");
    });
}

updateCountdowns();
setInterval(updateCountdowns, 1000);

// --- NEWSLETTER ---
function submitNewsletter(e) {
    e.preventDefault();
    document.querySelector(".newsletter-content").style.display = "none";
    document.getElementById("newsletter-ok").style.display = "block";
}
