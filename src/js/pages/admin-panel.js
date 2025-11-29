// src/js/pages/admin-panel.js
/**
 * LÓGICA DE PÁGINA: admin-panel.html
 * Responsabilidade: Gerenciar o painel administrativo (CRUD de Pacotes e Usuários).
 */

import { AuthService } from '../services/auth.js';
import { StorageService } from '../services/storage.js';
import { PackageService } from '../services/package.js';
import { Validator } from '../services/validator.js';

// Elementos globais
const mainContent = document.getElementById('panel-content');
const navLinks = document.querySelectorAll('#panel-sidebar .panel-nav-item'); // Alterado para selecionar o LI com data-target
const adminLogoutBtn = document.getElementById('logout-btn');


// --- MOCKS/SIMULAÇÃO DE SERVIÇOS ADMIN (APENAS USUÁRIOS) ---

/**
 * MOCK: Obtém lista de usuários (exceto o próprio admin)
 */
const getMockUsers = (adminUser) => {
    // Busca todos os usuários salvos (simulação)
    const allUsersData = StorageService.get(StorageService.KEYS.USERS, []);
    return allUsersData.filter(u => u.id !== adminUser.id);
};

// --- FUNÇÕES DE UTILITY ---

/**
 * 1. Verifica se o usuário logado tem permissão de Admin.
 */
const checkAdminAccess = () => {
    const adminUser = AuthService.getCurrentUser();

    if (!adminUser || adminUser.role !== 'admin') {
        alert("Acesso negado. Você deve ser um administrador para acessar esta página.");
        window.location.href = 'user-panel.html'; // Redireciona para o login
        return null;
    }

    // Configura o botão de logout
    if (adminLogoutBtn) {
        // Remove o listener anterior para evitar duplicação, embora no DOMContentLoaded não seja estritamente necessário
        adminLogoutBtn.onclick = (e) => {
            e.preventDefault();
            AuthService.logout();
            window.location.href = 'index.html';
        };
    }

    return adminUser;
};

/**
 * Função utilitária para exibir erros de validação no formulário.
 */
const displayFormErrors = (form, errors) => {
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.input-group input, .input-group textarea, .input-group select').forEach(input => {
        input.classList.remove('input-error');
    });

    Object.keys(errors).forEach(key => {
        const input = form.querySelector(`[name="${key}"]`);
        if (input) {
            input.classList.add('input-error');
            const errorElement = document.createElement('p');
            errorElement.className = 'error-message';
            errorElement.style.color = 'var(--color-danger)';
            errorElement.style.fontSize = '0.9em';
            errorElement.textContent = errors[key];
            input.closest('.input-group').appendChild(errorElement);
        }
    });
};

// --- HANDLERS E RENDERS DE PACOTES (CRUD LÓGICA) ---

/**
 * Gerencia a exclusão de um pacote. (FUNÇÃO DELETE)
 * @param {string} id - ID do pacote a excluir.
 */
const handleDeletePackage = (id) => {
    const pkgToDelete = PackageService.getPackageById(id);
    if (!pkgToDelete) {
        alert(`Erro: Pacote ID ${id} não encontrado.`);
        return;
    }

    if (confirm(`Tem certeza que deseja EXCLUIR o pacote: "${pkgToDelete.title}" (ID: ${id})? Essa ação é irreversível.`)) {
        if (PackageService.deletePackage(id)) {
            alert(`Pacote "${pkgToDelete.title}" excluído com sucesso.`);
            handleNavigation('packages'); // Recarrega a lista
        } else {
            alert("Erro ao excluir o pacote.");
        }
    }
};

/**
 * Gerencia o redirecionamento e a renderização do formulário para edição. (FUNÇÃO UPDATE)
 * @param {string} id - ID do pacote a editar.
 */
const handleEditPackage = (id) => {
    const packageToEdit = PackageService.getPackageById(id);
    if (packageToEdit) {
        // Não altera a URL ao ir para o formulário
        renderCreatePackageForm(packageToEdit);
    } else {
        alert(`Pacote com ID ${id} não encontrado.`);
        handleNavigation('packages');
    }
};

/**
 * Gerencia a submissão do formulário de criação/edição de pacotes. (ADAPTADA PARA CREATE/UPDATE)
 * @param {Event} e - Evento de submissão.
 * @param {string | null} packageId - ID do pacote sendo editado, ou null para criação.
 */
