# BR-Turismo - Agência de Viagens (MVP Estático)

## ✈️ Sobre o Projeto

O **BR-Turismo** é um projeto de simulação de uma aplicação web de agência de viagens, desenvolvido para a disciplina de **Programação Web** do curso de Análise e Desenvolvimento de Sistemas do **SENAC**.

Este projeto foi concebido sob uma dinâmica prática de trabalho: os desenvolvedores atuaram em pares, alternando os papéis de **Cliente** (definindo requisitos e solicitando funcionalidades) e **Web Developer** (implementando as especificações).

O objetivo principal foi aplicar conceitos de **arquitetura de software web** e **separação de responsabilidades** (Módulos/Serviços/Componentes) em um ambiente puramente estático (HTML, CSS e JS), simulando a persistência de dados via `localStorage`.

---

## 🤝 Dinâmica Cliente/Desenvolvedor

**Confira o projeto desenvolvido pela minha dupla, onde atuei como Cliente:**

| Papel | Projeto | Desenvolvedor(a) |
| :---: | :--- | :--- |
| **Cliente** | **CorinthiansCult** | **@lima-gabr** |
| **Acesso** | https://lima-gabr.github.io/CorinthiansCult/ | https://github.com/lima-gabr |

---

### Status e Hospedagem

O projeto é um **MVP (Minimum Viable Product)** estático, com autenticação, carrinho de compras e CRUD (leitura/escrita) simulados.

O projeto está hospedado e pode ser acessado em: **[Link do GitHub Pages do seu Projeto]**

---

## 🛠️ Especificações Técnicas e Arquitetura

O projeto BR-Turismo é construído com foco em **modularidade** e **organização**, seguindo o princípio de *Separation of Concerns* (Separação de Preocupações).

### 1. Estrutura e Modularização (JavaScript)

A arquitetura do projeto é dividida em camadas lógicas para garantir a organização do código-fonte:

| Camada | Pasta | Responsabilidade |
| :--- | :--- | :--- |
| **Modelos** | `src/js/models` | Estrutura de dados (ex: `User`, `Package`). |
| **Serviços** | `src/js/services` | Lógica de negócio, persistência (`AuthService`, `CartService`, `StorageService`). |
| **Componentes** | `src/js/components` | Lógica de pequenos componentes reutilizáveis (ex: `menu-toggle.js`). |
| **Páginas** | `src/js/pages` | Lógica específica de inicialização e manipulação de cada página HTML. |

### 2. Organização de Estilos (CSS Puro)

O CSS segue a organização por contexto para facilitar a manutenção:

* **Base (`src/css/base.css`)**: Estilos globais, *resets* e variáveis de cores.
* **Componentes (`src/css/components/`)**: Estilos para elementos reutilizáveis em qualquer página (ex: `button.css`, `header.css`, `card.css`).
* **Páginas (`src/css/pages/`)**: Estilos específicos de layout para páginas individuais (ex: `home.css`, `user-panel.css`).
    
> **Integração Bootstrap:** A responsividade da aplicação está em processo de adaptação, utilizando a *grid system* do **Bootstrap 5** para otimizar o layout em diferentes dispositivos.

### 3. Gerenciamento de Dados

A persistência de dados é **simulada** utilizando a API `Web Storage` do navegador (`localStorage` e `sessionStorage`).

* **`StorageService.js`**: Única interface para `localStorage`, isolando a lógica de persistência do restante da aplicação.
* **Simulação CRUD**: Operações de Criar/Ler/Atualizar/Deletar (CRUD) são realizadas em tempo de execução e persistidas localmente (usuários, pacotes, pedidos).

---

## 🚀 Como Executar Localmente

Para rodar o projeto em sua máquina:

1.  **Clone o repositório:**
    ```bash
    git clone [Link do Repositório do GitHub]
    cd br-turismo
    ```
2.  **Abra com Servidor Local:**
    * Como o projeto utiliza **módulos JavaScript** (`import` / `export`), é estritamente necessário rodar a aplicação através de um servidor web local.
    * Recomendamos a extensão **Live Server** (VS Code) ou um servidor HTTP simples para evitar erros de CORS.
    * Abra o `index.html` através deste servidor.

---

## 👥 Desenvolvedores

* Gabriel Silva
* Gabriel Lima
