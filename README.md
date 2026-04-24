# 🎨 Traço — Agência Criativa
### Site Profissional Completo: Front-end + Back-end + Banco de Dados

---

## 📚 GUIA COMPLETO PARA INICIANTES

Antes de rodar o projeto, vamos entender o que cada parte faz.

---

## 🏗️ ESTRUTURA DO PROJETO

```
traco-projeto/
├── 📁 frontend/
│   └── index.html         ← O site (HTML + CSS + JavaScript)
│
├── 📁 backend/
│   ├── server.js          ← O servidor Node.js
│   ├── package.json       ← Lista de dependências
│   └── traco.db           ← Banco de dados (criado automaticamente)
│
└── README.md              ← Este arquivo
```

---

## 📚 CONCEITOS FUNDAMENTAIS

### O QUE É O FRONT-END?
É tudo que o usuário **vê e interage** no navegador:
- O site visualmente (HTML + CSS)
- As animações
- O formulário de contato
- A validação dos campos

**Arquivos:** `frontend/index.html`

---

### O QUE É O BACK-END?
É o "servidor" — um programa que roda no seu computador
(ou em um servidor na internet) e fica **aguardando requisições**.

Quando o usuário envia o formulário:
1. O JavaScript chama o back-end: `POST /api/contato`
2. O back-end recebe os dados
3. Valida tudo
4. Salva no banco de dados
5. Retorna uma resposta: `{ sucesso: true }`

**Arquivos:** `backend/server.js`

---

### O QUE É UMA API?
API = Application Programming Interface

É como um **garçom** num restaurante:
- Você (front-end) faz o pedido ao garçom (API)
- O garçom leva à cozinha (back-end)
- A cozinha prepara e devolve ao garçom
- O garçom traz a resposta para você

Neste projeto, a API tem 3 "endereços":

| Método | URL              | O que faz                        |
|--------|------------------|----------------------------------|
| POST   | /api/contato     | Recebe e salva um novo contato   |
| GET    | /api/contatos    | Lista todos os contatos salvos   |
| GET    | /api/status      | Verifica se o servidor está online |

---

### O QUE É BANCO DE DADOS?
É onde os dados ficam **salvos permanentemente**.

Imagine uma planilha do Excel no servidor:

```
TABELA: contatos
┌────┬──────────────┬────────────────────┬─────────────┬──────────────────────┬──────────────────────┐
│ id │ nome         │ email              │ telefone    │ mensagem             │ data_envio           │
├────┼──────────────┼────────────────────┼─────────────┼──────────────────────┼──────────────────────┤
│  1 │ João Silva   │ joao@gmail.com     │ (62) 99999  │ Preciso de um logo…  │ 15/01/2024 14:30     │
│  2 │ Maria Lopes  │ maria@empresa.com  │ null        │ Quero fazer meu site │ 16/01/2024 09:15     │
└────┴──────────────┴────────────────────┴─────────────┴──────────────────────┴──────────────────────┘
```

Usamos **SQLite** — ele cria um arquivo `traco.db` na pasta backend.
Não precisa instalar nada separado!

---

### O QUE É SQL?
SQL = Structured Query Language
É a **linguagem** para falar com o banco de dados.

```sql
-- Buscar todos os contatos:
SELECT * FROM contatos

-- Adicionar um novo contato:
INSERT INTO contatos (nome, email, mensagem) VALUES ('João', 'joao@email.com', 'Olá!')

-- Buscar apenas contatos não lidos:
SELECT * FROM contatos WHERE lido = 0

-- Contar quantos contatos temos:
SELECT COUNT(*) FROM contatos
```

---

## 🚀 COMO RODAR O PROJETO — PASSO A PASSO

### PRÉ-REQUISITO: Instalar o Node.js

1. Acesse: https://nodejs.org
2. Baixe a versão **LTS** (recomendada)
3. Instale normalmente
4. Para verificar, abra o Terminal/CMD e digite:
   ```bash
   node --version
   # Deve mostrar: v18.x.x ou superior
   ```

---

### PASSO 1 — Abrir o Terminal

**Windows:** Pressione `Win + R`, digite `cmd`, pressione Enter
**Mac:** Pressione `Cmd + Espaço`, digite `terminal`, pressione Enter

---

### PASSO 2 — Navegar até a pasta do back-end

```bash
# Substitua pelo caminho real onde você salvou o projeto:
cd /caminho/para/traco-projeto/backend

# Exemplo Windows:
cd C:\Users\SeuNome\Desktop\traco-projeto\backend

# Exemplo Mac/Linux:
cd ~/Desktop/traco-projeto/backend
```

---

### PASSO 3 — Instalar as dependências

```bash
npm install
```

Isso vai baixar:
- **express** — framework para criar o servidor web
- **better-sqlite3** — biblioteca para usar SQLite
- **cors** — permite que o front-end fale com o back-end
- **nodemon** — reinicia o servidor automaticamente (dev)

---

### PASSO 4 — Iniciar o servidor

```bash
# Modo produção:
npm start

# Modo desenvolvimento (reinicia ao editar o código):
npm run dev
```

Você deve ver:
```
╔══════════════════════════════════════════╗
║   🚀 TRAÇO — Servidor rodando!           ║
╠══════════════════════════════════════════╣
║   API Contato:  http://localhost:3001/api/contato   ║
║   Ver dados:    http://localhost:3001/api/contatos  ║
╚══════════════════════════════════════════╝
```

---

### PASSO 5 — Abrir o site

Abra o arquivo `frontend/index.html` **diretamente no navegador**:
- Clique duas vezes no arquivo, ou
- Arraste para o Chrome/Firefox

