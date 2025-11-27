/**
 * SERVIÇO: StorageService
 * API unificada para manipulação de dados persistidos no cliente (localStorage).
 * Responsabilidade: Encapsular a lógica de stringify/parse e manipulação de localStorage.
 */

// Chaves de armazenamento
const STORAGE_KEYS = {
    USERS: 'brTurismo_users',
    PACKAGES: 'brTurismo_packages',
    CART: 'brTurismo_cart',
    SESSION: 'brTurismo_session'
};

/**
 * Salva um valor (objeto ou array) no localStorage.
 * @param {string} key - A chave de STORAGE_KEYS.
 * @param {any} value - O valor a ser armazenado.
 */
const set = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error(`Erro ao salvar no localStorage (${key}):`, e);
        return false;
    }
};

/**
 * Recupera um valor do localStorage e o converte de JSON para objeto.
 * @param {string} key - A chave de STORAGE_KEYS.
 * @param {any} defaultValue - Valor padrão se nada for encontrado (ex: [] para listas).
 * @returns {any} O valor recuperado ou o valor padrão.
 */
const get = (key, defaultValue = null) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
        console.error(`Erro ao ler do localStorage (${key}):`, e);
        return defaultValue;
    }
};

/**
 * Remove um item do localStorage.
 * @param {string} key - A chave de STORAGE_KEYS.
 */
const remove = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error(`Erro ao remover do localStorage (${key}):`, e);
        return false;
    }
};

/**
 * Limpa todos os itens do armazenamento local do BR Turismo.
 */
const clearAll = () => {
    // Itera sobre as chaves do projeto para evitar apagar dados de outros sites
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
};

export const StorageService = {
    KEYS: STORAGE_KEYS,
    set,
    get,
    remove,
    clearAll
};