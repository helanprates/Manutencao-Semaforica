import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  port: 5432,
  ssl: { rejectUnauthorized: false },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    let body = req.body;
    // Vercel pode não fazer o parse automático do JSON
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
    const { date, time, reporter, problem, restored, address } = body;
    try {
      await pool.query(
        "INSERT INTO maintenance (date, time, reporter, problem, restored, address) VALUES ($1, $2, $3, $4, $5, $6)",
        [date, time, reporter, problem, restored, address]
      );
      res.status(200).send("Manutenção registrada com sucesso.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Erro ao registrar manutenção.");
    }
  } else if (req.method === "GET") {
    try {
      const result = await pool.query("SELECT * FROM maintenance");
      res.status(200).json(result.rows);
    } catch (err) {
      res.status(500).send("Erro ao buscar manutenções.");
    }
  } else {
    res.status(405).send("Método não permitido");
  }
}