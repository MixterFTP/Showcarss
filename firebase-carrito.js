// =============================================
// SHOWCARS — FIREBASE + CARRITO INTEGRATION
// =============================================
// Este módulo conecta el carrito con Firebase:
// guarda pedidos y redirige si no hay sesión.

import { escucharSesion, guardarPedido, cerrarSesion } from "./firebase.js";

let usuarioActual = null;

// Escuchar sesión y actualizar nav
escucharSesion((user) => {
    usuarioActual = user;
    actualizarNavUsuario(user);
});

function actualizarNavUsuario(user) {
    const links = document.querySelectorAll(".links");
    links.forEach(nav => {
        let link = nav.querySelector(".mi-cuenta-link");
        if (!link) return;
        if (user) {
            link.textContent = "Mi cuenta ✓";
            link.style.color = "rgba(244,244,240,0.9)";
        } else {
            link.textContent = "Mi cuenta";
            link.style.color = "";
        }
    });
}

// Leer datos del formulario de envío
function getDatosEnvio() {
    const get = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
    return {
        nombre:    get("nombre"),
        apellido:  get("apellido"),
        correo:    get("correo"),
        direccion: get("direccion"),
        ciudad:    get("ciudad"),
        estado:    get("estado"),
        cp:        get("cp"),
    };
}

// Leer totales del DOM
function getTotales() {
    const parse = (id) => {
        const el = document.getElementById(id);
        if (!el) return 0;
        return parseInt(el.textContent.replace(/[$,]/g, "")) || 0;
    };
    return {
        subtotal: parse("subtotal"),
        iva:      parse("iva"),
        envio:    parse("envio"),
        total:    parse("total"),
    };
}

// Función global llamada desde carrito.html
window.procesarPagoFirebase = async function(metodoActivo) {
    const btn = document.getElementById("btn-pagar");
    btn.disabled = true;
    btn.textContent = "PROCESANDO...";

    try {
        // Si no hay sesión, guardar intención y redirigir a login
        if (!usuarioActual) {
            sessionStorage.setItem("redir_after_login", "carrito.html");
            window.location.href = "login.html";
            return;
        }

        const carrito    = getCarrito();
        const totales    = getTotales();
        const datosEnvio = getDatosEnvio();

        // Guardar pedido en Firestore
        const { ordenId } = await guardarPedido(
            usuarioActual,
            carrito,
            totales,
            metodoActivo,
            datosEnvio
        );

        // Limpiar carrito
        saveCarrito([]);
        actualizarContadorNav();

        // Mostrar confirmación
        document.getElementById("orden-num").textContent = "# " + ordenId;
        document.getElementById("confirmacion").classList.add("visible");

    } catch (err) {
        console.error("Error guardando pedido:", err);
        btn.disabled = false;
        btn.textContent = "CONFIRMAR PAGO";
        alert("Ocurrió un error al procesar el pago. Intenta de nuevo.");
    }
};
