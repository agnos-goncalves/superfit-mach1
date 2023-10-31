import express from "express";
import dotenv from "dotenv";
import { ModalidadeService } from "./services/modalidade.service";
import { PessoaService } from "./services/pessoa.service";
import { Client } from "pg";

const app = express();
const port = 3000;

dotenv.config();

app.use(express.json());
// CRUD - CREATE READ UPDATE DELETE
const db = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

db.connect();

const pessoaService = new PessoaService(db);
const modalidadeService = new ModalidadeService(db);

// READ -------------
app.get("/pessoas", async (req, res) => {
  const users = await pessoaService.getAll();
  res.json(users);
});

app.get("/pessoas/:id", async (req, res) => {
  const { id } = req.params;
  const user = await pessoaService.find(id);
  res.json(user);
});

// CREATE
app.post("/pessoas", async (req, res) => {
  try {
    const user = pessoaService.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

// UPDATE
app.put("/pessoas/:id", async (req, res) => {
  try {
    const user = await pessoaService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

app.get("/modalidades", async (req, res) => {
  const modalidades = await modalidadeService.getAll();
  res.json(modalidades);
});

app.post("/modalidades", async (req, res) => {
  try {
    const modalidade = await modalidadeService.create(req.body);
    res.json(modalidade);
  } catch (error) {
    res.status(500).json({
      error,
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("server run", port);
  // console.log("ENV DATA", process.env.DB_NAME);
});
