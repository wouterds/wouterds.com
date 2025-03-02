import { useEffect, useState } from 'react';

import { Aranet4 } from './cards/aranet4';
import { NUC } from './cards/nuc';
import { Power } from './cards/power';
import { SpotifyNowPlaying } from './cards/spotify-now-playing';
import { SteamNowPlaying } from './cards/steam-now-playing';
import { Tesla } from './cards/tesla';
import { Aranet4Charts } from './charts/aranet4-charts';
import { NUCCharts } from './charts/nuc-charts';
import { PowerCharts } from './charts/power-charts';
import { TeslaCharts } from './charts/tesla-charts';

type Data = {
  aranet: {
    temperature: number;
    humidity: number;
    co2: number;
    pressure: number;
    battery: number;
  };
  tesla: {
    battery: number;
    distance: number;
    temperatureInside: number;
    temperatureOutside: number;
  };
  p1: {
    active: number;
    peak: number;
  };
  nuc: {
    cpuTemp: number;
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
  };
  spotify: {
    url: string;
    explicit: boolean;
    name: string;
    artist: Array<{
      id: string;
      name: string;
      url: string;
    }>;
    playedAt: number;
  };
  steam: {
    id: string;
    name: string;
    url: string;
    startedAt: number;
  };
};

type ChartType = 'aranet4' | 'tesla' | 'power' | 'nuc' | null;

export const Experiments = () => {
  const [data, setData] = useState<Data | null>(null);
  const [visibleChart, setVisibleChart] = useState<ChartType>(null);

  const toggleChart = (chart: ChartType) => {
    setVisibleChart((current) => (current === chart ? null : chart));
  };

  const fetchData = async () => {
    const response = await fetch('/api/experiments');
    if (!response.ok) {
      return;
    }

    setData(await response.json());
  };

  useEffect(() => {
    fetchData();
    const timeout = setInterval(fetchData, 5000);
    return () => clearInterval(timeout);
  }, []);

  return (
    <div className="mt-12 text-zinc-800 dark:text-zinc-200">
      {visibleChart === 'aranet4' && <Aranet4Charts />}
      {visibleChart === 'tesla' && <TeslaCharts />}
      {visibleChart === 'power' && <PowerCharts />}
      {visibleChart === 'nuc' && <NUCCharts />}
      <div className="flex flex-nowrap whitespace-nowrap text-nowrap bg-zinc-100 dark:bg-zinc-900 min-w-full px-3 sm:px-5 py-2 text-sm overflow-x-auto border-t border-zinc-200 dark:border-zinc-800">
        <div onClick={() => toggleChart('aranet4')} className="cursor-pointer group">
          <Aranet4 data={data?.aranet} />
        </div>
        <div onClick={() => toggleChart('tesla')} className="cursor-pointer group">
          <Tesla data={data?.tesla} />
        </div>
        <div onClick={() => toggleChart('power')} className="cursor-pointer group">
          <Power data={data?.p1} />
        </div>
        <div onClick={() => toggleChart('nuc')} className="cursor-pointer group">
          <NUC data={data?.nuc} />
        </div>
        {data?.spotify && <SpotifyNowPlaying data={data.spotify} />}
        {data?.steam && <SteamNowPlaying data={data.steam} />}
      </div>
    </div>
  );
};
