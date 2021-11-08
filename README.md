# Ignite - Trilha ReactJS: Chapter V
Este projeto tem um foco em performar uma aplicação que usa ReactJS, utilizando boas práticas, e usando corretamente as ferramentas do arsenal do React, como **memo**, **useMemo**, **useCallback** etc.

## Performando apps com ReactJS

### Renderização no React

A renderização no React ocorre basicamente em 3 momentos:

- Pai para filho: sempre que um componente pai é renderizado novamente, os componentes filhos também são.
- Propriedades: sempre que uma propriedade é alterada, o componente é renderizado novamente.
- Hooks: sempre que um hook é chamado, o componente  sofre uma nova renderização.

### Fluxo de renderização

1. Gerar uma nova versão do componente que precisa ser renderizado.
2. Comparar a nova versão com a versão anterior.
3. Se houverem alterações, o React "renderiza" essa nova versão em tela, ele atualiza o que foi alterado.

## Otimizações

<details>
<summary>memo</summary>

## memo

Impede que uma nova renderização do componente pai, faça com que o filho também seja renderizado novamente.

O **memo** faz um [**shallow compare**](https://reactjs.org/docs/shallow-compare.html) (comparação rasa), em resumo ele faz a verificação da igualdade das informações que tivermos dentro das propriedades.

Quando temos propriedades que é em forma de objeto, e não é por exemplo uma simples **string**, **number**, **boolean**, é necessário ser enviado um segundo parâmetro para o **memo**, e realizar a comparação necessária para o **memo** saber se precisa ou não renderizar aquele componente.

Para exemplificar imagine o seguinte cenário, na tela **Home** tenho um componente chamado **SearchResults**, que recebe uma propriedade chamada **results**, esse **results** seria os dados dos produtos que é obtido após uma pesquisa a API, dentro desse componente **SearchResults** temos outro componente o **ProductItem**, ele recebe como parâmetro o **product** que é os dados do produto em si, os dados de cada produto de forma individual, acontece quando percorremos a propriedade **results** pois ela será um array de produtos, nesse cenário quando ocorrer alguma renderização por parte do componente pai, irá renderizar novamente os filhos, então o **ProductItem** irá ser renderizado novamente, mesmo se as informações forem a mesma, nesse caso podemos usar o **memo**.

Para ficar mais fácil a demonstração da aplicação do **memo**, irei usar como exemplo o cenário abordado acima para aplicar o **memo** no componente **ProductItem**:

```tsx
import React, { memo } from 'react';

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
  return (
    <div>
      {product.title} - <strong>{product.priceFormatted}</strong>
    </div>
  );
}

export const ProductItem = memo(ProductItemComponent, (prevProps, nextProps) => {
  return Object.is(prevProps.product. nextProps.product);
});
```

[Exemplo aplicado na aplicação](src/components/ProductItem.tsx)

### Quando usar:

1. Pure Functional Components.
2. Renders too often.
3. Re-render with same props.
4. Medium to big size.
</details>

<details>
<summary>useMemo</summary>

## useMemo

Usado para memorizar valores e não funções, ele evita que alguma coisa que oculpe muito processamento, seja refeito todas as vezes que o componente renderizar.

Para exemplificar imagine o seguinte cenário, na tela **Home** tenho um componente chamado **Component1**, que recebe uma propriedade chamada **products** esse **products** seria os dados dos produtos que é obtido após uma pesquisa a API, então dentro do **Component1**, precimos mostrar o valor da soma de todos esses produtos, portanto dentro desse componente, iremos fazer uma função para calcular a soma total desses produtos, e mostrar o valor em tela, nesse caso poderiamos usar o **useMemo** para evitar que esse procedimento seja refeito toda vez que ocorrer uma nova renderização nesse componente.

obs: lógico que esse processo é muito simples, não chega a ser muito pesado, mas imagine que fosse uma função bem complexa que demore a executar, então esse exemplo será válido.

Para ficar ainda mais fácil imaginar esse cenário, aqui vai o exemplo em código do que foi falado acima:

> screens/Home.tsx
```tsx
export const Home = () => {
  return (
    <Component1
      products={products}
    />
  );
}
```

> components/Component1.tsx
```tsx
import React, { useMemo } from 'react';

interface Component1Props {
  products: {
    id: number;
    title: string;
    price: number;
  }[];
}

export const Component1 = ({ products }: Component1Props) => {
  const totalPrice = useMemo(() => {
    return products.reduce((acc, product) => acc + product.price, 0);
  }, [products]);

  return (
    <strong>{totalPrice}</strong>
  );
}
```

[Exemplo aplicado na aplicação](src/components/SearchResults.tsx)

### Quando usar:

1. Cálculos pesados.
2. Variáveis que ocupam novos espaços na memória (Igualdade referencial), quando uma informação é repassada de pai pra filho.
</details>

<details>
<summary>useCallback</summary>

## useCallback

Usado para memorizar funções e não valores, ele evita a criação desnecessária de funções.
Quando ocorrer uma renderização no componente pai, a função que estiver sendo passada para o componente filho como propriedade, e esse componente filho repassar para outro componente essa função, o que irá ocorrer é que quando o pai for renderizado, essa função que será passado como propriedade vai ser recriada, o componente filho que repassar essa função, vai perceber que a função mudou, pois está oculpando uma outra posição na memória, devido a comparação de igualdade referencial, nesse caso deve ser usado o **useCallback**.

Para exemplificar imagine o seguinte cenário, na tela **Home** tenho um componente chamado **Component1**, que recebe uma função por propriedade, e essa função está criada na tela **Home** mesmo, e dentro desse **Component1**, temos um outro componente chamado **Component2**, que recebe essa função que passamos para o **Component1**, e por fim, dentro desse **Component2** que recebemos a função repassada, executamos ela, isso é chamado de **Prop Drilling**, nesse caso por exemplo podemos usar o **useCallback**.

Para ficar ainda mais fácil imaginar esse cenário, aqui vai o exemplo em código do que foi falado acima:

> screens/Home.tsx
```tsx
import React, { useCallback } from 'react';

export const Home = () => {
  const handleFunctionTest = useCallback(() => {
    console.log('Prop Drilling');
  }, []);

  return (
    <Component1
      onExecuteFunction={handleFunctionTest}
    />
  );
}
```

> components/Component1.tsx
```tsx
interface Component1Props {
  onExecuteFunction: () => void;
}

export const Component1 = ({ onExecuteFunction }: Component1Props) => {
  return (
    <Component2
      onExecuteFunction={onExecuteFunction}
    />
  );
}
```

> components/Component2.tsx
```tsx
interface Component2Props {
  onExecuteFunction: () => void;
}

export const Component2 = ({ onExecuteFunction }: Component2Props) => {
  return (
    <button
      type="button"
      onClick={onExecuteFunction}
    >
      Execute function
    </button>
  );
}
```

[Exemplo aplicado na aplicação](src/pages/index.tsx)

### Quando usar:

1. Prop Drilling.
</details>

<details>
<summary>Formatação de dados</summary>

## Formatação de dados

Evitar formatação e cálculos dentro dos componentes renderizados, é melhor fazê-los no momento em que buscamos os dados e não no momento em que exibimos.

Realizar esses procedimentos de formatação e cáculos, dentro do **return** do componente, é o pior momento para fazer esse procedimento, pois todas as vezes que esse componente for renderizado, todo esse processo irá ser refeito.

Exemplo de implementação da forma **errada**:
```tsx
interface Component1Props {
  product: {
    id: number;
    title: string;
    price: number;
    createdAt: Date;
  };
}

export const Component1 = ({ product }: Component1Props) => {
  return (
    <div>
      <p>{product.title}<p>

      <strong>
        {
          new Intl.NumberFormat('pt-BR', {
            currency: 'BRL',
            style: 'currency',
            minimumFractionDigits: 2,
          }).format(product.price)
        }
      </strong>

      <p>
        {
          new Date(product.createdAt).toLocaleDateString('pt-BR', {
            day: 'numeric',
            weekday: 'long',
            month: 'long',
            year: 'numeric',
          });
        }
      </p>
    </div>
  );
}
```

Exemplo de implementação da forma **correta**:

> Componente pai
```tsx
import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  title: string;
  price: number;
  priceFormatted: string;
  createdAt: Date;
  createdAtFormatted: string;
}

export const Home = () => {
  const [product, setProduct] = useState({} as Product);

  useEffect(() => {
    async function getProduct() {
      const response = await fetch('https://fakeapi/product/1');
      const responseData = await response.json();

      const numberFormatter = new Intl.NumberFormat('pt-BR', {
        currency: 'BRL',
        style: 'currency',
        minimumFractionDigits: 2,
      });

      const productFormatted = {
        id: responseData.id,
        title: responseData.title,
        price: responseData.price,
        priceFormatted: numberFormatter.format(responseData.price),
        createdAt: responseData.createdAt,
        createdAtFormatted: new Date(responseData.createdAt)
          .toLocaleDateString('pt-BR', {
            day: 'numeric',
            weekday: 'long',
            month: 'long',
            year: 'numeric',
          }),
      } as Product;

      setProduct(productFormatted);
    }

    getProduct();
  }, []);

  return (
    <Component1 product={product}>
  );
}
```

> Componente filho
```tsx
interface Component1Props {
  product: {
    id: number;
    title: string;
    price: number;
    priceFormatted: string;
    createdAt: Date;
    createdAtFormatted: string;
  };
}

export const Component1 = ({ product }: Component1Props) => {
  return (
    <div>
      <p>{product.title}<p>
      <strong>{product.priceFormatted}</strong>
      <p>{product.createdAtFormatted}</p>
    </div>
  );
}
```

[Exemplo aplicado na aplicação](src/pages/index.tsx)
</details>

<details>
<summary>Dynamic import (Code splitting)</summary>

## Dynamic import (Code splitting)

Importar algum conteúdo somente no momento em que formos utilizar, as vezes é uma alternativa viável para diminuir o bundle.

Para exemplificar imagine o seguinte cenário, na tela **Home** tenho um botão, que ao usuário clicar nele abre um modal, mas esse modal não precisa estar disponível/carregado desde o início da aplicação, e sim faz sentido ele ficar disponível quando o usuário clicar no botão, pois ai sim irá ser exibido o modal.

Nesses casos, podemos falar para aplicação "inserir" esse conteúdo no bundle após a interação do usuário, para ficar mais fácil segue um exemplo abaixo:

> components/Modal.tsx
```tsx
export interface ModalProps {
  title: string;
}

export const Modal = ({ title }: ModalProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>Modal example</p>
    </div>
  );
}
```

> screens/Home.tsx
```tsx
// To ReactJS
import React, { useState, lazy } from 'react';
import { ModalProps } from '../components/Modal';
// To Next.JS
import { useState } from 'react';
import { dynamic } from 'next/dynamic';
import { ModalProps } from '../components/Modal';

export const Home = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const Modal = dynamic<ModalProps>(() => {
    return import('../components/Modal').then(mod => mod.Modal);
  }, {
    ssr: false,
    loading: () => <span>carregando...</span>,
  });

  return (
    <div>
      {
        modalIsOpen &&
        <Modal title="Modal title" />
      }

      <button
        type="button"
        onClick={() => setModalIsOpen(true)}
      >
        Open modal
      </button>
    </div>
  );
}
```

[Exemplo aplicado na aplicação](src/components/ProductItem.tsx)
</details>

<details>
<summary>Virtualização</summary>

## Virtualização

Permite mostrar em tela somente os itens visíveis no navegador.

- [React virtualized](https://github.com/bvaughn/react-virtualized)

[Exemplo aplicado na aplicação](src/components/SearchResults.tsx)
</details>

<details>
<summary>Bundle analyzer</summary>

## Bundle analyzer

Analisar o bundle para descobrir o que está deixando a aplicação pesada.

Por exemplo, com o bundle analyzer é possível ver qual lib está oculpando maior espaço na aplicação, e com base nisso podemos tratar, seja removendo essa lib, alterando a mesma, ou implementando a funcionalidade de forma nativa.

- [Next Bundle Analyzer](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer)
</details>
