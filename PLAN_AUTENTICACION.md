# Plan de autenticación — OPE Urgencias

> **Rol de este documento:** plan de implementación cerrado. Lo escribe el planificador (Opus); lo ejecuta Sonnet.
> No es código de producción: los fragmentos SQL/JS son de referencia para que la implementación no tenga que re-decidir arquitectura.

---

## 1. Decisiones tomadas (no reabrir)

| Decisión | Elección | Motivo |
|---|---|---|
| **Proveedor de identidad** | **Supabase** | Auth + base de datos Postgres en uno. La BD nos sirve luego para los planes de pago sin cambiar de proveedor. |
| **Métodos de login** | **Email/contraseña + Google**. Apple **NO** de momento. | Un solo SDK da los tres. Apple exige cuenta Apple Developer (99 $/año) y solo hace falta para la App Store; esto es una PWA. |
| **Cuentas propias hechas a mano** | **Descartado** | Hashing, recuperación, tokens, RGPD… es donde salen los agujeros. Se delega en Supabase. |
| **Control de acceso (fase 1)** | **Aprobación manual** por el admin (aarnal80). Lista blanca. | Hasta que exista el pago, tú apruebas quién entra. |
| **Alcance de la fase 1** | **"Cerrar la puerta"** con login, pero dejando la estructura de datos lista para el pago. | Rápido de montar ahora, sin trabajo tirado cuando llegue el pago. |

---

## 2. La realidad técnica que condiciona todo (leer antes de implementar)

La app es **100% estática**: todas las preguntas viajan al navegador en `app/data/db.js` (~5,8 MB), servido como archivo estático por Vercel/Python.

> ⚠️ **En la fase 1, el login protege la puerta, NO el contenido.** Cualquiera con algo de maña puede descargar `db.js` directamente sin loguearse. La puerta disuade del acceso casual y de compartir el enlace, pero no es protección real del contenido.

Esto **es aceptable ahora** (app privada, entre conocidos) y **se resuelve de verdad en la fase 2** (paywall), moviendo el contenido premium detrás de una API que valide el plan antes de servirlo. La fase 1 se diseña para que ese salto sea limpio.

**Corolario para Sonnet:** no perder tiempo intentando "ocultar" `db.js` en fase 1. El objetivo es el gate de UI + la estructura de datos de usuarios/planes.

---

## 3. Arquitectura por fases

```
FASE 1 — LA PUERTA (esto es lo que se implementa ahora)
  Login obligatorio (email/pass + Google)
  Estado de cuenta: pending → approved (aprobación manual del admin)
  Campo 'plan' ya presente en la BD, aunque todo el mundo es 'free' de momento
  El contenido sigue siendo público a nivel de red (asumido)

FASE 2 — EL PAYWALL (futuro cercano, NO ahora — solo se deja preparado)
  db.js se parte en contenido libre + contenido premium
  El premium se sirve tras una serverless function (Vercel) que valida el JWT + el plan
  Integración de pago (Stripe) → webhook actualiza profiles.plan
  Aprobación manual se sustituye por "pago = acceso"
```

---

## 4. FASE 1 — Implementación detallada

### 4.1. Configuración en Supabase (panel web, sin código)

1. Crear proyecto Supabase (región Europa: `eu-west` / Frankfurt).
2. **Auth → Providers:**
   - Email: **activado**. Recomendado dejar **"Confirm email" activado** (evita emails falsos; como además apruebas a mano, doble filtro).
   - Google: activar. Requiere crear un **OAuth Client** en Google Cloud Console → obtener *Client ID* y *Client Secret* → pegarlos en Supabase.
3. **Auth → URL Configuration → Redirect URLs / Site URL:** añadir TODOS los orígenes desde los que se usa la app:
   - Dominio de producción de Vercel (`https://<tu-app>.vercel.app` y dominio propio si lo hay).
   - `http://127.0.0.1:8741` y `http://localhost:8741` (servidor local portable — ver memoria [[servidor-local-portable]]).
   - En Google Cloud, esos mismos orígenes van en *Authorized JavaScript origins* / *redirect URIs*.
4. Anotar **SUPABASE_URL** y **SUPABASE_ANON_KEY** (Project Settings → API).

> 🔑 **La `anon key` es pública por diseño** — va en el cliente y no es un secreto. Que aparezca en `db.js`/config del navegador es correcto y esperado. La seguridad la dan las políticas RLS, no ocultar la key. (El *service_role key* SÍ es secreto y **nunca** va al cliente.)

