import { useEffect } from 'react';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useMatch } from 'react-router-dom';
import { Outlet, Route, useLocation, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoinInfo, fetchCoinTickers } from '../api';
import { InfoInterface, PriceInterface } from '../Interface';
import Chart from './Chart';
import Price from './Price';
import { FaHome, FaCoins, FaChartLine } from 'react-icons/fa';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isDarkAtom } from '../atoms';

const Container = styled.div`
  padding: 0px 20px;
  margin: 0 auto;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
interface IMode {
  mode: boolean;
}
const ModeBtnWrapper = styled.div`
  position: absolute;
  top: -62px;
  left: 30px;
`;

const ModeBtn = styled.button<IMode>`
  width: 100px;
  height: 30px;
  cursor: pointer;
  position: relative;
  background-color: ${(props) => props.theme.accentColor};
  transition: background-color 300ms ease-in-out;
  border-radius: 20px;
`;

const ModeBall = styled.div<IMode>`
  position: absolute;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.bgColor};
  border: 1px solid white;
  top: 0px;
  right: ${(props) => (props.mode ? '5px' : '65px')};
  transition: background-color 300ms ease-in-out, right 400ms ease-in-out;
`;
const Header = styled.header`
  height: 15vh;
  display: flex;
  align-items: center;
`;
const HomeBtn = styled.span`
  font-size: 48px;
  cursor: pointer;
  color: white;

  position: absolute;
  left: -63px;
  top: 0px;
  &:hover {
    color: ${(props) => props.theme.accentColor};
  }
  transition: color 300ms ease-in-out;
`;

const Title = styled.h1`
  font-size: 48px;
  font-weight: 700;
  font-style: italic;
  color: ${(props) => props.theme.accentColor};
  position: relative;
  text-shadow: 6px 6px 0px rgba(0, 0, 0, 0.2);
`;
const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  position: absolute;
  right: -150px;
  top: -7px;
`;

const Tab = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  padding: 10px;
  padding-bottom: 3px;
  color: white;
  text-align: center;
  font-size: 46px;
  box-shadow: ${(props) =>
    props.isActive
      ? `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;`
      : 'none'};
  a {
    color: ${(props) => (props.isActive ? props.theme.accentColor : 'white')};
    &:hover {
      color: ${(props) => props.theme.accentColor};
    }
    transition: color 300ms ease-in-out, box-shadow 400ms ease-in-out;
  }
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
  const loading = infoLoading || tickersLoading;
  const lastUpdatedDate = tickersData?.last_updated.split('T')[0];
  const lastUpdatedTime = tickersData?.last_updated.split('T')[1];
  const navigator = useNavigate();
  const currentMode = useRecoilValue(isDarkAtom);
  const modeSetterFn = useSetRecoilState(isDarkAtom);
  function handleHomeClick() {
    navigator('/');
  }
  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? 'Loading....' : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <Title>
          <HomeBtn onClick={handleHomeClick}>
            <FaHome />
          </HomeBtn>
          <ModeBtnWrapper>
            <ModeBtn
              mode={currentMode}
              onClick={() => modeSetterFn((prevMode) => !prevMode)}
            >
              <ModeBall mode={currentMode}></ModeBall>
            </ModeBtn>
          </ModeBtnWrapper>
          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={`/${coinId}/chart`}>
                <FaChartLine />
              </Link>
            </Tab>
            <Tab isActive={priceMatch !== null}>
              <Link to={`/${coinId}/price`}>
                <FaCoins />
              </Link>
            </Tab>
          </Tabs>
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

          <Outlet context={{ coinId }} />
        </>
      )}
    </Container>
  );
};
export default Coin;
