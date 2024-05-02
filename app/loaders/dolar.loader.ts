import { LoaderFunction, json } from '@remix-run/node';
import dayjs from 'dayjs';
import { ApiResponseType, EndpointConfig, ExchangeRate } from '~/types/dolar.types'


// Endpoint configurations
const endpoints: EndpointConfig[] = [
  {
    label: 'Ambito Financiero',
    url: 'https://mercados.ambito.com//dolar/informal/variacion',
    parseData: (data: ApiResponseType): ExchangeRate => {
      if ('compra' in data && 'venta' in data && typeof data.compra === 'string' && typeof data.venta === 'string' && 'fecha' in data) {
        return {
          compra: parseFloat(data.compra.replace(',', '.')),
          venta: parseFloat(data.venta.replace(',', '.')),
          fecha: data.fecha,
          valor: (parseFloat(data.compra.replace(',', '.')) + parseFloat(data.venta.replace(',', '.'))) / 2
        };
      }
      throw new Error("Data does not match AmbitoApiResponse structure");
    }
  },
  {
    label: 'BlueLytics',
    url: 'https://api.bluelytics.com.ar/v2/latest',
    parseData: (data: ApiResponseType): ExchangeRate => {
      if ('blue' ! in data) {
        return {
          compra: data.blue.value_buy,
          venta: data.blue.value_sell,
          fecha: dayjs(data.last_update).format('DD/MMM/YYYY'),
          valor: data.blue.value_avg
        };
      }
      throw new Error("Data does not match BlueApiResponse structure");
    }
  },
  {
    label: 'DolarAPI',
    url: 'https://dolarapi.com/v1/dolares/blue',
    parseData: (data: ApiResponseType): ExchangeRate => {
      if ('compra' in data && 'venta' in data && 'fechaActualizacion' in data) {
        return {
          compra: data.compra,
          venta: data.venta,
          fecha: dayjs(data.fechaActualizacion).format('DD/MMM/YYYY'),
          valor: (data.compra + data.venta) / 2
        };
      }
      throw new Error("Data does not match DolarApiResponse structure");
    }
  },
];
// Loader function
const loader: LoaderFunction = async () => {
  try {
    const rawData = await Promise.all(endpoints.map(endpoint =>
      fetch(endpoint.url).then(res => res.json())
    ));
    const exchangeRates = rawData.map((data, index) => endpoints[index].parseData(data));
    return json(exchangeRates);
  } catch (error) {
    console.error(error);
    throw new Response("Error fetching exchange rate data", { status: 500 });
  }
};

export default loader;
