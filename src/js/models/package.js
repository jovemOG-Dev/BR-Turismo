/**
 * MODELO: Package
 * Representa um pacote de viagem.
 */
export class Package {
    constructor({ id, title, description, price, imageUrl, rating, location }) {
        this.id = id || `pkg-${Date.now()}`;
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.rating = rating; // 1 a 5 estrelas
        this.location = location;
    }
}