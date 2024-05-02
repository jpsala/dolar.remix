import { ExchangeRate } from '~/types/dolar.types'
import dolarLoader from '../loaders/dolar.loader'
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react'
export const loader = dolarLoader;
import "../tailwind.css";

export default function Dolars() {
  const data: ExchangeRate[] = useLoaderData()
  const [type, setType] = useState<'USD' | 'ARS'>('USD')
  const [amountUSD, setAmountUSD] = useState<string>('')
  const [amountARS, setAmountARS] = useState<string>('')

  const formatCurrency = (val: number) => {
    return isNaN(val) ? 'Invalid Number' : new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val)
  }

  const calculateTotal = (_valor: number) => {
    const valor = Number(_valor)
    const amount = Number(type === 'USD' ? amountUSD : amountARS)
    const total = type === 'USD' ? (amount * valor) : (amount / valor)
    console.log(_valor, amount, amount, total)
    return total
  }

  useEffect(() => {
    console.log('Type:', type, 'USD:', amountUSD, 'ARS:', amountARS)
  }, [amountUSD, amountARS, type])

  return (
    <>
      <div className="mt-10 border-gray-300 border p-8 rounded-md flex flex-col gap-2 mx-auto" style={{ width: '480px' }}>
        <h1 className='font-bold text-2xl'>Dolares JP</h1>
        <hr className='mt-2 mb-2' />
        <div>
          <label htmlFor="USD">Dólares:</label>
          <input autoFocus={true} autoComplete='off' id="USD" type="text" className='ml-3 border border-gray-300 rounded-md p-1'
            value={amountUSD}
            onChange={e => {
              setType('USD')
              setAmountUSD(e.target.value)
              setAmountARS('')
            }} />
        </div>
        <div>
          <label htmlFor="ARS">Pesos:</label>
          <input autoComplete='off' id="ARS" type="text" className='ml-3 border border-gray-300 rounded-md p-1'
            value={amountARS}
            onChange={e => {
              setType('ARS')
              setAmountARS(e.target.value)
              setAmountUSD('')
            }} />
        </div>
        <hr className='mt-2 mb-2' />

        {data.map((rate, index) => (
          <div key={index}>
            <span className='text-md font-bold mb-3'>
              Exchange Rate as of {rate.fecha}
            </span>
            <div className='flex flex-col'>
              <div className='flex w-full'>
                <span className='text-sm font-bold w-[120px] text-right'>Compra</span>
                <span className='text-sm font-bold w-[120px] text-right'>Venta</span>
                <span className='text-sm font-bold w-[120px] text-right'>Promedio</span>
                <span className='text-sm font-bold w-[120px] text-right'>Total</span>
              </div>
              <div className='flex w-full'>
                <span className='text-sm w-[120px] text-right'>{formatCurrency(rate.compra)}</span>
                <span className='text-sm w-[120px] text-right'>{formatCurrency(rate.venta)}</span>
                <span className='text-sm w-[120px] text-right'>{formatCurrency(rate.valor)}</span>
                <span className='text-sm w-[120px] text-right'>{formatCurrency(calculateTotal(rate.valor))}</span>
              </div>
            </div>
            <hr className='mt-2 mb-2' />
          </div>
        ))}
      </div>
    </>
  )
}
