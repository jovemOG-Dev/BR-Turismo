// src/js/services/package.js

import { Package } from '../models/package.js';
import { StorageService } from './storage.js';

/**
 * MOCKS: Lista completa e unificada de pacotes para inicialização.
 * (Combinando os mocks de home.js e results.js)
 */
const INITIAL_MOCK_PACKAGES = [
    new Package({
        id: 'pkg-001',
        title: 'Praias do Nordeste',
        description: '7 dias em Maceió com aéreo e hotel. Inclui café da manhã.',
        price: 1899.90,
        imageUrl: 'https://www.viajenaviagem.com/wp-content/uploads/2023/12/maceio-cadeira-gigante-16x9-1.jpg.webp', 
        rating: 4.5,
        location: 'Maceió, AL'
    }),
    new Package({
        id: 'pkg-002',
        title: 'Serra Gaúcha Romântica',
        description: 'Pacote de 5 dias em Gramado e Canela. Inclui traslado e passeios.',
        price: 2450.00,
        imageUrl: 'https://guiaviajarmelhor.com.br/wp-content/uploads/2015/07/bondinho.jpg', 
        rating: 4.8,
        location: 'Gramado, RS'
    }),
    new Package({
        id: 'pkg-003',
        title: 'Aventura na Amazônia',
        description: '3 dias e 2 noites em Lodge na floresta, Manaus. Pensão completa.',
        price: 1200.00,
        imageUrl: 'https://dbui4lb3qzbcx.cloudfront.net/imagens/a2735a52914c468943a8761c7b82123e.jpeg', 
        rating: 4.2,
        location: 'Manaus, AM'
    }),
    new Package({
        id: 'pkg-004', 
        title: 'Recife: História e Praias',
        description: 'Pacote econômico 4 dias em Olinda/Recife. Inclui City Tour.',
        price: 980.50, 
        imageUrl: 'https://viagemeturismo.abril.com.br/wp-content/uploads/2016/12/thinkstockphotos-4744489501.jpeg?quality=70&strip=info&resize=1080,565&crop=1',
        rating: 4.1, 
        location: 'Recife, PE'
    }),
    new Package({
        id: 'pkg-005', 
        title: 'Foz do Iguaçu: Maravilha Natural',
        description: 'Aéreo + 3 noites com visita às Cataratas e Itaipu.',
        price: 1550.00, 
        imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/9b/2d/ce/foz-do-iguacu.jpg?w=1100&h=1100&s=1',
        rating: 4.9, 
        location: 'Foz do Iguaçu, PR'
    }),
    new Package({
        id: 'pkg-006', 
        title: 'Salvador Cultural',
        description: '5 dias no Pelourinho com workshop de Capoeira e Culinária.',
        price: 1300.00, 
        imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/6a/16/60/caption.jpg?w=1200&h=-1&s=1',
        rating: 4.4, 
        location: 'Salvador, BA'
    })
];

/**
 * Inicializa os pacotes no localStorage se a chave não existir.
 */
const initializePackages = () => {
    // Tenta obter os pacotes
    let packages = StorageService.get(StorageService.KEYS.PACKAGES);

    // Se a lista não existir no localStorage, salva os mocks iniciais
    if (!packages || packages.length === 0) {
        console.log("Inicializando packages no localStorage com dados mockados.");
        StorageService.set(StorageService.KEYS.PACKAGES, INITIAL_MOCK_PACKAGES);
        packages = INITIAL_MOCK_PACKAGES;
    }

    // Garante que os dados lidos do localStorage sejam instâncias da classe Package
    return packages.map(pkgData => new Package(pkgData));
};

/**
 * Retorna todos os pacotes disponíveis (lendo do localStorage e inicializando se necessário).
 * @returns {Package[]} Lista de pacotes.
 */
const getAllPackages = () => {
    // A inicialização é feita antes de cada leitura para garantir a existência dos dados.
    return initializePackages();
};

/**
 * Retorna um pacote específico pelo seu ID. (READ Detalhe)
 * @param {string} id - ID do pacote.
 * @returns {Package | undefined} O pacote encontrado ou undefined.
 */
const getPackageById = (id) => {
    const allPackages = getAllPackages();
    return allPackages.find(pkg => pkg.id === id);
};

/**
 * CRIAÇÃO (CREATE): Adiciona um novo pacote ao array persistido.
 * (Função mantida inalterada da etapa anterior)
 */
const createPackage = (newPackageData) => {
    const allPackages = getAllPackages();

    const newPackage = new Package({
        ...newPackageData,
        price: parseFloat(newPackageData.price),
        rating: parseFloat(newPackageData.rating || 5.0)
    });

    allPackages.push(newPackage);
    StorageService.set(StorageService.KEYS.PACKAGES, allPackages);
    
    return newPackage;
};

/**
 * ATUALIZAÇÃO (UPDATE): Atualiza um pacote existente.
 * @param {string} id - ID do pacote a ser atualizado.
 * @param {object} updatedData - Novos dados do pacote (já validados).
 * @returns {Package | null} O pacote atualizado ou null se não for encontrado.
 */
const updatePackage = (id, updatedData) => {
    let allPackages = getAllPackages();
    const index = allPackages.findIndex(pkg => pkg.id === id);

    if (index === -1) {
        console.error(`Pacote com ID ${id} não encontrado para atualização.`);
        return null;
    }

    // Mantém o ID original, atualiza o restante dos campos
    const existingPackage = allPackages[index];

    // Cria uma nova instância de Package (ou atualiza a existente)
    const packageToUpdate = new Package({
        id: existingPackage.id, // Mantém o ID
        title: updatedData.title,
        description: updatedData.description,
        price: parseFloat(updatedData.price), // Garante que o tipo seja numérico
        imageUrl: updatedData.imageUrl,
        rating: parseFloat(updatedData.rating || 5.0),
        location: updatedData.location,
        status: updatedData.status
    });

    allPackages[index] = packageToUpdate;

    StorageService.set(StorageService.KEYS.PACKAGES, allPackages);
    
    return packageToUpdate;
};

/**
 * EXCLUSÃO (DELETE): Remove um pacote do array persistido.
 * @param {string} id - ID do pacote a ser excluído.
 * @returns {boolean} True se a exclusão foi bem-sucedida, false caso contrário.
 */
const deletePackage = (id) => {
    let allPackages = getAllPackages();
    const initialLength = allPackages.length;
    
    // Filtra o array, removendo o pacote com o ID correspondente
    const updatedPackages = allPackages.filter(pkg => pkg.id !== id);
    
    if (updatedPackages.length < initialLength) {
        StorageService.set(StorageService.KEYS.PACKAGES, updatedPackages);
        return true;
    }
    
    console.warn(`Pacote com ID ${id} não encontrado para exclusão.`);
    return false;
};

// Exporta as funções de acesso ao CRUD de Pacotes
export const PackageService = {
    getAllPackages,
    getPackageById, 
    createPackage,
    updatePackage, 
    deletePackage, 
};