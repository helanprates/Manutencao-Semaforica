require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configuração do banco de dados usando Pool do pg
const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: 5432, // geralmente 5432 para PostgreSQL
  ssl: { rejectUnauthorized: false }, // necessário para conexão segura na Vercel/Supabase
});

// Teste de conexão
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Erro ao conectar ao PostgreSQL:", err);
  }
  console.log("Conectado ao PostgreSQL!");
  release();
});

// Rota para inserir manutenção
app.post("/api/maintenance", async (req, res) => {
  const { date, time, reporter, problem, restored, address } = req.body;
  try {
    await pool.query(
      "INSERT INTO maintenance (date, time, reporter, problem, restored, address) VALUES ($1, $2, $3, $4, $5, $6)",
      [date, time, reporter, problem, restored, address]
    );
    res.status(200).send("Manutenção registrada com sucesso.");
  } catch (err) {
    console.error("Erro ao inserir:", err);
    res.status(500).send("Erro ao registrar manutenção.");
  }
});

// Rota para listar manutenções
app.get("/api/maintenance", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM maintenance");
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).send("Erro ao buscar manutenções.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});