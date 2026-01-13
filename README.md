# Módulo Chat

Módulo para gerenciamento de chats do sistema Gestor.

## Instalação

### Como pacote npm de repositório git

```bash
npm install git+https://github.com/pereirajair/core-module-chat.git --save
```

## Estrutura

```
chat/
├── models/          # Models do Sequelize
├── migrations/      # Migrations do banco de dados
├── seeders/         # Seeders de dados
├── routes/          # Rotas da API
├── controllers/     # Controllers da API
├── package.json     # Configuração do pacote npm
├── module.json      # Configuração do módulo (opcional)
└── README.md        # Este arquivo
```

## Funcionalidades

- Canais de chat
- Contatos
- Conversas
- Mensagens

## Uso

Após instalar o módulo, ele será automaticamente detectado pelo sistema Gestor e poderá ser instalado através da interface administrativa em `/admin/models`.

## Desenvolvimento

Para desenvolver este módulo:

1. Clone o repositório
2. Faça suas alterações
3. Commit e push para o repositório
4. No projeto principal, execute `npm update @gestor/chat` para atualizar
