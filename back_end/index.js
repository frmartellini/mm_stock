// creating a node api to connect to mysql database and communicate with the front end
// need to initizlize node to get node modules and configurations, for that run npm init -y
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
  
const app = express();
const port = 3000; // 4200 padrão do Angular

// get the environment variables for the database connection
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
  
/* MySQL Connection */
const db = mysql.createConnection({
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName
});
  
/* Connect to MySQL */
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

// close connectio to mysql --> db.end();
  
/* Middleware */
app.use(bodyParser.json());
app.use(cors());
  
/* Routes */
/* List all posts */

//
// produto table
//

app.get('/produto', (req, res) => {
  db.query('SELECT * FROM produto', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
  console.log('get /produto executado. Produtos retornados com sucesso!');
});
   
/* Create a new post */
app.post('/produto/create', (req, res) => {
  const { descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual } = req.body;
  const query = `INSERT INTO produto (descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual) VALUES (?, ?, ?, ?, ?, ?)`;
  const values = [descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual];
  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send('Error creating post');
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM produto WHERE id = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching created post');
        return;
      }
      res.status(201).json(result[0]);
    });
  });
  console.log('post executado, produto criado com sucesso!');
});
  
/* Get a specific post */
app.get('/produto/:id', (req, res) => {
  const produtoId = req.params.id;
  db.query('SELECT * FROM produto WHERE id = ?', produtoId, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Post not found');
      return;
    }
    res.json(result[0]);
  });
  console.log('get /produto/' + produtoId + ' executado. Produto retornado com sucesso!');
});
  
/* Update a post */
app.put('/produto/:id', (req, res) => {
  const produtoId = req.params.id;
  const { descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual } = req.body;
  const query = `UPDATE produto SET descricao = ?, cor = ?, tamanho = ?, tipo_material = ?, preco_venda = ?, quantidade_atual = ? WHERE id_produto = ?`;
  const values = [descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual, produtoId];

  db.query(query, values, err => {
    if (err) {
      res.status(500).send('Error updating post');
      return;
    }
    db.query('SELECT * FROM produto WHERE id = ?', produtoId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching updated post');
        return;
      }
      res.json(result[0]);
    });
  });
  console.log('put /produto/' + produtoId + ' executado. Produto atualizado com sucesso!');
});
  
/* Delete a post */
app.delete('/produto/:id', (req, res) => {
  const produtoId = req.params.id;
  db.query('DELETE FROM produto WHERE id = ?', produtoId, err => {
    if (err) {
      res.status(500).send('Error deleting post');
      return;
    }
    res.status(200).json({ msg: 'Post deleted successfully' });
  });
  console.log('delete /produto/' + produtoId + ' executado. Produto deletado com sucesso!');
});

//
// cliente table
//

app.get('/cliente', (req, res) => {
  db.query('SELECT * FROM cliente', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
  console.log('get /cliente executado. Clientes retornados com sucesso!');
});
   
/* Create a new post */
app.post('/cliente/create', (req, res) => {
    const { nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf } = req.body;
    const query = `INSERT INTO cliente (nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf];
    db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send('Error creating post');
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM cliente WHERE id = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching created post');
        return;
      }
      res.status(201).json(result[0]);
    });
  });
  console.log('post executado. Cliente criado com sucesso!');
});
  
/* Get a specific post */
app.get('/cliente/:id', (req, res) => {
  const clienteId = req.params.id;
  db.query('SELECT * FROM cliente WHERE id = ?', clienteId, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Post not found');
      return;
    }
    res.json(result[0]);
  });
  console.log('get /cliente/' + clienteId + ' executado. Cliente retornado com sucesso!');
});
  
/* Update a post */
app.put('/cliente/:id', (req, res) => {
    const clienteId = req.params.id;
    const { nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf } = req.body;
    const query = `UPDATE cliente SET nome_completo = ?, email = ?, nome_loja = ?, cnpj = ?, cpf = ?, tipo_cliente = ?, endereco = ?, numero = ?, complemento = ?, cidade = ?, uf = ? WHERE id_cliente = ?`;
    const values = [nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf, clienteId];
    db.query(query, values, err => {
    if (err) {
      res.status(500).send('Error updating post');
      return;
    }
    db.query('SELECT * FROM cliente WHERE id = ?', clienteId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching updated post');
        return;
      }
      res.json(result[0]);
    });
  });
  console.log('put /cliente/' + clienteId + ' executado. Cliente atualizado com sucesso!');
});
  
/* Delete a post */
app.delete('/cliente/:id', (req, res) => {
  const clienteId = req.params.id;
  db.query('DELETE FROM cliente WHERE id = ?', clienteId, err => {
    if (err) {
      res.status(500).send('Error deleting post');
      return;
    }
    res.status(200).json({ msg: 'Post deleted successfully' });
  });
  console.log('delete /cliente/' + clienteId + ' executado. Cliente deletado com sucesso!');
});

//
// fornecedor table
//

app.get('/fornecedor', (req, res) => {
  db.query('SELECT * FROM fornecedor', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
  console.log('get /fornecedor executado. Fornecedores retornados com sucesso!');
});
   
/* Create a new post */
app.post('/fornecedor/create', (req, res) => {
    const { nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, endereco, complemento, cidade, uf } = req.body;
    const query = `INSERT INTO fornecedor (nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, endereco, complemento, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, endereco, complemento, cidade, uf];
    db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send('Error creating post');
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM fornecedor WHERE id = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching created post');
        return;
      }
      res.status(201).json(result[0]);
    });
  });
  console.log('post executado. Fornecedor criado com sucesso!');
});
  
