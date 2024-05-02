
type Rate = {
  value_buy: number;
  value_sell: number;
  value_avg: number;
};

type BlueApiResponse = {
  oficial: Rate;
  blue: Rate;
  oficial_euro: Rate;
  blue_euro: Rate;
  last_update: string;
};

type DolarApiResponse = {
  compra: number;
  venta: number;
  fechaActualizacion: string;
};

type AmbitoApiResponse = {
  compra: string;
  venta: string;
  fecha: string;
  variacion: string;
  classVariacion: string;
  valor_cierre_ant: string;
};

type DolarsiCasa = {
  compra: string;
  venta: string;
  nombre: string;
  // include other fields if necessary
};

type DolarsiApiResponse = Array<{ casa: DolarsiCasa }>;

export type ApiResponseType = BlueApiResponse | DolarApiResponse | AmbitoApiResponse | DolarsiApiResponse

export type ExchangeRate = {
  compra: number;
  venta: number;
  fecha: string;
  valor: number;
};

export type EndpointConfig = {
  label: string;
  url: string;
  parseData: (data: ApiResponseType) => ExchangeRate;
};