const handlePackageFormSubmit = (e, packageId) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // 1. Validação
    const { isValid, errors } = Validator.validatePackage(data);
    displayFormErrors(form, errors);

    if (!isValid) {
        alert("Por favor, corrija os erros no formulário antes de salvar.");
        return;
    }

    // 2. Criação (CREATE) ou Atualização (UPDATE)
    try {
        let title = data.title;

        if (packageId) {
            // Modo UPDATE
            PackageService.updatePackage(packageId, data);
            alert(`Pacote "${title}" (ID: ${packageId}) atualizado com sucesso!`);
        } else {
            // Modo CREATE
            PackageService.createPackage(data);
            alert(`Pacote "${title}" criado com sucesso e salvo no localStorage!`);
            form.reset();
        }

        // 3. Retorna à lista de pacotes após a operação
        // Chama handleNavigation('packages') para atualizar a view e a URL
        handleNavigation('packages');
    } catch (error) {
        console.error("Erro ao salvar pacote:", error);
        alert("Ocorreu um erro ao salvar o pacote. Verifique o console.");
    }
};

/**
 * Renderiza o formulário de criação/edição de pacotes. (ADAPTADA PARA CREATE/UPDATE)
 * @param {Package | null} packageData - Dados do pacote para edição, ou null para criação.
 */
const renderCreatePackageForm = (packageData = null) => {
    const isEditMode = packageData !== null;
    const formTitle = isEditMode ? `Editar Pacote #${packageData.id}` : 'Criar Novo Pacote';
    const submitButtonText = isEditMode ? 'Salvar Alterações' : 'Salvar Novo Pacote';

    const formattedPrice = isEditMode ? packageData.price.toFixed(2) : '';
    const formattedRating = isEditMode ? packageData.rating : '5.0';
    const packageStatus = packageData?.status || 'Ativo';

    // Remove a classe 'active' de todos os itens de navegação ao entrar no formulário
    navLinks.forEach(link => link.classList.remove('active'));


    mainContent.innerHTML = `
        <div class="form-header-actions"> 
        <h2 class="section-title">${formTitle}</h2>
        <a href="#" class="btn btn-secondary btn-sm" data-action="back-to-packages">← Voltar à Lista</a>
    </div>

    <form id="package-form" class="form-component" style="margin-top: var(--space-xl);">
            ${isEditMode ? `<input type="hidden" id="package-id" name="packageId" value="${packageData.id}">` : ''}

            <div class="form-grid">
                <div class="input-group">
                    <label for="title">Título do Pacote *</label>
                    <input type="text" id="title" name="title" required maxlength="100" value="${packageData?.title || ''}">
                </div>
                
                <div class="input-group">
                    <label for="location">Localização (Cidade, UF) *</label>
                    <input type="text" id="location" name="location" required maxlength="50" value="${packageData?.location || ''}">
                </div>

                <div class="input-group">
                    <label for="price">Preço Base (R$) *</label>
                    <input type="number" id="price" name="price" step="0.01" min="0.01" required value="${formattedPrice}">
                </div>
                
                <div class="input-group">
                    <label for="rating">Avaliação Inicial (1.0 a 5.0)</label>
                    <input type="number" id="rating" name="rating" step="0.1" min="1.0" max="5.0" value="${formattedRating}">
                </div>

                <div class="input-group">
                    <label for="status">Status do Pacote *</label>
                    <select id="status" name="status" required>
                        <option value="Ativo" ${packageStatus === 'Ativo' ? 'selected' : ''}>Ativo</option>
                        <option value="Esgotado" ${packageStatus === 'Esgotado' ? 'selected' : ''}>Esgotado</option>
                        <option value="Cancelado" ${packageStatus === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </div>
                
                <div class="input-group full-width">
                    <label for="imageUrl">URL da Imagem *</label>
                    <input type="url" id="imageUrl" name="imageUrl" required value="${packageData?.imageUrl || ''}">
                </div>

                <div class="input-group full-width">
                    <label for="description">Descrição Detalhada *</label>
                    <textarea id="description" name="description" rows="4" required maxlength="500">${packageData?.description || ''}</textarea>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-lg">${submitButtonText}</button>
            </div>
            <p class="disclaimer-text">* Campos obrigatórios.</p>
        </form>
    `;

    // Configura listeners
    document.getElementById('package-form').addEventListener('submit', (e) => {
        handlePackageFormSubmit(e, packageData ? packageData.id : null);
    });

    // O botão de voltar chama a navegação 'packages', mantendo o estado correto na URL.
    document.querySelector('[data-action="back-to-packages"]').addEventListener('click', (e) => {
        e.preventDefault();
        handleNavigation('packages');
    });
};