/* Get a specific post */
app.get('/fornecedor/:id', (req, res) => {
  const fornecedorId = req.params.id;
  db.query('SELECT * FROM fornecedor WHERE id = ?', fornecedorId, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Post not found');
      return;
    }
    res.json(result[0]);
  });
  console.log('get /fornecedor/' + fornecedorId + ' executado. Fornecedor retornado com sucesso!');
});
  
/* Update a post */
app.put('/fornecedor/:id', (req, res) => {
  const fornecedorId = req.params.id;
  const { nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, endereco, complemento, cidade, uf } = req.body;
  const query = `UPDATE fornecedor SET nome_fornecedor = ?, nome_responsavel = ?, contato_telefonico = ?, redes_sociais = ?, materiais_fornecidos = ?, endereco = ?, complemento = ?, cidade = ?, uf = ? WHERE id_fornecedor = ?`;
  const values = [nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, endereco, complemento, cidade, uf, id, fornecedorId];
    db.query(query, values, err => {
    if (err) {
      res.status(500).send('Error updating post');
      return;
    }
    db.query('SELECT * FROM fornecedor WHERE id = ?', fornecedorId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching updated post');
        return;
      }
      res.json(result[0]);
    });
  });
  console.log('put /fornecedor/' + fornecedorId + ' executado. Fornecedor atualizado com sucesso!');
});
  
/* Delete a post */
app.delete('/fornecedor/:id', (req, res) => {
  const fornecedorId = req.params.id;
  db.query('DELETE FROM fornecedor WHERE id = ?', fornecedorId, err => {
    if (err) {
      res.status(500).send('Error deleting post');
      return;
    }
    res.status(200).json({ msg: 'Post deleted successfully' });
  });
  console.log('delete /fornecedor/' + fornecedorId + ' executado. Fornecedor deletado com sucesso!');
});

//
// movimentacao table
// 

