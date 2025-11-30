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
        detailsDescription: 'Explore as belezas de Maceió, um verdadeiro paraíso no Nordeste. Este pacote oferece 7 dias de relaxamento com passagens aéreas simuladas e hospedagem em hotel 4 estrelas na orla, com café da manhã incluso. Desfrute das piscinas naturais de Pajuçara e da famosa Praia do Francês. Uma viagem inesquecível para toda a família.', 
        price: 1899.90,
        imageUrl: 'https://www.viajenaviagem.com/wp-content/uploads/2023/12/maceio-cadeira-gigante-16x9-1.jpg.webp', 
        rating: 4.5,
        location: 'Maceió, AL',
        details: { 
            inclusions: ["Aéreo de Ida e Volta (Simulado)", "Hospedagem 7 noites em hotel 4 estrelas", "Café da Manhã Diário", "Traslado aeroporto/hotel (Simulado)"],
            itinerary: [
                "Dia 1: Chegada em Maceió e check-in no hotel.", 
                "Dia 2: Passeio para a Praia do Francês (incluso).", 
                "Dia 3: Dia livre para aproveitar as piscinas naturais de Pajuçara.",
                "Dia 4: Opcional: Tour para Maragogi (não incluso).",
                "Dia 5-6: Dias livres.",
                "Dia 7: Check-out e Retorno para casa (aéreo simulado)."
            ]
        },
        reviews: [ 
            { name: "Cliente A", rating: 5, comment: "Viagem inesquecível! Recomendo." },
            { name: "Cliente B", rating: 4, comment: "O aéreo atrasou um pouco, mas o destino vale muito a pena." }
        ]
    }),
    new Package({
        id: 'pkg-002',
        title: 'Serra Gaúcha Romântica',
        description: 'Pacote de 5 dias em Gramado e Canela. Inclui traslado e passeios.', 
        detailsDescription: 'Viva um sonho romântico na Serra Gaúcha. 5 dias e 4 noites explorando o charme de Gramado e a beleza de Canela. Inclui hospedagem em pousada aconchegante, traslado de Porto Alegre e passeios essenciais pela região. Perfeito para casais que buscam um clima europeu e experiências gastronômicas únicas.', 
        price: 2450.00,
        imageUrl: 'https://guiaviajarmelhor.com.br/wp-content/uploads/2015/07/bondinho.jpg', 
        rating: 4.8,
        location: 'Gramado, RS',
        status: 'Ativo',
        details: { 
            inclusions: ["5 dias e 4 noites de hospedagem", "Traslado Aeroporto POA/Gramado/POA", "Café da manhã incluso", "Ingresso para o Museu de Cera (Simulado)"],
            itinerary: [
                "Dia 1: Chegada em Porto Alegre (POA) e transfer para Gramado. Check-in.", 
                "Dia 2: Tour em Gramado (Lago Negro e centro).", 
                "Dia 3: Tour em Canela (Catedral de Pedra e Parque do Caracol).",
                "Dia 4: Dia livre para compras e chocolate.",
                "Dia 5: Check-out e Transfer de volta."
            ]
        },
        reviews: [ 
            { name: "Cliente C", rating: 5, comment: "A pousada era linda! Perfeito para o casal." },
            { name: "Cliente D", rating: 4, comment: "Excelente, mas o traslado foi um pouco demorado." }
        ]
    }),
    new Package({
        id: 'pkg-003',
        title: 'Aventura na Amazônia',
        description: '3 dias e 2 noites em Lodge na floresta, Manaus. Pensão completa.', 
        detailsDescription: 'Uma imersão total na maior floresta tropical do mundo. Este pacote de 3 dias inclui 2 noites em um Lodge rústico, mas confortável, com pensão completa (café, almoço e jantar). Serão realizadas atividades como focagem de jacarés, caminhada na selva e visita à comunidades ribeirinhas, guiadas por experientes nativos.', 
        price: 1200.00,
        imageUrl: 'https://dbui4lb3qzbcx.cloudfront.net/imagens/a2735a52914c468943a8761c7b82123e.jpeg', 
        rating: 4.2,
        location: 'Manaus, AM',
        details: { 
            inclusions: ["2 noites em Lodge", "Pensão Completa (todas as refeições)", "Transfer de Manaus (porto ou aeroporto)", "Excursões guiadas (Focagem, Trilha)"],
            itinerary: [
                "Dia 1: Transfer de Manaus e check-in, Jantar e Focagem noturna.", 
                "Dia 2: Caminhada na Selva e Visita à Comunidade Ribeirinha.", 
                "Dia 3: Café da manhã e Retorno para Manaus."
            ]
        },
        reviews: [ 
            { name: "Cliente E", rating: 4, comment: "A experiência foi incrível, mas o calor é intenso." }
        ]
    }),
    new Package({
        id: 'pkg-004', 
        title: 'Recife: História e Praias',
        description: 'Pacote econômico 4 dias em Olinda/Recife. Inclui City Tour.', 
        detailsDescription: 'Descubra a história viva de Olinda e as belas praias de Recife. Este pacote econômico de 4 dias e 3 noites oferece hospedagem em hotel bem localizado e um City Tour completo para conhecer os principais pontos turísticos do "Veneza Brasileira" e as ladeiras históricas de Olinda. Ideal para quem busca cultura e sol com um orçamento limitado.', 
        price: 980.50, 
        imageUrl: 'https://viagemeturismo.abril.com.br/wp-content/uploads/2016/12/thinkstockphotos-4744489501.jpeg?quality=70&strip=info&resize=1080,565&crop=1',
        rating: 4.1, 
        location: 'Recife, PE',
        details: { 
            inclusions: ["3 noites de Hospedagem", "City Tour Histórico Recife/Olinda (incluso)", "Café da manhã (Simulado)", "Seguro Viagem"],
            itinerary: [
                "Dia 1: Chegada e check-in no hotel.", 
                "Dia 2: City Tour em Olinda/Recife.", 
                "Dia 3: Dia livre para Porto de Galinhas (Opcional - não incluso).",
                "Dia 4: Check-out e retorno."
            ]
        },
        reviews: [ 
            { name: "Cliente F", rating: 4, comment: "Ótimo custo-benefício. O City Tour foi excelente." }
        ]
    }),
    new Package({
        id: 'pkg-005', 
        title: 'Foz do Iguaçu: Maravilha Natural',
        description: 'Aéreo + 3 noites com visita às Cataratas e Itaipu.', 
        detailsDescription: 'Testemunhe a grandiosidade das Cataratas do Iguaçu, uma das 7 Maravilhas Naturais do Mundo. Este pacote inclui passagens aéreas simuladas, 3 noites de hospedagem confortável e ingressos para os principais pontos turísticos: lado brasileiro das Cataratas e a Usina Hidrelétrica de Itaipu. Uma experiência de contato com a natureza em escala colossal.', 
        price: 1550.00, 
        imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/03/9b/2d/ce/foz-do-iguacu.jpg?w=1100&h=1100&s=1',
        rating: 4.9, 
        location: 'Foz do Iguaçu, PR',
        details: { 
            inclusions: ["Aéreo de Ida e Volta (Simulado)", "3 noites de Hospedagem", "Ingresso Cataratas (lado BR)", "Ingresso Usina de Itaipu"],
            itinerary: [
                "Dia 1: Chegada em Foz e check-in.", 
                "Dia 2: Visita às Cataratas do Iguaçu.", 
                "Dia 3: Tour Usina de Itaipu.",
                "Dia 4: Check-out e retorno."
            ]
        },
        reviews: [ 
            { name: "Cliente G", rating: 5, comment: "As Cataratas são mais bonitas do que imaginei!" }
        ]
    }),
    new Package({
        id: 'pkg-006', 
        title: 'Salvador Cultural',
        description: '5 dias no Pelourinho com workshop de Capoeira e Culinária.', 
        detailsDescription: 'Mergulhe na cultura afro-brasileira de Salvador, a capital da alegria. 5 dias e 4 noites de hospedagem em um hotel-boutique no Pelourinho. O pacote inclui experiências culturais exclusivas, como um workshop de Capoeira e uma aula de culinária baiana, além de um passeio guiado pela história do centro. Axé!', 
        price: 1300.00, 
        imageUrl: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/23/6a/16/60/caption.jpg?w=1200&h=-1&s=1',
        rating: 4.4, 
        location: 'Salvador, BA',
        details: { 
            inclusions: ["4 noites em Hotel no Pelourinho", "Passeio Guiado Histórico", "Workshop de Capoeira", "Aula de Culinária Baiana"],
            itinerary: [
                "Dia 1: Chegada e check-in.", 
                "Dia 2: Tour Histórico no Pelourinho.", 
                "Dia 3: Workshop de Capoeira e almoço local.", 
                "Dia 4: Aula de Culinária e Noite de Acarajé.",
                "Dia 5: Check-out e retorno."
            ]
        },
        reviews: [ 
            { name: "Cliente H", rating: 5, comment: "O Pelourinho é vibrante. Experiências culturais fantásticas." }
        ]
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
    return packages.map(pkgData => {
        if (!pkgData.detailsDescription) {
            // Usa a descrição curta como fallback se o campo novo não existir
            pkgData.detailsDescription = pkgData.description; 
        }
        // ... (outras correções)
        return new Package(pkgData);
    });
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
 * @param {object} newPackageData - Dados do novo pacote, incluindo o objeto 'details'.
 */
const createPackage = (newPackageData) => {
    const allPackages = getAllPackages();

    const newPackage = new Package({
        ...newPackageData,
        price: parseFloat(newPackageData.price),
        rating: parseFloat(newPackageData.rating || 5.0),
        details: newPackageData.details
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
        status: updatedData.status,
        details: updatedData.details
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