// creating a node api to connect to mysql database and communicate with the front end
// need to initizlize node to get node modules and configurations, for that run npm init -y
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const multer = require('multer');
const json_2_csv = require('json-2-csv');
var iconv = require('iconv-lite');
const jwt = require('jsonwebtoken');
  
const app = express();
var port = 3000; // 4200 padrão do Angular e 3000 é a padrão do Node

// get the environment variables for the database connection
dotenv.config();

const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const DB_POOL_CONNECTION_LIMIT = process.env.DB_POOL_CONNECTION_LIMIT;
const NumMinCharSenhaUsuario = process.env.NumMinCharSenhaUsuario;
  
// se a config "BACKEND_PORT" do arquivo .env estiver configurada, vai usar a porta indicada nesta config "BACKEND_PORT" do .env
if ( process.env.BACKEND_PORT ) {
  port = process.env.BACKEND_PORT;
}

// retorna a data/hora atual no timezone atual do sistema no formato yyyy-MM-ddThh:mm:ss.zzz
function GetLocalDateTimeForLog() {
  var dt = new Date();
  //dt.setHours(dt.getHours() );
  //return dt.toLocaleString('pt-BR'); // retorna no formato: 21/05/2024, 19:03:05
  //return dt.toISOString(); // retorna no formato: 21/05/2024, 19:03:05
  return new Date(dt.getTime() - (dt.getTimezoneOffset() * 60000)).toISOString().replace("Z", '').replaceAll(":","-",);
}

//process.env.TZ='America/Sao_Paulo';
//console.info('process.env.TZ=',process.env.TZ);
//console.info("timezone atual=" + (GetLocalDateTimeForLog()).getTimezoneOffset() );
console.log("new Date()=" , new Date()); // mostra a data/hora atual no timezone UTC(padrao do javascript) como no exemplo: 2024-05-21T22:19:06.129Z
console.log("GetLocalDateTimeForLog()=" + GetLocalDateTimeForLog());

// usando esse estoque de conecxao simples, se o mysql server reiniciar (por exemplo), esta conexao serah finalizada e nao serah reconectada e 
// a partir daih todos os comandos que executam SQL no BD vao dar erro e por isso o processo do back-end precisa ser parado e iniciado novamente.
/* MySQL Connection - conexao simples unica que fica aberta enquanto o processo estiver rodando */
// const db = mysql.createConnection({
//   host: dbHost,
//   port: dbPort,
//   user: dbUser,
//   password: dbPassword,
//   database: dbName
// });

// criar o connection pool do mysql
/*
   O proprio coonection pool cria (ou recria) conexoes com o BD se e quando for preciso.
*/
//console.info('DB_POOL_CONNECTION_LIMIT=',DB_POOL_CONNECTION_LIMIT);
const db = mysql.createPool({
  connectionLimit: DB_POOL_CONNECTION_LIMIT,
  //program_name: "node_process_back_end",
  host: dbHost,
  port: dbPort,
  user: dbUser,
  password: dbPassword,
  database: dbName
});

//console.info(GetLocalDateTimeForLog() , ' - db.config.connectionLimit=',db.config.connectionLimit);

// evento disparado quando o programa faz uma nova conexao com o bd (dentro do pool)
db.on('connection', function (connection) {
  console.info(GetLocalDateTimeForLog() , ' - MySQL Connection '+ connection.threadId +' established');
  console.info(GetLocalDateTimeForLog() , ' - MySQL Connections in the pool. Total=',db._allConnections.length);
  console.info(GetLocalDateTimeForLog() , ' - MySQL Connections in the pool. Free=',db._freeConnections.length);

  connection.on('error', function (err) {
    console.error(GetLocalDateTimeForLog(), ' - MySQL error event on connection ' + connection.threadId, ' - ' , err.code);
  });

  // nao vi ser executado e acho que eh porque o close das conexoes do pool nao eh executado
  connection.on('close', function (err) {
    console.error(GetLocalDateTimeForLog(), ' - MySQL close on connection ' + connection.threadId, err);
  });

  connection.on('end', function () {
    console.info(GetLocalDateTimeForLog(), ' - MySQL end event on connection ' + connection.threadId );
  });

});

// evento disparado quando o programa "pega" uma conexao do pool para usar
db.on('acquire', function (connection) {
  console.log(GetLocalDateTimeForLog() , (' - MySQL Connection '+ connection.threadId +' acquired from the pool'));
  console.info(GetLocalDateTimeForLog() , ' - MySQL Connections in the pool. Total=',db._allConnections.length);
  console.info(GetLocalDateTimeForLog() , ' - MySQL Connections in the pool. Free=',db._freeConnections.length);
});

// evento disparado quando o programa devolve a conexao para o pool
db.on('release', function (connection) {
  console.log(GetLocalDateTimeForLog() , ' - MySQL Connection ' + connection.threadId + ' released');
  console.info(GetLocalDateTimeForLog() , ' - MySQL Connections in the pool. Total=',db._allConnections.length);
  console.info(GetLocalDateTimeForLog() , ' - MySQL Connections in the pool. Free=',db._freeConnections.length);
});

// nao precisa mais conectar no mysql server assim porque agora usa connection pool
/* Connect to MySQL */
//db.connect(err => {
// db.getConnection(err => {  
//   if (err) {
//     throw err;
//   }
//   console.log('Connected to MySQL');
// });


// close connectio to mysql --> db.end();
  