/**
 * 2. Renderiza a seção de Gerenciamento de Pacotes. (ATUALIZADA PARA READ REAL E LISTENERS CRUD)
 */
const renderPackageManagement = () => {
    // Usa o serviço REAL para obter os pacotes
    const packages = PackageService.getAllPackages();

    const tableRows = packages.map(pkg => {
        let statusClass = 'status-active';
        if (pkg.status === 'Cancelado') statusClass = 'status-danger';
        if (pkg.status === 'Esgotado') statusClass = 'status-warning';

        const formattedPrice = pkg.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        return `
            <tr>
                <td data-label="ID">${pkg.id}</td>
                <td data-label="Título">${pkg.title}</td>
                <td data-label="Local">${pkg.location}</td>
                <td data-label="Preço">${formattedPrice}</td>
                <td data-label="Status"><span class="status-badge ${statusClass}">${pkg.status}</span></td>
                <td data-label="Ações">
    <div class="action-buttons-group">
        <button class="btn btn-secondary btn-sm" data-action="edit-pkg" data-id="${pkg.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-action="delete-pkg" data-id="${pkg.id}">Excluir</button>
    </div>
 </td>
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
    `;
    mainContent.innerHTML = contentHTML;

    // Configura Listeners de Ação (ATUALIZADO PARA CREATE/UPDATE/DELETE)
    mainContent.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            const id = e.currentTarget.dataset.id;

            if (action === 'create-pkg') {
                renderCreatePackageForm();
            } else if (action === 'edit-pkg') {
                handleEditPackage(id);
            } else if (action === 'delete-pkg') {
                handleDeletePackage(id);
            } else {
                alert(`Ação Simulado: ${action} no item ID ${id || ''}`);
            }
        });
    });
};

// --- HANDLERS E RENDERS DE USUÁRIOS (CRUD LÓGICA) ---

/**
 * 3. Renderiza a seção de Gerenciamento de Usuários (MOCK).
 */
const renderUserManagement = (adminUser) => {
    const users = AuthService.getAllUsers();

    const tableRows = users.map(user => {
        return `
            <tr>
                <td data-label="ID">${user.id}</td>
                <td data-label="Nome">${user.name}</td>
                <td data-label="Email">${user.email}</td>
                <td data-label="Perfil">${user.role}</td>
                <td data-label="Ações">
                    <div class="action-buttons-group">
                        <button class="btn btn-secondary btn-sm" data-action="edit-user" data-id="${user.id}">Editar</button>
                        <button class="btn btn-danger btn-sm" data-action="delete-user" data-id="${user.id}">Excluir</button>
                    </div>
                </td>
        `;
    }).join('');

    mainContent.innerHTML = `
        <h2 class="section-title">Gerenciamento de Usuários</h2>
        <p class="disclaimer-text">Simulação: Usuários são lidos do localStorage. Ações de Editar/Bloquear são simuladas.</p>

        <div class="responsive-table-container">
            <table class="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Perfil</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>${tableRows}</tbody>
            </table>
        </div>
    `;

    // Listeners de ações
    mainContent.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.dataset.action;
            const id = e.currentTarget.dataset.id;
            const name = e.currentTarget.dataset.name;

            if (action === 'edit-user') {
                const userToEdit = AuthService.getAllUsers().find(u => u.id === id);
                if (userToEdit) {
                    handleEditUser(userToEdit);
                }
            }

            if (action === 'delete-user') {
                handleDeleteUser(id, name);
            }
        });
    });
};


/**
 * Gerencia a exclusão de um usuário. (FUNÇÃO DELETE - NOVO)
 * @param {string} userId - ID do usuário a excluir.
 * @param {string} userName - Nome do usuário para confirmação.
 */
const handleDeleteUser = (userId, userName) => {
    const adminUser = AuthService.getCurrentUser();

    if (adminUser && adminUser.id === userId) {
        alert("Atenção: Você não pode excluir a si mesmo enquanto estiver logado.");
        return;
    }

    if (confirm(`Tem certeza que deseja EXCLUIR o usuário: "${userName}" (ID: ${userId})? Essa ação é irreversível.`)) {
        if (AuthService.deleteUser(userId)) {
            alert(`Usuário "${userName}" excluído com sucesso.`);
            handleNavigation('users'); // Recarrega a lista
        } else {
            alert("Erro ao excluir o usuário. O ID pode não existir.");
        }
    }
};

