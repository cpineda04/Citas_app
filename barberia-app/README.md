# Barbería Dominicana — Prototipo

Prototipo funcional (React + Vite + Tailwind) del sistema de reservas para
Barbería Dominicana. Simula tres vistas: Cliente, Panel del negocio y Super
Admin, todas conectadas al mismo estado en memoria (sin backend real todavía).

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:5173

## Subir a GitHub

```bash
git init
git add .
git commit -m "Prototipo inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/TU-REPO.git
git push -u origin main
```

(Crea antes el repositorio vacío en GitHub y reemplaza la URL de arriba con la tuya.)

## Desplegar en Vercel

1. Entra a https://vercel.com y conecta tu cuenta de GitHub.
2. "Add New..." → "Project" → elige el repositorio que acabas de subir.
3. Vercel detecta automáticamente que es un proyecto Vite (Framework Preset:
   "Vite"). No hace falta cambiar nada — build command `npm run build`,
   output directory `dist`.
4. Click "Deploy". En 1-2 minutos tendrás una URL pública (algo como
   `tu-repo.vercel.app`).

Cada vez que hagas `git push` a `main`, Vercel vuelve a desplegar
automáticamente.

## Qué es esto (y qué no es)

Esto es un **prototipo de interfaz**, no la aplicación final:

- Todos los datos (citas, clientes, servicios, horarios) viven en memoria del
  navegador (`useState`) — se pierden al recargar la página.
- No hay base de datos, autenticación real, ni backend.
- Los mensajes de WhatsApp abren `wa.me` con el texto ya escrito; el usuario
  decide si los envía.
- El panel "Super Admin" muestra negocios de ejemplo ilustrativos, no
  conectados al tenant real de Barbería Dominicana.

Sirve para validar el flujo, la experiencia de usuario y la arquitectura de
pantallas antes de construir la aplicación real con base de datos y
multi-tenancy verdadero (Next.js + PostgreSQL, según lo que definimos en la
conversación de arquitectura).