### 4.2. Esquema de base de datos (SQL a ejecutar en Supabase → SQL Editor)

Tabla `profiles` con los campos de la fase 1 **y** los que necesitará el pago, para no migrar después:

```sql
create table public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text,
  status       text not null default 'pending',   -- 'pending' | 'approved' | 'blocked'
  plan         text not null default 'free',       -- 'free' | 'premium'  (preparado para el pago)
  role         text not null default 'user',        -- 'user' | 'admin'
  created_at   timestamptz not null default now(),
  approved_at  timestamptz,
  -- campos preparados para fase 2 (nulos por ahora):
  plan_expires_at   timestamptz,
  stripe_customer_id text
);
alter table public.profiles enable row level security;

-- Cada usuario ve SOLO su propia ficha:
create policy "self read" on public.profiles
  for select using (auth.uid() = id);

-- Nadie actualiza su status/plan desde el cliente (lo hace el admin por panel / service_role):
-- (no se crea policy de update para 'user'; sin policy = denegado)

-- Alta automática: al registrarse un usuario, se crea su profile en 'pending'.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

**Aprobación manual (fase 1):** el admin entra al panel de Supabase → *Table Editor → profiles* → cambia `status` de `pending` a `approved`. Sin UI de admin todavía; se puede añadir en una fase 1.5 si el volumen lo pide.

### 4.3. Ficheros del front a crear / tocar

Como no hay build ni bundler, se **vendorea** la librería de Supabase (copiarla a `app/vendor/`) para que el service worker la cachee y **funcione offline** — no cargar desde CDN.

| Fichero | Acción | Contenido/propósito |
|---|---|---|
| `app/vendor/supabase.js` | **crear** | Copia local de `@supabase/supabase-js` (build UMD/ESM). Vendoreada para offline. |
| `app/config.js` | **crear** | `window.SUPA = { url: "...", anonKey: "..." }`. Valores públicos. |
| `app/auth/gate.js` | **crear** | Lógica de la puerta (ver 4.4). Controla el overlay, la sesión y el arranque de la app. |
| `app/index.html` | **editar** | Añadir el markup del overlay de login/pendiente (ver 4.5) y el **orden de carga**: `config.js` → `vendor/supabase.js` → `auth/gate.js` → `app.js`. |
| `app/app.js` | **editar mínimo** | Actualmente hace trabajo en el nivel superior (`const DB = window.DB`…). En fase 1 basta con el overlay tapando por encima; **no** hace falta refactor grande (ver nota 4.4). |
| `app/sw.js` | **editar** | Añadir `config.js`, `vendor/supabase.js`, `auth/gate.js` (y el CSS/markup nuevo) a `FICHEROS`, y **subir `SHELL_VER`** para invalidar caché. |
| `app/styles.css` | **editar** | Estilos del overlay (pantalla completa, z-index alto, coherente con la estética Duolingo-verde `#58CC02`). |

### 4.4. Flujo del gate (`gate.js`)

Arranque de la app, en orden:

```
1. Inicializar cliente Supabase con window.SUPA.
2. supabase.auth.getSession()
   ├─ Sin sesión  → mostrar overlay LOGIN (form email/pass + botón Google). App tapada.
   └─ Con sesión  → leer su fila en 'profiles':
        ├─ status = 'approved' → ocultar overlay, dejar usar la app. (app.js ya está corriendo detrás.)
        ├─ status = 'pending'  → overlay "Cuenta pendiente de aprobación" + botón cerrar sesión.
        └─ status = 'blocked'  → overlay "Acceso no disponible" + cerrar sesión.
3. Suscribirse a supabase.auth.onAuthStateChange para reaccionar a login/logout sin recargar.
```

**Sobre el arranque de `app.js` (decisión de diseño, importante):**
- **Enfoque recomendado para fase 1 (mínimo cambio):** *overlay que tapa*. `app.js` sigue inicializándose como hasta ahora; el overlay se muestra **por defecto** en el HTML (visible al cargar) y `gate.js` lo retira solo cuando `status = approved`. Como el contenido ya es público a nivel de red en fase 1, que la app inicialice por detrás no añade ninguna fuga.
- **No** hace falta convertir `app.js` en un `initApp()` diferido en fase 1. Ese refactor se hace en fase 2, cuando el arranque dependa de datos que llegan de la API tras validar el plan.

