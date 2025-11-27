import { Package } from '../models/package.js';
import { PackageService } from '../services/package.js';

/**
 * 1. Função de utilidade para criar o HTML de um Card de Pacote
 * @param {Package} pkg 
 * @returns {string} HTML do card
 */
const createPackageCard = (pkg) => {
    // Implementação básica do template do card para garantir que o JS funcione
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
 * 2. Renderiza a lista de pacotes no contêiner da Home.
 * @param {HTMLElement} container 
 */
const renderPackages = (container) => {
    const allPackages = PackageService.getAllPackages();
    // Renderiza apenas 3 ou 4 pacotes para a seção de destaque
    const packagesToShow = allPackages.slice(0, 3); 
    const cardsHTML = packagesToShow.map(createPackageCard).join('');
    
    // Assumindo que há um elemento com ID 'featured-packages' ou similar na main
    container.innerHTML = cardsHTML; 
};

/**
 * 3. Função de Inicialização da Página Home (O EXPORT NECESSÁRIO)
 */
export const initHomePage = () => {
    // Elemento onde os pacotes serão injetados (verifique seu index.html)
    const packagesContainer = document.querySelector('#featured-packages .promo-grid'); 
    
    if (packagesContainer) {
        renderPackages(packagesContainer);
    } else {
        console.warn("Contêiner de pacotes em destaque (#featured-packages) não encontrado.");
    }
};
