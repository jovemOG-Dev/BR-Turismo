// src/js/pages/details.js
/**
 * LÓGICA DE PÁGINA: details.html
 * Responsabilidade: Ler o ID do pacote na URL, buscar o pacote, renderizar os detalhes
 * e permitir a adição ao carrinho via CartService.
 */
import { PackageService } from '../services/package.js';
import { CartService } from '../services/cart.js';

// Elementos DOM
const packageDetailsContainer = document.getElementById('package-details-main');

const renderStars = (rating) => {
    const fullStar = '★'; 
    const emptyStar = '☆';
    const floorRating = Math.floor(rating);
    const remainder = rating - floorRating;
    
    let stars = fullStar.repeat(floorRating);
    stars += emptyStar.repeat(5 - floorRating);
    
    return stars;
};

/**
 * 1. Renderiza os detalhes do pacote na página.
 * @param {Package} pkg - O objeto Package a ser renderizado.
 */
const renderPackageDetails = (pkg) => {
    // Atualiza o título da página
    document.getElementById('page-title').textContent = `${pkg.title} | BR Turismo`;

    const combinedListItems = [
        // Seções de Inclusão
        ...(pkg.details?.inclusions?.length > 0 ? [`<li class="list-title"><strong>✅ O que está incluso:</strong></li>`] : []),
        ...(pkg.details?.inclusions || []).map(item => `<li>${item}</li>`),

        // Seções de Roteiro
        ...(pkg.details?.itinerary?.length > 0 ? [`<li class="list-title" style="margin-top: 10px;"><strong>🗺️ Roteiro / Detalhes do Dia:</strong></li>`] : []),
        ...(pkg.details?.itinerary || []).map(item => `<li>${item}</li>`)
    ].join('');

    const reviewList = (pkg.reviews?.length > 0 ? pkg.reviews : [
        { name: "Sistema", rating: pkg.rating || 5.0, comment: "Pacote novo. Nenhuma avaliação de cliente disponível ainda." }
    ]).map(review => {
        const stars = renderStars(review.rating);
        return `<p>${stars} "${review.comment}" - ${review.name}</p>`;
    }).join('');

    // Renderiza o conteúdo principal, INCLUINDO os placeholders para Inclusões/Exclusões
    packageDetailsContainer.innerHTML = `
        <div class="container package-details-layout">
            <section id="package-info" aria-labelledby="package-title">

                <div class="details-header">
                    <h1 id="package-title">${pkg.title}</h1>
                    <div id="package-rating" class="rating-display">
                        Avaliação: ${renderStars(pkg.rating)} (${pkg.rating.toFixed(1)})
                    </div>
                </div>

                <div class="details-content-wrapper">

                    <article id="package-content" class="package-main-info">

                        <h2>Sobre o Destino e o Pacote</h2>
                        <p id="package-description" class="lead-description">
                            ${pkg.detailsDescription || pkg.description}
                        </p>

                        <div class="main-image-wrapper">
                            <img id="package-main-image" src="${pkg.imageUrl}" alt="Imagem de ${pkg.title}" width="1000" height="600"
                                loading="eager">
                        </div>

                        <h3>Inclusões e Roteiro</h3>
                        <ul id="package-inclusions" class="feature-list">
                            ${combinedListItems || '<li>Nenhum detalhe de inclusão ou roteiro fornecido.</li>'}
                        </ul>

                        <h3>Avaliações de Clientes</h3>
                        <div id="customer-reviews">
                            ${reviewList}
                        </div>
                    </article>

                    <aside id="booking-sidebar" class="booking-aside" aria-label="Opções de Reserva">
                        <h3>Reserve seu Pacote</h3>

                        <form id="booking-form">
                            <div class="price-box">
                                <p class="starting-price">Preço por pessoa a partir de:</p>
                                <span id="package-price" class="price-highlight">${pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>

                            <div class="form-group-grid">
                                <div class="form-group">
                                    <label for="checkin-date">Check-in:</label>
                                    <input type="date" id="checkin-date" required>
                                </div>
                                <div class="form-group">
                                    <label for="checkout-date">Check-out:</label>
                                    <input type="date" id="checkout-date" required>
                                </div>
                            </div>
                            
                            <div class="travelers-fields" style="margin-top: 15px;">
                                <h4>Viajantes e Quartos</h4>
                                <div class="form-group-grid">
                                    <div class="form-group">
                                        <label for="travelers-adults">Adultos (1+):</label>
                                        <input type="number" id="travelers-adults" min="1" max="99" value="1" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="travelers-children">Crianças (0-4):</label>
                                        <input type="number" id="travelers-children" min="0" max="4" value="0" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="rooms-count">Quartos (1-4):</label>
                                        <input type="number" id="rooms-count" min="1" max="4" value="1" required>
                                    </div>
                                </div>
                            </div>

                            <p class="final-price-summary">Total Estimado: <strong id="total-estimated-price">R$ 0,00</strong></p>

                            <button type="submit" id="add-to-cart-btn" class="btn btn-primary btn-lg btn-block" disabled>
                                Preencha os dados
                            </button>
                            
                            <p id="status-message" class="disclaimer-text" style="text-align: center; margin-top: 10px;"></p>

                            <p class="disclaimer-text">
                                ⚠️ Reserva simulada. Nenhum pagamento real será processado.
                            </p>
                        </form>
                    </aside>
                </div>
            </section>
        </div>
    `;
    
    // Re-selecionar os elementos após a renderização do HTML
    const bookingForm = document.getElementById('booking-form');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const travelersInput = document.getElementById('travelers-count');
    const dateInput = document.getElementById('departure-date');
    
    const adultsInput = document.getElementById('travelers-adults'); 
    const childrenInput = document.getElementById('travelers-children'); 
    const roomsInput = document.getElementById('rooms-count'); 
    const checkinInput = document.getElementById('checkin-date'); 
    const checkoutInput = document.getElementById('checkout-date');

    /**
     * LÓGICA: Atualiza o preço total estimado.
     */
    const updatePrice = () => {
        const adults = parseInt(adultsInput.value) || 1;
        const children = parseInt(childrenInput.value) || 0;
        const totalTravelers = adults + children; // Total de viajantes para cálculo
        
        const total = pkg.price * totalTravelers;
        document.getElementById('total-estimated-price').textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };
    /**
     * LÓGICA: Valida e habilita o botão de adicionar ao carrinho.
     * O botão só é habilitado se houver data e N° de viajantes > 0.
     */
    const checkFormValidity = () => {
        const checkinDate = checkinInput.value;
        const checkoutDate = checkoutInput.value;
        
        const checkinIsValid = checkinDate !== '';
        const checkoutIsValid = checkoutDate !== '';

        // 1. Validação de Data: Check-out deve ser estritamente após Check-in
        let datesAreValid = false;
        if (checkinIsValid && checkoutIsValid) {
            datesAreValid = new Date(checkoutDate) > new Date(checkinDate);
        }

        // 2. Validação de Viajantes/Quartos: Min 1 adulto e min 1 quarto
        const adults = parseInt(adultsInput.value);
        const rooms = parseInt(roomsInput.value);
        const travelersAndRoomsAreValid = adults >= 1 && rooms >= 1;
        
        const isValid = datesAreValid && travelersAndRoomsAreValid;

        addToCartBtn.disabled = !isValid;
        addToCartBtn.textContent = addToCartBtn.disabled ? 'Preencha os dados' : 'Adicionar ao Carrinho';
        
        const statusMessage = document.getElementById('status-message');
        
        // Exibir erro específico
        if (checkinIsValid && checkoutIsValid && !datesAreValid) {
            statusMessage.style.color = 'var(--color-danger)';
            statusMessage.textContent = '❌ Check-out deve ser após Check-in.';
        } else {
            statusMessage.textContent = ''; // Limpa a mensagem se estiver válido ou incompleto
        }
    };

    /**
     * HANDLER: Adiciona o item ao carrinho.
     */
    const handleAddToCart = (e) => {
        e.preventDefault();
        
        if (addToCartBtn.disabled) return; // Evita submissão se o botão estiver desabilitado

        const adults = parseInt(adultsInput.value);
        const children = parseInt(childrenInput.value);
        const rooms = parseInt(roomsInput.value);
        const checkinDate = checkinInput.value; 
        const checkoutDate = checkoutInput.value; 
        const statusMessage = document.getElementById('status-message');

        if (pkg.status !== 'Ativo') {
            statusMessage.style.color = 'var(--color-danger)';
            document.getElementById('status-message').textContent = 'Este pacote não está disponível para reserva no momento.';
            return;
        }

        try {
            // 1. Chamar o CartService.addItem com os detalhes necessários
            const cartItemDetails = {
                id: Date.now().toString(), // ID único para o item no carrinho
                packageId: pkg.id,
                title: pkg.title,
                location: pkg.location,
                imageUrl: pkg.imageUrl,
                
                // NOVOS DADOS DE RESERVA
                checkinDate: checkinDate, 
                checkoutDate: checkoutDate,
                adults: adults,
                children: children,
                rooms: rooms,
                
                pricePerTraveler: pkg.price,
                travelers: adults + children, // Total de viajantes para cálculo
            };
            
            CartService.addItem(cartItemDetails);
            
            // 2. Feedback e redirecionamento
            statusMessage.style.color = 'var(--color-success)';
            statusMessage.textContent = '✅ Pacote adicionado ao carrinho com sucesso! Redirecionando...';
            
            // Redireciona para o carrinho após um pequeno atraso
            setTimeout(() => {
                window.location.href = 'cart.html';
            }, 800);

        } catch (error) {
            console.error('Erro ao adicionar item ao carrinho:', error);
            statusMessage.style.color = 'var(--color-danger)';
            statusMessage.textContent = '❌ Erro ao adicionar pacote. Tente novamente.';
        }
    };
    
    // Configura Listeners de Evento
    adultsInput.addEventListener('input', updatePrice);
    adultsInput.addEventListener('input', checkFormValidity);
    childrenInput.addEventListener('input', updatePrice);
    childrenInput.addEventListener('input', checkFormValidity);
    roomsInput.addEventListener('input', checkFormValidity); 
    checkinInput.addEventListener('change', checkFormValidity);
    checkoutInput.addEventListener('change', checkFormValidity);
    bookingForm.addEventListener('submit', handleAddToCart);
    
    // Inicializa o estado do formulário:
    // 1. Garante que o input de data comece a partir de hoje
    const today = new Date().toISOString().split('T')[0];
    checkinInput.min = today;
    checkoutInput.min = today;
    // 2. Verifica a validade inicial
    checkFormValidity();
    updatePrice();
};


/**
 * 3. Inicializa a página: Lê a URL e chama a renderização.
 */
export const initDetailsPage = () => {
    // 1. Obtém o ID do pacote da URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');

    if (!packageId) {
        // Trata erro de ID não encontrado
        document.getElementById('package-details-main').innerHTML = '<div class="container"><h2 class="section-title">Erro 404</h2><p>Pacote não especificado. Retorne à página de <a href="/results.html">Pacotes</a>.</p></div>';
        return;
    }

    // 2. Busca o pacote usando o PackageService
    const pkg = PackageService.getPackageById(packageId);

    if (pkg) {
        renderPackageDetails(pkg);
    } else {
        // Trata erro de pacote não encontrado
        document.getElementById('package-details-main').innerHTML = `<div class="container"><h2 class="section-title">Pacote Não Encontrado</h2><p>O pacote com ID <strong>${packageId}</strong> não foi encontrado. Retorne à página de <a href="/results.html">Pacotes</a>.</p></div>`;
    }
};