/* Prefix public/ files with Vite's base URL so the site also works when it is
   served from a sub-path (e.g. GitHub Pages: username.github.io/portfolio/). */
export const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