> **Nota:** O front-end funciona normalmente sem o back-end rodando.
> Quando o servidor está online, os dados são salvos no banco.
> Quando está offline, o formulário simula o envio (para demonstração).

---

## 🔍 COMO VER OS DADOS SALVOS

### Método 1 — Pelo navegador (mais fácil)
Com o servidor rodando, acesse:
```
http://localhost:3001/api/contatos
```

Você verá um JSON com todos os contatos:
```json
{
  "sucesso": true,
  "total": 2,
  "dados": [
    {
      "id": 2,
      "nome": "Maria Lopes",
      "email": "maria@empresa.com",
      "mensagem": "Quero fazer meu site",
      "data_envio": "16/01/2024 09:15"
    }
  ]
}
```

### Método 2 — DB Browser for SQLite (visual, como Excel)
1. Baixe grátis em: https://sqlitebrowser.org
2. Abra o arquivo `backend/traco.db`
3. Clique em "Browse Data"
4. Selecione a tabela "contatos"
5. Você vê todos os dados como uma planilha!

### Método 3 — Terminal (linha de comando)
```bash
# Instale o sqlite3:
# Windows: https://sqlite.org/download.html
# Mac: brew install sqlite3
# Linux: sudo apt install sqlite3

# Abra o banco:
sqlite3 backend/traco.db

# Comandos SQLite:
.tables              # Lista as tabelas
SELECT * FROM contatos;   # Mostra todos os contatos
.quit                # Sai do SQLite
```

---

## 🧪 COMO TESTAR O SISTEMA

### Teste 1 — Interface visual
1. Abra `frontend/index.html` no navegador
2. Role até a seção "Contato"
3. Tente enviar com campos vazios → deve mostrar erros
4. Preencha tudo corretamente e envie
5. Deve aparecer mensagem de sucesso

### Teste 2 — API diretamente (back-end rodando)
Use o aplicativo **Postman** (grátis: https://postman.com)
ou o comando `curl` no terminal:

```bash
# Enviar um contato via curl:
curl -X POST http://localhost:3001/api/contato \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Silva","email":"teste@email.com","mensagem":"Mensagem de teste completa"}'

# Resposta esperada:
# { "sucesso": true, "mensagem": "Mensagem recebida!", "id": 1 }
```

### Teste 3 — Verificar dados salvos
```bash
# Após enviar um contato, acesse:
http://localhost:3001/api/contatos

# Deve aparecer o contato que você enviou
```

---

## ❓ PERGUNTAS FREQUENTES

### "O formulário diz sucesso mas não vai para o banco"
Verifique se o servidor está rodando (`npm start` na pasta backend).
Se não estiver, o formulário simula o envio (isso é intencional para demonstração).

### "Erro: Cannot find module 'express'"
Execute `npm install` dentro da pasta `backend/`.

### "Erro: Port 3001 is already in use"
Outra aplicação está usando a porta 3001.
Edite `server.js` e troque `const PORT = 3001` por `3002` ou outro número.

### "Como colocar o site na internet?"
1. **Front-end:** Faça upload do `index.html` para Vercel, Netlify ou GitHub Pages (grátis)
2. **Back-end:** Use Railway (railway.app), Render (render.com) ou Heroku
3. Atualize a URL da API no `index.html`: troque `/api/contato` pela URL do seu servidor

---

## 📁 ARQUIVOS EXPLICADOS

### `backend/server.js`
- Cria o servidor Express
- Define as rotas da API (`/api/contato`, `/api/contatos`)
- Cria a tabela SQLite automaticamente
- Valida e salva os dados do formulário

### `backend/package.json`
- Lista as dependências do projeto
- Define os scripts (`npm start`, `npm run dev`)

### `backend/traco.db`
- Arquivo do banco de dados SQLite
- Criado automaticamente ao rodar o servidor
- Contém a tabela `contatos` com todos os envios

### `frontend/index.html`
- O site completo (HTML + CSS + JavaScript em um único arquivo)
- Design premium baseado na identidade visual da Traço
- Todas as seções: Hero, Serviços, Portfólio, Sobre, Contato, Footer
- Formulário com validação e envio para o back-end

---

## 🎨 PERSONALIZAÇÃO

### Alterar cores
No `index.html`, procure a seção `:root` no CSS:
```css
:root {
  --navy:        #0B1A35;   /* Azul marinho escuro */
  --electric:    #4BAADC;   /* Azul elétrico */
  --electric-lt: #7DC8EE;   /* Azul claro */
}
```

### Alterar informações de contato
Procure no HTML:
```html
<div class="contato-item-val">oi@traco.studio</div>
<div class="contato-item-val">(62) 9 9999-0000</div>
<div class="contato-item-val">Goiânia, Goiás · Brasil</div>
```

### Adicionar imagens reais ao portfólio
Substitua as divs `.proj-bg-N` por tags `<img>`:
```html
<!-- Antes: -->
<div class="proj-bg proj-bg-1"></div>

<!-- Depois: -->
<img src="imagens/projeto-voss.jpg" alt="Projeto Voss" style="width:100%;height:100%;object-fit:cover;">
```

---

## 🔒 SEGURANÇA IMPLEMENTADA

- **Validação dupla:** front-end E back-end validam os dados
- **SQL Injection:** uso de `?` placeholders (parameterized queries)
- **CORS configurado:** só o front-end autorizado acessa o back-end
- **Limite de tamanho:** JSON limitado a 10KB por requisição

---

Feito com ❤️ para a **Traço Agência Criativa**
