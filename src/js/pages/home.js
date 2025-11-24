import { Package } from '../models/package.js';

// --- Dados Mock (Simulação) ---
const mockPackages = [
    new Package({
        id: 'pkg-001',
        title: 'Praias do Nordeste',
        description: '7 dias em Maceió com aéreo e hotel. Inclui café da manhã.',
        price: 1899.90,
        // Refatorado: De '../assets/images/mock/maceio.jpg' para absoluto
        imageUrl: '../../assets/images/mock/maceio.jpg', 
        rating: 4.5,
        location: 'Maceió, AL'
    }),
    new Package({
        id: 'pkg-002',
        title: 'Serra Gaúcha Romântica',
        description: 'Pacote de 5 dias em Gramado e Canela. Inclui traslado e passeios.',
        price: 2450.00,
        // Refatorado: De '../assets/images/mock/gramado.jpg' para absoluto
        imageUrl: '../../assets/images/mock/gramado.jpg', 
        rating: 4.8,
        location: 'Gramado, RS'
    }),
    new Package({
        id: 'pkg-003',
        title: 'Aventura na Amazônia',
        description: '3 dias e 2 noites em Lodge na floresta, Manaus. Pensão completa.',
        price: 1200.00,
        // Refatorado: De '../assets/images/mock/amazonia.jpg' para absoluto
        imageUrl: '../../assets/images/mock/amazonia.jpg', 
        rating: 4.2,
        location: 'Manaus, AM'
    })
];
/**
 * 1. Função de utilidade para criar o HTML de um Card de Pacote
 * @param {Package} pkg 
 * @returns {string} HTML do card
 */
const createPackageCard = (pkg) => {
    // Implementação básica do template do card para garantir que o JS funcione
    return `
        <div class="package-card-component">
            <img src="${pkg.imageUrl}" alt="Imagem de ${pkg.title}" loading="lazy">
            <div class="card-body">
                <h3>${pkg.title}</h3>
                <p class="location">${pkg.location}</p>
                <p class="description">${pkg.description}</p>
                <div class="card-footer">
                    <span class="price">R$ ${pkg.price.toFixed(2).replace('.', ',')}</span>
                    <a href="details.html?id=${pkg.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
                </div>
            </div>
        </div>
    `;
};


/**
 * 2. Renderiza a lista de pacotes no contêiner da Home.
 * @param {HTMLElement} container 
 */
const renderPackages = (container) => {
    // Renderiza apenas 3 ou 4 pacotes para a seção de destaque
    const packagesToShow = mockPackages.slice(0, 4); 
    const cardsHTML = packagesToShow.map(createPackageCard).join('');
    
    // Assumindo que há um elemento com ID 'featured-packages' ou similar na main
    container.innerHTML = cardsHTML; 
};


/**
 * 3. Função de Inicialização da Página Home (O EXPORT NECESSÁRIO)
 */
export const initHomePage = () => {
    // Elemento onde os pacotes serão injetados (verifique seu index.html)
    const packagesContainer = document.getElementById('featured-packages'); 
    
    if (packagesContainer) {
        renderPackages(packagesContainer);
    } else {
        console.warn("Contêiner de pacotes em destaque (#featured-packages) não encontrado.");
    }
};
