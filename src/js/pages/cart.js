// src/js/pages/cart.js
/**
 * LÓGICA DE PÁGINA: cart.html
 * Responsabilidade: Exibir itens, permitir remoção e calcular o total.
 */
import { CartService } from '../services/cart.js';

// Elementos DOM
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyCartMessage = document.getElementById('empty-cart-message');

/**
 * 1. Renderiza um único item do carrinho.
 * @param {import('../services/cart.js').CartItem} item 
 * @returns {string} HTML do item
 */
const renderCartItem = (item) => {
    const itemTotal = (item.pricePerTraveler * item.travelers);
    const formattedPrice = item.pricePerTraveler.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formattedTotal = itemTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="item-image">
                <img src="${item.imageUrl || '../../assets/images/mock/default-package.jpg'}" alt="Imagem do pacote ${item.title}">
            </div>
            <div class="item-details">
                <h3><a href="/details.html?id=${item.packageId}">${item.title}</a></h3>
                <p class="item-metadata">Viagem em: <span>${item.date}</span></p>
                <p class="item-metadata">Pessoas: <span>${item.travelers}</span></p>
            </div>
            <div class="item-pricing">
                <p class="price-per-person">${formattedPrice} p/pessoa</p>
                <p class="item-total-price">Total: <strong>${formattedTotal}</strong></p>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger btn-sm remove-item-btn" data-item-id="${item.id}" aria-label="Remover item do carrinho">
                    Remover
                </button>
            </div>
        </div>
    `;
};

/**
 * 2. Renderiza a lista completa e o subtotal.
 */
const renderCart = () => {
    const items = CartService.getCartItems();
    const subtotal = CartService.calculateSubtotal();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
    } else {
        emptyCartMessage.style.display = 'none';
        cartItemsContainer.innerHTML = items.map(renderCartItem).join('');
        checkoutBtn.disabled = false;
    }

    // Atualiza o subtotal na sidebar
    if (cartSubtotalElement) {
        cartSubtotalElement.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    
    attachEventListeners();
};

/**
 * 3. Anexa listeners de eventos (Remover Item)
 */
const attachEventListeners = () => {
    // Remove listeners anteriores para evitar duplicação
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.removeEventListener('click', handleRemoveItem);
    });

    // Adiciona o listener para todos os botões de remoção
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.addEventListener('click', handleRemoveItem);
    });
    
    // Configura o botão de Checkout (simulação)
    if (checkoutBtn) {
        checkoutBtn.removeEventListener('click', handleCheckout);
        checkoutBtn.addEventListener('click', handleCheckout);
    }
};

/**
 * 4. Handler para remover um item.
 */
function handleRemoveItem(event) {
    const itemId = event.currentTarget.dataset.itemId;
    if (confirm("Tem certeza que deseja remover este pacote do carrinho?")) {
        CartService.removeItem(itemId);
        renderCart(); // Re-renderiza a lista após a remoção
    }
}

/**
 * 5. Handler para iniciar o checkout.
 */
function handleCheckout() {
    alert("Iniciando o Checkout! Você será redirecionado para a página de Pagamento e Dados. (Simulação)");
    window.location.href = '/checkout.html';
}

/**
 * 6. Função de inicialização do módulo.
 */
export const initCartPage = () => {
    // Renderiza a primeira vez ao carregar a página
    renderCart();
};