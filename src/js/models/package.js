/**
 * MODELO: Package
 * Representa um pacote de viagem.
 */
export class Package {
    /**
     * Modelo de Pacote de Viagem.
     * @param {object} data - Dados para popular o pacote.
     * @param {string} data.description - Descrição breve (para listagem/cards).
     * @param {string} data.detailsDescription - Descrição detalhada (para details.html). 
     * @param {Array<object>} data.reviews - Array de avaliações de clientes. // NOVO
     */
    constructor({ 
        id, 
        title, 
        description, 
        price, 
        imageUrl, 
        rating, 
        location, 
        status = 'Ativo', 
        details = { inclusions: [], itinerary: [] }, 
        detailsDescription, 
        reviews = [] // NOVO: Adicionado 'reviews' com default array vazio
    }) {
        this.id = id || `pkg-${Date.now()}`;
        this.title = title;
        this.description = description;
        this.detailsDescription = detailsDescription;
        this.price = price;
        this.imageUrl = imageUrl;
        this.rating = rating; // 1 a 5 estrelas
        this.location = location;
        this.status = status || 'Ativo'; // disponível, esgotado, ativo
        this.details = details;
        this.reviews = reviews;
    }
}