const express = require("express");

const app = express();

// Middleware
// usando o express para converter o body em json
// para que possamos utilizar o body
app.use(express.json());

/**
 * Métodos HTTP:
 *
 * GET - Busca informação dentro do servidor
 * POST - Inserir informação dentro do servidor
 * PUT - Alterar informação dentro do servidor
 * DELETE - Deletar informação dentro do servidor
 * PATCH - Alterar uma informação específica
 *
 */

/**
 * Tipos de parâmetros:
 *
 * Route Params => Identificar recursos (Atualizar/Deletar)
 * Query Params => Filtros e paginação
 * Request Body => Conteúdo na hora de criar ou editar um recurso (JSON)
 *
 */

app.get("/", (req, res) => {
  const query = req.query;
  console.log(query);
  return res.json({ message: "Método get realizado com sucesso!" });
});

app.post("/post", (req, res) => {
  const body = req.body;
  console.log(body);
  return res.json({ message: "Os dados foram salvos com sucesso!" });
});

app.put("/put/:id", (req, res) => {
  const params = req.params;
  console.log(params.id);
  console.log(`Os dados foram do id ${params.id} foram alterados com sucesso!`);
  return res.json({
    message: `Os dados foram do id ${params.id} foram alterados com sucesso!`,
  });
});

app.delete("/delete/:id", (req, res) => {
  return res.json({ message: "Os dados foram deletados com sucesso!" });
});

app.patch("/patch/:id", (req, res) => {
  return res.json({ message: "Os dados foram alterados com sucesso!" });
});

// Porta que o servidor irá rodar
app.listen(3000);
