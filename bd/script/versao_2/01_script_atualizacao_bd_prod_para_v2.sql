
-- criar o schema "mm_stock_prod_old1"
CREATE SCHEMA `mm_stock_prod_old1` DEFAULT CHARACTER SET utf8mb4 ;

/*

-- select para gerar os comandos RENAME TABLE que serao usados para "transferir" as tabelas do schema "mm_stock" para "mm_stock_prod_old1"

SELECT CONCAT('RENAME TABLE ',table_schema,'.`',table_name,
     '` TO ','mm_stock_prod_old1.`',table_name,'`;')
 FROM information_schema.TABLES
 WHERE table_schema LIKE 'mm_stock';

*/
 
RENAME TABLE mm_stock.`cliente` TO mm_stock_prod_old1.`cliente`;
RENAME TABLE mm_stock.`config` TO mm_stock_prod_old1.`config`;
RENAME TABLE mm_stock.`fornecedor` TO mm_stock_prod_old1.`fornecedor`;
RENAME TABLE mm_stock.`movimentacao` TO mm_stock_prod_old1.`movimentacao`;
RENAME TABLE mm_stock.`produto` TO mm_stock_prod_old1.`produto`;

