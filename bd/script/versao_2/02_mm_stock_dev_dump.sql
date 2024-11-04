-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 179.145.6.125    Database: mm_stock_dev
-- ------------------------------------------------------
-- Server version	8.0.37


-- script criado para ser usado na criacao do database mm_stock (producao) - versao 2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nome_completo` varchar(100) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `nome_loja` varchar(100) DEFAULT NULL,
  `cnpj` varchar(50) DEFAULT NULL,
  `cpf` varchar(50) DEFAULT NULL,
  `tipo_cliente` varchar(50) DEFAULT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `numero` int DEFAULT NULL,
  `complemento` varchar(45) DEFAULT NULL,
  `cidade` varchar(45) DEFAULT NULL,
  `uf` char(2) DEFAULT NULL,
  PRIMARY KEY (`id_cliente`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'Jorge Augusto','(19)981942563','jorgeaugusto@gmail.com','Jorge Presentes','','679.631.590-18','Pessoa Física','Rua Joao Belcastro',352,'','Bebedouro','SP'),(3,'José Carlos da Silva','(19)99785-9285','jose.silva@gmail.com','José Presentes M.E.','01.980.545/0001-09','','Pessoa Jurídica','Avenida Campos Salles',80,'-','Limeira','SP'),(9,'Diego Almeida','(19)3441-3253','diego.almeida@diegopresentes.com','Diego Presentes','153.584.796/0001-25','','Pessoa Jurídica','Rua Tiradentes',250,'','Limeira','SP'),(10,'Rosa Quintino de Oliveira','(19)3452-8351','rosaquadros@rosaquadroseretratos.com.br','Rosa Quadros e Retratos','548.943.879/0001-25','','Pessoa Jurídica','Rua Sete de Setembro',365,'','Americana','SP'),(13,'Pedro Gadelha','(19)34212152','pedro.gadelha@gmail.com','Novidades e Presentes','','556.412.400-60','Pessoa Física','Rua David Pugliese',101,'','Piracicaba','SP'),(17,'Rafaela Gomes','(31)99961-6055','sebastiana.gomes@gmail.com','Rafa Presentes','','433.656.880-48','Pessoa Física','Rua Gumercindo Araujo',30,'-','Juiz de Fora','MG'),(32,'josé das couve','19982699323','zedascouve@gmail.com','Couves do zeh','12345678000190','','Pessoa Jurídica','Rua dois',123,'quitanda da esquina','Brodowski','SP');
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `config`
--

DROP TABLE IF EXISTS `config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config` (
  `CFG01` varchar(200) NOT NULL COMMENT 'senha do usuario fixo "admin" do sistema',
  PRIMARY KEY (`CFG01`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config`
--

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
INSERT INTO `config` VALUES ('$2b$10$eZWvhJ4bf56VVm6rpPTID.Qaug1b/GEk4ncPzV3C16imq7fjqT2LK');
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fornecedor`
--

DROP TABLE IF EXISTS `fornecedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fornecedor` (
  `id_fornecedor` int NOT NULL AUTO_INCREMENT,
  `nome_fornecedor` varchar(100) NOT NULL,
  `nome_responsavel` varchar(100) NOT NULL,
  `contato_telefonico` varchar(20) DEFAULT NULL,
  `redes_sociais` varchar(255) DEFAULT NULL,
  `materiais_fornecidos` text,
  `cnpj` varchar(50) DEFAULT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `numero` int DEFAULT NULL,
  `complemento` varchar(45) DEFAULT NULL,
  `cidade` varchar(45) DEFAULT NULL,
  `uf` char(2) DEFAULT NULL,
  PRIMARY KEY (`id_fornecedor`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fornecedor`
--

