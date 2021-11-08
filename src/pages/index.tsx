import { FormEvent, useCallback, useState } from "react";
import { SearchResults } from "../components/SearchResults";

interface Product {
  id: number;
  title: string;
  price: number;
  priceFormatted: string;
}

interface Results {
  totalPrice: number;
  data: Product[];
}

export const Home = () => {
  const [search, setSearch] = useState<string>('');
  const [results, setResults] = useState<Results>({
    totalPrice: 0,
    data: [],
  });

  async function handleSearch(event: FormEvent) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    const response = await fetch(`http://localhost:3333/products?q=${search}`);
    const data = await response.json();

    const formatter = new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      style: 'currency',
      minimumFractionDigits: 2,
    });

    const products = data.map((product: Product) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      priceFormatted: formatter.format(product.price),
    } as Product));

    const totalPrice = data.reduce((acc, product) => {
      return acc + product.price;
    }, 0);

    setResults({ totalPrice, data: products });
  }

  /**
   * Quando o componente Home renderizar, como a função addToWishlist será recriada
   * e irá oculpar um novo espaço na memória, o componente filho que repassar essa função,
   * vai perceber que a função mudou, pois está oculpando uma outra posição na memória, devido
   * a comparação de igualdade referencial, nesse caso deve ser usado o useCallback
   */
  const addToWishlist = useCallback(async (id: number) => {
    console.log(id);
  }, []);

  return (
    <div>
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit">Buscar</button>
      </form>

      <SearchResults
        results={results.data}
        totalPrice={results.totalPrice}
        onAddToWishlist={addToWishlist}
      />
    </div>
  );
}

export default Home;
