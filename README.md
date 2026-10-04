# syoma.place

Source for my portfolio website, https://syoma.place. It is plain HTML, CSS and JavaScript,
served by GitHub Pages straight from `main`, with no build step.

- Built with a slightly modified copy of the UIkit 3.14 framework (`css/uikit.css` holds the site theme).
- The moving letters come from a JS script that redraws the `SYOMcanvas` every frame (see `js/script.js`).

Run it locally from the repo root:

    python -m http.server 8000

then open http://localhost:8000.

Notes for developers and AI coding assistants: [.claude/CLAUDE.md](.claude/CLAUDE.md)
