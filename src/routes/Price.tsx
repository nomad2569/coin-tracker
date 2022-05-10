import { useQuery } from 'react-query';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoinTickers } from '../api';
import { PriceInterface } from '../Interface';

const PriceContainer = styled.div`
  min-width: 480px;
  margin-top: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: ${(props) => props.theme.accentColor};
`;
const PriceView = styled.div`
  display: flex;
  flex-direction: column;
`;
const PriceTitle = styled.span``;
const PriceItem = styled.span``;

const Price = () => {
  const { state } = useLocation() as { state: { coinId: string } };
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<PriceInterface>(
      ['price', state.coinId],
      () => fetchCoinTickers(state.coinId),
      {
        refetchInterval: 1000,
      }
    );
  return <PriceContainer>It will show price data</PriceContainer>;
};

export default Price;
