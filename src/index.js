const express = require("express");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(express.json());

const customers = [];

/**
 * CPF - string
 * name - string
 * id - uuid
 * statement []
 */

// O middleware também pode ser usado dessa forma
// quando todas as rotas vão usar o mesmo middleware:
// app.use(verifyIfExistsAccountCPF)

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return res.status(400).json({ error: "Customer not found!" });
  }

  req.customer = customer;

  return next();
}

function customerAlreadyExists(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.some((customer) => customer.cpf === cpf);

  if (customer) {
    return res.status(400).json({ error: "Customer already exists!" });
  }

  return next();
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

// Rotas da aplicação

// Rotas de get
app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
});

app.get("/statement/date", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter(
    (statement) =>
      statement.created_at.toDateString() ===
      new Date(dateFormat).toDateString()
  );

  return res.json({ message: "Statement by date successfully!", statement});
});

app.get("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  return res.json(customer);
});

app.get("/balance", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  const balance = getBalance(customer.statement);

  return res.json({ messae: "Balance successfully!", balance });
});

// Rotas de post
app.post("/account", customerAlreadyExists, (req, res) => {
  const { cpf, name } = req.body;

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement: [],
  });

  return res.status(201).send({
    Mensagem: "Account created successfully!",
    CPF: `${cpf}`,
    Name: `${name}`,
  });
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { description, amount } = req.body;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return res.status(201).send({
    message: "Deposit successfully!",
    description: `${description}`,
    amount: `${amount}`,
  });
});

app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;
  const { amount } = req.body;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: "Insufficient funds!" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);

  return res.status(201).send({
    message: "Withdraw successfully!",
    amount: `Seu saldo atual é de R$${amount}`,
  });
});

// Rotas de put e delete

app.put("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { name } = req.body;
  const { customer } = req;

  customer.name = name;

  return res.status(201).send({
    message: "Account updated successfully!",
    name: `${name}`,
  });
});

app.delete("/account", verifyIfExistsAccountCPF, (req, res) => {
  const { customer } = req;

  // splice
  customers.splice(customer, 1);

  return res.status(200).json({ message: "Account deleted successfully!"});
});

app.listen(3000, () => console.log("Server is running on port 3000"));
