import { useParams } from 'react-router-dom';

interface RouterParams {
  coinId: string;
}

const Coin = () => {
  const { coinId } = useParams();
  return <h1>{coinId}</h1>;
};
export default Coin;
