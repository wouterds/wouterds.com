import { Battery, BatteryFull, BatteryLow, BatteryMedium, Car, Thermometer } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';

import { ExperimentCard } from './experiment-card';
import { MetricItem } from './metric-item';

type Props = {
  data?: {
    battery: number;
    distance: number;
    temperatureInside: number;
    temperatureOutside: number;
  };
};

const getBatteryIcon = (percentage?: number) => {
  if (percentage == null) return Battery;
  if (percentage < 15) return Battery;
  if (percentage < 30) return BatteryLow;
  if (percentage < 70) return BatteryMedium;
  return BatteryFull;
};

export const Tesla = ({ data }: Props) => {
  return (
    <ExperimentCard title="Car">
      <TooltipProvider>
        {/* <Tooltip>
          <TooltipTrigger>
            <MetricItem
              icon={Car}
              value={data?.distance ? Math.ceil(data.distance) : undefined}
              unit="km"
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>Mileage</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={Thermometer} value={data?.temperatureInside} unit="°C" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Cabin temperature</p>
          </TooltipContent>
        </Tooltip> */}

        <Tooltip>
          <TooltipTrigger>
            <MetricItem icon={getBatteryIcon(data?.battery)} value={data?.battery} unit="%" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Battery level</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </ExperimentCard>
  );
};
