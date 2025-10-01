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

