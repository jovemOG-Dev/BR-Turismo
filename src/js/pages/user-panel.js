// src/js/pages/user-panel.js
/**
 * LÓGICA DE PÁGINA: user-panel.html
 * Responsabilidade: Exibir dados do usuário logado e gerenciar as seções do painel.
 */
import { AuthService } from '../services/auth.js';
// Importação simulada para dados de pedidos
// Em um projeto real, haveria um OrderService
const MOCK_ORDER_HISTORY = [
    { id: 'ORD-202301', date: '10/01/2023', total: 2500.00, status: 'Concluído', packageTitle: 'Serra Gaúcha Romântica' },
    { id: 'ORD-202305', date: '22/05/2023', total: 1150.00, status: 'Cancelado', packageTitle: 'Recife: História e Praias' },
    { id: 'ORD-202403', date: '05/03/2024', total: 3899.80, status: 'Pendente', packageTitle: 'Praias do Nordeste: Maceió Fantástica' },
];

// Elementos DOM
const mainContent = document.getElementById('panel-content');
const navLinks = document.querySelectorAll('.panel-nav-item');

/**
 * 1. Protege a rota: redireciona se não estiver logado.
 * @returns {object|null} Usuário logado ou null.
 */
const checkAuthentication = () => {
    const user = AuthService.getCurrentUser();
    if (!user) {
        alert("Acesso Negado: Faça login para acessar o painel.");
        window.location.href = '/login.html?redirect=/user-panel.html';
        return null;
    }
    return user;
};

/**
 * 2. Renderiza a seção Perfil do Usuário.
 * @param {object} user - Dados públicos do usuário.
 */
const renderUserProfile = (user) => {
    const contentHTML = `
        <h2 class="section-title">Meu Perfil</h2>
        
        <div class="user-info-grid">
            <div class="info-card">
                <h3>Nome Completo</h3>
                <p>${user.name}</p>
            </div>
            <div class="info-card">
                <h3>Email</h3>
                <p>${user.email}</p>
            </div>
            <div class="info-card">
                <h3>CPF (Simulado)</h3>
                <p>${user.cpf || 'Não informado'}</p>
            </div>
            <div class="info-card">
                <h3>Membro Desde</h3>
                <p>${new Date(user.createdAt || Date.now()).toLocaleDateString('pt-BR')}</p>
            </div>
        </div>
        
        <button class="btn btn-secondary" style="margin-top: var(--space-xl);">
            Editar Informações (Simulação)
        </button>
    `;
    mainContent.innerHTML = contentHTML;
};

/**
 * 3. Renderiza a seção Histórico de Pedidos.
 */
const renderOrderHistory = () => {
    const tableRows = MOCK_ORDER_HISTORY.map(order => {
        const statusClass = order.status === 'Concluído' ? 'status-success' : 
                            order.status === 'Cancelado' ? 'status-danger' : 'status-warning';
        const formattedTotal = order.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return `
            <tr>
                <td data-label="ID">${order.id}</td>
                <td data-label="Pacote">${order.packageTitle}</td>
                <td data-label="Data">${order.date}</td>
                <td data-label="Total">${formattedTotal}</td>
                <td data-label="Status"><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td data-label="Ação"><a href="#" class="action-link">Ver Detalhes</a></td>
            </tr>
        `;
    }).join('');

    const contentHTML = `
        <h2 class="section-title">Meus Pedidos</h2>
        <div class="responsive-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Pacote</th>
                        <th>Data</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
        </div>
        <p class="disclaimer-text" style="margin-top: var(--space-md);">O histórico é simulado.</p>
    `;
    mainContent.innerHTML = contentHTML;
};

/**
 * 4. Renderiza a seção Configurações.
 */
const renderSettings = () => {
    const contentHTML = `
        <h2 class="section-title">Configurações e Segurança</h2>
        <p>Aqui o usuário poderia alterar a senha, gerenciar notificações e excluir a conta.</p>
        
        <div class="settings-group">
            <h3>Segurança</h3>
            <button class="btn btn-secondary">Alterar Senha (Simulação)</button>
            <button class="btn btn-danger" style="margin-top: var(--space-md);">Excluir Conta (Simulação)</button>
        </div>
    `;
    mainContent.innerHTML = contentHTML;
};

/**
 * 5. Gerencia a mudança de navegação no painel.
 */
const handleNavigation = (target) => {
    // 5.1 Remove a classe ativa de todos os links e adiciona ao link clicado
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-target="${target}"]`).classList.add('active');

    // 5.2 Chama a função de renderização correta
    const user = AuthService.getCurrentUser();
    if (!user) return; // Não deve acontecer devido ao checkAuthentication

    switch (target) {
        case 'profile':
            renderUserProfile(user);
            break;
        case 'orders':
            renderOrderHistory();
            break;
        case 'settings':
            renderSettings();
            break;
        default:
            renderUserProfile(user);
    }
};

/**
 * 6. Função de inicialização do módulo.
 */
export const initUserPanel = () => {
    const user = checkAuthentication();
    if (!user) return;

    // Configura listeners de navegação lateral
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.dataset.target;
            handleNavigation(target);
        });
    });

    // Renderiza a seção padrão ao carregar (Perfil)
    const initialTarget = new URLSearchParams(window.location.search).get('view') || 'profile';
    handleNavigation(initialTarget);
};