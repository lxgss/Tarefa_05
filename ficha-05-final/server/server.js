const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const file = path.join(__dirname, "cartas.json");

let cards = JSON.parse(fs.readFileSync(file, "utf8"));

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

function saveCards() {
  fs.writeFileSync(file, JSON.stringify(cards, null, 2));
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
  </head>
  <body>
    <nav>
      <a href="/">Início</a> ·
      <a href="/cartas">Cartas</a> ·
      <a href="/sobre">Sobre</a> ·
      <a href="/agora">Agora</a>
    </nav>
    <h1>${title}</h1>
    ${body}
  </body>
</html>`;
}

app.get("/", (req, res) => {
  res.send(page(
    "A minha coleção",
    `<p>Neste momento tenho <b>${cards.length}</b> cartas na coleção.</p>`
  ));
});

app.get("/sobre", (req, res) => {
  res.send(page(
    "Sobre",
    `<p>Feito por <b>Gian Andrade</b>, Turma TGPSI-T.</p>`
  ));
});

app.get("/cartas", (req, res) => {
  const items = cards
    .map((card) => `<li><b>${card.name}</b> — ${card.type}, ataque ${card.attack}</li>`)
    .join("");

  res.send(page("Cartas", `<ul>${items}</ul>`));
});

app.get("/cartas/aleatoria", (req, res) => {
  const card = cards[Math.floor(Math.random() * cards.length)];

  res.send(page(
    "Carta à sorte",
    `<h2>${card.name}</h2>
     <p>${card.type} · ataque ${card.attack}</p>`
  ));
});

app.get("/agora", (req, res) => {
  const now = new Date().toLocaleString("pt-PT", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  res.send(page("Agora", `<p>Este pedido foi respondido às <b>${now}</b>.</p>`));
});

// Devolve todas as cartas para a aplicação React.
app.get("/api/cartas", (req, res) => {
  res.json(cards);
});

// Acrescenta uma carta nova.
app.post("/api/cartas", (req, res) => {
  const { name, type, attack } = req.body;

  if (!name || !type) {
    return res.status(400).json({ error: "O nome e o tipo são obrigatórios" });
  }

  const newCard = {
    id: Date.now(),
    name: name,
    type: type,
    attack: Number(attack) || 0,
  };

  cards.push(newCard);
  saveCards();

  res.status(201).json(newCard);
});

// Apaga uma carta pelo seu id.
app.delete("/api/cartas/:id", (req, res) => {
  const id = Number(req.params.id);
  const oldLength = cards.length;
  cards = cards.filter((card) => card.id !== id);

  if (cards.length === oldLength) {
    return res.status(404).json({ error: "Carta não encontrada" });
  }

  saveCards();
  res.json({ message: "Carta apagada" });
});

app.use((req, res) => {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: `HTTP 404: rota ${req.path} não encontrada` });
  }

  res.status(404).send(page(
    "404 — não encontrado",
    `<p>Não existe nada em <code>${req.url}</code>.</p>
     <p><a href="/">Voltar ao início</a></p>`
  ));
});

app.listen(PORT, () => {
  console.log(`Server a correr em http://localhost:${PORT}`);
});
