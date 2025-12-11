# Nice Poker

Uma aplicação de Nice Poker em tempo real construída com React, Node.js e Socket.io. Este projeto permite que equipes estimem tarefas de forma colaborativa.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (v16 ou superior)
- [npm](https://www.npmjs.com/) (geralmente vem com o Node.js)

## Instalação

1. Clone o repositório (se ainda não o fez):

   ```bash
   git clone <repository-url>
   cd nice-poker
   ```

2. Instale as dependências para o cliente e o servidor:
   ```bash
   npm run install:all
   ```

## Configuração

1. Crie um arquivo `.env` no diretório raiz se ele não existir, usando `.env.example` como modelo:

   ```bash
   cp .env.example .env
   ```

2. Configure o arquivo `.env`:
   - `PORT`: Porta para o servidor (padrão: 3000)
   - `NODE_ENV`: Ambiente (development/production)
   - `HOST`: Host do servidor (padrão: 0.0.0.0 para acesso via rede)
   - `ALLOWED_ORIGINS`: Origens CORS (padrão: \*)

## Rodando Localmente

Para iniciar tanto o cliente quanto o servidor em modo de desenvolvimento:

```bash
npm run dev
```

Isso iniciará:

- **Servidor** em `http://localhost:3000`
- **Cliente** em `http://localhost:5173` (ou na próxima porta disponível)

### Acessando via IP Local (Acesso pela Rede)

A aplicação está configurada para ser acessível na sua rede local (ex: do seu celular ou outro computador).

1. Encontre o endereço IP local do seu computador:

   - **Linux/Mac**: Execute `ifconfig` ou `ip addr` (procure por `inet` em `eth0` ou `wlan0`, ex: `192.168.1.15`).
   - **Windows**: Execute `ipconfig`.

2. Inicie a aplicação:

   ```bash
   npm run dev
   ```

3. No seu outro dispositivo, abra o navegador e acesse:
   `http://<SEU_ENDERECO_IP>:5173`

   **Nota:** Certifique-se de que seu firewall permite conexões de entrada nas portas 3000 e 5173.

## Estrutura do Projeto

- **`client/`**: Frontend React (Vite + TypeScript + TailwindCSS).
- **`server/`**: Backend Node.js/Express (TypeScript + Socket.io).
- **`scripts/`**: Scripts utilitários para gerenciar o monorepo.

## Build para Produção

Para fazer o build tanto do cliente quanto do servidor:

```bash
npm run build
```

Isso executará verificações de tipo e gerará builds de produção em `client/dist` e `server/dist`.
