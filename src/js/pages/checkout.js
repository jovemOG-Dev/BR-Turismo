// src/js/pages/checkout.js
/**
 * LÓGICA DE PÁGINA: checkout.html
 * Responsabilidade: Gerenciar a finalização do pedido, validação de dados e simulação de compra.
 */
import { CartService } from '../services/cart.js';
import { AuthService } from '../services/auth.js';
import { Validator } from '../services/validator.js'; // Assumindo que este módulo foi movido para services/
// Import { MockDataService } from '../services/mockData.js'; // Para obter detalhes dos itens

// Elementos DOM
const checkoutForm = document.getElementById('checkout-form');
const checkoutSummary = document.getElementById('checkout-summary');
const paymentSimulatedContainer = document.getElementById('payment-simulated-container');
const cartTotalElement = document.getElementById('cart-total');
const userDetailsSection = document.getElementById('user-details-section');

/**
 * 1. Pré-preenche os dados do usuário se estiver logado.
 */
const prefillUserDetails = (user) => {
    // Acessa os campos do formulário
    const nameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const cpfInput = document.getElementById('cpf');

    if (user) {
        // Assume que o objeto User retornado pela sessão tem esses campos (simulação)
        if (nameInput) nameInput.value = user.name || '';
        if (emailInput) emailInput.value = user.email || '';
        // Nota: CPF e outros dados sensíveis não deveriam ser expostos/preenchidos automaticamente por padrão.
        // Aqui simulamos o preenchimento apenas para fins de MVP.
        if (cpfInput) cpfInput.value = user.cpf || ''; 

        // Oculta a necessidade de login/cadastro
        const loginPrompt = document.getElementById('login-prompt');
        if (loginPrompt) loginPrompt.style.display = 'none';
    } else {
        // Se não estiver logado, garante que o prompt de login/cadastro esteja visível
        const loginPrompt = document.getElementById('login-prompt');
        if (loginPrompt) loginPrompt.style.display = 'block';
    }
};

/**
 * 2. Renderiza o resumo do pedido na sidebar.
 */
const renderSummary = () => {
    const items = CartService.getCartItems();
    const subtotal = CartService.calculateSubtotal();
    
    // Simulação de Taxas
    const taxes = subtotal * 0.05; // 5% de taxa de serviço
    const total = subtotal + taxes;

    // Renderiza a lista de itens no resumo
    checkoutSummary.innerHTML = items.map(item => `
        <div class="summary-item">
            <span class="item-title">${item.title}</span>
            <span class="item-qty">(${item.travelers} pax)</span>
            <span class="item-price">${(item.pricePerTraveler * item.travelers).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
    `).join('');

    // Renderiza os totais
    const totalHtml = `
        <div class="summary-line line-subtotal"><span>Subtotal:</span><span>${subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
        <div class="summary-line line-tax"><span>Taxas (5%):</span><span>${taxes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span></div>
        <div class="summary-line line-total"><span>TOTAL A PAGAR:</span><strong>${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong></div>
    `;
    cartTotalElement.innerHTML = totalHtml;
};

/**
 * 3. Simula a finalização do pedido.
 */
const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(checkoutForm);
    const data = Object.fromEntries(formData.entries());
    
    // --- Validação (Simplificada) ---
    // Em um projeto real, faríamos a validação campo a campo com feedback visual
    let isValid = true;
    
    if (!Validator.isEmail(data.email)) {
        alert("Por favor, insira um e-mail válido.");
        isValid = false;
    }
    
    if (!Validator.isCpfValid(data.cpf)) {
        alert("Por favor, insira um CPF válido (11 dígitos).");
        isValid = false;
    }

    if (!isValid) return;

    // --- Simulação de Processamento ---
    alert("Processando pagamento... (Simulação)");

    // 4. Limpar o carrinho e finalizar a sessão de compra
    CartService.clearCart(); 

    // 5. Redirecionar para a página de Confirmação (a ser criada: confirmation.html)
    // Usamos um timeout para simular o processamento
    setTimeout(() => {
        alert("SUCESSO! Pedido Finalizado (Simulação). Você será redirecionado.");
        // Redireciona para o índice ou uma página de confirmação
        window.location.href = '/index.html'; 
    }, 1500);

    // Desabilita o botão para evitar cliques duplos
    document.getElementById('finalize-btn').disabled = true;
};

/**
 * 6. Inicializa a página.
 */
export const initCheckoutPage = () => {
    // A. Verifica o Carrinho
    if (CartService.getCartItems().length === 0) {
        alert("Seu carrinho está vazio. Redirecionando para a loja.");
        window.location.href = '/results.html';
        return;
    }

    // B. Renderiza o Resumo
    renderSummary();

    // C. Pré-preenche Dados
    const currentUser = AuthService.getCurrentUser();
    prefillUserDetails(currentUser);

    // D. Adiciona Event Listener do Formulário
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleSubmit);
    }
    
    // E. Lógica visual para o pagamento (ex: seleção de cartão)
    paymentSimulatedContainer.innerHTML = '<p class="disclaimer-text">💳 Pagamento por Cartão (Simulação: qualquer dado é aceito).</p>';
};