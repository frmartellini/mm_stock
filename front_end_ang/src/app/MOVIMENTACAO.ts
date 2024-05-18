export interface MOVIMENTACAO {
  id_movimentacao :number;
  data_hora: string;
  id_produto: number;
  tipo_mov: string;
  quantidade: number;
  num_pedido: number;
  id_cliente: number;
  obs: string;
}