/* Puerta de acceso (fase 1 del plan de autenticación).
 * Tapa la app con un overlay hasta que haya sesión y profiles.status = 'approved'.
 * No protege el contenido (ver PLAN_AUTENTICACION.md, sección 2): solo controla
 * quién entra a usar la interfaz. */
"use strict";

(function () {
  const LS_STATUS_KEY = "opeurg_auth_status_cache";

  let supa;
  try {
    supa = window.supabase.createClient(window.SUPA.url, window.SUPA.anonKey);
  } catch (e) {
    const loading = document.getElementById("auth-view-loading");
    if (loading) loading.innerHTML =
      '<p class="mini">Falta configurar la autenticación (app/config.js). ' +
      'Revisa PLAN_AUTENTICACION.md.</p>';
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
    if (!email || !password) return mostrarError("Escribe email y contraseña.");
    const { error } = await supa.auth.signInWithPassword({ email, password });
    if (error) mostrarError(traducirError(error));
  });

  el.btnSignup?.addEventListener("click", async () => {
    mostrarError("");
    const email = el.email.value.trim();
    const password = el.password.value;
    if (!email || !password) return mostrarError("Escribe email y contraseña.");
    if (password.length < 6) return mostrarError("La contraseña debe tener al menos 6 caracteres.");
    const { error } = await supa.auth.signUp({ email, password });
    if (error) return mostrarError(traducirError(error));
    mostrarError("Cuenta creada. Revisa tu correo para confirmarla y vuelve a entrar.");
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
    if (!email) return mostrarError("Escribe tu email arriba y pulsa de nuevo.");
    const { error } = await supa.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + window.location.pathname,
    });
    if (error) return mostrarError(traducirError(error));
    mostrarError("Te hemos enviado un email para restablecer la contraseña.");
  });

  el.btnLogoutPending?.addEventListener("click", () => supa.auth.signOut());
  el.btnLogoutBlocked?.addEventListener("click", () => supa.auth.signOut());
  el.btnLogoutAjustes?.addEventListener("click", () => supa.auth.signOut());

  function traducirError(error) {
    const msg = String(error?.message || "");
    if (/invalid login credentials/i.test(msg)) return "Email o contraseña incorrectos.";
    if (/user already registered/i.test(msg)) return "Ya existe una cuenta con ese email.";
    if (/email not confirmed/i.test(msg)) return "Confirma tu email antes de entrar (revisa tu bandeja).";
    return msg || "Ha ocurrido un error. Inténtalo de nuevo.";
  }

  supa.auth.onAuthStateChange((_event, session) => {
    comprobarPerfilYRenderizar(session);
  });

  mostrarVista("loading");
  supa.auth.getSession().then(({ data }) => comprobarPerfilYRenderizar(data.session));
})();
