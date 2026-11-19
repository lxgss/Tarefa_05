# Cartas - Ficha 5

Projeto feito por Gian Andrade, da turma TGPSI-T.

A aplicação tem um cliente em React e um servidor em Express. As cartas são guardadas no ficheiro `server/cartas.json`.

## Como executar

Na pasta `server`:

```bash
npm install
npm run dev
```

Na pasta `client`, abrir outro terminal:

```bash
npm install
npm run dev
```

A aplicação React fica em `http://localhost:5173` e o servidor fica em `http://localhost:3000`.

## API

| Método | URL | O que recebe | Resposta |
|---|---|---|---|
| GET | `/api/cartas` | Nada | Devolve todas as cartas com HTTP 200. |
| POST | `/api/cartas` | JSON com `name`, `type` e `attack` | Acrescenta e guarda a carta. Responde com HTTP 201. |
| POST | `/api/cartas` | Uma carta sem `name` ou sem `type` | Não guarda a carta e responde com HTTP 400. |
| DELETE | `/api/cartas/:id` | O ID da carta no URL | Apaga a carta e responde com HTTP 200. |

## Pergunta 3

Quando acrescentamos uma carta, aparecem dois pedidos no separador Network: primeiro o `OPTIONS` e depois o `POST`.

O `OPTIONS` é um pedido de verificação feito pelo browser para confirmar se o servidor permite a comunicação entre origens diferentes. Antes de instalar o CORS, o browser bloqueava o pedido `POST`, por isso o código da rota não chegava a ser executado e o `console.log` não aparecia no terminal.

## Pergunta 4

Na primeira versão, a carta nova ficava guardada apenas no estado do React e desaparecia ao atualizar a página com F5.

Na segunda versão, a carta ficava guardada no array do servidor, mas desaparecia quando o servidor era reiniciado.

Na terceira versão, a carta fica guardada no ficheiro `cartas.json`, mantendo-se depois de atualizar a página ou reiniciar o servidor.

## Git e GitHub

O projeto deve ter um commit por tarefa e um `git push` depois de cada commit. O ficheiro `node_modules` está no `.gitignore` e não deve ser enviado para o repositório.