/**
 * Gerencia a edição de um usuário (UPDATE via prompt para a Role). (FUNÇÃO UPDATE - NOVO)
 * @param {object} user - Objeto User a ser editado.
 */
const handleEditUser = (user) => {
    const newRole = prompt(`Editando o Perfil (Role) do usuário: ${user.name}\n\nRole atual: ${user.role}\n\nDigite a nova role (admin ou user):`);

    if (newRole === null) return; // Cancelado

    const roleLower = newRole.toLowerCase().trim();
    if (roleLower === 'admin' || roleLower === 'user') {
        // Restrição lógica: O administrador não deve se rebaixar para 'user' via esta interface simples
        const adminUser = AuthService.getCurrentUser();
        if (adminUser.id === user.id && roleLower === 'user') {
            alert("Ação Bloqueada: Você não pode remover suas próprias permissões de administrador através desta interface.");
            return;
        }

        const updatedUser = AuthService.updateUser(user.id, { role: roleLower });

        if (updatedUser) {
            alert(`Perfil do usuário ${user.name} atualizado para: ${updatedUser.role.toUpperCase()}`);
            handleNavigation('users'); // Recarrega a lista
        } else {
            alert("Erro ao atualizar o perfil. O usuário pode não existir.");
        }
    } else {
        alert("Role inválida. Por favor, digite 'admin' ou 'user'.");
    }
};

/**
 * 4. Gerencia a mudança de navegação no painel. (ATUALIZADA)
 * * @param {string} target - O ID da seção a ser carregada (dashboard, packages, users).
 * @param {boolean} updateUrl - Se deve atualizar a URL usando pushState (false em popstate).
 */
const handleNavigation = (target, updateUrl = true) => {
    const adminUser = checkAdminAccess();
    if (!adminUser) return;

    // 1. Marca o link ativo na barra lateral
    navLinks.forEach(link => link.classList.remove('active'));

    const targetElement = document.querySelector(`.panel-nav-item[data-target="${target}"]`);
    if (targetElement) {
        targetElement.classList.add('active');
    }

    // 2. Atualiza a URL (a menos que seja um evento popstate ou o dashboard)
    if (updateUrl) {
        let newUrl = window.location.pathname;
        if (target !== 'dashboard') {
            newUrl += `?view=${target}`;
        }

        // Usa history.pushState para mudar a URL sem recarregar a página
        window.history.pushState({ view: target }, '', newUrl);
    }

    // 3. Renderiza o conteúdo
    switch (target) {
        case 'packages':
            renderPackageManagement();
            break;
        case 'users':
            renderUserManagement(adminUser);
            break;
        case 'dashboard':
            // Dashboard agora usa a contagem REAL de pacotes
            const activePackagesCount = PackageService.getAllPackages().length;
            mainContent.innerHTML = `<h2 class="section-title">Bem-vindo, ${adminUser.name}</h2>
                                     <p>Este é o Painel de Controle Administrativo. Use a navegação lateral para gerenciar Pacotes e Usuários.</p>
                                     <div class="info-card" style="margin-top: var(--space-xl);">
                                        <h3>Pacotes Ativos</h3>
                                        <p style="font-size: 2rem; font-weight: bold;">${activePackagesCount}</p>
                                     </div>`;
            break;
        default:
            // Fallback para dashboard se o target for inválido
            handleNavigation('dashboard');
    }
};

/**
 * 5. Função de inicialização do módulo. (ATUALIZADA)
 */
export const initAdminPanel = () => {
    const adminUser = checkAdminAccess();
    if (!adminUser) return;

    // 1. Configura listeners de navegação lateral
    navLinks.forEach(item => {
        item.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.dataset.target;
            handleNavigation(target); // Chama com updateUrl=true por padrão
        });
    });

    // 2. Configura o listener para o botão de voltar/avançar do navegador
    window.addEventListener('popstate', (event) => {
        const params = new URLSearchParams(window.location.search);
        const target = params.get('view') || 'dashboard';

        // Chama a navegação, mas desabilita a atualização do history/URL
        handleNavigation(target, false);
    });

    // 3. Renderiza a seção padrão ao carregar
    const initialTarget = new URLSearchParams(window.location.search).get('view') || 'dashboard';
    // Chama a navegação com updateUrl=false para não criar uma entrada duplicada no history
    handleNavigation(initialTarget, false);
};