/* Middleware */
app.use(bodyParser.json());
app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB in bytes
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith('image/png') || file.mimetype.startsWith('image/jpeg')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são suportadas'), false);
    }
  }
});

const produtoResponse = row => ({...row, foto: !!row.foto? `data:image/png;base64,${row.foto.toString('base64')}` : null})

function parseBase64Image(dataURL) {
  const matches = dataURL.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image string');
  }

  return {
    mime: matches[1],
    buffer: Buffer.from(matches[2], 'base64'),
  };
}

/*
// fechar a conexao com o mysql (deve ser usado apenas para testes)
app.get('/close_mysql_connection', (req, res) => {

  console.log("db.connection=" + db.);

  // fecha o pool inteiro
  //db.end();
  var result = {"msg":"conexao com o mysql foi fechada"};
  res.json(result);
  console.log('get /close_mysql_connection executado.');
});
*/

//
// produto table
//

app.get('/produto', (req, res) => {
  db.query('SELECT id_produto, descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual, localizacao FROM produto', (err, results) => {
    if (err) {
      res.status(500).send('Erro ao retornar os produtos: ' + err);
      return;
    }
    res.json(results.map(produtoResponse));
  });
  console.log('get /produto executado. Produtos retornados com sucesso!');
});

// retorna as cores distintas dos produtos da tabela "produto"
app.get('/produto/cores', (req, res) => {
  db.query('SELECT DISTINCT cor FROM produto ORDER BY cor ASC', (err, results) => {
    if (err) {
      res.status(500).send('Erro ao retornar as cores dos produtos: ' + err);
      return;
    }
    res.json(results);
  });
  console.log('get /produto/cores executado. Cores distintas dos produtos retornadas com sucesso!');
});

// retorna os tamanhos distintos dos produtos da tabela "produto"
app.get('/produto/tamanhos', (req, res) => {
  db.query('SELECT DISTINCT tamanho FROM produto ORDER BY tamanho ASC', (err, results) => {
    if (err) {
      res.status(500).send('Erro ao retornar os tamanhos dos produtos: ' + err);
      return;
    }
    res.json(results);
  });
  console.log('get /produto/tamanhos executado. Tamanhos distintos dos produtos retornados com sucesso!');
});

// retorna os "tipo_material" distintos dos produtos da tabela "produto"
app.get('/produto/tipos_material', (req, res) => {
  db.query('SELECT DISTINCT tipo_material FROM produto ORDER BY tipo_material ASC', (err, results) => {
    if (err) {
      res.status(500).send('Erro ao retornar os valores distintos de "tipo_material" dos produtos: ' + err);
      return;
    }
    res.json(results);
  });
  console.log('get /produto/tipos_material executado. "tipo_material" distintos dos produtos retornados com sucesso!');
});


/* adicionar um produto */
app.post('/produto/create', upload.single('foto'), (req, res) => {
  const { descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual, localizacao} = JSON.parse(req.body.data);
  const values = [descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual, localizacao, req.file?.buffer];
  const query = `INSERT INTO produto (descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual, localizacao, foto) VALUES (${values.map(() => "?").join(", ")})`;

  db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send('Erro criando produto: ' + err);
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM produto WHERE id_produto = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Erro recuperando produto criado: ' + err);
        return;
      }
      res.status(201).json(produtoResponse(result[0]));
    });
  });
  console.log('post executado, produto criado com sucesso! ');
});
  
/* obter um produto pelo ID do produto */
app.get('/produto/:id', (req, res) => {
  const produtoId = req.params.id;
  db.query('SELECT * FROM produto WHERE id_produto = ?', produtoId, (err, result) => {
    if (err) {
      res.status(500).send('Erro recuperando produto: ' + err);
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Produto não encontrado: ' + err);
      return;
    }
    res.json(produtoResponse(result[0]));
  });
  console.log('get /produto/' + produtoId + ' executado. Produto retornado com sucesso!');
});
  

/* alterar um produto */
app.put('/produto/:id', upload.single("foto"), (req, res) => {

  const produtoId = req.params.id;
  const { descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual, localizacao, foto } = JSON.parse(req.body.data);
  const query = `UPDATE produto SET descricao = ?, cor = ?, tamanho = ?, tipo_material = ?, preco_venda = ?, quantidade_atual = ?, localizacao = ?, foto = ? WHERE id_produto = ?`;
  const values = [descricao, cor, tamanho, tipo_material, preco_venda, quantidade_atual, localizacao, !!foto? parseBase64Image(foto).buffer : req.file?.buffer, produtoId];

  db.query(query, values, err => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Este é um exemplo de código de erro MySQL para "Cannot delete or update a parent row"
        res.status(409).send('Erro alterando produto: Não é possível alterar informações de um produto que já esteja envolvido em uma movimentação com um cliente.');
      } else {
        res.status(500).send('Erro alterando produto: ' + err);
      }
      return;
    }
    db.query('SELECT * FROM produto WHERE id_produto = ?', produtoId, (err, result) => {
      if (err) {
        res.status(500).send('Erro recuperando o produto alterado: ' + err);
        return;
      }
      res.json(produtoResponse(result[0]));
    });
  });
  console.log('put /produto/' + produtoId + ' executado. Produto atualizado com sucesso!');
});
  