app.get('/movimentacao', (req, res) => {
  db.query('SELECT m.*, c.nome_completo AS nome_completo, p.descricao AS descricao FROM movimentacao m INNER JOIN cliente c ON m.id_cliente = c.id_cliente INNER JOIN produto p ON m.id_produto = p.id_produto', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
  console.log('get /movimentacao executado. Movimentações retornadas com sucesso!');
});

/* Create a new post */
app.post('/movimentacao/create', (req, res) => {
  const { id_movimentacao, data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs } = req.body;
  const query = `INSERT INTO movimentacao (id_movimentacao, data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [id_movimentacao, data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs];
  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send('Error creating post');
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM movimentacao WHERE id = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching created post');
        return;
      }
      res.status(201).json(result[0]);
    });
    console.log('post executado. Movimentação criada com sucesso!');
  });
});

/* Get a specific post */
app.get('/movimentacao/:id', (req, res) => {
  const movimentacaoId = req.params.id;
  db.query('SELECT * FROM movimentacao WHERE id = ?', movimentacaoId, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Post not found');
      return;
    }
    res.json(result[0]);
  });
  console.log('get /movimentacao/' + movimentacaoId + ' executado. Movimentação retornada com sucesso!');
});

/* Update a post */
app.put('/movimentacao/:id', (req, res) => {
  const movimentacaoId = req.params.id;
  const { id_movimentacao, data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs } = req.body;
  const query = `UPDATE movimentacao SET id_movimentacao = ?, data_hora = ?, id_produto = ?, tipo_mov = ?, quantidade = ?, num_pedido = ?, id_cliente = ?, obs = ? WHERE id_movimentacao = ?`;
  const values = [id_movimentacao, data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs, movimentacaoId];
  db.query(query, values, err => {
    if (err) {
      res.status(500).send('Error updating post');
      return;
    }
    db.query('SELECT * FROM movimentacao WHERE id = ?', movimentacaoId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching updated post');
        return;
      }
      res.json(result[0]);
    });
  });
  console.log('put /movimentacao/' + movimentacaoId + ' executado. Movimentação atualizada com sucesso!');
});

/* Delete a post */
app.delete('/movimentacao/:id', (req, res) => {
  const movimentacaoId = req.params.id;
  db.query('DELETE FROM movimentacao WHERE id = ?', movimentacaoId, err => {
    if (err) {
      res.status(500).send('Error deleting post');
      return;
    }
    res.status(200).json({ msg: 'Post deleted successfully' });
  });
  console.log('delete /movimentacao/' + movimentacaoId + ' executado. Movimentação deletada com sucesso!');
});

// functions to support the front end to register a movimentation due to the foreign keys

// get all produtos descricao and id for the front

app.get('/produtos/names', (req, res) => {
  db.query('SELECT id_produto, descricao FROM produto', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    res.json(result);
  });
  console.log('get /produtos/names executado. Produtos retornados com sucesso!');
});

// get all clientes name and id for the front

app.get('/clientes/names', (req, res) => {
  db.query('SELECT id_cliente, nome_completo FROM cliente', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    res.json(result);
  });
  console.log('get /clientes/names executado. Clientes retornados com sucesso!');
});

//
// search functions for cliente, produto, fornecedor and movimentacao tables
//

app.get('/search/produto/:descricao', (req, res) => {
  const descricao = req.params.descricao;
  db.query('SELECT * FROM produto WHERE descricao LIKE ?', '%' + descricao + '%', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Produto not found');
      return;
    }
    res.json(result);
  });
  console.log('get /search/produto/' + descricao + ' executado. Produto retornado com sucesso!');
});

app.get('/search/cliente/:name', (req, res) => {
  const name = req.params.nome;
  db.query('SELECT * FROM cliente WHERE nome_completo LIKE ?', '%' + name + '%', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Cliente not found');
      return;
    }
    res.json(result);
  });
  console.log('get /search/cliente/' + nome + ' executado. Cliente retornado com sucesso!');
});

app.get('/search/fornecedor/:name', (req, res) => {
  const name = req.params.nome;
  db.query('SELECT * FROM fornecedor WHERE nome_fornecedor LIKE ?', '%' + name + '%', (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Fornecedor not found');
      return;
    }
    res.json(result);
  });
  console.log('get /search/fornecedor/' + nome + ' executado. Fornecedor retornado com sucesso!');
});

app.get('/search/movimentacao/:value', (req, res) => {
  const value = '%' + req.params.value + '%'; // Adicionando wildcards para buscar em qualquer parte do valor
  const query = `SELECT * FROM movimentacao WHERE id_movimentacao LIKE ? OR data_hora LIKE ? OR tipo_mov LIKE ? OR quantidade LIKE ? OR num_pedido LIKE ? OR obs LIKE ?`;
  const values = Array(6).fill(value); // Repetindo o valor para todos os campos
  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(result);
    }
  });
  console.log('get /search/movimentacao/' + req.params.value + ' executado. Movimentação retornada com sucesso!');
});

// 

//
// Config table - WIP 
//

app.get('/config', (req, res) => {
  db.query('SELECT * FROM config', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
  console.log('get /config executado. Configurações retornadas com sucesso!');
});


/* Update a post */
/*
para testar com o postman, usar o comando PUT com a url "http://localhost:3000/config/123" e enviar o "body" com conteudo "raw" no formato "json" com o texto abaixo, por exemplo:
{ "value":"12345" }
*/
app.put('/config/:value', (req, res) => {
  const { value } = req.body;
  console.log('put /config/ value=' + value);
  // Hashing to store on the database
  bcrypt.hash(value, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).send('Error occured while hashing');
      return;
    }
    const query = `UPDATE config SET CFG01 = ?`;
    const values = [hashedPassword];
    console.log('put /config/ values=' + values);
    db.query(query, values, err => {
      if (err) {
        res.status(500).send('Error updating post');
        return;
      }
      db.query('SELECT * FROM config', (err, result) => {
        if (err) {
          res.status(500).send('Error fetching updated post. ' + err);
          return;
        }
        res.json(result[0]);
      });
    });
  });
  console.log('put /config/ executado. Configuração atualizada com sucesso!');
});

//
  
/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
