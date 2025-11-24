import { Package } from '../models/package.js';

// --- Dados Mock (Simulação - Expandido para simular resultados) ---
const getMockPackages = () => ([
    new Package({
        id: 'pkg-004', title: 'Recife: História e Praias',
        description: 'Pacote econômico 4 dias em Olinda/Recife. Inclui City Tour.',
        price: 980.50, 
        // Refatorado: De '../assets/images/mock/recife.jpg' para absoluto
        imageUrl: '../../assets/images/mock/recife.jpg',
        rating: 4.1, location: 'Recife, PE'
    }),
    new Package({
        id: 'pkg-005', title: 'Foz do Iguaçu: Maravilha Natural',
        description: 'Aéreo + 3 noites com visita às Cataratas e Itaipu.',
        price: 1550.00, 
        // Refatorado: De '../assets/images/mock/foz.jpg' para absoluto
        imageUrl: '../../assets/images/mock/foz.jpg',
        rating: 4.9, location: 'Foz do Iguaçu, PR'
    }),
    new Package({
        id: 'pkg-006', title: 'Salvador Cultural',
        description: '5 dias no Pelourinho com workshop de Capoeira e Culinária.',
        price: 1300.00, 
        // Refatorado: De '../assets/images/mock/salvador.jpg' para absoluto
        imageUrl: '../../assets/images/mock/salvador.jpg',
        rating: 4.4, location: 'Salvador, BA'
    })
    // ...
]);

/**
 * Cria o HTML para um card de pacote (utilidade).
 */
const createPackageCard = (pkg) => {
    return `
        <div class="package-card-component package-result-card">
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
 * Renderiza os pacotes na página de resultados.
 * @param {Package[]} packages - Lista de pacotes a renderizar.
 */
const renderResults = (packages) => {
    // Assumindo que o contêiner de resultados tenha o ID 'packages-list'
    const resultsContainer = document.getElementById('results-list');
    
    if (resultsContainer) {
        const cardsHTML = packages.map(createPackageCard).join('');
        resultsContainer.innerHTML = cardsHTML;
    } else {
        console.error("Contêiner de resultados (#packages-list) não encontrado.");
    }
};


/**
 * FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO.
 * Exporta a função para ser chamada pelo HTML.
 */
export const initResultsPage = () => {
    console.log("Página de Resultados inicializada.");
    
    // 1. Lógica para carregar os pacotes
    const packages = getMockPackages();
    
    // 2. Renderizar
    renderResults(packages);
    
    // 3. (Futuro: Configurar filtros e ordenação)
};