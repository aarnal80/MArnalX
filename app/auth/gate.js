/* Puerta de acceso (fase 1 del plan de autenticación).
 * Tapa la app con un overlay hasta que haya sesión y profiles.status = 'approved'.
 * No protege el contenido (ver PLAN_AUTENTICACION.md, sección 2): solo controla
 * quién entra a usar la interfaz. */
"use strict";

// The gate remains disabled during this local build so we can validate the
// study experience before enabling accounts for a real deployment.
const GATE_DISABLED_FOR_TESTING = true;

(function () {
  if (GATE_DISABLED_FOR_TESTING) {
    const gate = document.getElementById("auth-gate");
    if (gate) gate.classList.add("hidden");
    return;
  }

  const LS_STATUS_KEY = "estudios_auth_status_cache";

  let supa;
  try {
    supa = window.supabase.createClient(window.SUPA.url, window.SUPA.anonKey);
  } catch (e) {
    const loading = document.getElementById("auth-view-loading");
    if (loading) loading.innerHTML =
      '<p class="mini">La autenticación todavía no está configurada (app/config.js).</p>';
    return;
  }
  window.SUPA_CLIENT = supa;

  const el = {
    gate: document.getElementById("auth-gate"),
    views: {
      loading: document.getElementById("auth-view-loading"),
      login: document.getElementById("auth-view-login"),
      pending: document.getElementById("auth-view-pending"),
      blocked: document.getElementById("auth-view-blocked"),
    },
    error: document.getElementById("auth-login-error"),
    email: document.getElementById("auth-email"),
    password: document.getElementById("auth-password"),
    btnLogin: document.getElementById("auth-btn-login"),
    btnSignup: document.getElementById("auth-btn-signup"),
    btnGoogle: document.getElementById("auth-btn-google"),
    btnForgot: document.getElementById("auth-btn-forgot"),
    btnLogoutPending: document.getElementById("auth-btn-logout-pending"),
    btnLogoutBlocked: document.getElementById("auth-btn-logout-blocked"),
    cuentaEmail: document.getElementById("ajustes-cuenta-email"),
    btnLogoutAjustes: document.getElementById("btn-logout-ajustes"),
  };

  function mostrarVista(nombre) {
    el.gate.classList.remove("hidden");
    Object.entries(el.views).forEach(([key, node]) => {
      if (node) node.classList.toggle("hidden", key !== nombre);
    });
  }

  function ocultarGate(email) {
    el.gate.classList.add("hidden");
    if (el.cuentaEmail && email) el.cuentaEmail.textContent = "Sesión iniciada como " + email;
  }

  function mostrarError(msg) {
    if (!el.error) return;
    el.error.textContent = msg;
    el.error.classList.toggle("hidden", !msg);
  }

  async function comprobarPerfilYRenderizar(session) {
    if (!session) {
      mostrarError("");
      mostrarVista("login");
      return;
    }
    try {
      const { data, error } = await supa
        .from("profiles")
        .select("status")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;
      localStorage.setItem(LS_STATUS_KEY, data.status);
      if (data.status === "approved") ocultarGate(session.user.email);
      else if (data.status === "blocked") mostrarVista("blocked");
      else mostrarVista("pending");
    } catch (err) {
      // Sin red: si la última comprobación con éxito fue 'approved', dejamos pasar
      // (la app también funciona offline vía service worker). Si no, pedimos esperar.
      const cache = localStorage.getItem(LS_STATUS_KEY);
      if (cache === "approved") ocultarGate(session.user.email);
      else mostrarVista("pending");
    }
  }

  el.btnLogin?.addEventListener("click", async () => {
    mostrarError("");
    const email = el.email.value.trim();
    const password = el.password.value;
    if (!email || !password) return mostrarError("Introduce tu correo y contraseña.");
    const { error } = await supa.auth.signInWithPassword({ email, password });
    if (error) mostrarError(traducirError(error));
  });

  el.btnSignup?.addEventListener("click", async () => {
    mostrarError("");
    const email = el.email.value.trim();
    const password = el.password.value;
    if (!email || !password) return mostrarError("Introduce tu correo y contraseña.");
    if (password.length < 6) return mostrarError("La contraseña debe tener al menos 6 caracteres.");
    const { error } = await supa.auth.signUp({ email, password });
    if (error) return mostrarError(traducirError(error));
    mostrarError("Cuenta creada. Confirma tu correo y vuelve a iniciar sesión.");
  });

  el.btnGoogle?.addEventListener("click", async () => {
    mostrarError("");
    const { error } = await supa.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    if (error) mostrarError(traducirError(error));
  });

  el.btnForgot?.addEventListener("click", async () => {
    mostrarError("");
    const email = el.email.value.trim();
    if (!email) return mostrarError("Introduce tu correo arriba y vuelve a pulsar.");
    const { error } = await supa.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });
    if (error) return mostrarError(traducirError(error));
    mostrarError("Te hemos enviado un correo para restablecer la contraseña.");
  });

  el.btnLogoutPending?.addEventListener("click", () => supa.auth.signOut());
  el.btnLogoutBlocked?.addEventListener("click", () => supa.auth.signOut());
  el.btnLogoutAjustes?.addEventListener("click", () => supa.auth.signOut());

  function traducirError(error) {
    const msg = String(error?.message || "");
    if (/invalid login credentials/i.test(msg)) return "Correo o contraseña incorrectos.";
    if (/user already registered/i.test(msg)) return "Ya existe una cuenta con ese correo.";
    if (/email not confirmed/i.test(msg)) return "Confirma tu correo antes de iniciar sesión.";
    return msg || "Algo ha fallado. Inténtalo de nuevo.";
  }

  supa.auth.onAuthStateChange((_event, session) => {
    comprobarPerfilYRenderizar(session);
  });

  mostrarVista("loading");
  supa.auth.getSession().then(({ data }) => comprobarPerfilYRenderizar(data.session));
})();
