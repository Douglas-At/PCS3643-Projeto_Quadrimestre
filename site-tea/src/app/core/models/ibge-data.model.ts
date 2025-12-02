export interface IbgeDataRecord {
  ano: number;
  idade: string;
  local: string;
  sexo: string;
  valor: number | null;   // aceita null vindo do backend
  variavel: string;
}