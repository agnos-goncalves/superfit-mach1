import { InterfaceCrud } from "./interfaces";

type PessoaModel = {
  id?: string;
  nome: string;
  email: string;
  cgc: string;
  tipo_pessoa: string;
  tipo_cadastro: string;
  ativo: string;
};

export class PessoaService implements InterfaceCrud<PessoaModel> {
  db: any;

  constructor(db: any) {
    this.db = db;
  }

  async createValidator(payload: PessoaModel) {
    return true;
  }

  async create(payload: PessoaModel): Promise<PessoaModel> {
    const { nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo } = payload;
    const query = `
    INSERT INTO pessoas (nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo) 
    values ($1,$2,$3,$4,$5,$6) Returning *;
  `;
    const values = [nome, cgc, tipo_pessoa, email, tipo_cadastro, ativo];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getAll(): Promise<PessoaModel[]> {
    const result = await this.db.query("SELECT * FROM pessoas");
    return result.rows as PessoaModel[];
  }

  async find(id: string): Promise<PessoaModel> {
    const result = await this.db.query("SELECT * FROM pessoas WHERE id=$1", [
      id,
    ]);
    return result.rows as PessoaModel;
  }

  async update(id: string, payload: PessoaModel): Promise<PessoaModel> {
    const { nome, email } = payload;
    const values = [nome, email, id];
    const result = await this.db.query(
      "UPDATE pessoas SET nome = $1, email =$2 WHERE id=$3 Returning *;",
      values
    );
    return result.rows[0];
  }
}
