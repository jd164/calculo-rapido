# ⚡ Cálculo Rápido

> Uma aplicação interativa e moderna para treino e desenvolvimento de agilidade mental em cálculo matemático.

[![Aceder à Aplicação](https://img.shields.io/badge/Demo_Online-Aceder_ao_Jogo-success?style=for-the-badge&logo=githubpages&logoColor=white)](https://jd164.github.io/calculo-rapido/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 🎯 Sobre o Projeto

O **Cálculo Rápido** é uma aplicação web concebida para estudantes, entusiastas e qualquer pessoa que deseje exercitar o cérebro e melhorar a velocidade e precisão no cálculo aritmético. 

Com uma interface limpa, intuitiva e responsiva, permite personalizar sessões de treino com diferentes operações, níveis de dificuldade e formatos de resposta, além de fornecer um histórico estatístico detalhado do progresso ao longo do tempo.

👉 **Experimente a versão online em:** [https://jd164.github.io/calculo-rapido/](https://jd164.github.io/calculo-rapido/)

---

## ✨ Funcionalidades Principais

- ➕ **Operações Aritméticas Completas:**
  - Adição (`+`)
  - Subtração (`-`)
  - Multiplicação (`×`)
  - Divisão (`÷`)
  - Prática dedicada de **Tabuadas** (do 2 ao 12 personalizável)
  - Modo **Misto** (combinação dinâmica de operações)

- 🎚️ **Níveis de Dificuldade:**
  - **Fácil:** Cálculos diretos e números menores, ideal para aquecimento e iniciantes.
  - **Médio:** Desafios equilibrados para estimular o raciocínio rápido.
  - **Difícil:** Números maiores e cálculos complexos sob pressão.

- ⌨️ **Formatos de Resposta Flexíveis:**
  - **Entrada Manual / Digitação:** Para simular cálculo real e treino com teclado numérico.
  - **Escolha Múltipla:** Para decisões rápidas e treino de reflexos.

- ⏱️ **Modos de Treino:**
  - Sessões fixas de **10**, **20** ou **50** perguntas.
  - Modo **Livre / Ilimitado** para treinar sem limite de questões.

- 📊 **Estatísticas e Histórico:**
  - Resumo de precisão (percentagem de acertos).
  - Tempo médio de resposta por operação.
  - Gráficos visuais de evolução e desempenho.
  - Armazenamento persistente das sessões no navegador (`LocalStorage`).

- 🔊 **Efeitos Sonoros e Feedback Imediato:**
  - Efeitos sonoros para acertos e erros (com opção de ligar/desligar som).
  - Animações e retorno visual instantâneo.

---

## 🛠️ Tecnologias Utilizadas

- **[React 18](https://react.dev/)** — Biblioteca para construção de interfaces reativas.
- **[Vite](https://vitejs.dev/)** — Ferramenta de build rápida e moderna para o ecossistema frontend.
- **[Tailwind CSS](https://tailwindcss.com/)** — Framework utilitário de estilização para design responsivo e moderno.
- **[Lucide React](https://lucide.dev/)** — Conjunto elegante de ícones para a interface.
- **HTML5 Web Storage API** — Persistência do histórico de sessões localmente sem necessidade de backend.

---

## 📂 Estrutura do Repositório

```plaintext
calculo-rapido/
├── .github/              # Workflows e configurações do GitHub
├── public/               # Ativos estáticos públicos
├── src/
│   ├── components/       # Componentes modulares da interface
│   │   ├── Charts.jsx    # Gráficos de desempenho e progresso
│   │   ├── Game.jsx      # Ecrã ativo de jogo e cálculo
│   │   ├── Header.jsx    # Cabeçalho da aplicação
│   │   ├── Menu.jsx      # Menu de configurações e opções de jogo
│   │   ├── Results.jsx   # Ecrã de resultados finais da sessão
│   │   └── Stats.jsx     # Painel detalhado de estatísticas
│   ├── utils/            # Utilitários, sons e gestão de LocalStorage
│   ├── App.jsx           # Componente raiz e controlo de estado
│   ├── index.css         # Configurações globais e diretivas Tailwind
│   └── main.jsx          # Ponto de entrada da aplicação
├── abrir.bat             # Atalho para arranque rápido em ambiente Windows
├── index.html            # Estrutura HTML principal
├── package.json          # Dependências e scripts do projeto
├── tailwind.config.js    # Configuração de temas e cores do Tailwind
└── vite.config.js        # Configuração do Vite
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
Certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- Gestor de pacotes [npm](https://www.npmjs.com/) (já incluído no Node.js) ou [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Passo a Passo

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/jd164/calculo-rapido.git
   ```

2. **Aceder à pasta do projeto:**
   ```bash
   cd calculo-rapido
   ```

3. **Instalar as dependências:**
   ```bash
   npm install
   ```

4. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Abrir no navegador:**
   - Aceda a `http://localhost:5173/` (ou ao endereço indicado no terminal).

> 💡 **Utilizadores Windows:** Pode também clicar duas vezes no ficheiro `abrir.bat` para iniciar rapidamente.

---

## 📦 Scripts Disponíveis

No ficheiro `package.json`, estão disponíveis os seguintes comandos:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento com hot-reload. |
| `npm run build` | Compila o projeto otimizado para produção na pasta `dist/`. |
| `npm run preview` | Pré-visualiza localmente a versão gerada na pasta de build. |

---

## 🌐 Publicação (Deploy) no GitHub Pages

O projeto já está configurado para deploy contínuo no **GitHub Pages**:

1. Ao realizar alterações na branch `main`, o build é gerado via Vite.
2. A aplicação compilada fica disponível publicamente em:
   ```
   https://jd164.github.io/calculo-rapido/
   ```

---

## 🤝 Contribuições

Contribuições, ideias de melhorias e sugestões são bem-vindas!
1. Faça um Fork do projeto.
2. Crie uma branch para a sua funcionalidade (`git checkout -b feature/nova-funcionalidade`).
3. Faça commit das alterações (`git commit -m 'Adiciona nova funcionalidade'`).
4. Envie para o repositório remoto (`git push origin feature/nova-funcionalidade`).
5. Abra um **Pull Request**.

---

## 📄 Licença

Este projeto é disponibilizado para fins educativos e de desenvolvimento pessoal. Consulte o autor para detalhes adicionais de licenciamento.

---

<div align="center">
  Desenvolvido com ⚡ por <a href="https://github.com/jd164">jd164</a>
</div>

