# Sistema de Gestión de Finanzas Personales

Aplicación con Next.js (App Router), Zustand, Bootstrap y Supabase.

## Requisitos

- Node.js 18+
- npm

## Comandos

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en desarrollo:

```bash
npm run dev
```

3. Verificar tipos:

```bash
npm run typecheck
```

4. Build de producción:

```bash
npm run build
```

## Estructura actual

- `app/` - Entradas de UI y rutas de Next.js
	- `(auth)/login`, `(auth)/register`
	- `finanzas`, `finanzas/[id]`
	- `carteras`, `carteras/[id]`
	- `presupuestos`, `presupuestos/[id]`
- `src/auth/autenticacion/` - módulo de autenticación (acciones, servicio y componentes)
- `src/modules/` - módulos de negocio (`finanzas`, `carteras`, `presupuestos`)
- `src/lib/` - infraestructura (Supabase, Brevo)
- `src/shared/` - componentes, hooks y tipos reutilizables
- `middleware.ts` - protección de rutas y control de sesión

## Notas

- La ruta raíz redirige a `/login`.
- La autenticación usa cookies HTTP-only y validación de sesión en middleware.
