// src/js/services/cart.js
/**
 * SERVIÇO: CartService
 * Gestão do Carrinho de Compras (CRUD e Lógica de Preços)
 */
import { StorageService } from './storage.js';

const CART_STORAGE_KEY = StorageService.KEYS.CART;

/**
 * Modelo de Item no Carrinho
 * @typedef {object} CartItem
 * @property {string} packageId - ID do Pacote (ex: 'pkg-001')
 * @property {string} date - Data de início da viagem (AAAA-MM-DD)
 * @property {number} travelers - Número de viajantes
 * @property {number} pricePerTraveler - Preço por pessoa no momento da adição
 * @property {string} id - ID único do item no carrinho
 * // Detalhes mock adicionais para renderização (não persistiriam em um backend real)
 * @property {string} title
 * @property {string} imageUrl
 */

/**
 * 1. Obtém o conteúdo atual do carrinho.
 * @returns {CartItem[]}
 */
const getCartItems = () => {
    // Retorna a lista de itens, ou um array vazio se nada for encontrado
    return StorageService.get(CART_STORAGE_KEY, []);
};

/**
 * 2. Salva o estado atual do carrinho.
 * @param {CartItem[]} items 
 */
const saveCartItems = (items) => {
    StorageService.set(CART_STORAGE_KEY, items);
};

/**
 * 3. Adiciona um novo item ao carrinho.
 * @param {object} itemDetails - Dados do item (packageId, title, pricePerTraveler, etc.)
 */
const addItem = (itemDetails) => {
    const items = getCartItems();
    const newItem = {
        ...itemDetails,
        id: `cart-${Date.now()}-${Math.random().toString(16).slice(2)}`, // ID único
        travelers: itemDetails.travelers || 1,
        date: itemDetails.date || new Date().toISOString().split('T')[0] // Hoje, se não houver data
    };
    items.push(newItem);
    saveCartItems(items);
    return newItem;
};

/**
 * 4. Remove um item do carrinho pelo seu ID único.
 * @param {string} itemId - ID único do item no carrinho.
 * @returns {boolean} True se o item foi removido, false caso contrário.
 */
const removeItem = (itemId) => {
    let items = getCartItems();
    const initialLength = items.length;
    items = items.filter(item => item.id !== itemId);
    saveCartItems(items);
    return items.length < initialLength;
};

/**
 * 5. Calcula o subtotal do carrinho.
 * @returns {number} O valor total de todos os itens.
 */
const calculateSubtotal = () => {
    const items = getCartItems();
    return items.reduce((total, item) => {
        // Preço Total do Item = Preço por Pessoa * N° de Viajantes
        const itemTotal = (item.pricePerTraveler || 0) * (item.travelers || 0);
        return total + itemTotal;
    }, 0);
};

/**
 * 6. Limpa completamente o carrinho.
 */
const clearCart = () => {
    StorageService.remove(CART_STORAGE_KEY);
};


export const CartService = {
    getCartItems,
    addItem,
    removeItem,
    calculateSubtotal,
    clearCart,
};