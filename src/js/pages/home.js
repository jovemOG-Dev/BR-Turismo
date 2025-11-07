import { Package } from '../models/package.js';

// --- Dados Mock (Simulação) ---
const mockPackages = [
    new Package({
        id: 'pkg-001',
        title: 'Praias do Nordeste',
        description: '7 dias em Maceió com aéreo e hotel. Inclui café da manhã.',
        price: 1899.90,
        // Refatorado: De '../assets/images/mock/maceio.jpg' para absoluto
        imageUrl: '/src/assets/images/mock/maceio.jpg', 
        rating: 4.5,
        location: 'Maceió, AL'
    }),
    new Package({
        id: 'pkg-002',
        title: 'Serra Gaúcha Romântica',
        description: 'Pacote de 5 dias em Gramado e Canela. Inclui traslado e passeios.',
        price: 2450.00,
        // Refatorado: De '../assets/images/mock/gramado.jpg' para absoluto
        imageUrl: '/src/assets/images/mock/gramado.jpg', 
        rating: 4.8,
        location: 'Gramado, RS'
    }),
    new Package({
        id: 'pkg-003',
        title: 'Aventura na Amazônia',
        description: '3 dias e 2 noites em Lodge na floresta, Manaus. Pensão completa.',
        price: 1200.00,
        // Refatorado: De '../assets/images/mock/amazonia.jpg' para absoluto
        imageUrl: '/src/assets/images/mock/amazonia.jpg', 
        rating: 4.2,
        location: 'Manaus, AM'
    })
    // ... (restante do código home.js)
];

// ... (Resto do código home.js não alterado, exceto pelas URLs)