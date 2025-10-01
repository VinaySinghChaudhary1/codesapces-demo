# codespace-demo

A tiny **Notes** web app built for GitHub Codespaces. This demo shows how to create a minimal Node.js + Express backend and a single-page frontend (HTML + JS) that lets you add/delete notes. It's intentionally simple (in-memory storage) so you can run it quickly inside a Codespace.

---

## Features

* Minimal Express server (`index.js`) exposing a small REST API

  * `GET /api/notes` — list notes
  * `POST /api/notes` — add a note (`{ text: "..." }`)
  * `DELETE /api/notes/:id` — delete a note
* Single static page served from `public/index.html` with a tiny JS UI
* No database — notes are stored in memory (reset when server restarts)

---

## Files in this repo

* `index.js` — Express server
* `public/index.html` — frontend UI
* `package.json` — created by `npm init -y`

---

## Prerequisites

### Using GitHub Codespaces (recommended for this demo)

* A GitHub account with access to Codespaces (or the option to create one)
* No local setup required — Codespaces provides Node.js and a terminal

### Or running locally on Ubuntu/Windows/macOS

* Node.js (v14+) and npm installed
* Git (optional)

---

## Quick start (inside a Codespace)

Copy and paste the exact commands below into the **Codespaces terminal**.

```bash
# 1) sanity check (optional)
node -v && npm -v

# 2) initialize project and install Express
npm init -y
npm install express

# 3) create folder for static files
mkdir -p public

# 4) create index.js (paste the server content when prompted)
cat > index.js <<'EOF'
// index.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// in-memory notes store
let notes = [
  { id: 1, text: 'Welcome to Codespace demo!' }
];

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const text = req.body.text;
  if (!text) return res.status(400).json({ error: 'text required' });
  const id = notes.length ? notes[notes.length - 1].id + 1 : 1;
  const note = { id, text };
  notes.push(note);
  res.json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = notes.findIndex(n => n.id === id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const removed = notes.splice(idx, 1)[0];
  res.json(removed);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
EOF

# 5) create public/index.html
cat > public/index.html <<'EOF'
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Codespace Demo — Notes</title>
</head>
<body>
  <h1>Codespace Demo — Notes</h1>

  <form id="noteForm">
    <input id="noteInput" placeholder="Write a note" required />
    <button>Add</button>
  </form>

  <ul id="notesList"></ul>

  <script>
    async function loadNotes(){
      const res = await fetch('/api/notes');
      const notes = await res.json();
      const ul = document.getElementById('notesList');
      ul.innerHTML = '';
      notes.forEach(n => {
        const li = document.createElement('li');
        li.textContent = n.text + ' ';
        const btn = document.createElement('button');
        btn.textContent = 'Delete';
        btn.onclick = async () => {
          await fetch('/api/notes/' + n.id, { method: 'DELETE' });
          loadNotes();
        };
        li.appendChild(btn);
        ul.appendChild(li);
      });
    }

    document.getElementById('noteForm').onsubmit = async (e) => {
      e.preventDefault();
      const text = document.getElementById('noteInput').value.trim();
      if (!text) return;
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      document.getElementById('noteInput').value = '';
      loadNotes();
    };

    loadNotes();
  </script>
</body>
</html>
EOF

# 6) start the server
node index.js
```

When the server starts you should see:

```
Server running on http://localhost:3000
```

---

## How to open the app in Codespaces

1. In the Codespaces UI, open the **Ports** panel (bottom or right side).
2. Find port **3000**. Click the globe icon or **Open in Browser**.
3. The preview or new tab will show the frontend.

> Tip: If you want others to access the forwarded URL, you can set the port visibility to **Public** from the Ports panel.

---

## How to "Try it" (testing)

* In the page UI:

  1. Type a note in the input box (e.g. `Hello Codespaces 👋`).
  2. Click **Add** — the app will POST to `/api/notes` and update the list.
  3. Click **Delete** next to any note to remove it (calls `DELETE /api/notes/:id`).

* From the terminal (example curl commands):

```bash
# list notes
curl -s http://localhost:3000/api/notes | jq

# add a note
curl -X POST http://localhost:3000/api/notes -H "Content-Type: application/json" -d '{"text":"hi from curl"}'

# delete a note (replace 1 with the id)
curl -X DELETE http://localhost:3000/api/notes/1
```

> Note: When testing from within Codespaces you can run these curl commands in the Codespace terminal. If you use the forwarded browser URL, replace `localhost:3000` with the forwarded URL shown by Codespaces.

---

## Commit & push your changes

Use the built-in Source Control panel or run:

```bash
git add .
git commit -m "Add Codespace demo notes app"
git push origin main
```

---

## Useful extras

* **Auto-restart on code change**:

  ```bash
  npm install --save-dev nodemon
  npx nodemon index.js
  ```
* **Run locally (non-Codespace)**: clone the repo, `npm install`, `node index.js`, then open `http://localhost:3000`.

---

## Troubleshooting

* **Port 3000 not showing in Ports panel**: Ensure your server actually started (`Server running on http://localhost:3000`) and that it is binding to `0.0.0.0` or the default Codespaces binding. If it’s still not visible, try restarting the Codespace.
* **Node or npm not found**: Codespaces normally includes Node. If missing, you can install via `nvm` or use a devcontainer to provide node.
* **Changes disappeared**: Notes are stored in memory; server restart clears them.

---

## Next steps (ideas)

* Persist notes into a JSON file or a real DB (SQLite, MongoDB)
* Add edit functionality
* Add user authentication
* Create a `devcontainer.json` to pin Node version and extensions for reproducible Codespaces

---

## License

MIT — feel free to copy and modify.

---

## Author

Your friendly Codespaces helper — ask me if you want a Python/Flask version or a `devcontainer.json` to pin environment settings.
