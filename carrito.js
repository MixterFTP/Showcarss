// =============================================
// SHOWCARS — CARRITO GLOBAL (localStorage)
// =============================================

const CARRITO_KEY = "showcars_carrito";

// --- Leer carrito ---
function getCarrito() {
    return JSON.parse(localStorage.getItem(CARRITO_KEY) || "[]");
}

// --- Guardar carrito ---
function saveCarrito(carrito) {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
}

// --- Añadir producto ---
function añadirAlCarrito(producto) {
    const carrito = getCarrito();
    const existente = carrito.find(p => p.id === producto.id);
    if (existente) {
        existente.qty += 1;
    } else {
        carrito.push({ ...producto, qty: 1 });
    }
    saveCarrito(carrito);
    mostrarToast(producto.nombre);
    actualizarContadorNav();
}

// --- Toast de confirmación ---
function mostrarToast(nombre) {
    let toast = document.getElementById("sc-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "sc-toast";
        toast.style.cssText = `
            position: fixed;
            bottom: 90px;
            left: 24px;
            background: #111;
            border: 1px solid #E8001D;
            color: #f4f4f0;
            font-family: 'Barlow Condensed', sans-serif;
            font-size: 13px;
            letter-spacing: 2px;
            text-transform: uppercase;
            padding: 14px 20px;
            border-radius: 2px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 10px;
            transform: translateY(20px);
            opacity: 0;
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `✓ <span><strong>${nombre}</strong> añadido al carrito</span>
        <a href="carrito.html" style="color:#E8001D;text-decoration:none;margin-left:8px;font-size:11px;border:1px solid #E8001D;padding:3px 8px;">Ver →</a>`;

    // Ajustar link si estamos en subcarpeta marcas/
    if (window.location.pathname.includes("/marcas/")) {
        toast.querySelector("a").href = "../carrito.html";
    }

    setTimeout(() => { toast.style.opacity = "1"; toast.style.transform = "translateY(0)"; }, 10);
    setTimeout(() => { toast.style.opacity = "0"; toast.style.transform = "translateY(20px)"; }, 3000);
}

// --- Contador del nav ---
function actualizarContadorNav() {
    const carrito = getCarrito();
    const total = carrito.reduce((sum, p) => sum + p.qty, 0);
    document.querySelectorAll(".carrito-nav-count").forEach(el => {
        el.textContent = total > 0 ? `(${total})` : "";
    });
}

// Inicializar contador al cargar
document.addEventListener("DOMContentLoaded", actualizarContadorNav);

// =============================================
// SHOWCARS — SOPORTE EVENTOS EN CARRITO
// =============================================

function añadirEvento(evento) {
    // Los eventos gratis no van al carrito
    if (evento.precio === 0) {
        mostrarToastGratis(evento.nombre);
        return;
    }
    añadirAlCarrito({
        ...evento,
        icono: "🎫",
        tipo: "evento"
    });
}

function mostrarToastGratis(nombre) {
    let toast = document.getElementById("sc-toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "sc-toast";
        toast.style.cssText = `
            position:fixed; bottom:90px; left:24px;
            background:#111; border:1px solid rgba(255,255,255,0.15);
            color:#f4f4f0; font-family:'Barlow Condensed',sans-serif;
            font-size:13px; letter-spacing:2px; text-transform:uppercase;
            padding:14px 20px; border-radius:2px; z-index:9999;
            display:flex; align-items:center; gap:10px;
            transform:translateY(20px); opacity:0;
            transition:all 0.3s ease; max-width:320px;
        `;
        document.body.appendChild(toast);
    }
    toast.innerHTML = `✉️ <span>Te registramos para <strong>${nombre}</strong> — ¡es gratis!</span>`;
    setTimeout(() => { toast.style.opacity="1"; toast.style.transform="translateY(0)"; }, 10);
    setTimeout(() => { toast.style.opacity="0"; toast.style.transform="translateY(20px)"; }, 3200);
}