LOCK TABLES `fornecedor` WRITE;
/*!40000 ALTER TABLE `fornecedor` DISABLE KEYS */;
INSERT INTO `fornecedor` VALUES (1,'Atacado Madeiras','Carlos Eduardo','17998062529','@atmadeiras','Fornecedor de madeiras de todos os tipos de tamanho e modelos.','49276112000169','Rua Tocantins, Jardim Arapuã',614,'','Jales','SP'),(21,'Atacado Varejeiro','Roberto Araujo','12345678','overejeiro@yahoo.com.br','Caixas\nTinturas\nVerniz\nLixas','4567891313184','Rua Carlos Gomes Moreno',123,'Bazar de esquina','Campinas','SP'),(22,'F5 Brindes','Fernando Marques',NULL,NULL,'Brindes:\ncanetas\ncopos\nsqueezes\nagendas\ncalendários\nchaveiros\nbottom\nbroches\nsqueezes\ngarrafas\nlápis',NULL,NULL,NULL,NULL,'Campinas','SP');
/*!40000 ALTER TABLE `fornecedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimentacao`
--

DROP TABLE IF EXISTS `movimentacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimentacao` (
  `id_movimentacao` int NOT NULL AUTO_INCREMENT,
  `data_hora` datetime NOT NULL,
  `id_produto` int NOT NULL,
  `tipo_mov` varchar(45) NOT NULL COMMENT 'Entrada\nSaida',
  `quantidade` int NOT NULL COMMENT 'qtde de produto que entrou ou saiu do estoque',
  `num_pedido` int DEFAULT NULL COMMENT 'é o número do pedido de venda para o cliente que gerou a movimentação de saída do estoque',
  `id_cliente` int DEFAULT NULL COMMENT 'id do cliente que levou o produto que saiu do estoque',
  `obs` text COMMENT 'texto de observacao/comentario sobre a movimentacao',
  PRIMARY KEY (`id_movimentacao`),
  KEY `id_produto_idx` (`id_produto`),
  KEY `id_cliente_idx` (`id_cliente`),
  CONSTRAINT `id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `id_produto` FOREIGN KEY (`id_produto`) REFERENCES `produto` (`id_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=327 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimentacao`
--

LOCK TABLES `movimentacao` WRITE;
/*!40000 ALTER TABLE `movimentacao` DISABLE KEYS */;
INSERT INTO `movimentacao` VALUES (15,'2024-05-05 20:32:01',1,'E',4,NULL,NULL,'1231231'),(16,'2024-05-05 20:32:11',1,'E',5,NULL,NULL,'1231231'),(17,'2024-05-05 20:42:33',1,'E',4,NULL,NULL,'ggggggg'),(18,'2024-05-05 20:56:24',1,'E',4,NULL,NULL,'1231231'),(19,'2024-05-05 21:05:12',1,'E',7,1,3,'zzzz'),(20,'2024-05-05 22:52:17',1,'E',4,NULL,NULL,'xxxxxxxxxxx'),(21,'2024-05-05 22:54:51',4,'E',6,NULL,NULL,'zzzzz'),(22,'2024-05-05 23:10:35',3,'E',6,NULL,NULL,'zzzzzrtwertwer\nwertwertwe\nwetertwertwretwer'),(23,'2024-05-05 23:13:40',4,'E',6,NULL,NULL,'6666666666666'),(24,'2024-05-05 23:30:37',3,'E',2,NULL,NULL,'qweqweqweq'),(25,'2024-05-05 23:44:10',3,'E',5,NULL,NULL,'1212121'),(26,'2024-05-05 23:48:00',3,'E',5,NULL,NULL,'2323232'),(27,'2024-05-06 00:05:11',3,'E',4,NULL,NULL,'23423423'),(28,'2024-05-06 00:24:39',4,'E',5,NULL,NULL,'55555555555'),(29,'2024-05-06 17:01:55',4,'E',3,NULL,NULL,'3333333'),(30,'2024-05-06 17:06:56',1,'E',1,NULL,NULL,'ssssssssssss'),(31,'2024-05-06 17:17:05',1,'E',1,NULL,NULL,'11111'),(32,'2024-05-06 17:23:25',3,'E',1,NULL,NULL,'11111'),(33,'2024-05-06 17:29:45',3,'E',5,NULL,NULL,'asdasdasdas'),(34,'2024-05-06 18:29:36',1,'E',3,NULL,NULL,NULL),(35,'2024-05-06 18:39:10',1,'E',3,NULL,NULL,'12'),(36,'2024-05-06 18:43:47',1,'E',1,NULL,NULL,'111111111'),(37,'2024-05-06 19:01:43',3,'E',1,NULL,NULL,'111'),(38,'2024-05-06 20:50:39',3,'E',5,NULL,NULL,NULL),(39,'2024-05-06 23:17:39',3,'S',1,NULL,3,'111111111111111'),(40,'2024-05-06 23:21:49',4,'S',2,123,3,'sdfgsdfgsfd'),(41,'2024-05-06 23:22:17',1,'S',5,78,1,'zzzzzzzzzzzzzzz'),(42,'2005-06-24 23:23:00',1,'E',100,1010,1,'Recebimento de mercadoria'),(43,'2005-06-24 23:23:00',1,'E',100,1010,1,'Recebimento de mercadoria'),(44,'2005-06-24 23:23:00',1,'S',100,1010,1,'Recebimento de mercadoria'),(45,'2024-05-07 11:18:55',3,'S',1,43,3,'vvvvvvvvvvvvvvvv'),(46,'2024-05-07 11:19:21',4,'S',4,NULL,1,NULL),(47,'2005-06-24 23:23:00',1,'S',304,1010,1,'Recebimento de mercadoria'),(48,'2005-06-24 23:23:00',1,'S',304,1010,1,'Recebimento de mercadoria'),(49,'2005-06-24 23:23:00',1,'S',304,1010,1,'Recebimento de mercadoria'),(50,'2005-06-24 23:23:00',1,'S',304,1010,1,'Recebimento de mercadoria'),(51,'2005-06-24 23:23:00',1,'S',304,1010,1,'Recebimento de mercadoria'),(52,'2005-06-24 23:23:00',1,'S',304,1010,1,'Recebimento de mercadoria'),(53,'2005-06-24 23:23:00',1,'S',304,1010,1,'que situação hein'),(54,'2005-06-24 23:23:00',1,'S',304,1010,1,'pequenas coisas da vida'),(55,'2005-06-24 23:23:00',1,'S',304,1010,1,'a vida é dura'),(56,'2005-06-24 23:23:00',1,'S',304,1010,1,'a vida é breve'),(57,'2005-06-24 23:23:00',1,'S',304,1010,1,'a vida é bela, as vezes'),(58,'2005-06-24 23:23:00',1,'S',304,1010,1,'a vida as vezes...'),(59,'2005-06-24 23:23:00',1,'S',303,1010,1,'poisé poisé...'),(60,'2005-07-24 18:23:00',1,'E',10,1010,1,'último teste'),(61,'2005-07-24 18:23:00',1,'E',10,1010,NULL,'último teste'),(62,'2024-05-09 23:44:34',1,'E',2,NULL,NULL,'entrada de 10 porta retratos verdes'),(63,'2024-05-10 22:05:28',1,'E',2,NULL,NULL,'Novos portas retratos entrando'),(64,'2024-05-10 22:07:05',1,'E',3,NULL,NULL,'mais porta retratos chegando!'),(66,'2024-05-10 22:21:53',1,'E',9,NULL,NULL,'muitos porta retratos!'),(68,'2024-05-11 00:30:26',3,'E',1,NULL,NULL,'teste'),(69,'2024-05-11 10:35:54',15,'E',1,NULL,NULL,'aasdasdas'),(70,'2024-05-11 10:37:57',4,'E',1,NULL,NULL,NULL),(71,'2024-05-11 10:38:08',5,'E',2,NULL,NULL,NULL),(73,'2024-05-12 16:21:12',1,'E',2,NULL,NULL,NULL),(74,'2024-05-13 21:10:38',1,'E',1,NULL,NULL,'mais um!'),(75,'2024-05-15 08:18:53',3,'E',2,NULL,NULL,'este produto é retorno ao estoque'),(76,'2024-05-15 08:19:19',3,'S',1,5,1,NULL),(77,'2024-05-15 08:19:51',22,'S',1,1,9,NULL),(78,'2024-05-15 12:39:46',28,'S',2,1520,9,'Venda feita através da internet Mercado Livre.'),(79,'2024-05-16 11:29:48',3,'E',4,NULL,NULL,NULL),(80,'2024-05-16 11:31:16',4,'E',4,NULL,NULL,NULL),(81,'2024-05-16 11:33:26',5,'E',1,NULL,NULL,NULL),(82,'2024-05-16 11:36:28',4,'E',1,NULL,NULL,NULL),(83,'2024-05-16 11:40:10',4,'E',1,NULL,NULL,NULL),(84,'2024-05-16 11:44:29',1,'S',1,NULL,9,NULL),(85,'2024-05-16 11:47:57',4,'E',1,NULL,NULL,NULL),(86,'2024-05-16 12:10:56',4,'E',2,NULL,NULL,NULL),(87,'2024-05-16 12:12:33',5,'E',1,NULL,NULL,'dddddddddd'),(88,'2024-05-16 12:30:13',3,'E',4,NULL,NULL,NULL),(89,'2024-05-16 12:38:35',4,'E',1,NULL,NULL,NULL),(90,'2024-05-16 12:43:46',5,'E',2,NULL,NULL,NULL),(91,'2024-05-16 12:48:10',1,'S',1,NULL,NULL,NULL),(92,'2024-05-16 13:01:33',1,'E',1,NULL,NULL,NULL),(93,'2024-05-16 13:03:23',4,'E',1,NULL,NULL,NULL),(94,'2024-05-16 13:04:36',4,'E',1,NULL,NULL,NULL),(95,'2024-05-16 13:04:53',15,'E',1,NULL,NULL,NULL),(96,'2024-05-16 13:16:19',1,'S',2,NULL,NULL,NULL),(97,'2024-05-16 13:24:30',1,'E',2,NULL,NULL,NULL),(98,'2024-05-16 13:24:40',4,'S',1,NULL,NULL,NULL),(99,'2024-05-16 19:48:04',4,'E',1,NULL,NULL,NULL),(100,'2024-05-16 21:06:30',1,'S',0,2,10,NULL),(101,'2024-05-16 21:10:00',1,'E',0,NULL,NULL,NULL),(102,'2024-05-17 00:06:34',5,'E',1,NULL,NULL,NULL),(104,'2024-05-17 08:19:19',1,'E',2,NULL,NULL,'teste para excluir'),(105,'2024-05-17 12:57:13',4,'S',1,543,NULL,'venda simples'),(106,'2024-05-17 12:58:03',4,'S',2,NULL,9,NULL),(107,'2024-05-17 13:06:00',4,'S',1,32,NULL,'venda'),(108,'2024-05-17 13:17:56',3,'S',1,123,3,NULL),(110,'2024-05-17 13:19:52',5,'S',1,65,3,NULL),(111,'2024-05-17 13:21:10',5,'S',1,NULL,17,NULL),(112,'2024-05-17 13:32:36',4,'S',1,NULL,13,NULL),(113,'2024-05-17 19:33:19',5,'E',1,NULL,NULL,NULL),(115,'2024-05-17 19:51:36',4,'E',10,NULL,NULL,NULL),(116,'2024-05-17 19:51:59',5,'S',2,NULL,9,NULL),(118,'2024-05-21 11:25:35',1,'E',1,NULL,NULL,NULL),(119,'2024-10-03 22:50:26',1,'E',3,NULL,NULL,'asd'),(120,'2024-10-03 22:50:41',1,'S',2,-5,9,'asd'),(121,'2024-10-03 22:50:53',1,'S',3,5,3,'asdfgf'),(122,'2024-10-03 23:12:52',1,'E',3,NULL,NULL,'gh'),(123,'2024-10-03 23:26:50',1,'E',3,NULL,NULL,'asdf'),(124,'2024-10-03 23:28:04',1,'E',3,NULL,NULL,'aasdasdfg'),(125,'2024-07-09 09:44:41',3,'E',10,NULL,NULL,NULL),(126,'2024-08-09 09:44:54',4,'S',6,123,9,NULL),(127,'2024-10-11 18:12:15',1,'E',1,NULL,NULL,NULL),(128,'2024-10-11 18:12:33',1,'S',1,1,1,NULL),(129,'2024-01-10 13:22:12',1,'E',20,NULL,NULL,NULL),(130,'2024-01-12 15:02:10',3,'E',20,NULL,NULL,NULL),(131,'2024-01-12 16:15:35',4,'E',20,NULL,NULL,NULL),(132,'2024-01-12 16:19:15',5,'E',20,NULL,NULL,NULL),(133,'2024-01-12 16:39:40',15,'E',20,NULL,NULL,NULL),(134,'2024-01-15 11:09:40',19,'E',15,NULL,NULL,NULL),(135,'2024-01-15 11:39:40',21,'E',15,NULL,NULL,NULL),(136,'2024-01-16 13:56:07',22,'E',15,NULL,NULL,NULL),(137,'2024-01-16 14:06:28',23,'E',15,NULL,NULL,NULL),(138,'2024-01-17 13:02:11',27,'E',10,NULL,NULL,NULL),(139,'2024-01-17 13:44:01',28,'E',10,NULL,NULL,NULL),(140,'2024-01-17 14:20:31',29,'E',10,NULL,NULL,NULL),(141,'2024-01-17 15:16:37',30,'E',10,NULL,NULL,NULL),(142,'2024-01-18 11:07:07',31,'E',10,NULL,NULL,NULL),(143,'2024-01-15 16:17:07',1,'S',1,200,1,NULL),(144,'2024-01-15 16:17:07',3,'S',1,201,1,NULL),(145,'2024-01-16 13:12:14',4,'S',3,202,3,NULL),(146,'2024-01-15 16:17:07',15,'S',5,203,9,NULL),(147,'2024-01-17 14:26:44',27,'S',2,204,13,NULL),(148,'2024-01-15 16:17:07',30,'S',1,205,32,NULL),(149,'2024-01-15 16:17:07',5,'S',10,206,17,NULL),(150,'2024-02-05 11:10:30',32,'E',15,NULL,NULL,NULL),(151,'2024-02-05 13:00:30',33,'E',15,NULL,NULL,NULL),(152,'2024-02-05 14:32:00',34,'E',15,NULL,NULL,NULL),(153,'2024-02-05 15:15:04',35,'E',15,NULL,NULL,NULL),(154,'2024-02-07 14:48:10',5,'E',5,NULL,NULL,NULL),(155,'2024-02-07 15:16:02',4,'E',5,NULL,NULL,NULL),(156,'2024-02-08 13:08:25',27,'E',5,NULL,NULL,NULL),(157,'2024-02-08 13:42:27',30,'E',6,NULL,NULL,NULL),(158,'2024-02-13 13:27:07',1,'S',2,207,1,NULL),(159,'2024-02-13 13:38:22',3,'S',4,208,3,NULL),(160,'2024-02-13 15:18:45',1,'S',2,209,9,NULL),(161,'2024-02-14 14:41:09',19,'S',5,210,10,NULL),(162,'2024-02-14 16:47:42',27,'S',2,211,13,NULL),(163,'2024-02-15 11:43:16',28,'S',1,212,1,NULL),(164,'2024-02-15 14:01:10',32,'S',4,213,17,NULL),(165,'2024-02-16 15:17:07',33,'S',1,214,32,NULL),(166,'2024-02-16 16:10:03',22,'S',3,215,13,NULL),(167,'2024-02-22 13:36:19',35,'S',3,216,10,NULL),(168,'2024-03-04 11:00:59',28,'E',1,NULL,NULL,NULL),(169,'2024-03-04 11:25:33',1,'E',5,NULL,NULL,NULL),(170,'2024-03-04 11:49:48',5,'E',5,NULL,NULL,NULL),(171,'2024-03-05 13:14:46',22,'E',3,NULL,NULL,NULL),(172,'2024-03-05 13:24:32',32,'E',5,NULL,NULL,NULL),(173,'2024-03-05 14:06:04',35,'E',5,NULL,NULL,NULL),(174,'2024-03-06 13:24:45',29,'E',5,NULL,NULL,NULL),(175,'2024-03-06 13:55:15',4,'E',3,NULL,NULL,NULL),(176,'2024-03-06 14:07:31',30,'E',5,NULL,NULL,NULL),(177,'2024-03-07 11:22:21',31,'E',2,NULL,NULL,NULL),(178,'2024-03-07 11:34:17',34,'E',1,NULL,NULL,NULL),(191,'2024-03-13 13:34:15',1,'S',2,217,1,NULL),(192,'2024-03-18 14:28:17',3,'S',4,218,3,NULL),(193,'2024-03-18 15:19:40',1,'S',2,219,9,NULL),(194,'2024-03-19 14:11:12',19,'S',5,220,10,NULL),(195,'2024-03-19 16:48:44',27,'S',2,221,13,NULL),(196,'2024-03-20 13:13:02',28,'S',1,222,1,NULL),(197,'2024-03-20 13:55:24',32,'S',4,223,17,NULL),(198,'2024-03-21 15:07:28',33,'S',1,224,32,NULL),(199,'2024-03-22 14:03:12',22,'S',3,225,13,NULL),(200,'2024-03-22 14:29:10',35,'S',3,226,10,NULL),(201,'2024-03-26 16:40:20',1,'S',2,227,1,NULL),(202,'2024-03-27 14:52:24',1,'S',2,228,1,NULL),(203,'2024-04-01 11:22:18',1,'E',18,NULL,NULL,NULL),(204,'2024-04-01 11:27:43',3,'E',19,NULL,NULL,NULL),(205,'2024-04-02 11:44:14',4,'E',5,NULL,NULL,NULL),(206,'2024-04-02 13:09:56',27,'E',11,NULL,NULL,NULL),(207,'2024-04-03 13:12:37',28,'E',11,NULL,NULL,NULL),(208,'2024-04-03 13:33:40',33,'E',7,NULL,NULL,NULL),(209,'2024-04-04 11:14:42',35,'E',7,NULL,NULL,NULL),(210,'2024-04-04 11:25:29',31,'E',8,NULL,NULL,NULL),(211,'2024-04-05 13:05:36',32,'E',8,NULL,NULL,NULL),(212,'2024-04-05 13:12:18',22,'E',8,NULL,NULL,NULL),(213,'2024-04-05 13:44:49',19,'E',15,NULL,NULL,NULL),(214,'2024-04-08 11:04:43',21,'E',5,NULL,NULL,NULL),(215,'2024-04-08 11:14:31',23,'E',5,NULL,NULL,NULL),(226,'2024-04-08 15:22:51',23,'S',3,227,3,NULL),(227,'2024-04-09 11:38:12',23,'S',2,228,9,NULL),(228,'2024-04-09 16:24:56',29,'S',5,229,1,NULL),(229,'2024-04-15 14:22:39',31,'S',1,230,1,NULL),(230,'2024-04-15 14:38:36',34,'S',3,231,10,NULL),(231,'2024-04-16 13:15:45',34,'S',3,232,13,NULL),(232,'2024-04-17 14:06:42',32,'S',1,233,10,NULL),(233,'2024-04-18 15:25:25',4,'S',1,234,3,NULL),(234,'2024-04-22 16:01:03',4,'S',4,235,17,NULL),(235,'2024-04-23 13:14:20',1,'S',2,236,17,NULL),(236,'2024-05-06 11:10:32',29,'E',5,NULL,NULL,NULL),(237,'2024-05-06 11:25:28',34,'E',5,NULL,NULL,NULL),(238,'2024-05-07 11:48:36',22,'E',8,NULL,NULL,NULL),(239,'2024-05-07 13:05:12',15,'E',5,NULL,NULL,NULL),(240,'2024-05-08 11:15:24',23,'E',5,NULL,NULL,NULL),(241,'2024-05-08 11:38:26',28,'E',5,NULL,NULL,NULL),(242,'2024-05-08 11:44:12',31,'E',1,NULL,NULL,NULL),(243,'2024-05-08 11:56:41',32,'E',1,NULL,NULL,NULL),(244,'2024-05-01 13:25:35',1,'S',2,237,9,NULL),(245,'2024-05-01 13:34:24',5,'S',3,238,3,NULL),(246,'2024-05-01 15:34:36',30,'S',4,239,10,NULL),(247,'2024-05-03 13:26:23',35,'S',3,240,1,NULL),(248,'2024-05-07 14:55:30',31,'S',1,241,13,NULL),(249,'2024-05-07 15:35:46',21,'S',5,242,32,NULL),(250,'2024-05-09 13:14:56',21,'S',2,243,17,NULL),(251,'2024-05-09 14:35:34',3,'S',1,244,9,NULL),(252,'2024-05-20 15:17:38',4,'S',6,245,10,NULL),(253,'2024-05-21 16:02:25',30,'S',2,246,3,NULL),(254,'2024-05-21 16:34:29',23,'S',1,247,1,NULL),(255,'2024-05-22 13:17:20',30,'S',2,248,32,NULL),(256,'2024-05-23 14:19:10',29,'S',3,249,10,NULL),(257,'2024-05-24 13:14:44',28,'S',1,250,9,NULL),(268,'2024-06-04 13:20:23',3,'S',3,251,1,NULL),(269,'2024-06-05 14:42:44',1,'S',4,252,32,NULL),(270,'2024-06-11 14:53:21',28,'S',2,253,13,NULL),(271,'2024-06-13 13:56:32',3,'S',1,254,17,NULL),(272,'2024-06-13 14:05:03',5,'S',2,255,3,NULL),(273,'2024-06-18 15:12:34',19,'S',3,256,10,NULL),(274,'2024-06-19 13:04:55',28,'S',2,257,10,NULL),(275,'2024-06-19 14:25:34',30,'S',2,258,1,NULL),(276,'2024-06-20 16:37:34',15,'S',3,259,9,NULL),(277,'2024-06-27 14:40:25',34,'S',1,260,3,NULL),(278,'2024-06-06 11:15:24',5,'E',5,NULL,NULL,NULL),(279,'2024-06-06 11:28:23',15,'E',3,NULL,NULL,NULL),(280,'2024-06-07 11:54:47',19,'E',3,NULL,NULL,NULL),(281,'2024-06-07 11:25:12',21,'E',7,NULL,NULL,NULL),(282,'2024-06-10 11:28:46',29,'E',8,NULL,NULL,NULL),(283,'2024-06-10 11:36:12',30,'E',5,NULL,NULL,NULL),(284,'2024-06-11 11:10:22',34,'E',6,NULL,NULL,NULL),(285,'2024-06-11 11:36:47',35,'E',3,NULL,NULL,NULL),(286,'2024-07-02 14:35:26',5,'S',1,261,13,NULL),(287,'2024-07-02 15:44:25',21,'S',2,262,3,NULL),(288,'2024-07-09 14:03:12',5,'S',2,263,17,NULL),(289,'2024-07-10 13:59:23',34,'S',3,264,32,NULL),(290,'2024-07-18 15:05:09',4,'S',5,265,1,NULL),(291,'2024-07-22 16:17:37',29,'S',2,266,9,NULL),(292,'2024-07-25 13:19:18',23,'S',1,267,10,NULL),(293,'2024-07-22 11:18:20',4,'E',6,NULL,NULL,NULL),(294,'2024-07-22 11:38:44',5,'E',3,NULL,NULL,NULL),(295,'2024-07-23 13:04:17',21,'E',2,NULL,NULL,NULL),(296,'2024-07-24 11:15:32',29,'E',2,NULL,NULL,NULL),(297,'2024-07-25 11:18:46',34,'E',3,NULL,NULL,NULL),(298,'2024-07-25 11:29:52',31,'E',1,NULL,NULL,NULL),(299,'2024-07-29 13:10:12',30,'E',5,NULL,NULL,NULL),(300,'2024-08-08 14:35:26',23,'S',3,268,10,NULL),(301,'2024-08-09 15:44:25',3,'S',3,269,32,NULL),(302,'2024-08-15 14:03:12',3,'S',2,270,9,NULL),(303,'2024-08-21 13:59:23',1,'S',6,271,17,NULL),(304,'2024-08-28 15:05:09',33,'S',7,272,1,NULL),(305,'2024-08-20 11:08:20',23,'E',5,NULL,NULL,NULL),(306,'2024-08-22 11:32:24',1,'E',3,NULL,NULL,NULL),(307,'2024-08-29 13:22:19',33,'E',6,NULL,NULL,NULL),(308,'2024-09-09 13:16:26',22,'S',1,273,1,NULL),(309,'2024-09-11 14:28:25',22,'S',2,274,3,NULL),(310,'2024-09-13 14:19:12',27,'S',3,275,9,NULL),(311,'2024-09-18 15:37:23',31,'S',3,276,13,NULL),(312,'2024-09-18 11:41:31',28,'S',5,277,32,NULL),(313,'2024-09-23 13:16:09',31,'S',1,278,17,NULL),(314,'2024-09-25 15:47:23',21,'S',4,279,3,NULL),(315,'2024-09-27 14:31:19',15,'S',2,280,10,NULL),(316,'2024-09-25 11:33:29',31,'E',3,NULL,NULL,NULL),(317,'2024-09-26 13:02:20',21,'E',3,NULL,NULL,NULL),(318,'2024-09-26 11:23:17',28,'E',4,NULL,NULL,NULL),(319,'2024-10-03 14:13:26',22,'S',2,281,10,NULL),(320,'2024-10-08 15:28:25',1,'S',1,282,32,NULL),(321,'2024-10-11 12:10:32',3,'S',4,283,17,NULL),(322,'2024-10-07 11:20:15',22,'E',4,NULL,NULL,NULL),(323,'2024-10-14 01:00:58',1,'E',1,NULL,NULL,'asd'),(324,'2024-10-14 01:01:08',1,'S',1,1,1,'asd'),(325,'2024-10-23 07:46:03',3,'S',1,2,1,NULL),(326,'2024-10-23 08:06:47',3,'E',3,NULL,NULL,NULL);
/*!40000 ALTER TABLE `movimentacao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produto`
--

DROP TABLE IF EXISTS `produto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produto` (
  `id_produto` int NOT NULL AUTO_INCREMENT,
  `descricao` varchar(80) NOT NULL,
  `cor` varchar(50) NOT NULL,
  `tamanho` varchar(50) NOT NULL,
  `tipo_material` varchar(50) NOT NULL,
  `preco_venda` decimal(10,2) NOT NULL,
  `quantidade_atual` int NOT NULL,
  PRIMARY KEY (`id_produto`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produto`
--

LOCK TABLES `produto` WRITE;
/*!40000 ALTER TABLE `produto` DISABLE KEYS */;
INSERT INTO `produto` VALUES (1,'Porta Retrato 10x15 Amarelo em Madeira','Amarelo','10x15','Madeira',4.50,51),(3,'Porta Retrato 10x15 Bege em Madeira','Bege','10x15','Madeira',4.10,119),(4,'Porta Retrato 10x15 Prata em Madeira','Prata','10x15','Madeira',4.20,54),(5,'Porta Retrato 10x15 Dourado em Madeira','Dourado','10x15','Madeira',4.90,599),(15,'Porta Retrato 10x15 Preto em Madeira','Preto','10x15','Madeira',4.50,6),(19,'Porta Retrato 15x21 Amarelo em Madeira','Amarelo','15x21','Madeira',5.20,150),(21,'Porta Retrato 15x21 Bege em Madeira','Bege','15x21','Madeira',5.20,31),(22,'Porta Retrato 15x21 Prata em Madeira','Prata','15x21','Madeira',5.60,50),(23,'Porta Retrato 15x21 Dourado em Madeira','Dourado','15x21','Madeira',5.60,30),(27,'Porta Retrato 20x30 Amarelo em Madeira','Amarelo','20x30','Madeira',7.50,111),(28,'Porta Retrato 20x30 Bege em Madeira','Bege','20x30','Madeira',7.20,130),(29,'Porta Retrato 20x30 Prata em Madeira','Prata','20x30','Madeira',7.50,120),(30,'Porta Retrato 20x30 Dourado em Madeira','Dourado','20x30','Madeira',7.60,200),(31,'Porta Retrato 20x30 Preto em Madeira','Preto','20x30','Madeira',7.80,320),(32,'Porta Retrato 20x25 Amarelo em Madeira','Amarelo','20x25','Madeira',5.50,100),(33,'Porta Retrato 20x25 Bege em Madeira','Bege','20x25','Madeira',5.60,150),(34,'Porta Retrato 20x25 Prata em Madeira','Prata','20x25','Madeira',5.10,20),(35,'Porta Retrato 20x25 Dourado em Madeira','Dourado','20x25','Madeira',5.30,63),(36,'Porta Retrato 20x25 Preto em Madeira','Preto','20x25','Madeira',5.90,515),(40,'Teste','Teste','1x1','Couro',5.00,2),(44,'Calendário Molduvidro Machado','Bege','1x1','Couro',5.00,10);
/*!40000 ALTER TABLE `produto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `login` varchar(45) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `senha` varchar(100) NOT NULL,
  `privilegios` varchar(100) DEFAULT NULL COMMENT 'Este campo guarda uma string e cada posição da string representa um privilégio do sistema e pode ser 0 ou 1, sendo que 0 indica que o usuário não possui o privilégio e 1 indica que o usuário possui o privilégio. Exemplo deste campo: 11001010111000\nA lista de privilégios com o número da posição de cada privilégio deve ser consultada no arquivo USUARIO.ts do front-end.',
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (4,'Admin','Administrador do Sistema','$2b$10$RjP7s.3X7p17SxGVvHy/5u0Pn8c2vTZ047QuufAy.5aMsKIDcl67u','111111111111111111111'),(5,'testando','Testando','$2b$10$tQXd3z67NdbAZG/zKZfDFuDiKAICrbjaanfouI35/.SFR9fmYmgbi','1110000000001010001'),(6,'zeh','zehhhh','$2b$10$8WbvYl64PJcXPO8U7Aasl.IQq1X7AIo17LYM1aKnmT.fEyLGrECEi','111111111111111111111'),(14,'pedro','pedro da silva','$2b$10$kyAsGrCl6CA65mW9qWr6luJl3nhvnHhtDEnlFylfQIkn5SQtDgs/q','000000000000000000000'),(15,'zeh2','zeh2','$2b$10$1sSPWrrtM8dzGXcfItP1r.WStx21NB4SjTbWz8G7oIeFVglUZVZCy','1000000000000000000'),(18,'erik','erik','$2b$10$es5BOWoi3YTpGBrxa9pYeumRk3rBFs89vD.RHceVDn31kf5W6.BpG','1111111111111111111'),(19,'betzabel','betzabel','$2b$10$N5/1lsHNYP6jnciVF5hgHePn1prLYHEfVBB5Qol4pMLEsSfvW/Cpu','1111111111111000111'),(20,'Danilo','Danilo Nunes','$2b$10$Orw5en0/rdWrOEIU/kSwV.JBiQpYFP4zgGL.hur1a5Crt93IWzaCK','111111111111111111111'),(21,'Antedeguemon','Antedeguemon Deftones da Silva','$2b$10$M6v37ktAnZwfEmAkYzeFLe.2LBDoob.wPlwm983BmzWm4hysLoQTa','1111111111110001111'),(26,'semnada','semnada','$2b$10$0VwGyudbpkYvjU7egNvHnup02eCKssar.8KDG8cIKQARGtx.2w7nm','000000000000000000000'),(27,'soconsulta','soconsulta','$2b$10$sPiPYs7a1xC8OJN6MGNktOBlgH5Gvh/C4GNK0/mIv2lbOxrvxPSaC','100010001000001100011'),(28,'inclusao','inclusao','$2b$10$AK3b1fMDzcGkqvreMfBmCO7NxdP8ud4H4WjH9FBYGXRSZFGT493YW','110011001100111110011'),(29,'edicao','edicao','$2b$10$fhlnRaBI1jaDpaTnx5xp5.vaP27qScBVOuW3fjMazYt72qZ..e/T2','111011101110111111011');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-29 15:18:07
