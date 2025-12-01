// src/js/pages/cart.js
/**
 * LÓGICA DE PÁGINA: cart.html
 * Responsabilidade: Exibir itens, permitir remoção e calcular o total.
 */
import { CartService } from '../services/cart.js';

// Elementos DOM
const cartItemsContainer = document.getElementById('cart-items-container');
const cartSubtotalElement = document.getElementById('cart-subtotal');
const cartTotalElement = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const emptyCartMessage = document.getElementById('empty-cart-message');

/**
 * 1. Renderiza um único item do carrinho.
 * @param {import('../services/cart.js').CartItem} item 
 * @returns {string} HTML do item
 */
const renderCartItem = (item) => {
    const itemPricePerTraveler = item.pricePerTraveler || 0;
    const itemTravelers = item.travelers || 0;
    const itemTotal = (itemPricePerTraveler * itemTravelers);
    
    // Formatação de moeda e data para PT-BR
    const formattedPrice = itemPricePerTraveler.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formattedTotal = itemTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    // Assume o formato AAAA-MM-DD e formata para dd/mm/aaaa
    const formattedDate = new Date(item.date).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' }); 

    return `
        <div class="cart-item" data-item-id="${item.id}">
            <div class="item-image">
                <img src="${item.imageUrl || '../../assets/images/mock/default-package.jpg'}" alt="Imagem do pacote ${item.title}">
            </div>
            <div class="item-details">
                <h3><a href="/details.html?id=${item.packageId}">${item.title}</a></h3>
                <p class="item-meta">Destino: ${item.location || 'Não especificado'}</p>
                <p class="item-meta">Viagem em: ${formattedDate}</p>
                <p class="item-meta">Viajantes: ${itemTravelers}</p>
                <p class="item-meta">Preço p/ pessoa: ${formattedPrice}</p>
                
                <button class="btn btn-danger btn-sm remove-item-btn" data-item-id="${item.id}">
                    Remover
                </button>
            </div>
            <div class="item-price">
                <p class="total-label">Subtotal Item:</p>
                <p class="total-value">${formattedTotal}</p>
            </div>
        </div>
    `;
};

/**
 * 2. Renderiza a lista completa e o subtotal.
 */
export const renderCart = () => {
    const items = CartService.getCartItems();
    const subtotal = CartService.calculateSubtotal();

    if (!cartItemsContainer || !cartSubtotalElement) {
        // Sai se os elementos DOM não existirem (pode estar sendo chamado em outra página)
        return; 
    }

    const formattedSubtotal = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // 1. Atualiza o Subtotal
    if (cartSubtotalElement) {
        cartSubtotalElement.textContent = formattedSubtotal;
    }

    // 2. CORREÇÃO: Atualiza o Total (que é o mesmo valor do subtotal por enquanto)
    if (cartTotalElement) {
        cartTotalElement.textContent = formattedSubtotal;
    }

    // Habilita o botão de checkout se houver itens
    if (checkoutBtn) {
        checkoutBtn.disabled = items.length === 0;
    }

    // Anexa os listeners
    attachEventListeners();

    if (items.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
    } else {
        emptyCartMessage.style.display = 'none';
        checkoutBtn.disabled = false;
        
        // Renderiza todos os itens na lista
        cartItemsContainer.innerHTML = items.map(renderCartItem).join('');
    }
    
    // Atualiza o subtotal no resumo
    if (cartSubtotalElement) {
        cartSubtotalElement.textContent = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
        console.error("Elemento DOM com ID 'cart-subtotal' não encontrado em cart.html!");
    }
    
    // Anexa os listeners (principalmente o botão "Remover")
    attachEventListeners();
};

/**
 * 3. Anexa listeners de eventos (Remover Item)
 */
const attachEventListeners = () => {
    // Remove listeners anteriores para evitar duplicação (importante após re-renderização)
    document.querySelectorAll('.remove-item-btn').forEach(button => {
        button.removeEventListener('click', handleRemoveItem);
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
    // O ID do item está armazenado no data-item-id do botão
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
    window.location.href = 'checkout.html';
}

/**
 * 6. Função de inicialização do módulo (Chamada a partir do cart.html).
 */
export const initCartPage = () => {
    renderCart();
};