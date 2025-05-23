export interface PRODUTO {
  id_produto :number;
  descricao: string;
  cor: string;
  tamanho: string;
  tipo_material: string;
  preco_venda: number;
  quantidade_atual: number;
  localizacao: string | null | undefined;
  foto: string | null | undefined;
}