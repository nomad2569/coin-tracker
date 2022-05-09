import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link, Route, Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoins } from '../api';
import Coin from './Coin';
const Container = styled.div`
  padding: 0px 20px;
  margin: 0 auto;
  max-width: 480px;
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

const CoinsList = styled.ul``;

const CoinWrapper = styled.div``;

const CoinElement = styled.li`
  font-size: 1rem;
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  margin: 15px 20px;
  border-radius: 20px;

  a {
    padding: 20px;
    transition: color 0.2s ease-in;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.bgColor};
  }
  &:hover {
    a {
      cursor: pointer;
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const Img = styled.img`
  width: 10%;
  height: 10%;
  margin-right: 10px;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
}
const Coins = () => {
  const { isLoading, data } = useQuery<ICoin[]>('getAllCoins', fetchCoins);
  return (
    <Container>
      <Helmet>
        <title>UPbit</title>
      </Helmet>
      <Header>
        <Title>UPbit</Title>
      </Header>
      {isLoading ? (
        <Loader>Loading....</Loader>
      ) : (
        <CoinsList>
          {data?.slice(0, 100).map((coin) => (
            <CoinElement key={coin.id}>
              <CoinWrapper>
                <Link to={`/${coin.id}`} state={{ name: coin.name }}>
                  <Img
                    src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
                  />
                  {coin.name} &rarr;
                </Link>
              </CoinWrapper>
            </CoinElement>
          ))}
        </CoinsList>
      )}
    </Container>
  );
};

export default Coins;
