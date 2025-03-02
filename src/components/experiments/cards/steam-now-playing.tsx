import { Gamepad2 } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data: {
    id: string;
    name: string;
    url: string;
    startedAt: number;
  };
};

export const SteamNowPlaying = ({ data }: Props) => {
  return (
    <ExperimentCard title="Gaming">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Gamepad2} value={data.name} href={data.url} />
          </TooltipTrigger>
          <TooltipContent>
            <p>Currently playing on Steam</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ExperimentCard>
  );
};
