import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

const Coin = styled.li`
  font-size: 1rem;
  background-color: white;
  color: ${(props) => props.theme.bgColor};
  margin: 15px 20px;
  border-radius: 20px;

  a {
    padding: 20px;
    transition: color 0.2s ease-in;
    display: block;
  }
  &:hover {
    a {
      cursor: pointer;
      color: ${(props) => props.theme.accentColor};
    }
  }
`;

const coins = [
  {
    id: 'btc-bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    rank: 1,
    is_new: false,
    is_active: true,
    type: 'coin',
  },
  {
    id: 'eth-ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    rank: 2,
    is_new: false,
    is_active: true,
    type: 'coin',
  },
  {
    id: 'hex-hex',
    name: 'HEX',
    symbol: 'HEX',
    rank: 3,
    is_new: false,
    is_active: true,
    type: 'token',
  },
];

const Coins = () => {
  return (
    <Container>
      <Header>
        <Title>UPbit</Title>
      </Header>
      <CoinsList>
        {coins.map((coin) => (
          <Coin key={coin.id}>
            <Link to={`/${coin.id}`}>{coin.name} &rarr;</Link>
          </Coin>
        ))}
      </CoinsList>
    </Container>
  );
};

export default Coins;
