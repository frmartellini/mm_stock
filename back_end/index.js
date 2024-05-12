// creating a node api to connect to mysql database and communicate with the front end
// need to initizlize node to get node modules and configurations, for that run npm init -y
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
  
const app = express();
var port = 3000; // 4200 padrão do Angular e 3000 é a padrão do Node

// get the environment variables for the database connection
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
  
// se a config "BACKEND_PORT" do arquivo .env estiver configurada, vai usar a porta indicada nesta config "BACKEND_PORT" do .env
if ( process.env.BACKEND_PORT ) {
  port = process.env.BACKEND_PORT;
}

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
    db.query('SELECT * FROM produto WHERE id_produto = ?', postId, (err, result) => {
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
  db.query('SELECT * FROM produto WHERE id_produto = ?', produtoId, (err, result) => {
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
      if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Este é um exemplo de código de erro MySQL para "Cannot delete or update a parent row"
        res.status(500).send('Erro alterando produto: Não é possível alterar informações de um produto que já esteja envolvido em uma movimentação de produto.');
      } else {
        res.status(500).send('Erro alterando produto: ' + err);
      }
      return;
    }
    db.query('SELECT * FROM produto WHERE id_produto = ?', produtoId, (err, result) => {
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
  db.query('DELETE FROM produto WHERE id_produto = ?', produtoId, err => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Este é um exemplo de código de erro MySQL para "Cannot delete or update a parent row"
        res.status(500).send('Erro deletando produto: Não é possível deletar um cliente que já esteja envolvido em uma movimentação de produto.');
      } else {
        res.status(500).send('Erro deletando produto: ' + err);
      }
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
      res.status(500).send('Error creating post' + err);
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM cliente WHERE id_cliente = ?', postId, (err, result) => {
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
  db.query('SELECT * FROM cliente WHERE id_cliente = ?', clienteId, (err, result) => {
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
    const query = `UPDATE cliente SET nome_completo = ?, telefone = ?, email = ?, nome_loja = ?, cnpj = ?, cpf = ?, tipo_cliente = ?, endereco = ?, numero = ?, complemento = ?, cidade = ?, uf = ? WHERE id_cliente = ?`;
    const values = [nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf, clienteId];
    db.query(query, values, err => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Este é um exemplo de código de erro MySQL para "Cannot delete or update a parent row"
        res.status(500).send('Erro alterando cliente: Não é possível alterar informações de um cliente que já esteja envolvido em uma movimentação de produto.');
      } else {
        res.status(500).send('Erro alterando cliente: ' + err);
      }
      return;
    }
    db.query('SELECT * FROM cliente WHERE id_cliente = ?', clienteId, (err, result) => {
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
  db.query('DELETE FROM cliente WHERE id_cliente = ?', clienteId, err => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Este é um exemplo de código de erro MySQL para "Cannot delete or update a parent row"
        res.status(500).send('Erro deletando cliente: Não é possível deletar um cliente que já esteja envolvido em uma movimentação de produto.');
      } else {
        res.status(500).send('Erro deletando cliente: ' + err);
      }
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
    const { nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf } = req.body;
    const query = `INSERT INTO fornecedor (nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf];
    db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send('Error creating post');
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM fornecedor WHERE id_fornecedor = ?', postId, (err, result) => {
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
  db.query('SELECT * FROM fornecedor WHERE id_fornecedor = ?', fornecedorId, (err, result) => {
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
  const { nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf } = req.body;
  const query = `UPDATE fornecedor SET nome_fornecedor = ?, nome_responsavel = ?, contato_telefonico = ?, redes_sociais = ?, materiais_fornecidos = ?, cnpj = ?, endereco = ?, numero = ?, complemento = ?, cidade = ?, uf = ? WHERE id_fornecedor = ?`;
  const values = [nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf, fornecedorId];
    db.query(query, values, err => {
    if (err) {
      res.status(500).send('Error updating post');
      return;
    }
    db.query('SELECT * FROM fornecedor WHERE id_fornecedor = ?', fornecedorId, (err, result) => {
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
  db.query('DELETE FROM fornecedor WHERE id_fornecedor = ?', fornecedorId, err => {
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
  db.query('SELECT m.*, c.nome_completo AS nome_completo, p.descricao AS descricao FROM movimentacao m LEFT OUTER JOIN cliente c ON (m.id_cliente = c.id_cliente) INNER JOIN produto p ON (m.id_produto = p.id_produto)', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts' + err);
      return;
    }
    res.json(results);
  });
  console.log('get /movimentacao executado. Movimentações retornadas com sucesso!');
});

/* Create a new post */
app.post('/movimentacao/create', async (req, res) => {
  const { data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs } = req.body;
  const query = `INSERT INTO movimentacao (data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const values = [data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs];

  try {
    if (tipo_mov === 'S') {
      // Se for uma saída, verificar se a quantidade em estoque é suficiente
      const quantidadeEmEstoque = await obterQuantidadeEmEstoque(id_produto);

      if (quantidadeEmEstoque < quantidade) {
        // Se a quantidade em estoque for inferior à quantidade a ser movimentada, retornar erro
        res.status(400).send('Quantidade em estoque insuficiente para a movimentação.');
        return;
      }
    }

    // Atualizar a quantidade do produto
    await atualizarQuantidadeProduto(id_produto, quantidade, tipo_mov);

    // Criar a movimentação
    db.query(query, values, (err, result) => {
      if (err) {
        res.status(500).send('Error creating post');
        return;
      }
      const postId = result.insertId;
      db.query('SELECT * FROM movimentacao WHERE id_movimentacao = ?', postId, (err, result) => {
        if (err) {
          res.status(500).send('Error fetching created post');
          return;
        }
        res.status(201).json(result[0]);
      });
      console.log('Post executado. Movimentação criada com sucesso!');
    });
  } catch (error) {
    res.status(400).send('Error creating post, invalid quantity');
    return;
  }
});

/* Get a specific post */
app.get('/movimentacao/:id', (req, res) => {
  const movimentacaoId = req.params.id;
  db.query('SELECT * FROM movimentacao WHERE id_movimentacao = ?', movimentacaoId, (err, result) => {
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
  const { data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs } = req.body;
  const query = `UPDATE movimentacao SET data_hora = ?, id_produto = ?, tipo_mov = ?, quantidade = ?, num_pedido = ?, id_cliente = ?, obs = ? WHERE id_movimentacao = ?`;
  const values = [data_hora, id_produto, tipo_mov, quantidade, num_pedido, id_cliente, obs, movimentacaoId];
  db.query(query, values, err => {
    if (err) {
      res.status(500).send('Error updating post' + err);
      return;
    }
    db.query('SELECT * FROM movimentacao WHERE id_movimentacao = ?', movimentacaoId, (err, result) => {
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
  db.query('DELETE FROM movimentacao WHERE id_movimentacao = ?', movimentacaoId, err => {
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
// auxiliar functions
//

// function to update the quantity of a product after a movimentation, with promise to wait for the update to finish due to the async nature of the db query on  javascript
function atualizarQuantidadeProduto(id_produto, quantidade, tipo_mov)
{
  return new Promise((resolve, reject) => {
    db.query('SELECT quantidade_atual FROM produto WHERE id_produto = ?', id_produto, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      const quantidade_atual = result[0].quantidade_atual;
      let nova_quantidade;
      if (tipo_mov === 'E') {
        nova_quantidade = quantidade_atual + quantidade; 
      }
      else { // Se não é entrada, é saída, são as duas únicas opções
        nova_quantidade = quantidade_atual - quantidade;        
      }
      db.query('UPDATE produto SET quantidade_atual = ? WHERE id_produto = ?', [nova_quantidade, id_produto], err => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }
      });     
    });
    resolve();
  });
}

function obterQuantidadeEmEstoque(id_produto) {
  return new Promise((resolve, reject) => {
    db.query('SELECT quantidade_atual FROM produto WHERE id_produto = ?', id_produto, (err, result) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      const quantidade_atual = result[0].quantidade_atual;
      resolve(quantidade_atual);
    });
  });
}

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

//
// verificacao de login (usuario e senha) que o front-end chama para validar o login do usuario
//
// para testar com o postman, usar o body raw json :    { "login":"admin","senha":"123" }
//
app.post('/config/login', (req, res) => {

  console.log('get /config/login - inicio');
  
  const { login, senha } = req.body;
  console.log('login=' + login.toLowerCase());
  console.log('senha=' + senha);

  var senha_atual_do_bd = "";

  if ( login.toLowerCase() == "admin") {

    db.query('SELECT CFG01 FROM config', (err, results) => {
      console.log('results=' + JSON.stringify(results));
      
      if (err) {
        res.status(500).send('Erro no select da tabela CONFIG');
        return;
      }
      else {

        senha_atual_do_bd = results[0].CFG01;
        console.log('senha_atual_do_bd=' +senha_atual_do_bd);

        if ( senha_atual_do_bd != "" ) {

          console.log("senha_atual_do_bd NAO estah vazia");
      
          // verificar se a senha recebida pro login bate com a senha gravada no BD
          bcrypt.compare(senha, senha_atual_do_bd).then(
    
            function(isCorrect) { 
              console.log("isCorrect=" + isCorrect);
              // se a senha atual enviada pelo usuario bate com a senha gravada no bd
              if ( isCorrect ) {
                console.log("senha informada pelo usuario bate com senha gravada no bd");
                res.status(200).json('{ "Status":"OK" }');
              }
              // se a senha atual enviada pelo usuario NAO bate com a senha gravada no bd
              else {
                console.log("senha informada pelo usuario NAO bate com senha gravada no bd");
                res.status(401).json('{ "Status":"INVALIDO" }');
              }
    
            } // function(isCorrect)
    
          ); // bcrypt.compare.....then

        } // if ( senha_atual_do_bd != "" )
        // se a senha gravada no bd estiver vazia
        else {
          console.log("senha gravada no bdestah vazia");
          res.status(500).send("senha gravada no bd estah vazia");
        } // else

      } // else
      
    }); // db.query select

  } // if login == admin
  else {
    res.status(401).json('{ "Status":"INVALIDO" }'); // login nao eh "admin"
  }

}); // post /config/login

/*
Alterar a senha de acesso do sistema que fica gravada na tabela "CONFIG" no campo "CFG01".
Precisa passar a nova senha e também a senha atual porque serah feita a verificacao se a senha atual bate com a senha gravada no BD.
*/
/*
para testar com o postman, usar o comando PUT com a url "http://localhost:3000/config/alter" para testar localmente ou "179.145.6.125:3000/config/alter" para testar no servidor e enviar o "body" com conteudo "raw" no formato "json" com o texto abaixo, por exemplo:
{ "senha_nova":"12345", "senha_atual":"12345" }
*/
app.put('/config/alter', (req, res) => {
  const { senha_nova, senha_atual } = req.body;
  console.log('put /config/ senha_nova=' + senha_nova);
  console.log('put /config/ senha_atual=' + senha_atual);
  
  // verificar se q senha atual recebida bate com a senha gravada atualmente no BD

  db.query('SELECT CFG01 FROM config', (err, result) => {
    if (err) {
      res.status(500).send('Erro no select que pega a senha atual do bd para verificar. ' + err);
      return;
    }

    // aqui result contem um array de objetos e cada objeto tem como props os campos da tabela CONFIG

    // se foi obtido ao menos um registro da tabela CONFIG
    if ( result.length ) {

      senha_atual_do_bd = result[0].CFG01;
      console.log('senha_atual_do_bd=' + senha_atual_do_bd);

      bcrypt.compare(senha_atual, senha_atual_do_bd).then(

        function(isCorrect) { 
          //console.log("isCorrect=" + isCorrect);
          
          // se a senha atual enviada pelo usuario bate com a senha gravada no bd
          if ( isCorrect ) {
            console.log("senha atual informada pelo usuario bate com senha gravada no bd");

            console.log("antes de obter o hash da nova senha");
    
            // Hashing to store on the database
            bcrypt.hash(senha_nova, 10, (err, hashedPassword) => {
              if (err) {
                res.status(500).send('Error occured while hashing the new password. ' + err);
                return;
              }
              const query = `UPDATE config SET CFG01 = ?`;
              const values = [hashedPassword];
              console.log('put /config/ values=' + values);
              db.query(query, values, err => {
                if (err) {
                  res.status(500).send('erro no update da tabeal CONFIG. ' + err);
                  return;
                }
                db.query('SELECT * FROM config', (err, result) => {
                  if (err) {
                    res.status(500).send('Erro no select da tabela CONFIG depois do update. ' + err);
                    return;
                  }
                  res.json(result[0]);
                }); // db.query
              }); // db.query
            }); // bcrypt.hash

            console.log('put /config/ executado. Configuração atualizada com sucesso!');

          }
          // se a senha atual enviada pelo usuario NAO bate com a senha gravada no bd
          else {
            console.log("senha atual informada pelo usuario NAO bate com senha gravada no bd");
            res.status(500).send('senha atual incorreta.');
            return;
          }

        } // function(isCorrect)

      ); // bcrypt.compare.....then

    } // if ( result.length )
    else {
      console.log("nao foi encontrado registro da tabela CONFIG");
      res.status(500).send('nao foi encontrado registro da tabela CONFIG.');
      return;
    }

  }); // db.query
  
}); // function


//
  
/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
