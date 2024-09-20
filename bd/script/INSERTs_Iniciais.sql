
-- Contem os comandos INSERT para inserir nas tabelas as informacoes que nao sao inseridas normalmente pelo sistema

-- inserir o usuario admin
INSERT INTO usuario
(
  login,
  nome,
  senha,
  privilegios
)
VALUES
(
  'admin',
  'Administrador do Sistema',
  '$2b$10$MCi0dcDS3ElWjUXMuBC/j..6Z0ot6jzpeYO./6T.V8D2RgvEMJjXq',
  '1111111111111111111111111111111111111111111111111111'
);

COMMIT;