/* Deletar um produto */
app.delete('/produto/:id', (req, res) => {
  const produtoId = req.params.id;
  db.query('DELETE FROM produto WHERE id_produto = ?', produtoId, err => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Este é um exemplo de código de erro MySQL para "Cannot delete or update a parent row"
        res.status(409).send('Erro deletando produto: Não é possível deletar um produto que já esteja envolvido em uma movimentação com um cliente.');
      } else {
        res.status(500).send('Erro deletando produto: ' + err);
      }
      return;
    }
    res.status(200).json({ msg: 'Produto deletado com sucesso' });
  });
  console.log('delete /produto/' + produtoId + ' executado. Produto deletado com sucesso!');
});

// api para retornar os produtos em formato texto com os campos separados por TAB
// exemplo para testar: http://localhost:3001/produto_lista/zzzzzzzzzz
// onde zzzzzzzzzz eh o token de seguranca

app.get('/produto_lista/:token' , verifyJWT , (req, res) => {
  console.log('get /produto_lista inicio da execucao');
  console.log('get /produto_lista token recebido na url=' + req.params.token);
  db.query(`SELECT id_produto , descricao , cor , tamanho , tipo_material , preco_venda , quantidade_atual
                   , IFNULL(localizacao,"") as localizacao , (foto IS NOT NULL) as tem_foto FROM produto`, (err, results) => {
    if (err) {
      console.log('Erro ao retornar a lista de produtos: ' + err);
      res.status(500).send('Erro ao retornar a lista de produtos: ' + err);
      return;
    }

    // array com os campos (nome do campo na tabela e titulo para o campo)
    const fields = [
      {
        title: 'ID',
        field: 'id_produto'
      },
      {
        title: 'Descrição',
        field: 'descricao'
      },
      {
        title: 'Cor',
        field: 'cor'
      },
      {
        title: 'Tamanho',
        field: 'tamanho'
      },
      {
        title: 'Tipo material',
        field: 'tipo_material'
      },
      {
        title: 'Preço Venda',
        field: 'preco_venda'
      },
      {
        title: 'Qtde Atual',
        field: 'quantidade_atual'
      },
      {
        title: 'Localização',
        field: 'localizacao'
      },
      {
        title: 'Foto',
        field: 'tem_foto'
      },
    ]; // fields
    
    var options = {
      keys : fields,
      prependHeader : true,
      delimiter : {
          field : '\t', // TAB for field delimiter
          eol   : '\r\n' // Newline delimiter = CRLF
      }
    };

    // converter os pontos para virgula do campo preco_venda (acertar o separador decimal)
    results.forEach(reg =>  {
      reg.preco_venda = reg.preco_venda.replace(".",",");
      //console.log(reg.preco_venda);
    }
    );

    // alterar o campo "tem_foto" colocando a URL da foto de cada produto, se o produto tem foto
    // se o produto nao temfoto, este campo tem_foto vai ficar vazio (string vazia)
    results.forEach(reg =>  {
      if ( reg.tem_foto == "1" ) {
        reg.tem_foto = req.protocol + "://" + req.get("host") + "/produto_foto/" + reg.id_produto;
      }
      else if ( reg.tem_foto == "0" ) {
        reg.tem_foto = "";
      }
      // a url vai ficar como este exemplo:  http://localhost:3001/produto_foto/45
    }
    );

    // obter o texto completo com os dados dos produtos
    var csv_text = json_2_csv.json2csv(results , options );

    // precisa converter o texto para WIN1252 ( ANSI )
    var csv_text_ansi = iconv.encode( csv_text , 'win1252' );

    // com esta parte, faz o browser receber um arquivo para ser baixado
    // sem esta parte, o browser exibe o texto direto (plain-text) no browser sem qualquer formatacao
    //res.setHeader("Content-Type", "text/csv");

    //console.log("req.get('host')=" + req.get('host'));

    res.status(200).end(csv_text_ansi);

    console.log('get /produto_lista executado. Produtos retornados com sucesso!');

  });
});

// api para retornar a foto de um produto a partir do ID do produto ( vai retornar direto a imagem )
// exemplo para testar: http://localhost:3001/produto_foto/45    (45 eh o ID do produto)
app.get('/produto_foto/:id', (req, res) => {
  const produtoId = req.params.id;
  const queryString = 'SELECT foto FROM produto WHERE id_produto = ? ';
  console.log('get /produto_foto/' + produtoId + ' - inicio');
  db.query( queryString, produtoId , (err, results) => {
    if (err) {
      res.status(500).end();
      console.log('erro:' + err);
    }
    else if (results.length === 0) {
      res.status(404).end();
    }
    else { // nao houve erro
      // montar o retorno com a imagem da foto do produto
      res.set('Content-Type', 'image/png');
      res.end(results[0].foto, 'binary');
      console.log('foto do produto serah retornada');
    }
    console.log('get /produto_foto/' + produtoId + ' executado.');
  })
  
});



//
// cliente table
//

app.get('/cliente', (req, res) => {
  db.query('SELECT * FROM cliente', (err, results) => {
    if (err) {
      res.status(500).send('Erro recuperando clientes: ' + err);
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
      res.status(500).send('Erro criando cliente: ' + err);
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM cliente WHERE id_cliente = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Erro recuperando cliente criado: ' + err);
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
      res.status(500).send('Erro recuperando cliente: ' + err);
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Cliente não encontrado: ' + err);
      return;
    }
    res.json(result[0]);
  });
  console.log('get /cliente/' + clienteId + ' executado. Cliente retornado com sucesso!');
});
  