**Interacción con el Service Worker / PWA offline:**
- La sesión de Supabase se guarda en `localStorage` → **persiste offline**: un usuario ya aprobado que abre la PWA sin conexión sigue viendo su sesión y el gate lo deja pasar (lee el `status` cacheado / la sesión local). Diseñar el gate para **no bloquear si no hay red pero sí hay sesión válida previamente aprobada** (fallar hacia "dejar pasar" solo si ya estaba aprobado en local; si nunca se validó, pedir conexión).
- Recordar **subir `SHELL_VER`** en `sw.js` en el mismo commit, o los clientes viejos no verán el gate.

### 4.5. Overlay de login (markup en `index.html`)

Un `<div id="auth-gate">` a pantalla completa, visible por defecto, con tres estados (login / pending / blocked) que `gate.js` alterna. Debe incluir:
- Login: campo email, campo contraseña, botón "Entrar", enlace "Crear cuenta", botón "Continuar con Google", enlace "He olvidado la contraseña".
- Pending: mensaje "Tu cuenta está pendiente de aprobación. Te avisaremos." + botón "Cerrar sesión".
- Estética coherente con la marca (verde `#58CC02`, tipografía Nunito ya cargada).

---

## 5. Qué se deja preparado para el pago (sin implementarlo)

Para que la fase 2 sea una extensión y no una reescritura:

1. **Campo `plan`** ya existe en `profiles` (`free`/`premium`) + `plan_expires_at` + `stripe_customer_id` (nulos ahora).
2. **El gate ya lee `plan`** aunque hoy no haga nada con él (todos entran igual). Punto único donde luego se ramifica free/premium.
3. **No mezclar** en `db.js` una marca de "esto es premium" todavía, pero **tener presente** que en fase 2 el contenido se partirá (p. ej. `db-free.js` público + premium servido por API). No hacer nada que lo dificulte.
4. **Aprobación manual = interruptor temporal.** En fase 2, "pago confirmado" pondrá `status=approved` + `plan=premium` automáticamente vía webhook de Stripe; la aprobación a mano se retira.

---

## 6. Checklist de ejecución para Sonnet

**Supabase (panel):**
- [ ] Crear proyecto (región EU).
- [ ] Activar Email (con confirmación) y Google (OAuth client en Google Cloud).
- [ ] Configurar Redirect URLs: Vercel prod + `127.0.0.1:8741` + `localhost:8741`.
- [ ] Ejecutar el SQL de la sección 4.2 (tabla, RLS, trigger).
- [ ] Anotar `SUPABASE_URL` y `SUPABASE_ANON_KEY`.

**Front (repo):**
- [ ] Vendorear `@supabase/supabase-js` en `app/vendor/supabase.js`.
- [ ] Crear `app/config.js` con url + anonKey.
- [ ] Crear `app/auth/gate.js` con el flujo de la sección 4.4.
- [ ] Añadir overlay (sección 4.5) a `app/index.html` + orden de carga de scripts.
- [ ] Estilos del overlay en `app/styles.css`.
- [ ] Actualizar `app/sw.js`: añadir ficheros nuevos a `FICHEROS` + subir `SHELL_VER`.
- [ ] Probar: registro → aparece en `profiles` como `pending` → app tapada con "pendiente".
- [ ] Aprobar a mano en panel → recargar → entra a la app.
- [ ] Probar login con Google.
- [ ] Probar offline: usuario ya aprobado abre la PWA sin red y entra.
- [ ] Probar en el servidor local portable (`127.0.0.1:8741`) y en Vercel.

---

## 7. Riesgos y notas

- **Fuga de `db.js` en fase 1:** asumida y documentada. No es un bug, es el alcance elegido.
- **Offline + gate:** el punto más delicado. No dejar a un usuario aprobado fuera por falta de red. Priorizar sesión local válida.
- **`SHELL_VER`:** olvidar subirlo = clientes con caché vieja sin gate. Va en el mismo commit.
- **Coste:** plan gratis de Supabase sobra para esta fase (500 MB BD, 50k usuarios activos/mes). El paso a pago (Supabase Pro 25 $/mes) solo si se dispara el uso.
- **RGPD:** al pasar a pago y guardar datos personales/pagos, revisar aviso legal y política de privacidad. Anotado para fase 2.

---

*Documento de planificación. Siguiente paso: ejecutar la fase 1 con Sonnet siguiendo el checklist de la sección 6.*
