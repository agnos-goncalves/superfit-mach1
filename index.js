const express = require("express");
const app = express();
const port = 3000;
const { Client } = require("pg");

app.use(express.json());

// CRUD - CREATE READ UPDATE DELETE
const db = new Client({
  user: "postgres",
  host: "localhost",
  database: "superfit",
  password: "123",
  port: 5432,
});

db.connect();

// READ -------------
app.get("/pessoas", async (req, res) => {
  const result = await db.query("SELECT * FROM pessoas");
  res.json(result.rows);
});

app.get("/pessoas/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.query("SELECT * FROM pessoas WHERE id=$1", [id]);
  res.json(result.rows[0]);
});

// CREATE
app.post("/pessoas", async (req, res) => {
  try {
    const { nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo } = req.body;
    const query = `
      INSERT INTO pessoas (nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo) 
      values ($1,$2,$3,$4,$5,$6) Returning *;
    `;
    const values = [nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo];
    const result = await db.query(query, values);
    res.json(result.row[0]);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("server run", port);
});