/* Update a cliente */
app.put('/cliente/:id', (req, res) => {
    const clienteId = req.params.id;
    const { nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf } = req.body;
    const query = `UPDATE cliente SET nome_completo = ?, telefone = ?, email = ?, nome_loja = ?, cnpj = ?, cpf = ?, tipo_cliente = ?, endereco = ?, numero = ?, complemento = ?, cidade = ?, uf = ? WHERE id_cliente = ?`;
    const values = [nome_completo, telefone, email, nome_loja, cnpj, cpf, tipo_cliente, endereco, numero, complemento, cidade, uf, clienteId];
    db.query(query, values, err => {
    if (err) {
      if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Este é um exemplo de código de erro MySQL para "Cannot delete or update a parent row"
        res.status(409).send('Erro alterando cliente: Não é possível alterar informações de um cliente que já esteja envolvido em uma movimentação de produto.');
      } else {
        res.status(500).send('Erro alterando cliente: ' + err);
      }
      return;
    }
    db.query('SELECT * FROM cliente WHERE id_cliente = ?', clienteId, (err, result) => {
      if (err) {
        res.status(500).send('Erro recuperando cliente alterado: ' + err);
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
        res.status(409).send('Erro deletando cliente: Não é possível deletar um cliente que já esteja envolvido em uma movimentação de produto.');
      } else {
        res.status(500).send('Erro deletando cliente: ' + err);
      }
      return;
    }
    res.status(200).json({ msg: 'Cliente deletado com sucesso' });
  });
  console.log('delete /cliente/' + clienteId + ' executado. Cliente deletado com sucesso!');
});

//
// fornecedor table
//

app.get('/fornecedor', (req, res) => {
  db.query('SELECT * FROM fornecedor', (err, results) => {
    if (err) {
      res.status(500).send('Erro retornando fornecedores: ' + err);
      return;
    }
    res.json(results);
  });
  console.log('get /fornecedor executado. Fornecedores retornados com sucesso!');
});
   
