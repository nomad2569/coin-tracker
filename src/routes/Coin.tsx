import { useEffect } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import { Outlet, Route, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoinInfo, fetchCoinTickers } from '../api';
import { InfoInterface, PriceInterface } from '../Interface';
import Chart from './Chart';
import Price from './Price';

const Container = styled.div`
  padding: 0px 20px;
  margin: 0 auto;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.header`
  height: 15vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  max-width: 480px;
  max-height: 500px;
  padding: 10px;
  background-color: ${(props) => props.theme.overviewColor};
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const OverviewItem = styled.div`
  max-height: 100%;
  margin-right: 5px;
  padding: 10px;
  padding-top: 0px;
  text-align: center;
  font-weight: 300;
  border-radius: 10px;
  display: flex;
  flex-flow: column wrap;
  word-break: keep-all;
  border: none;
  border-radius: 0%;
  padding: 10px;
  height: 100%;
  justify-content: center;
  img {
    width: 128px;
    max-height: 100%;
    margin-bottom: 10px;
  }
  h1 {
    color: red;
  }
  span {
    color: ${(props) => props.theme.textColor};
    margin-top: 5px;
  }
`;
const Tabs = styled.div`
  max-width: 480px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-top: 20px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  width: 120px;
  cursor: pointer;
  padding: 5px;
  margin: 10px;
  color: white;
  text-align: center;
  background-color: ${(props) => props.theme.overviewColor};
  a {
    color: ${(props) => (props.isActive ? props.theme.bgColor : 'white')};
    &:hover {
      color: ${(props) => props.theme.bgColor};
    }
    transition: color 300ms ease-in-out;
  }
`;
interface RouteState {
  state: {
    name: string;
  };
}

type IParams = {
  coinId: string;
};

const Coin = () => {
  const { coinId } = useParams() as IParams;
  const { state } = useLocation() as RouteState;
  const priceMatch = useMatch('/:coinId/price');
  const chartMatch = useMatch('/:coinId/chart');

  const { isLoading: infoLoading, data: infoData } = useQuery<InfoInterface>(
    ['info', coinId],
    () => fetchCoinInfo(coinId)
  );
  const { isLoading: tickersLoading, data: tickersData } =
    useQuery<PriceInterface>(
      ['price', coinId],
      () => fetchCoinTickers(coinId),
      {
        refetchInterval: 1000,
      }
    );
  console.log(tickersData);
  const loading = infoLoading || tickersLoading;
  const lastUpdatedDate = tickersData?.last_updated.split('T')[0];
  const lastUpdatedTime = tickersData?.last_updated.split('T')[1];
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? 'Loading....' : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          {state?.name ? state.name : loading ? 'Loading....' : infoData?.name}
        </Title>
      </Header>
      {loading ? (
        <Loader>로딩중...</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <img
                src={`https://cryptocurrencyliveprices.com/img/${coinId}.png`}
              />
              <span># {infoData?.rank}</span>
            </OverviewItem>
          </Overview>
          <Overview>
            <OverviewItem>
              <h1>Price</h1>
              <span>$ {tickersData?.quotes.USD.ath_price}</span>
            </OverviewItem>
            <OverviewItem>
              <h1>Updated by</h1>
              <span>{lastUpdatedDate}</span>
              <span>{lastUpdatedTime}</span>
            </OverviewItem>
          </Overview>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>Chart</Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>Price</Link>
            </Tab>
          </Tabs>
          <Outlet context={{ coinId }} />
        </>
      )}
    </Container>
  );
};
export default Coin;
