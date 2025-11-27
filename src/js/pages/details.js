// src/js/pages/details.js
/**
 * LÓGICA DE PÁGINA: details.html
 * Responsabilidade: Ler o ID do pacote na URL, buscar o pacote (mock) e renderizar os detalhes.
 */
import { Package } from '../models/package.js';
// Futuramente: import { CartService } from '../services/cart.js';
// Futuramente: Criar um MockDataService centralizado (boa prática)

// Dados Mock (Temporário - Serão movidos para um serviço)
const MOCK_PACKAGE_DETAILS = [
    new Package({
        id: 'pkg-001',
        title: 'Praias do Nordeste: Maceió Fantástica',
        description: 'Maceió é famosa por suas praias urbanas, piscinas naturais de Pajuçara e a culinária alagoana. Este pacote de 7 dias e 6 noites inclui passagens aéreas, transfer e hospedagem no Hotel Ponta Verde. Desfrute de um passeio de jangada até as piscinas naturais.',
        price: 1899.90,
        imageUrl: 'https://res.cloudinary.com/djeui5p1t/image/upload/f_auto,fl_progressive,c_fill,h_490,w_1080/v1756143208/1920x1280-praia-paripueira-maceio_edi3kc.jpg',
        rating: 4.5,
        location: 'Maceió, AL',
        details: {
            inclusions: ['Aéreo de ida e volta (Maceió)', '6 Noites de Hotel 4 estrelas', 'Café da manhã diário', 'Transfer Aeroporto/Hotel', 'Passeio de Jangada (Opcional)'],
            maxTravelers: 4
        }
    }),
    new Package({
        id: 'pkg-004',
        title: 'Recife: História e Praias',
        description: 'Recife e Olinda oferecem um mergulho na história colonial e praias urbanas vibrantes. Este pacote foca na cultura e inclui 4 dias de estadia em Boa Viagem, com city tour guiado pelo Recife Antigo e Olinda, Patrimônio da Humanidade.',
        price: 980.50,
        imageUrl: 'https://www.viajenaviagem.com/wp-content/uploads/2024/02/recife-boa-viagem-16x9-1.jpg.webp',
        rating: 4.1,
        location: 'Recife, PE',
        details: {
            inclusions: ['Aéreo de ida e volta (Recife)', '3 Noites de Hotel', 'City Tour Histórico (Recife/Olinda)', 'Seguro Viagem Básico'],
            maxTravelers: 6
        }
    }),
];

/**
 * 1. Busca o pacote pelo ID da URL.
 * @param {string} id - ID do pacote.
 * @returns {Package | undefined}
 */
const getPackageById = (id) => {
    return MOCK_PACKAGE_DETAILS.find(p => p.id === id);
};

/**
 * 2. Renderiza os dados do pacote na página.
 * @param {Package} pkg - Objeto Package com detalhes.
 */
const renderPackageDetails = (pkg) => {
    // 2.1 Atualiza Títulos e Metadados
    document.getElementById('page-title').textContent = `${pkg.title} | BR Turismo`;
    document.getElementById('package-title').textContent = pkg.title;
    document.getElementById('package-main-image').src = pkg.imageUrl;
    document.getElementById('package-main-image').alt = `Imagem principal do pacote: ${pkg.title}`;

    // 2.2 Atualiza o Conteúdo
    document.getElementById('package-description').textContent = pkg.description;

    // 2.3 Atualiza Inclusões
    const inclusionsList = document.getElementById('package-inclusions');
    if (inclusionsList && pkg.details && pkg.details.inclusions && Array.isArray(pkg.details.inclusions)) {
        // Limpa as inclusões estáticas do HTML
        inclusionsList.innerHTML = ''; 
        pkg.details.inclusions.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            inclusionsList.appendChild(li);
        });
    }

    // 2.4 Atualiza Preço e UI de Compra
    const formattedPrice = pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('package-price').textContent = formattedPrice;
    document.getElementById('total-estimated-price').textContent = formattedPrice;
    
    // Configura o botão (A ser implementado em Fase 5)
    const form = document.getElementById('booking-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // LÓGICA FUTURA: adicionar ao carrinho (CartService.addItem(pkg.id, date, travelers))
            alert(`Pacote ${pkg.title} (R$ ${pkg.price}) adicionado ao carrinho! (Simulação)`);
            window.location.href = '/cart.html'; 
        });
    }

    // Lógica simples de cálculo de preço
    const travelersInput = document.getElementById('travelers-count');
    const updatePrice = () => {
        const travelers = parseInt(travelersInput.value) || 1;
        const total = pkg.price * travelers;
        document.getElementById('total-estimated-price').textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    travelersInput.addEventListener('input', updatePrice);
};


/**
 * 3. Inicializa a página: Lê a URL e chama a renderização.
 */
export const initDetailsPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');

    if (!packageId) {
        alert("Erro: ID do pacote não encontrado na URL.");
        // Redireciona para resultados ou exibe mensagem de erro
        document.getElementById('package-details-main').innerHTML = '<div class="container"><p>Pacote não especificado. Retorne à página de <a href="/results.html">Resultados</a>.</p></div>';
        return;
    }

    const pkg = getPackageById(packageId);

    if (pkg) {
        renderPackageDetails(pkg);
    } else {
        alert(`Erro: Pacote com ID ${packageId} não encontrado.`);
        document.getElementById('package-details-main').innerHTML = '<div class="container"><p>Pacote não encontrado. Verifique o ID e tente novamente.</p></div>';
    }
};