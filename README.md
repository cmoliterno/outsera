# Golden Raspberry Awards

Este projeto é uma aplicação web desenvolvida em Angular para exibir informações sobre indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards.

## Requisitos

- Node.js (versão 14 ou superior)
- npm (normalmente instalado com o Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Navegue até o diretório do projeto:
```bash
cd outsera-fe
```

3. Instale as dependências:
```bash
npm install
```

## Executando o projeto

### Modo de desenvolvimento

```bash
ng serve
```

O servidor de desenvolvimento será iniciado e a aplicação estará disponível em `http://localhost:4200/`.

### Build para produção

```bash
ng build --prod
```

Os arquivos de build serão armazenados no diretório `dist/`.

### Executando com Docker

O projeto possui uma configuração Docker para facilitar o deploy. Para construir e executar a aplicação usando Docker:

1. Construa a imagem:
```bash
docker build -t golden-raspberry-awards .
```

2. Execute o container:
```bash
docker run -p 8080:80 golden-raspberry-awards
```

A aplicação estará disponível em `http://localhost:8080/`.

## Testes unitários

```bash
ng test
```

Os testes serão executados via [Karma](https://karma-runner.github.io).

## Estrutura do projeto

- `src/app/components/`: Componentes compartilhados
- `src/app/models/`: Modelos de dados
- `src/app/services/`: Serviços para comunicação com a API
- `src/app/views/`: Componentes das páginas principais (Dashboard e Lista de Filmes)

## Funcionalidades

### Dashboard

- Mostra anos que tiveram mais de um vencedor
- Exibe os três estúdios com mais vitórias
- Mostra produtores com maior e menor intervalo entre vitórias
- Permite buscar vencedores por ano específico

### Lista de Filmes

- Exibe todos os filmes com paginação
- Permite filtrar por ano
- Permite filtrar por vencedor/não vencedor

## API

A aplicação consome dados da API disponível em `https://challenge.outsera.tech/api/movies`.

## Responsividade

A aplicação é responsiva para resoluções a partir de 768x1280, conforme especificado nos requisitos. 