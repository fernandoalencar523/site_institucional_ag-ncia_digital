/* ╔══════════════════════════════════════════════════════════╗
   ║   TRAÇO — AGÊNCIA CRIATIVA                              ║
   ║   server.js — Back-end Node.js + Express + SQLite       ║
   ╚══════════════════════════════════════════════════════════╝

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📚 PARA INICIANTES — O QUE É O BACK-END?
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Imagine um restaurante:
   ▸ FRONT-END = O salão: mesa, cardápio, garçom — o que você VÊ
   ▸ BACK-END  = A cozinha: onde o pedido É PROCESSADO

   O back-end recebe os dados do formulário, valida, e salva.

   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📚 O QUE É UMA API?
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   API = Application Programming Interface
   É um "contrato" de comunicação entre sistemas.
   
   Quando você envia o formulário, o JS chama:
     POST /api/contato  ← isso é a API
   O servidor recebe, salva no banco, responde:
     { sucesso: true }
   
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📚 O QUE É SQL / BANCO DE DADOS?
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

   Banco de dados = planilha superpoderosa no servidor
   SQL = linguagem para falar com o banco:
   
     SELECT * FROM contatos     ← "mostre tudo"
     INSERT INTO contatos ...   ← "adicione este contato"
     DELETE FROM contatos ...   ← "remova este contato"

   SQLite cria um arquivo "traco.db" no seu computador.
   Não precisa instalar servidor de banco — é simples!
*/

// ═══════════════════════════════════════════════════════════
// 1. IMPORTAÇÕES
// ═══════════════════════════════════════════════════════════

const express  = require("express");
const path     = require("path");
const cors     = require("cors");
const Database = require("better-sqlite3");

// ═══════════════════════════════════════════════════════════
// 2. CONFIGURAÇÃO DO SERVIDOR
// ═══════════════════════════════════════════════════════════

const app  = express();
const PORT = process.env.PORT || 3001;

// ─── Middlewares ────────────────────────────────────────────
// Middlewares = funções que processam a requisição ANTES das rotas
// (como um segurança na porta que verifica antes de deixar entrar)

// CORS: permite que o front-end (porta 3000) fale com o back (porta 3001)
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",  // Vite dev server
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

// Permite ler JSON no corpo das requisições (req.body)
app.use(express.json({ limit: "10kb" }));

// Log de todas as requisições (útil para debug)
app.use((req, res, next) => {
  const agora = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
  console.log(`[${agora}] ${req.method} ${req.url}`);
  next(); // Passa para a próxima função
});

// ═══════════════════════════════════════════════════════════
// 3. BANCO DE DADOS SQLite
// ═══════════════════════════════════════════════════════════
/*
  new Database("traco.db") cria (ou abre) o arquivo do banco.
  
  ESTRUTURA DA TABELA contatos:
  ┌────┬────────────┬───────────────────┬─────────────┬──────────────────┬─────────────────────┐
  │ id │ nome       │ email             │ telefone    │ mensagem         │ data_envio          │
  ├────┼────────────┼───────────────────┼─────────────┼──────────────────┼─────────────────────┤
  │  1 │ João Silva │ joao@email.com    │ (62) 9xxxx  │ Olá, gostaria...│ 2024-01-15 14:30:00 │
  │  2 │ Maria Luz  │ maria@empresa.com │ null        │ Preciso de...   │ 2024-01-16 09:15:00 │
  └────┴────────────┴───────────────────┴─────────────┴──────────────────┴─────────────────────┘
*/

const dbPath = path.join(__dirname, "traco.db");
const db     = new Database(dbPath);

// Ativa WAL mode (melhor performance para leituras e escritas simultâneas)
db.pragma("journal_mode = WAL");

// Cria a tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS contatos (
    id          INTEGER  PRIMARY KEY AUTOINCREMENT,
    nome        TEXT     NOT NULL CHECK(length(trim(nome)) >= 3),
    email       TEXT     NOT NULL,
    telefone    TEXT,
    mensagem    TEXT     NOT NULL CHECK(length(trim(mensagem)) >= 10),
    data_envio  DATETIME DEFAULT (strftime('%d/%m/%Y %H:%M', 'now', 'localtime')),
    ip_origem   TEXT,
    lido        INTEGER  DEFAULT 0
  )
