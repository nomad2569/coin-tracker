import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { fetchCoins } from '../api';
import { isDarkAtom } from '../atoms';

interface IMode {
  mode: boolean;
}

const ModeBtnWrapper = styled.div`
  position: absolute;
  top: 13px;
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
  text-shadow: 6px 6px 0px rgba(0, 0, 0, 0.4);
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
  background-color: ${(props) => props.theme.overviewColor};
  a {
    padding: 20px;
    transition: color 0.2s ease-in;
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.accentColor};
  }
  &:hover {
    a {
      cursor: pointer;
      color: ${(props) => props.theme.bgColor};
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
  const currentMode = useRecoilValue(isDarkAtom);
  const modeSetterFn = useSetRecoilState(isDarkAtom);
  return (
    <Container>
      <Helmet>
        <title>UPbit</title>
      </Helmet>
      <Header>
        <Title>UPbit</Title>
        <ModeBtnWrapper>
          <ModeBtn
            mode={currentMode}
            onClick={() => modeSetterFn((prevMode) => !prevMode)}
          >
            <ModeBall mode={currentMode}></ModeBall>
          </ModeBtn>
        </ModeBtnWrapper>
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
