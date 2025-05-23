

ALTER TABLE `mm_stock_dev`.`produto` 
ADD COLUMN `foto` LONGBLOB NULL AFTER `quantidade_atual`,
ADD COLUMN `localizacao` VARCHAR(60) NULL AFTER `foto`;

COMMIT;

