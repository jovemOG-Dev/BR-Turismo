/**
 * COMPONENTE: Header Auth Link
 * Arquivo: src/js/components/header-auth.js
 * Responsabilidade: Gerenciar o link de Login/Painel do Usuário no cabeçalho.
 */

import { AuthService } from '../services/auth.js';

const AUTH_LINK_ID = 'header-auth-link';
const USER_PANEL_HREF = 'user-panel.html';

/**
 * Atualiza o link de autenticação do cabeçalho com base no status de login.
 */
const updateHeaderAuthLink = () => {
    const authLink = document.getElementById(AUTH_LINK_ID);

    if (!authLink) {
        console.warn(`Elemento com ID '${AUTH_LINK_ID}' não encontrado no cabeçalho. Pulando a atualização.`);
        return;
    }

    const user = AuthService.getCurrentUser(); // Verifica se há usuário logado

    if (user) {
        // RF3: Usuário logado - Alterar para Painel do Usuário
        
        // Pega apenas o primeiro nome para a saudação
        const firstName = user.name ? user.name.split(' ')[0] : 'Usuário';

        authLink.href = USER_PANEL_HREF;
        authLink.textContent = `Olá, ${firstName}`;
        
        // Opcional: Remover a classe btn-secondary (se for um botão, pode ser melhor manter o estilo)
        // No HTML original, ele é um <a> com classes de botão. Mantemos as classes.

    } else {
        // RF4: Usuário deslogado - Manter Login
        authLink.href = 'login.html';
        authLink.textContent = 'Entrar';
        // Garante que o estilo secundário esteja presente se tiver sido removido (redundância segura)
        authLink.classList.add('btn', 'btn-secondary', 'btn-sm'); 
    }
};

/**
 * Inicializa o componente de autenticação do cabeçalho.
 */
export const initHeaderAuth = () => {
    updateHeaderAuthLink();
};