import { useEffect, useState } from "react";
import Card from "./Card.jsx";

function App() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("Criatura");
  const [attack, setAttack] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/api/cartas")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setCards(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setSending(true);

    const card = {
      name: name,
      type: type,
      attack: Number(attack),
    };

    fetch("http://localhost:3000/api/cartas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(card),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return data;
      })
      .then((newCard) => {
        setCards([...cards, newCard]);
        setName("");
        setType("Criatura");
        setAttack("");
      })
      .catch((err) => setFormError(err.message))
      .finally(() => setSending(false));
  }

  function deleteCard(id) {
    fetch(`http://localhost:3000/api/cartas/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        setCards(cards.filter((card) => card.id !== id));
      })
      .catch((err) => setFormError(err.message));
  }

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  function pickRandom() {
    if (cards.length > 0) {
      setRandomCard(cards[Math.floor(Math.random() * cards.length)]);
    }
  }

  if (loading) {
    return <main><p>A carregar…</p></main>;
  }

  if (error) {
    return <main><p>Ocorreu um erro: {error}</p></main>;
  }

  return (
    <main>
      <h1>A minha coleção</h1>

      <h2>Adicionar carta</h2>
      <form onSubmit={handleSubmit}>
        <p>
          <label>
            Nome: {" "}
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
        </p>
        <p>
          <label>
            Tipo: {" "}
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Criatura">Criatura</option>
              <option value="Feitiço">Feitiço</option>
            </select>
          </label>
        </p>
        <p>
          <label>
            Ataque: {" "}
            <input
              type="number"
              value={attack}
              onChange={(e) => setAttack(e.target.value)}
            />
          </label>
        </p>
        <button type="submit" disabled={sending}>
          {sending ? "A enviar…" : "Adicionar carta"}
        </button>
        {formError && <p className="error">{formError}</p>}
      </form>

      <p>
        Tenho {cards.length} cartas · a mostrar {visible.length}
      </p>

      <div>
        <button onClick={() => setFilter("Todas")}>Todas</button>
        <button onClick={() => setFilter("Criatura")}>Só criaturas</button>
        <button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
        </button>
      </div>

      <p>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Procurar pelo nome…"
        />
      </p>

      {visible.length === 0 ? (
        <p>Nenhuma carta corresponde.</p>
      ) : (
        <ul>
          {visible.map((card) => (
            <Card key={card.id} {...card} onDelete={deleteCard} />
          ))}
        </ul>
      )}

      <h2>Carta à sorte</h2>
      <button onClick={pickRandom}>Escolher outra</button>
      {randomCard && (
        <p>
          <b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack}
        </p>
      )}
    </main>
  );
}

export default App;
