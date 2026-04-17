// =============================================
// SHOWCARS — FIREBASE CONFIG & HELPERS
// =============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, serverTimestamp }
    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyB4nl81dmqHkoHlpF-icDd54GsQ-VERuhk",
    authDomain: "showcarss-a3463.firebaseapp.com",
    projectId: "showcarss-a3463",
    storageBucket: "showcarss-a3463.firebasestorage.app",
    messagingSenderId: "1028918463710",
    appId: "1:1028918463710:web:f8210d8a38a3cb2eb0c64f"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// -----------------------------------------------
// AUTH: Registrar usuario
// -----------------------------------------------
export async function registrarUsuario(email, password, nombre) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    return cred.user;
}

// -----------------------------------------------
// AUTH: Iniciar sesión
// -----------------------------------------------
export async function iniciarSesion(email, password) {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
}

// -----------------------------------------------
// AUTH: Cerrar sesión
// -----------------------------------------------
export async function cerrarSesion() {
    await signOut(auth);
}

// -----------------------------------------------
// AUTH: Escuchar cambios de sesión
// -----------------------------------------------
export function escucharSesion(callback) {
    onAuthStateChanged(auth, callback);
}

// -----------------------------------------------
// FIRESTORE: Guardar pedido
// -----------------------------------------------
export async function guardarPedido(usuario, items, totales, metodoPago, datosEnvio) {
    const pedido = {
        uid:         usuario.uid,
        email:       usuario.email,
        items:       items,
        subtotal:    totales.subtotal,
        iva:         totales.iva,
        envio:       totales.envio,
        total:       totales.total,
        metodoPago:  metodoPago,
        datosEnvio:  datosEnvio,
        estado:      "confirmado",
        fechaCreado: serverTimestamp(),
        ordenId:     "SC-" + Math.floor(100000 + Math.random() * 900000)
    };

    const ref = await addDoc(collection(db, "pedidos"), pedido);
    return { id: ref.id, ordenId: pedido.ordenId };
}

// -----------------------------------------------
// FIRESTORE: Obtener historial de pedidos del usuario
// -----------------------------------------------
export async function obtenerHistorial(uid) {
    const q = query(
        collection(db, "pedidos"),
        where("uid", "==", uid),
        orderBy("fechaCreado", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export { auth, db };
