import { useMemo } from 'react';
import { List, ListRowRenderer } from 'react-virtualized';
import { ProductItem } from "./ProductItem";

interface SearchResultsProps {
  totalPrice: number;
  results: {
    id: number;
    title: string;
    price: number;
    priceFormatted: string;
  }[];
  onAddToWishlist: (id: number) => void;
}

export const SearchResults = ({ totalPrice, results, onAddToWishlist }: SearchResultsProps) => {
  // const totalPrice = useMemo(() => {
  //   return results.reduce((acc, product) => {
  //     return acc + product.price;
  //   }, 0);
  // }, [results]);

  const rowRenderer: ListRowRenderer = ({ index, key, style }) => {
    return (
      <div key={key} style={style}>
        <ProductItem
          product={results[index]}
          onAddToWishlist={onAddToWishlist}
        />
      </div>
    );
  }

  return (
    <div>
      <h2>{totalPrice}</h2>

      {/* {results.map(product => (
        <ProductItem
          key={product.id}
          product={product}
          onAddToWishlist={onAddToWishlist}
        />
      ))} */}

      <List
        height={300}
        rowHeight={30}
        width={900}
        overscanRowCount={5}
        rowCount={results.length}
        rowRenderer={rowRenderer}
      />
    </div>
  );
}

/**
 * useMemo | usado para memorizar valores não função:
 * o hook useMemo, o grande propósito dele é evitar que alguma coisa oculpe muito
 * processamento como um cálculo ou alguma coisa que tenhamos dentro do componente,
 * seja refeito toda vez que um componente renderizar.
 * 
 * 1º Cálculos pesados
 * 2º Igualdade referencial (quando a gente repassa aquela informação a um componente filho)
 * 
 * useCallback | usado para memorizar função não valores:
 */