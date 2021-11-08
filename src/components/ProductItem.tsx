import { memo, useState } from 'react';
// Se estiver em um app ReactJS somente no lado do browser basta usar: import { lazy } from 'react';
import dynamic from 'next/dynamic';
import { AddProductToWishlistProps } from './AddProductToWishlist';
// import { AddProductToWishlist } from './AddProductToWishlist';
import lodash from 'lodash';

/**
 * Esse procedimento ajuda a não inserir tudo no bundle de uma vez só,
 * e sim quando aquela funcionalidade precisar ser exibida, no caso de exemplo, foi um
 * modal que ao clicar iria ser exibido as opções, mas somente com a interação do usuário,
 * essa funcionalidade não precisaria ter sido carregada/inserida no bundle desde o início.
 */
const AddProductToWishlist = dynamic<AddProductToWishlistProps>(() => {
  return import('./AddProductToWishlist').then(mod => mod.AddProductToWishlist);
}, {
  ssr: false,
  loading: () => <span>carregando...</span>,
});

interface ProductItemProps {
  product: {
    id: number;
    title: string;
    price: number;
    priceFormatted: string;
  };
  onAddToWishlist: (id: number) => void;
}

const ProductItemComponent = ({ product, onAddToWishlist }: ProductItemProps) => {
  const [isAddingToWishlist, setIsAddingToWishlist] = useState<boolean>(false);

  /**
   * Exemplo de utilização lazy-loading para funções, para ser importado aquela lib,
   * somente no momento que precisar dela, o que ajuda no bundle.
   */
  // async function showFormattedDate() {
  //   const { format } = await import('date-fns');

  //   format();
  // }

  return (
    <div>
      {product.title} - <strong>{product.priceFormatted}</strong>
      {/* <button
        type="button"
        onClick={() => onAddToWishlist(product.id)}
      >
        Add to Wishlist
      </button> */}

      <button onClick={() => setIsAddingToWishlist(true)}>Adicionar aos favoritos</button>

      {
        isAddingToWishlist && (
          <AddProductToWishlist
            onAddToWishlist={() => onAddToWishlist(product.id)}
            onRequestClose={() => setIsAddingToWishlist(false)}
          />
        )
      }
    </div>
  );
}

export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
  // return Object.is(prevProps.product, nextProps.product);
  return lodash.isEqual(prevProps.product, nextProps.product);
});

/**
 * INSTRUÇÕES | FLUXO DE RENDERIZAÇÃO REACT:
 * 
 * 1º Criar uma nova versão do componente
 * 2º Comparar com a versão anterior
 * 3º Se houverem alterações, vai atualizar o que alterou
 */

/**
 * MEMO:
 * 
 * O memo vai evitar quando a primeira instrução aconteça, caso nenhuma propriedade
 * do componente tenha sido alterada
 * 
 * O memo faz um shallow compare -> comparação rasa, em resumo ele faz a verificação
 * da igualdade das informações que tenhamos dentro das propriedades
 * 
 * Quando temos propriedades que é em forma de objetos e não é um simples texto por exemplo,
 * tem que ser enviado um segundo parâmetro para o memo
 * 
 * USO:
 * 
 * 1º Pure Functional Components
 * 2º Renders too often
 * 3º Re-renders with same props
 * 4º Medium to big size
 */
