## Sugestões de Melhorias

Aqui estão algumas sugestões para melhorar a aplicação, divididas por categoria. Escolha as que desejar implementar.

### Experiência do Usuário (UI/UX)

- [ ] **Melhoria 1: Sistema de Notificações (Toast):** Implementar notificações não-invasivas (toasts) para ações como "Link Copiado", "Usuário Entrou/Saiu" e para exibir mensagens de erro da API.
- [ ] **Melhoria 2: Persistência de Sessão:** Salvar os dados da sala e do usuário no `localStorage` para que, ao recarregar a página, o usuário seja reconectado automaticamente à sala.
- [ ] **Melhoria 3: Animações e Transições:** Utilizar a biblioteca `framer-motion` (já instalada) para adicionar animações sutis na entrada de componentes e modais, tornando a interface mais fluida.
- [ ] **Melhoria 4: Favicon Customizado:** Adicionar um favicon ao projeto para uma identidade visual mais profissional.

### Qualidade de Código e Arquitetura

- [ ] **Melhoria 5: Implementação do Evento `room:created` no Servidor:** Finalizar a funcionalidade de criação de sala, implementando a lógica no backend para emitir o evento `room:created` que o frontend já espera.
- [ ] **Melhoria 6: Tratamento de Erros no Backend:** Robustecer o backend para tratar e emitir eventos de erro claros para o cliente (ex: `room:error`) em casos como "Sala não encontrada" ou "Nome de usuário já em uso".
- [ ] **Melhoria 7: Compartilhamento de Tipos (Client/Server):** Criar um diretório compartilhado para tipos TypeScript, evitando duplicação e garantindo consistência entre o frontend e o backend.

### Novas Funcionalidades

- [ ] **Melhoria 8: Modo Espectador:** Adicionar a funcionalidade para que um usuário possa entrar na sala como "espectador", podendo ver o andamento do jogo sem votar.