/* Create a new post */
app.post('/fornecedor/create', (req, res) => {
    const { nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf } = req.body;
    const query = `INSERT INTO fornecedor (nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf];
    db.query(query, values, (err, result) => {
    if (err) {
      res.status(500).send('Erro criando fornecedor: ' + err);
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM fornecedor WHERE id_fornecedor = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Erro recuperando fornecedor criado: ' + err);
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
      res.status(500).send('Erro recuperando fornecedor: ' + err);
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Fornecedor não encontrado: ' + err);
      return;
    }
    res.json(result[0]);
  });
  console.log('get /fornecedor/' + fornecedorId + ' executado. Fornecedor retornado com sucesso!');
});
  

//alteração Erik e Marcos//

// retorna a lista de usuarios
app.get('/usuario', (req, res) => {
  console.log('get /usuario - inicio');
  db.query('SELECT * FROM usuario', (err, results) => {
    if (err) {
      console.error('Erro retornando usuarios. ' + JSON.stringify(err));
      res.status(500).send('Erro retornando usuarios: ' + err);
      return;
    }
    res.json(results);
    console.log('get /usuario executado. Usuarios retornados com sucesso!');
  });
});
   
/* POST para incluir um novo usuario */
app.post('/usuario/create', (req, res) => {
  const { login, nome, privilegios, senha } = req.body;
  
  console.log('post /usuario/create - inicio');

  // Gerar um salt e hash a senha
  const saltRounds = 10; // Número de salt rounds
  bcrypt.hash(senha, saltRounds, (err, hashedPassword) => {
      if (err) {
          // nao sei porque neste caso abaixo o JSON.stringify(err) retorna string {} como se o obj estivesse vazio, mas o obj tem ao menos a prop "Error"
          console.error('erro ao executar bcrypt.hash da senha. ' + err + " " + JSON.stringify(err));
          //console.error(typeof(err));
          res.status(500).send('Erro ao hash da senha: ' + err);
          return;
      }

      // Continua com a inserção no banco de dados
      const query = 'INSERT INTO usuario (login, nome, privilegios, senha) VALUES (?, ?, ?, ?)';
      const values = [login, nome, privilegios, hashedPassword]; // Usa a senha criptografada

      db.query(query, values, (err, result) => {
          if (err) {
              console.error('Erro criando usuario. ' + JSON.stringify(err));
              res.status(500).send('Erro criando usuario: ' + err);
              return;
          }

          const usuarioId = result.insertId;
          db.query('SELECT * FROM usuario WHERE id_usuario = ?', [usuarioId], (err, result) => {
              if (err) {
                  console.error('Erro recuperando usuario criado.' + JSON.stringify(err));
                  res.status(500).send('Erro recuperando usuario criado: ' + err);
                  return;
              }
              res.status(201).json(result[0]);
              console.log('post executado. Usuario criado com sucesso!');
          });
      });

  });
});
  
/* PUT para atualizar um usuario */
app.put('/usuario/:id', (req, res) => {
  const usuarioId = req.params.id;
  const { login, nome, privilegios } = req.body;
  const query = `UPDATE usuario SET login = ? , nome = ? , privilegios = ?  WHERE  ( id_usuario = ? ) `;
  const values = [login, nome, privilegios, usuarioId];
  db.query(query, values, err => {
  if (err) {
      res.status(500).send('Erro alterando usuario: ' + err);
    return;
  }
  db.query('SELECT * FROM usuario WHERE id_usuario = ?', usuarioId, (err, result) => {
    if (err) {
      res.status(500).send('Erro recuperando usuario alterado: ' + err);
      return;
    }
    res.json(result[0]);
  });
});
console.log('put /usuario/' + usuarioId + ' executado. Usuario atualizado com sucesso!');
});

/* GET - retorna um usuario a partir do :id do usuario */
app.get('/usuario/:id', (req, res) => {
  const usuarioId = req.params.id;
  console.log('get /usuario/' + usuarioId + ' - inicio');
  db.query('SELECT * FROM usuario WHERE id_usuario = ?', usuarioId, (err, result) => {
    if (err) {
      console.error(JSON.stringify(err));
      res.status(500).send('Erro recuperando usuario: ' + err);
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Usuario não encontrado: ' + err);
      return;
    }
    res.json(result[0]);
  });
  console.log('get /usuario/' + usuarioId + ' executado. Usuario retornado com sucesso!');
});

/* GET - retorna um usuario a partir do login do usuario */
app.get('/usuario/GetByLogin/:login', (req, res) => {
  const LoginUsuario = req.params.login;
  console.log('get /usuario/GetByLogin/' + LoginUsuario + ' - inicio');
  db.query('SELECT * FROM usuario WHERE login = ?', LoginUsuario, (err, result) => {
    if (err) {
      console.error(JSON.stringify(err));
      res.status(500).send('Erro recuperando usuario. ' + err);
      return;
    }
    if (result.length === 0) {
      console.error('usuario nao encontrado');
      res.status(404).send('Usuario não encontrado.');
      return;
    }
    res.json(result[0]);
    console.log('get /usuario/GetByLogin/' + LoginUsuario + ' executado. Usuario retornado com sucesso!');
  });
});

/* DELETE - deleta um usuario do BD */
app.delete('/usuario/:id', (req, res) => {
  const usuarioId = req.params.id;
  console.log('delete /usuario/' + usuarioId + ' - inicio');
  db.query('DELETE FROM usuario WHERE id_usuario = ?', usuarioId, err => {
    if (err) {
      console.log('erro deletando o usuario. ' + JSON.stringify(err));
      if (err.code === 'ER_ROW_IS_REFERENCED_2') { // Este é um exemplo de código de erro MySQL para "Cannot delete or update a parent row"
        res.status(409).send('Erro deletando usuario: Não é possível deletar um usuario porque existem referencias para o usuário.');
      } else {
        res.status(500).send('Erro deletando usuario. ' + 'Code: '+err.code + '; Message: ' + err.message);
      }
      return;
    }
    console.log('delete /usuario/' + usuarioId + ' executado. Usuario deletado com sucesso!');
    res.status(200).json({ msg: 'Usuario deletado com sucesso' });
  });
});


// Alterar senha do usuario com id_usuario = :id
app.patch('/usuario/:id/senha', (req, res) => {
  const { senhaAntiga, novaSenha } = req.body;  
  const usuarioId = req.params.id;  

  // Validação de entrada
  if (!senhaAntiga || !novaSenha) {
    return res.status(400).json({ status: "erro", mensagem: "Senha antiga e nova senha são necessárias" });
  }

  // Validação da nova senha (verificar o num mínimo conforme a configuracao "NumMinCharSenhaUsuario")
  if (novaSenha.length < NumMinCharSenhaUsuario) {
    return res.status(400).json({ status: "erro", mensagem: "A nova senha deve ter pelo menos "+ NumMinCharSenhaUsuario +" caracteres." });
  }

  // Verifica se o usuário existe
  db.query('SELECT senha FROM usuario WHERE id_usuario = ?', [usuarioId], (err, results) => {
    if (err) {
      console.error(JSON.stringify(err));
      return res.status(500).json({ status: 'erro', mensagem: 'Erro ao processar a solicitação' });
    }

    if (results.length === 0) {
      return res.status(404).json({ status: 'erro', mensagem: 'Usuário não encontrado' });
    }

    const senhaAtualDoBd = results[0].senha;

    // Comparar a senha antiga fornecida com a senha armazenada
    bcrypt.compare(senhaAntiga, senhaAtualDoBd, (err, isMatch) => {
      if (err) {
        console.error(JSON.stringify(err));
        return res.status(500).json({ status: 'erro', mensagem: 'Erro ao processar a solicitação' });
      }

      if (!isMatch) {
        return res.status(401).json({ status: 'erro', mensagem: 'Senha antiga incorreta' });
      }

      // Se a senha antiga estiver correta, hash a nova senha
      bcrypt.hash(novaSenha, 10, (err, hash) => {
        if (err) {
          console.error(JSON.stringify(err));
          return res.status(500).json({ status: 'erro', mensagem: 'Erro ao processar a solicitação' });
        }

        // Atualiza a senha no banco de dados
        db.query('UPDATE usuario SET senha = ? WHERE id_usuario = ?', [hash, usuarioId], (err) => {
          if (err) {
            console.error(JSON.stringify(err));
            return res.status(500).json({ status: 'erro', mensagem: 'Erro ao processar a solicitação' });
          }

          return res.status(200).json({ status: "OK", mensagem: "Senha alterada com sucesso" });
        });
      });
    });
  });
});

//fim da alteração//




/* Update a post */
app.put('/fornecedor/:id', (req, res) => {
  const fornecedorId = req.params.id;
  const { nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf } = req.body;
  const query = `UPDATE fornecedor SET nome_fornecedor = ?, nome_responsavel = ?, contato_telefonico = ?, redes_sociais = ?, materiais_fornecidos = ?, cnpj = ?, endereco = ?, numero = ?, complemento = ?, cidade = ?, uf = ? WHERE id_fornecedor = ?`;
  const values = [nome_fornecedor, nome_responsavel, contato_telefonico, redes_sociais, materiais_fornecidos, cnpj, endereco, numero, complemento, cidade, uf, fornecedorId];
    db.query(query, values, err => {
    if (err) {
      res.status(500).send('Erro alterando fornecedor: ' + err);
      return;
    }
    db.query('SELECT * FROM fornecedor WHERE id_fornecedor = ?', fornecedorId, (err, result) => {
      if (err) {
        res.status(500).send('Erro recuperando fornecedor alterado: ' + err);
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
      res.status(500).send('Erro deletando fornecedor: ' + err);
      return;
    }
    res.status(200).json({ msg: 'Fornecedor deletado com sucesso' });
  });
  console.log('delete /fornecedor/' + fornecedorId + ' executado. Fornecedor deletado com sucesso!');
});

//
// movimentacao table
// 

app.get('/movimentacao', (req, res) => {
  db.query('SELECT m.*, c.nome_completo AS nome_completo, p.descricao AS descricao FROM movimentacao m LEFT OUTER JOIN cliente c ON (m.id_cliente = c.id_cliente) INNER JOIN produto p ON (m.id_produto = p.id_produto)', (err, results) => {
    if (err) {
      res.status(500).send('Erro retornando movimentações: ' + err);
      return;
    }
    res.json(results);
  });
  console.log('get /movimentacao executado. Movimentações retornadas com sucesso!');
});

// Retorna os registros de movimentacao de um periodo de datas.
// Precisa passar os params como o exemplo abaixo:
//     /movimentacao_por_periodo?dhinicio=2024-05-15&dhfim=2024-05-16
app.get('/movimentacao_por_periodo', (req, res) => {
  console.log("/movimentacao_por_periodo - req.query.dhinicio=" + req.query.dhinicio);
  console.log("/movimentacao_por_periodo - req.query.dhfim=" + req.query.dhfim);
  const query = 'SELECT m.*, c.nome_completo AS nome_completo, p.descricao AS descricao FROM movimentacao m '+
                'LEFT OUTER JOIN cliente c ON (m.id_cliente = c.id_cliente) ' +
                'INNER JOIN produto p ON (m.id_produto = p.id_produto)' +
                'WHERE ( m.data_hora BETWEEN ? AND ? ) ';
  const values = [ req.query.dhinicio , req.query.dhfim ];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send('Erro retornando movimentações por periodo: ' + err);
      return;
    }
    res.json(results);
  });
  console.log('get /movimentacao_por_periodo executado. Movimentações retornadas com sucesso!');
});

// Retorna os dados de movimentacao para o grafico de movimentacao de produtos.
// Precisa passar os params como o exemplo abaixo:
//     /movimentacao_graf_por_periodo?dhinicio=2024/05/15&dhfim=2024/12/31
app.get('/movimentacao_graf_por_periodo', (req, res) => {
  console.log("/movimentacao_graf_por_periodo - req.query.dhinicio=" + req.query.dhinicio);
  console.log("/movimentacao_graf_por_periodo - req.query.dhfim=" + req.query.dhfim);
  const query = "select DATE_FORMAT(t.data_hora, '%Y/%m') as \"mes\", t.tipo_mov, sum(t.quantidade) qtde from movimentacao t " +
                "WHERE ( t.data_hora BETWEEN ? AND ? ) " + 
                "group by mes, t.tipo_mov " +
                "order by mes asc ";
  const values = [ req.query.dhinicio , req.query.dhfim ];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send('Erro retornando movimentações para o grafico: ' + err);
      return;
    }
    res.json(results);
    console.log('get /movimentacao_graf_por_periodo executado. Registros retornados com sucesso!');
  });
});

// Retorna os dados de vendas (com base nas movimentacoes) para o grafico de vendas.
// Precisa passar os params como o exemplo abaixo:
//     /vendas_graf_por_periodo?dhinicio=2024/05/15&dhfim=2024/12/31
app.get('/vendas_graf_por_periodo', (req, res) => {
  console.log("/vendas_graf_por_periodo - req.query.dhinicio=" + req.query.dhinicio);
  console.log("/vendas_graf_por_periodo - req.query.dhfim=" + req.query.dhfim);
  const query = "select DATE_FORMAT(t.data_hora, '%Y/%m') as \"mes\", sum(t.quantidade * p.preco_venda) valor_total " +
                "from movimentacao t " +
                "join produto p on (p.id_produto = t.id_produto) " +
                "where ( t.tipo_mov = 'S' )" + // considerar apenas saidas de estoque
                "AND ( t.data_hora BETWEEN ? AND ? ) " + // pegar as movimentacoes de saida apenas que tiverem data_hora dentro do periodo
                "group by mes, t.tipo_mov " +
                "order by mes asc " ;
  //console.log("query=" + query);
  const values = [ req.query.dhinicio , req.query.dhfim ];
  db.query(query, values, (err, results) => {
    if (err) {
      res.status(500).send('Erro retornando dados de vendas para o gráfico: ' + err);
      return;
    }
    res.json(results);
    console.log('get /vendas_graf_por_periodo executado. Registros retornados com sucesso!');
  });
});

// Retorna os dados de vendas (com base nas movimentacoes) para o grafico de vendas por cliente.
// Precisa passar os params como o exemplo abaixo:
//     /vendas_cli_graf_por_periodo?dhinicio=2024/05/15&dhfim=2024/12/31
app.get('/vendas_cli_graf_por_periodo', (req, res) => {
  console.log("/vendas_cli_graf_por_periodo - req.query.dhinicio=" + req.query.dhinicio);
  console.log("/vendas_cli_graf_por_periodo - req.query.dhfim=" + req.query.dhfim);

const query = `select 
                c.nome_completo cliente
                ,sum(t.quantidade * p.preco_venda) valor_total
                ,( sum(t.quantidade * p.preco_venda) / t_total.total *100 ) perc
                /* ,c.id_cliente */
                /* ,t_total.total */
                from
                  movimentacao t 
                  join produto p on (p.id_produto = t.id_produto)
                  join cliente c on (c.id_cliente = t.id_cliente) 
                  join ( select 
                            sum(mov.quantidade * prod.preco_venda) total 
                          from 
                            movimentacao mov 
                            join produto prod on (prod.id_produto = mov.id_produto) 
                          where 
                            ( mov.tipo_mov = 'S' )
                            and
                            (mov.data_hora between ? and ?) 
                        ) t_total
                where
                  ( t.tipo_mov = 'S' ) 
                  and
                  (t.data_hora between ? and ?)
                group by
                  /* t.id_cliente, */
                  c.nome_completo
                  ,t_total.total
                order by valor_total desc
                `;

  //console.log("query=" + query);
  const values = [ req.query.dhinicio , req.query.dhfim , req.query.dhinicio , req.query.dhfim ];
  //const values = { dhinicio: req.query.dhinicio , dhfim: req.query.dhfim };
  //console.log('values=' + JSON.stringify(values));
  db.query(query, values, (err, results) => {
    if (err) {
      console.log('erro=' + err);
      res.status(500).send('Erro retornando dados de vendas por cliente para o gráfico: ' + err);
      return;
    }
    res.json(results);
    //console.log('results=' + JSON.stringify(results));
    console.log('get /vendas_cli_graf_por_periodo executado. Registros retornados com sucesso!');
  });
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
        res.status(500).send('Erro criando movimentação: ' + err);
        return;
      }
      const postId = result.insertId;
      db.query('SELECT * FROM movimentacao WHERE id_movimentacao = ?', postId, (err, result) => {
        if (err) {
          res.status(500).send('Erro recuperando movimentação criada: ' + err);
          return;
        }
        res.status(201).json(result[0]);
      });
      console.log('Post executado. Movimentação criada com sucesso!');
    });
  } catch (error) {
    res.status(400).send('Erro criando movimentação, quantidade inválida!');
    return;
  }
});

/* Get a specific post */
app.get('/movimentacao/:id', (req, res) => {
  const movimentacaoId = req.params.id;
  db.query('SELECT * FROM movimentacao WHERE id_movimentacao = ?', movimentacaoId, (err, result) => {
    if (err) {
      res.status(500).send('Erro recuperando movimentação: ' + err);
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Movimentação não encontrada: ' + err);
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
      res.status(500).send('Erro alterando movimentação: ' + err);
      return;
    }
    db.query('SELECT * FROM movimentacao WHERE id_movimentacao = ?', movimentacaoId, (err, result) => {
      if (err) {
        res.status(500).send('Erro recuperando movimentação alterada: ' + err);
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
      res.status(500).send('Erro deletando movimentação: ' + err);
      return;
    }
    res.status(200).json({ msg: 'Movimentação deletada com sucesso' });
  });
  console.log('delete /movimentacao/' + movimentacaoId + ' executado. Movimentação deletada com sucesso!');
});

// functions to support the front end to register a movimentation due to the foreign keys

// get all produtos descricao and id for the front

app.get('/produtos/names', (req, res) => {
  db.query('SELECT id_produto, descricao FROM produto', (err, result) => {
    if (err) {
      res.status(500).send('Erro recuperando nomes dos produtos');
    }
    res.json(result);
  });
  console.log('get /produtos/names executado. Produtos retornados com sucesso!');
});

// get all clientes name and id for the front

app.get('/clientes/names', (req, res) => {
  db.query('SELECT id_cliente, nome_completo FROM cliente', (err, result) => {
    if (err) {
      res.status(500).send('Erro recuperando nomes dos clientes');
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
      res.status(500).send('Erro recuperando configurações: ' + err);
      return;
    }
    res.json(results);
    console.log('Configurações retornadas com sucesso!');
  });
  console.log('get /config executado.');
});

//
// verificacao de login (usuario e senha) que o front-end chama para validar o login do usuario
//
// para testar com o postman, usar o body raw json :    { "login":"admin","senha":"123" }
//
app.post('/config/login', (req, res) => {

  console.log('post /config/login - inicio');
  
  var { login, senha } = req.body;
  login = login.toLowerCase();
  console.log('login=' + login);
  console.log('senha=' + senha);

  var senha_atual_do_bd = "";

  // obter o usuario da tabela do BD
  db.query('SELECT senha FROM usuario WHERE lower(login) = ?', [login], (err, results) => {

    if (err) {
      console.log('/config/login - Erro no select da tabela USUARIO');
      res.status(500).send('Erro no select da tabela USUARIO. ' + err.message);
    }
    else {

      // se existe no BD um usuario com o login recebido
      if ( results.length > 0) {
      
        console.log('results=' + JSON.stringify(results));

        senha_atual_do_bd = results[0].senha;
        console.log('/config/login - senha_atual_do_bd=' +senha_atual_do_bd);

        if ( senha_atual_do_bd != "" ) {

          console.log("/config/login - senha_atual_do_bd NAO estah vazia");
      
          // verificar se a senha recebida pro login bate com a senha gravada no campo senha do usuario
          // compareSync eh executado de forma sincrona (nao usa funcoes callback)
          if ( bcrypt.compareSync(senha, senha_atual_do_bd) ) {
            
            // se a senha atual enviada pelo usuario bate com a senha gravada no campo senha do usuario
            console.log("/config/login - senha informada pelo usuario bate com senha gravada no campo senha do usuario");
            res.status(200).json('{ "Status":"OK" }');

/*
            const token = jwt.sign({ login }, process.env.SECRET, {
              expiresIn: 300 // expires in 5min
            });

            res.status(200).json('{ "Status":"OK" , auth: true , token: ' + token +' }');
*/            
    
          } // if bcrypt.compareSync
          // se a senha atual enviada pelo usuario NAO bate com a senha gravada no campo senha do usuario
          else {
            console.log("/config/login - senha informada pelo usuario NAO bate com senha gravada no campo senha do usuario");
            res.status(401).json('{ "Status":"INVALIDO" }');
          } // else

        } // if ( senha_atual_do_bd != "" )
        // se a senha gravada no bd estiver vazia
        else {
          console.log("/config/login - senha gravada no campo senha do usuario estah vazia");
          res.status(500).send("senha gravada no campo senha do usuario estah vazia");
        } // else
      } // if ( results.length > 0)
      // se nao achou no BD um usuario com o login recebido
      else {
        console.log("/config/login - login informado pelo usuario NAO existe");
        res.status(401).json('{ "Status":"INVALIDO" }');
      } // else

    } // else
  
    console.log('post /config/login - fim');

  }); // db.query select

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
// verificar o usuario e senha recebidos e retorna um token de seguranca de acesso a API
//
// para testar com o postman, usar o body raw json :    { "login":"admin","senha":"123", "minutos":5 }
//
app.post('/config/get_api_token', (req, res) => {

  console.log('post /config/get_api_token - inicio');
  
  var { login, senha, minutos } = req.body;
  login = login.toLowerCase();
  console.log('login=' + login);
  console.log('senha=' + senha);
  console.log('minutos=' + minutos);

  var senha_atual_do_bd = "";

  // obter o usuario da tabela do BD
  db.query('SELECT senha FROM usuario WHERE lower(login) = ?', [login], (err, results) => {

    if (err) {
      console.log('/config/get_api_token - Erro no select da tabela USUARIO');
      res.status(500).send('Erro no select da tabela USUARIO. ' + err.message);
    }
    else {

      // se existe no BD um usuario com o login recebido
      if ( results.length > 0) {
      
        console.log('results=' + JSON.stringify(results));

        senha_atual_do_bd = results[0].senha;
        console.log('/config/get_api_token - senha_atual_do_bd=' +senha_atual_do_bd);

        if ( senha_atual_do_bd != "" ) {

          console.log("/config/get_api_token - senha_atual_do_bd NAO estah vazia");
      
          // verificar se a senha recebida pro login bate com a senha gravada no campo senha do usuario
          // compareSync eh executado de forma sincrona (nao usa funcoes callback)
          if ( bcrypt.compareSync(senha, senha_atual_do_bd) ) {
            
            // se a senha atual enviada pelo usuario bate com a senha gravada no campo senha do usuario
            console.log("/config/get_api_token - senha informada pelo usuario bate com senha gravada no campo senha do usuario");

            const token = jwt.sign({ login }, process.env.SECRET, {
              expiresIn: minutos * 60 // expires in x minutos
            });

            res.status(200).json('{ "auth": true , "token": "' + token +'" }');
    
          } // if bcrypt.compareSync
          // se a senha atual enviada pelo usuario NAO bate com a senha gravada no campo senha do usuario
          else {
            console.log("/config/get_api_token - senha informada pelo usuario NAO bate com senha gravada no campo senha do usuario");
            res.status(401).json('{ "auth": false , "token": "" }');
          } // else

        } // if ( senha_atual_do_bd != "" )
        
      } // if ( results.length > 0)
      // se nao achou no BD um usuario com o login recebido
      else {
        console.log("/config/get_api_token - login informado pelo usuario NAO existe");
        res.status(401).json('{ "auth": false , "token": "" }');
      } // else

    } // else
  
    console.log('post /config/get_api_token - fim');

  }); // db.query select

}); // post /config/get_api_token

// verifica se o token recebido no request eh valido e, se for valido, continua a execucao do endpoint que chamou esta funcao
function verifyJWT(req, res, next){
  
  //const token = req.headers['authorization'];
  const token = req.params.token;
  
  //console.log("token=" + token);

  if (!token) return res.status(401).json({ auth: false, message: 'token de seguranca nao foi recebido.' });
  
  jwt.verify(token, process.env.SECRET, function(err, decoded) {
    //console.log("decoded=" + JSON.stringify( decoded) );
    
    if (err) {
      return res.status(500).json({ auth: false, message: 'falha na autenticacao do token de seguranca.' });
    }
    
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
} // function verifyJWT

//
  
/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
