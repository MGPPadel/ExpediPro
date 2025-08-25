// Importar funciones de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    onSnapshot 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBMyDgQDU58NZhC4_4jupw1QoVJpKo6QXo",
  authDomain: "abogapp-c3166.firebaseapp.com",
  projectId: "abogapp-c3166",
  storageBucket: "abogapp-c3166.appspot.com",
  messagingSenderId: "138541502606",
  appId: "1:138541502606:web:ec236d8e1a47031bd439df",
  measurementId: "G-K2JH9J257J"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencias a elementos de autenticación
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const showForgotPasswordLink = document.getElementById('show-forgot-password');
const backToLoginLink = document.getElementById('back-to-login');
const toast = document.getElementById("toast");
let toastTimeout = null;

function showToast(msg = "Acción realizada", type = "success", ms = 2600) {
  toast.textContent = msg;
  toast.className = 'toast ' + type + ' show';
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => { toast.classList.remove('show'); }, ms);
}

// Lógica para mostrar/ocultar formularios de login/registro
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    forgotPasswordForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    forgotPasswordForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

showForgotPasswordLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    forgotPasswordForm.classList.remove('hidden');
});

backToLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    forgotPasswordForm.classList.add('hidden');
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Manejar registro
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showToast('¡Cuenta creada con éxito! Ahora puedes iniciar sesión.', 'success');
            registerForm.reset();
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        })
        .catch((error) => {
            showToast(`Error al registrar: ${error.message}`, 'error');
        });
});

// Manejar inicio de sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    signInWithEmailAndPassword(auth, email, password)
        .catch((error) => {
            showToast(`Error al iniciar sesión: ${error.message}`, 'error');
        });
});

// Manejar olvido de contraseña
forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            showToast('Se ha enviado un enlace para restablecer tu contraseña a tu email.', 'success');
            forgotPasswordForm.reset();
            forgotPasswordForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        })
        .catch((error) => {
            showToast(`Error: ${error.message}`, 'error');
        });
});

// Observador de estado de autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario ha iniciado sesión
        authContainer.classList.add('hidden');
        if (!appContainer.innerHTML.trim()) {
            const template = document.getElementById('app-template');
            appContainer.innerHTML = template.innerHTML;
        }
        appContainer.classList.remove('hidden');
        initializeAppLogic(user.uid);
    } else {
        // Usuario ha cerrado sesión
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
        appContainer.innerHTML = ''; // Limpiar el contenido de la app al cerrar sesión
    }
});

// Función principal que se ejecuta después del login
function initializeAppLogic(userId) {
    // Aquí va todo el código de la aplicación
    let contactos = [];
    let casos = [];
    let vencimientos = [];
    let facturacion = [];
    let tareas = [];

    // ... (el resto del código de la aplicación que ya teníamos)
    // ...
}
