// =============================================
// SHOWCARS — BRAND PAGE SCRIPT
// =============================================

// --- Pills navegación interna ---
const pills = document.querySelectorAll(".pill");

pills.forEach(pill => {
    pill.addEventListener("click", function(e) {
        pills.forEach(p => p.classList.remove("active"));
        this.classList.add("active");
    });
});

// Actualizar pill activa al hacer scroll
const sections = ["historia", "eventos", "merch"];

window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 120) current = id;
        }
    });
    pills.forEach(pill => {
        pill.classList.remove("active");
        if (pill.getAttribute("href") === `#${current}`) {
            pill.classList.add("active");
        }
    });
});

// --- Animaciones scroll ---
const animados = document.querySelectorAll(".animar");

function checkAnimaciones() {
    const h = window.innerHeight;
    animados.forEach(el => {
        if (el.getBoundingClientRect().top < h - 80) {
            el.classList.add("visible");
        }
    });
}

window.addEventListener("scroll", checkAnimaciones);
window.addEventListener("load", checkAnimaciones);

// --- Botón música (sin video en subpáginas) ---
const botonMusica = document.getElementById("musica");
if (botonMusica) {
    botonMusica.style.display = "none"; // Ocultar si no hay video
}

// --- Feedback al agregar al carrito ---
document.querySelectorAll(".add-cart").forEach(btn => {
    btn.addEventListener("click", function() {
        const original = this.textContent;
        this.textContent = "✓ Añadido";
        this.style.background = "var(--brand-color, #E8001D)";
        this.style.borderColor = "var(--brand-color, #E8001D)";
        this.style.color = "#080808";
        setTimeout(() => {
            this.textContent = original;
            this.style.background = "";
            this.style.borderColor = "";
            this.style.color = "";
        }, 1800);
    });
});
