import { Package } from '../models/package.js';
import { PackageService } from '../services/package.js';

/**
 * Cria o HTML de um Card de Pacote para os resultados.
 * @param {Package} pkg 
 * @returns {string} HTML do card
 */
const createPackageCard = (pkg) => {
    // Uso das classes corretas do card.css
    return `
        <div class="card-component">
            <img src="${pkg.imageUrl}" alt="Imagem de ${pkg.title}" loading="lazy">
            <div class="card-body">
                <h3 class="card-title">${pkg.title}</h3>
                <p class="card-location">${pkg.location}</p>
                <p class="card-description">${pkg.description}</p>
                <div class="card-footer">
                    <span class="card-price">R$ ${pkg.price.toFixed(2).replace('.', ',')}</span>
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
    const packages = PackageService.getAllPackages();
    
    // 2. Renderizar
    renderResults(packages);
    
    // 3. (Futuro: Configurar filtros e ordenação)
};