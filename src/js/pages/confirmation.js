// src/js/pages/confirmation.js
/**
 * LÓGICA DE PÁGINA: confirmation.html
 * Responsabilidade: Exibir a mensagem de sucesso e links de navegação.
 */
import { AuthService } from '../services/auth.js';

// Elementos DOM
const confirmationMessage = document.getElementById('confirmation-message');

/**
 * 1. Inicializa a página.
 */
export const initConfirmationPage = () => {
    // Simula a obtenção de um número de pedido (ID com base no timestamp)
    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    
    const user = AuthService.getCurrentUser();
    
    let userPrompt = '';
    if (user) {
        userPrompt = `Você pode verificar o status do seu pedido acessando seu <a href="user-panel.html?view=orders" class="link-primary">Painel de Pedidos</a>.`;
    } else {
        userPrompt = `Você pode <a href="register.html" class="link-primary">criar uma conta</a> agora para gerenciar seus pedidos.`;
    }

    confirmationMessage.innerHTML = `
        <h1 class="confirmation-title">🎉 Pedido Finalizado com Sucesso!</h1>
        <p class="confirmation-subtitle">Obrigado por comprar na BR Turismo. Seu pedido foi processado (Simulação).</p>
        
        <div class="confirmation-details">
            <p><strong>Número do Pedido:</strong> <span class="order-id">${orderId}</span></p>
            <p><strong>Confirmação Enviada Para:</strong> ${user ? user.email : 'O e-mail fornecido no checkout.'}</p>
        </div>
        
        <p class="next-steps-prompt">${userPrompt}</p>
        
        <div class="action-buttons">
            <a href="results.html" class="btn btn-secondary btn-lg">Continuar Comprando</a>
            ${user ? `<a href="user-panel.html" class="btn btn-primary btn-lg">Acessar Meu Painel</a>` : ''}
        </div>
    `;
};