`);

console.log(`✅ Banco de dados SQLite pronto → ${dbPath}`);
console.log("   Tabela 'contatos' criada/verificada.\n");

// ═══════════════════════════════════════════════════════════
// 4. ROTAS DA API
// ═══════════════════════════════════════════════════════════

// ─── POST /api/contato ─────────────────────────────────────
/*
  Esta rota recebe os dados do formulário do site.
  
  FLUXO COMPLETO:
  1. Usuário preenche o form no site
  2. JavaScript faz: fetch("POST /api/contato", dados)
  3. Esta função recebe os dados em req.body
  4. Valida os dados
  5. Salva no banco com SQL INSERT
  6. Retorna { sucesso: true } para o JavaScript
  7. JS exibe mensagem de sucesso para o usuário
*/
app.post("/api/contato", (req, res) => {

  // req.body = o que veio do formulário (nome, email, etc.)
  const { nome, email, telefone, mensagem } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "desconhecido";

  // ── Validação no back-end ──────────────────────────────
  // SEMPRE valide no servidor! O usuário pode desativar JS.
  const erros = [];

  if (!nome || typeof nome !== "string" || nome.trim().length < 3) {
    erros.push("Nome inválido — mínimo 3 caracteres.");
  }

  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!email || !emailRegex.test(email.trim())) {
    erros.push("E-mail inválido.");
  }

  if (!mensagem || typeof mensagem !== "string" || mensagem.trim().length < 10) {
    erros.push("Mensagem muito curta — mínimo 10 caracteres.");
  }

  // Se houver erros, responde 400 (Bad Request)
  if (erros.length > 0) {
    return res.status(400).json({
      sucesso:  false,
      mensagem: "Dados inválidos.",
      erros,
    });
  }

  // ── Salva no banco de dados ───────────────────────────
  /*
    INSERT INTO contatos = "insira um novo registro na tabela contatos"
    VALUES (?, ?, ?, ?)  = os ? são placeholders que evitam SQL Injection
    
    SQL Injection é um ataque onde o hacker coloca código SQL nos campos.
    Usar ? com .run() protege automaticamente contra isso.
  */
  try {
    const stmt = db.prepare(`
      INSERT INTO contatos (nome, email, telefone, mensagem, ip_origem)
      VALUES (?, ?, ?, ?, ?)
    `);

    const resultado = stmt.run(
      nome.trim(),
      email.trim().toLowerCase(),
      telefone?.trim() || null,   // Telefone é opcional
      mensagem.trim(),
      ip
    );

    console.log(`\n📨 NOVO CONTATO SALVO!`);
    console.log(`   ID:      ${resultado.lastInsertRowid}`);
    console.log(`   Nome:    ${nome.trim()}`);
    console.log(`   E-mail:  ${email.trim()}`);
    console.log(`   Fone:    ${telefone || "—"}`);
    console.log(`   Msg:     ${mensagem.trim().substring(0, 60)}...`);

    // Responde com sucesso (HTTP 201 = Created)
    return res.status(201).json({
      sucesso:  true,
      mensagem: "Mensagem recebida! Entraremos em contato em breve.",
      id:       resultado.lastInsertRowid,
    });

  } catch (erro) {
    console.error("❌ Erro ao salvar no banco:", erro.message);
    return res.status(500).json({
      sucesso:  false,
      mensagem: "Erro interno. Por favor, tente novamente.",
    });
  }
});

// ─── GET /api/contatos ─────────────────────────────────────
/*
  Rota para VISUALIZAR todos os contatos salvos.
  Use no navegador: http://localhost:3001/api/contatos
  
  SELECT * FROM contatos = "busque TUDO da tabela contatos"
  ORDER BY id DESC       = "do mais recente para o mais antigo"
*/
app.get("/api/contatos", (req, res) => {
  try {
    const contatos = db.prepare(
      "SELECT id, nome, email, telefone, mensagem, data_envio, lido FROM contatos ORDER BY id DESC"
    ).all();

    return res.json({
      sucesso: true,
      total:   contatos.length,
      dados:   contatos,
    });
  } catch (erro) {
    return res.status(500).json({ sucesso: false, mensagem: erro.message });
  }
});

// ─── GET /api/status ───────────────────────────────────────
// Rota de saúde — útil para checar se o servidor está online
app.get("/api/status", (req, res) => {
  const total = db.prepare("SELECT COUNT(*) as total FROM contatos").get();
  res.json({
    status:   "online",
    versao:   "1.0.0",
    contatos: total.total,
    hora:     new Date().toLocaleString("pt-BR"),
  });
});

// ═══════════════════════════════════════════════════════════
// 5. INICIA O SERVIDOR
// ═══════════════════════════════════════════════════════════

app.listen(PORT, () => {
  console.log("╔══════════════════════════════════════════╗");
  console.log("║   🚀 TRAÇO — Servidor rodando!           ║");
  console.log("╠══════════════════════════════════════════╣");
  console.log(`║   API Contato:  http://localhost:${PORT}/api/contato   ║`);
  console.log(`║   Ver dados:    http://localhost:${PORT}/api/contatos  ║`);
  console.log(`║   Status:       http://localhost:${PORT}/api/status    ║`);
  console.log("╠══════════════════════════════════════════╣");
  console.log("║   Ctrl+C para encerrar                   ║");
  console.log("╚══════════════════════════════════════════╝\n");
});

// Encerra o banco corretamente ao parar o servidor
process.on("SIGINT", () => {
  db.close();
  console.log("\n🛑 Servidor encerrado com segurança.");
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Erro não tratado:", err.message);
});
