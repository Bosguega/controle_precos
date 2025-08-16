# Controle de Preços

Sistema de controle de preços de produtos com interface moderna e banco de dados SQLite via Prisma.

## 🚀 Funcionalidades

- **Cadastro de Produtos**: Adicione produtos com nome, marca, quantidade, valor unitário e mercado
- **Pesquisa e Visualização**: Encontre e visualize todos os produtos cadastrados
- **Cálculo Automático**: Valor total calculado automaticamente (quantidade × valor unitário)
- **Persistência de Dados**: Banco de dados SQLite com Prisma ORM
- **Interface Responsiva**: Design moderno e responsivo com Tailwind CSS
- **🆕 Uso Offline**: Funciona 100% sem internet com sincronização automática
- **🆕 PWA**: Instale como app nativo no celular
- **🆕 Sincronização**: Dados sincronizados entre dispositivos via GitHub

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Banco de Dados**: SQLite com Prisma ORM
- **Estilização**: Tailwind CSS
- **Ícones**: React Icons

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/controle_precos.git
cd controle_precos
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npx prisma generate
npx prisma db push
```

4. Execute o projeto:
```bash
npm run dev
```

5. Acesse: http://localhost:3000

## 🗄️ Banco de Dados

O projeto usa **SQLite** com **Prisma ORM** para persistência de dados:

### Schema do Produto
```prisma
model Produto {
  id            String   @id @default(uuid())
  nome          String
  marca         String
  quantidade    Int
  unidade       String
  valorUnitario Float
  valorTotal    Float   @default(0)
  dataCompra    DateTime
  mercado       String

  @@map("produtos")
  @@index([nome])
  @@index([marca])
  @@index([dataCompra])
}
```

### Comandos do Prisma
```bash
# Gerar cliente Prisma
npx prisma generate

# Aplicar mudanças no banco
npx prisma db push

# Visualizar banco (opcional)
npx prisma studio
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── produtos/      # Endpoints CRUD
│   ├── cadastro/          # Página de cadastro
│   ├── pesquisa/          # Página de pesquisa
│   └── configuracao/      # Página de configuração
├── components/            # Componentes React
├── hooks/                 # Hooks personalizados
├── lib/                   # Utilitários e formatação
├── services/              # Serviços de dados
└── types.ts              # Definições de tipos
```

## 🔧 API Endpoints

### Produtos
- `GET /api/produtos` - Listar todos os produtos
- `POST /api/produtos` - Criar novo produto
- `PUT /api/produtos/[id]` - Atualizar produto
- `DELETE /api/produtos/[id]` - Deletar produto
- `GET /api/produtos/search?q=query` - Buscar produtos

## 🎯 Como Usar

### 📱 Instalação PWA (Recomendado)
1. Abra o app no navegador do celular
2. Clique em "Instalar" quando aparecer
3. Ou use menu → "Adicionar à tela inicial"
4. Agora funciona como app nativo!

### Cadastro de Produtos
1. Acesse a página "Cadastro"
2. Preencha os campos do produto
3. Clique em "Adicionar Linha" para mais produtos
4. Clique em "Salvar Produtos" para persistir no banco

### Pesquisa de Produtos
1. Acesse a página "Pesquisa"
2. Use o campo de busca para filtrar produtos
3. Visualize todos os produtos cadastrados
4. Exclua produtos clicando no ícone de lixeira

### 🔄 Sincronização
1. **Offline**: Use normalmente, dados salvos localmente
2. **Online**: Sincroniza automaticamente com servidor
3. **GitHub**: Exporte/importe dados entre dispositivos
4. **Configuração**: Gerencie backups e sincronização

### Configuração
1. Acesse a página "Configuração"
2. Exporte dados para backup
3. Importe dados de arquivos JSON
4. Verifique versões do banco

## 🔄 Migração do localStorage

O projeto foi migrado de localStorage para Prisma SQLite com suporte offline:

### Antes (localStorage)
- Dados armazenados no navegador
- Sem persistência entre dispositivos
- Limitações de espaço

### Depois (Prisma + SQLite + Offline)
- Dados persistentes no servidor
- Acesso via API REST
- **🆕 Funciona 100% offline**
- **🆕 Sincronização automática**
- **🆕 PWA instalável**
- Melhor performance e escalabilidade
- Backup e sincronização facilitados

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Outros Provedores
- **Railway**: Suporte nativo a SQLite
- **Render**: Configuração manual necessária
- **Heroku**: Requer PostgreSQL (não SQLite)

## 📝 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma [issue](https://github.com/seu-usuario/controle_precos/issues) no GitHub.
