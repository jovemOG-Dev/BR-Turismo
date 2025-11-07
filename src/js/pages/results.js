import { Package } from '../models/package.js';

// --- Dados Mock (Simulação - Expandido para simular resultados) ---
const getMockPackages = () => ([
    new Package({
        id: 'pkg-004', title: 'Recife: História e Praias',
        description: 'Pacote econômico 4 dias em Olinda/Recife. Inclui City Tour.',
        price: 980.50, 
        // Refatorado: De '../assets/images/mock/recife.jpg' para absoluto
        imageUrl: '/src/assets/images/mock/recife.jpg',
        rating: 4.1, location: 'Recife, PE'
    }),
    new Package({
        id: 'pkg-005', title: 'Foz do Iguaçu: Maravilha Natural',
        description: 'Aéreo + 3 noites com visita às Cataratas e Itaipu.',
        price: 1550.00, 
        // Refatorado: De '../assets/images/mock/foz.jpg' para absoluto
        imageUrl: '/src/assets/images/mock/foz.jpg',
        rating: 4.9, location: 'Foz do Iguaçu, PR'
    }),
    new Package({
        id: 'pkg-006', title: 'Salvador Cultural',
        description: '5 dias no Pelourinho com workshop de Capoeira e Culinária.',
        price: 1300.00, 
        // Refatorado: De '../assets/images/mock/salvador.jpg' para absoluto
        imageUrl: '/src/assets/images/mock/salvador.jpg',
        rating: 4.4, location: 'Salvador, BA'
    })
    // ...
]);

// ... (Resto do código results.js não alterado)