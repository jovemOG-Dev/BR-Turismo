// src/js/pages/admin-panel.js
/**
 * LÓGICA DE PÁGINA: admin-panel.html
 * Responsabilidade: Gerenciar o painel administrativo (CRUD de Pacotes e Usuários).
 */
import { AuthService } from '../services/auth.js';
import { StorageService } from '../services/storage.js';

// --- MOCK/SIMULAÇÃO DE SERVIÇOS ADMIN ---

/**
 * MOCK: Obtém lista de usuários (exceto o próprio admin)
 */
const getMockUsers = (adminUser) => {
    // Busca todos os usuários salvos (simulação)
    const allUsersData = StorageService.get(StorageService.KEYS.USERS, []);
    return allUsersData.filter(u => u.id !== adminUser.id);
};

/**
 * MOCK: Obtém uma lista simulada de pacotes.
 */
const getMockPackages = () => ([
    { id: 'pkg-001', title: 'Praias do Nordeste', price: 1899.90, location: 'Maceió, AL', status: 'Ativo' },
    { id: 'pkg-002', title: 'Serra Gaúcha Romântica', price: 2450.00, location: 'Gramado, RS', status: 'Ativo' },
    { id: 'pkg-003', title: 'Aventura na Amazônia', price: 1200.00, location: 'Manaus, AM', status: 'Rascunho' },
    { id: 'pkg-007', title: 'Pantanal Selvagem', price: 3500.00, location: 'Cuiabá, MT', status: 'Inativo' },
]);

// --- ELEMENTOS DOM E LÓGICA PRINCIPAL ---

const mainContent = document.getElementById('panel-content');
const navLinks = document.querySelectorAll('.panel-nav-item');

/**
 * 1. Protege a rota: redireciona se não for ADMIN.
 * @returns {object|null} Usuário ADMIN logado ou null.
 */
const checkAdminAccess = () => {
    const user = AuthService.getCurrentUser();
    if (!user || !user.isAdmin) {
        alert("Acesso Negado: Você não tem permissão de administrador.");
        window.location.href = '/login.html';
        return null;
    }
    return user;
};

/**
 * 2. Renderiza a seção de Gerenciamento de Pacotes.
 */
const renderPackageManagement = () => {
    const packages = getMockPackages();
    
    const tableRows = packages.map(pkg => {
        const statusClass = pkg.status === 'Ativo' ? 'status-success' : 
                            pkg.status === 'Inativo' ? 'status-danger' : 'status-warning';
        const formattedPrice = pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return `
            <tr>
                <td data-label="ID">${pkg.id}</td>
                <td data-label="Título">${pkg.title}</td>
                <td data-label="Local">${pkg.location}</td>
                <td data-label="Preço">${formattedPrice}</td>
                <td data-label="Status"><span class="status-badge ${statusClass}">${pkg.status}</span></td>
                <td data-label="Ações">
                    <button class="btn btn-secondary btn-sm" data-action="edit-pkg" data-id="${pkg.id}">Editar</button>
                    <button class="btn btn-danger btn-sm" data-action="delete-pkg" data-id="${pkg.id}">Excluir</button>
                </td>
            </tr>
        `;
    }).join('');

    const contentHTML = `
        <h2 class="section-title">Gerenciamento de Pacotes de Viagem</h2>
        <div class="header-actions" style="margin-bottom: var(--space-xl);">
            <button class="btn btn-primary" data-action="create-pkg">Adicionar Novo Pacote</button>
        </div>

        <div class="responsive-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Local</th>
                        <th>Preço Base</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
        <p class="disclaimer-text" style="margin-top: var(--space-md);">Ações de CRUD são simuladas.</p>
    `;
    mainContent.innerHTML = contentHTML;
    
    // Simulação de Listeners
    mainContent.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            const id = e.currentTarget.dataset.id;
            alert(`Ação Simulado: ${action} no item ID ${id || ''}`);
        });
    });
};

/**
 * 3. Renderiza a seção de Gerenciamento de Usuários.
 */
const renderUserManagement = (adminUser) => {
    const users = getMockUsers(adminUser);
    
    const tableRows = users.map(user => {
        return `
            <tr>
                <td data-label="Nome">${user.name}</td>
                <td data-label="Email">${user.email}</td>
                <td data-label="Membro Desde">${new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
                <td data-label="Ações">
                    <button class="btn btn-secondary btn-sm" data-action="reset-pwd" data-id="${user.id}">Resetar Senha</button>
                    <button class="btn btn-danger btn-sm" data-action="delete-user" data-id="${user.id}">Deletar</button>
                </td>
            </tr>
        `;
    }).join('');

    const contentHTML = `
        <h2 class="section-title">Usuários Cadastrados</h2>

        <div class="responsive-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Membro Desde</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
        <p class="disclaimer-text" style="margin-top: var(--space-md);">O único usuário não listado é você (Admin Demo).</p>
    `;
    mainContent.innerHTML = contentHTML;
};

/**
 * 4. Gerencia a mudança de navegação no painel.
 */
const handleNavigation = (target) => {
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector(`[data-target="${target}"]`).classList.add('active');

    const adminUser = checkAdminAccess();
    if (!adminUser) return;

    switch (target) {
        case 'packages':
            renderPackageManagement();
            break;
        case 'users':
            renderUserManagement(adminUser);
            break;
        case 'dashboard':
            // Simples dashboard de boas-vindas
            mainContent.innerHTML = `<h2 class="section-title">Bem-vindo, ${adminUser.name}</h2>
                                     <p>Este é o Painel de Controle Administrativo. Use a navegação lateral para gerenciar Pacotes e Usuários.</p>
                                     <div class="info-card" style="margin-top: var(--space-xl);">
                                        <h3>Pacotes Ativos</h3>
                                        <p style="font-size: 2rem; font-weight: bold;">3</p>
                                     </div>`;
            break;
        default:
            handleNavigation('dashboard');
    }
};

/**
 * 5. Função de inicialização do módulo.
 */
export const initAdminPanel = () => {
    const adminUser = checkAdminAccess();
    if (!adminUser) return;
    
    // Configura listeners de navegação lateral
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.currentTarget.dataset.target;
            handleNavigation(target);
        });
    });

    // Renderiza a seção padrão ao carregar (Dashboard)
    const initialTarget = new URLSearchParams(window.location.search).get('view') || 'dashboard';
    handleNavigation(initialTarget);
};