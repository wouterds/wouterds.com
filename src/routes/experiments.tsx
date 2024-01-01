import { LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData, useRevalidator } from '@remix-run/react';
import { useInterval } from 'react-use';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const env = (context as Context).env;

  const records = await env.WOUTERDSBE.get('aranet').then((value) => {
    return JSON.parse(value || '') as AranetRecord[];
  });

  return { records };
};

export const meta: MetaFunction = () => {
  return [
    { title: 'Experiments' },
    {
      name: 'description',
      content: 'Just a page with random experiments.',
    },
  ];
};

export default function Experiments() {
  const { records } = useLoaderData<typeof loader>();
  const { revalidate } = useRevalidator();

  useInterval(revalidate, 1000 * 30);

  return (
    <>
      <h1 className="text-xl font-medium mb-2">Experiments</h1>
      <p className="mb-6">
        This page is just a playground for random experiments. Not much to see
        here!
      </p>
      <h2 className="text-lg font-medium mb-2">Aranet readings</h2>
      <p className="mb-4">
        Once a minute a Raspberry Pi pushes{' '}
        <a className="underline" href="https://aranet.com/products/aranet4">
          Aranet4
        </a>{' '}
        readings to{' '}
        <a className="underline" href="https://developers.cloudflare.com/kv/">
          Cloudflare Workers KV
        </a>{' '}
        which you can view here.
      </p>
      <ul className="gap-2 grid grid-cols-2 sm:grid-cols-4 text-center">
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">
            {records[records.length - 1].co2}
          </div>
          <div className="relative aspect-[3/1]">
            <ResponsiveContainer>
              <LineChart data={records}>
                <Line
                  type="monotone"
                  dataKey="co2"
                  stroke="#000"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            co2
          </div>
        </li>
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">
            {records[records.length - 1].temperature}
          </div>
          <div className="relative aspect-[3/1]">
            <ResponsiveContainer>
              <LineChart data={records}>
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#000"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            temperature
          </div>
        </li>
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">
            {records[records.length - 1].humidity}
          </div>
          <div className="relative aspect-[3/1]">
            <ResponsiveContainer>
              <LineChart data={records}>
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke="#000"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            humidity
          </div>
        </li>
        <li className="border border-black dark:border-white">
          <div className="text-sm font-semibold py-2">
            {records[records.length - 1].pressure}
          </div>
          <div className="relative aspect-[3/1]">
            <ResponsiveContainer>
              <LineChart data={records}>
                <Line
                  type="monotone"
                  dataKey="pressure"
                  stroke="#000"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div
            className="font-medium bg-black dark:bg-white text-white dark:text-black py-0.5"
            style={{ margin: 1 }}>
            pressure
          </div>
        </li>
      </ul>
    </>
  );
}
