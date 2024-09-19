-- MySQL Script generated by MySQL Workbench
-- Thu Sep 19 09:58:08 2024
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mm_stock
-- -----------------------------------------------------
-- DROP SCHEMA IF EXISTS `mm_stock` ;

-- -----------------------------------------------------
-- Schema mm_stock
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mm_stock` DEFAULT CHARACTER SET utf8mb4 ;
USE `mm_stock` ;

-- -----------------------------------------------------
-- Table `mm_stock`.`cliente`
-- -----------------------------------------------------
-- DROP TABLE IF EXISTS `mm_stock`.`cliente` ;

CREATE TABLE IF NOT EXISTS `mm_stock`.`cliente` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `nome_completo` VARCHAR(100) NOT NULL,
  `telefone` VARCHAR(20) NULL DEFAULT NULL,
  `email` VARCHAR(100) NULL DEFAULT NULL,
  `nome_loja` VARCHAR(100) NULL DEFAULT NULL,
  `cnpj` VARCHAR(50) NULL DEFAULT NULL,
  `cpf` VARCHAR(50) NULL,
  `tipo_cliente` VARCHAR(50) NULL,
  `endereco` VARCHAR(100) NULL,
  `numero` INT NULL,
  `complemento` VARCHAR(45) NULL,
  `cidade` VARCHAR(45) NULL,
  `uf` CHAR(2) NULL,
  PRIMARY KEY (`id_cliente`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mm_stock`.`produto`
-- -----------------------------------------------------
-- DROP TABLE IF EXISTS `mm_stock`.`produto` ;

CREATE TABLE IF NOT EXISTS `mm_stock`.`produto` (
  `id_produto` INT NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(80) NOT NULL,
  `cor` VARCHAR(50) NOT NULL,
  `tamanho` VARCHAR(50) NOT NULL,
  `tipo_material` VARCHAR(50) NOT NULL,
  `preco_venda` DECIMAL(10,2) NOT NULL,
  `quantidade_atual` INT NOT NULL,
  PRIMARY KEY (`id_produto`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mm_stock`.`movimentacao`
-- -----------------------------------------------------
-- DROP TABLE IF EXISTS `mm_stock`.`movimentacao` ;

CREATE TABLE IF NOT EXISTS `mm_stock`.`movimentacao` (
  `id_movimentacao` INT NOT NULL AUTO_INCREMENT,
  `data_hora` DATETIME NOT NULL,
  `id_produto` INT NOT NULL,
  `tipo_mov` VARCHAR(45) NOT NULL COMMENT 'Entrada\nSaida',
  `quantidade` INT NOT NULL COMMENT 'qtde de produto que entrou ou saiu do estoque',
  `num_pedido` INT NULL COMMENT 'é o número do pedido de venda para o cliente que gerou a movimentação de saída do estoque',
  `id_cliente` INT NULL COMMENT 'id do cliente que levou o produto que saiu do estoque',
  `obs` TEXT NULL COMMENT 'texto de observacao/comentario sobre a movimentacao',
  PRIMARY KEY (`id_movimentacao`),
  CONSTRAINT `id_produto`
    FOREIGN KEY (`id_produto`)
    REFERENCES `mm_stock`.`produto` (`id_produto`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_cliente`
    FOREIGN KEY (`id_cliente`)
    REFERENCES `mm_stock`.`cliente` (`id_cliente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `id_produto_idx` ON `mm_stock`.`movimentacao` (`id_produto` ASC) VISIBLE;

CREATE INDEX `id_cliente_idx` ON `mm_stock`.`movimentacao` (`id_cliente` ASC) VISIBLE;


-- -----------------------------------------------------
-- Table `mm_stock`.`fornecedor`
-- -----------------------------------------------------
-- DROP TABLE IF EXISTS `mm_stock`.`fornecedor` ;

CREATE TABLE IF NOT EXISTS `mm_stock`.`fornecedor` (
  `id_fornecedor` INT NOT NULL AUTO_INCREMENT,
  `nome_fornecedor` VARCHAR(100) NOT NULL,
  `nome_responsavel` VARCHAR(100) NOT NULL,
  `contato_telefonico` VARCHAR(20) NULL DEFAULT NULL,
  `redes_sociais` VARCHAR(255) NULL DEFAULT NULL,
  `materiais_fornecidos` TEXT NULL DEFAULT NULL,
  `cnpj` VARCHAR(50) NULL,
  `endereco` VARCHAR(100) NULL,
  `numero` INT NULL,
  `complemento` VARCHAR(45) NULL,
  `cidade` VARCHAR(45) NULL,
  `uf` CHAR(2) NULL,
  PRIMARY KEY (`id_fornecedor`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `mm_stock`.`config`
-- -----------------------------------------------------
-- DROP TABLE IF EXISTS `mm_stock`.`config` ;

CREATE TABLE IF NOT EXISTS `mm_stock`.`config` (
  `CFG01` VARCHAR(200) NOT NULL COMMENT 'senha do usuario fixo \"admin\" do sistema',
  PRIMARY KEY (`CFG01`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mm_stock`.`usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mm_stock`.`usuario` ;

CREATE TABLE IF NOT EXISTS `mm_stock`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `login` VARCHAR(45) NOT NULL,
  `nome` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `privilegios` VARCHAR(100) NULL DEFAULT NULL COMMENT 'Este campo guarda uma string e cada posição da string representa um privilégio do sistema e pode ser 0 ou 1, sendo que 0 indica que o usuário não possui o privilégio e 1 indica que o usuário possui o privilégio. Exemplo deste campo: 11001010111000\nA lista de privilégios com o número da posição de cada privilégio deve ser consultada no arquivo USUARIO.ts do front-end.',
  PRIMARY KEY (`id_usuario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
