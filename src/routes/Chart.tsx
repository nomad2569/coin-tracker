import { useQuery } from 'react-query';
import { useOutletContext } from 'react-router-dom';
import { fetchCoinohlcv } from '../api';
import ApexChart from 'react-apexcharts';
import styled from 'styled-components';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from '../atoms';
export interface IOhlcv {
  time_open: Date;
  time_close: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface IOutlet {
  coinId: string;
}

const ChartWrapper = styled.div`
  width: 700px;
  height: 500px;
  margin-top: 10px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.textColor};
`;
const Chart = () => {
  const { coinId } = useOutletContext<IOutlet>();
  const { isLoading, data } = useQuery<IOhlcv[]>(['ohlcv', coinId], () =>
    fetchCoinohlcv(coinId)
  );
  const isDark = useRecoilValue(isDarkAtom);
  return (
    <ChartWrapper>
      {isLoading ? (
        'Loading chart...'
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: coinId,
              data: data!.map((price) => price.close),
            },
          ]}
          options={{
            theme: {
              mode: isDark ? 'dark' : 'light',
            },
            chart: {
              width: 300,
              height: 300,
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            grid: {
              show: false,
            },
            xaxis: {
              axisTicks: { show: false },
              axisBorder: { show: false },
              labels: {
                show: false,
              },
              type: 'datetime',
              categories: data?.map((tmp) => tmp.time_close),
            },
            yaxis: {
              show: false,
            },
            stroke: {
              curve: 'smooth',
              width: 3,
            },
            fill: {
              type: 'gradient',
              gradient: { gradientToColors: ['#0be881'], stops: [0, 100] },
            },
            colors: ['#0fbcf9'],
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(4)}`,
              },
            },
          }}
        />
      )}
    </ChartWrapper>
  );
};

export default Chart;
