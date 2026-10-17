# simar25.github.io

My portfolio website: **https://simar25.github.io**

Plain HTML, CSS and JavaScript (no framework, no build step), hosted for free on GitHub Pages.

| File | What it is |
|---|---|
| `index.html` | All the page content: about, projects, skills, education, contact |
| `style.css` | Colours (light and dark theme), layout, phone layout |
| `script.js` | Theme button, phone menu, fade-in on scroll |
| `Simarjot_Singh_Anand_Resume.pdf` | Resume linked from the site (public copy, no phone number) |
| `og-image.png` | Preview image shown when the link is shared on LinkedIn/WhatsApp |
| `.nojekyll` | Tells GitHub Pages to serve the files as they are |

## How to update the site

1. Edit `index.html` (for example, add a new `<article class="project">` block by copying an existing one).
2. Open `index.html` in your browser to check it.
3. Publish:

```
git add .
git commit -m "Describe what you changed"
git push
```

GitHub Pages rebuilds the site automatically; changes are live in about a minute.
