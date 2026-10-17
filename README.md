# Agenda FCFM

MVP frontend del **Calendario Digital Único de Eventos de la FCFM**. Es una aplicación React pensada para la demo del proyecto de Evaluación de Proyectos de Software.

> **Importante:** esta versión funciona solamente en local. No tiene usuarios reales, SSO, base de datos ni despliegue público. Los datos de la demo se guardan en el navegador usando `localStorage`.

## Requisitos

- Node.js 18 o superior.
- npm, incluido con Node.js.

## Cómo ejecutar la página

Desde esta carpeta, abre una terminal y ejecuta:

```bash
npm install
npm run dev
```

Vite mostrará una dirección similar a `http://localhost:5173`. Ábrela en el navegador.

Para generar una versión de producción y comprobar que el proyecto compila:

```bash
npm run build
```

## Funcionalidades disponibles

- Cartelera de eventos de la FCFM.
- Búsqueda por nombre, descripción o unidad organizadora.
- Filtros por categoría y modalidad.
- Vista de detalle con fecha, horario, ubicación e inscripción externa.
- Guardar y quitar eventos de **Mi calendario**.
- Persistencia local de eventos y agenda mediante `localStorage`.
- Creación de eventos como organizador.
- Guardado de eventos en estado borrador.
- Validación de campos obligatorios y horarios.
- Publicación de eventos en la cartelera.
- Selector de perfil demo: miembro, organizador y administrador.
- Panel administrativo visual de demostración.
- Vista de preferencias temáticas.
- Diseño responsive para computador y celular.

### Flujo sugerido para la presentación

1. Buscar un evento desde la cartelera.
2. Filtrarlo por categoría.
3. Abrir el detalle y guardarlo.
4. Entrar en **Mi calendario**.
5. Ir a **Crear evento** y publicar una actividad.
6. Abrir **Admin demo** desde el pie de página.

## Cómo está construido

### React

React permite construir la interfaz usando **componentes** pequeños y reutilizables:

- `EventCard` representa una tarjeta de evento.
- `EventForm` representa el formulario para publicar.
- `EventModal` muestra el detalle de un evento.
- `Logo` reutiliza la marca de la aplicación.

El archivo `App.tsx` coordina la página: guarda el estado de los eventos, filtros, perfil seleccionado y eventos guardados. Los hooks principales son:

- `useState`: guarda datos que cambian, como filtros o eventos guardados.
- `useEffect`: ejecuta tareas cuando la aplicación se carga o cuando cambia un dato.
- `useMemo`: calcula la lista filtrada sin repetir trabajo innecesario.

No se agregó Redux ni otra herramienta de estado global porque el MVP es pequeño. Para este alcance, `useState` y `useEffect` son más fáciles de aprender y mantener.

### Vite

Vite es la herramienta que levanta el servidor local y prepara el proyecto para producción. `vite.config.ts` configura el plugin de React y los comandos se encuentran en `package.json`.

### TypeScript

TypeScript ayuda a detectar errores antes de ejecutar la página. Los modelos centrales están en `src/types.ts`, por ejemplo, la forma que debe tener un `Event`.

### CSS

Los estilos están en `src/styles.css`. Se usa CSS normal para mantener el MVP simple y evitar agregar una dependencia adicional de estilos.

## Estructura del código

```text
src/
├── components/       Componentes visuales reutilizables
│   ├── EventCard.tsx
│   ├── EventForm.tsx
│   ├── Logo.tsx
│   └── Modal.tsx
├── data.ts            Eventos de ejemplo y catálogos
├── services/api.ts    Acceso a datos local o API de Django
├── types.ts           Tipos de TypeScript
├── App.tsx            Estado y navegación principal
├── main.tsx           Punto de entrada de React
└── styles.css         Estilos de toda la aplicación
```

## Preparación para Django

La interfaz está separada de la fuente de datos en `src/services/api.ts`. Por defecto usa datos locales. Para probar un backend Django REST local, crea un archivo `.env` en esta misma carpeta:

```env
VITE_API_URL=http://localhost:8000/api
```

Con esa variable, se usan estos endpoints:

```text
GET    /api/events/
POST   /api/events/
DELETE /api/events/:id/
```

El `POST` envía los campos del formulario y `status` (`draft` o `published`). El backend debe devolver eventos con la forma definida en `src/types.ts`. Django deberá configurar CORS y CSRF; `credentials: 'include'` ya está preparado para autenticación basada en cookies.

## Alcance pendiente

Para una siguiente iteración quedarían la autenticación SSO real, Django/PostgreSQL, integración con U-Cursos, permisos reales, notificaciones y recordatorios automáticos. Esta entrega se enfoca en demostrar el flujo principal del MVP en local.
