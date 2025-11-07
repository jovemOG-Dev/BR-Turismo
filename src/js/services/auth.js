/**
 * SERVIÇO: AuthServiceSimulated
 * Simulação de Autenticação e Gestão de Sessão (MVP Estático).
 * AVISO: A segurança é completamente comprometida.
 */
import { StorageService } from './storage.js';
import { User } from '../models/user.js';
// O módulo de validação (validator.js) será usado aqui, mas ainda não foi criado.
// import { Validator } from '../utils/validator.js'; 

const USER_STORAGE_KEY = StorageService.KEYS.USERS;
const SESSION_STORAGE_KEY = StorageService.KEYS.SESSION;

/**
 * Obtém todos os usuários simulados (apenas para a simulação de login/cadastro).
 * Em produção, essa lista nunca estaria no cliente.
 * @returns {User[]} Lista de objetos User.
 */
const getAllUsers = () => {
    const usersData = StorageService.get(USER_STORAGE_KEY, []);
    return usersData.map(data => new User(data));
};

/**
 * Salva a lista completa de usuários simulados.
 * @param {User[]} users - Lista de usuários.
 */
const saveAllUsers = (users) => {
    StorageService.set(USER_STORAGE_KEY, users);
};

/**
 * SIMULAÇÃO de Login.
 * @param {string} email - Email do usuário.
 * @param {string} password - Senha (não hashada no cliente para simplificar).
 * @returns {object|null} Objeto de usuário logado ou null.
 */
const login = (email, password) => {
    const users = getAllUsers();
    
    // Alerta de Limitação do MVP
    console.warn("Autenticação SIMULADA. Senha e login NÃO são seguros.");
    
    const user = users.find(u => u.email === email && u.passwordHash === password);

    if (user) {
        // Persiste o estado da sessão (simulando um token/cookie)
        StorageService.set(SESSION_STORAGE_KEY, user.getPublicData()); 
        return user.getPublicData();
    }
    return null;
};

/**
 * SIMULAÇÃO de Cadastro (Cria um novo usuário e persiste localmente).
 * @param {object} userData - Dados de registro (name, email, password, etc.).
 * @returns {User|null} Novo objeto de usuário ou null em caso de erro.
 */
const register = (userData) => {
    // **NOTA DE GAP:** Aqui é onde o Validator.js entraria.
    
    const users = getAllUsers();
    
    if (users.some(u => u.email === userData.email)) {
        console.error("Email já cadastrado.");
        return null;
    }

    // Cria um novo usuário (usando a senha como "hash" simulado)
    const newUser = new User({
        ...userData,
        passwordHash: userData.password // Simulação de hash simples
    });

    users.push(newUser);
    saveAllUsers(users);
    
    // Loga o usuário após o cadastro
    return login(newUser.email, newUser.passwordHash);
};

/**
 * Desloga o usuário e limpa a sessão.
 */
const logout = () => {
    StorageService.remove(SESSION_STORAGE_KEY);
};

/**
 * Verifica se há um usuário na sessão.
 * @returns {object|null} Dados públicos do usuário logado ou null.
 */
const getCurrentUser = () => {
    return StorageService.get(SESSION_STORAGE_KEY);
};

/**
 * Inicializa um usuário ADMIN mock (se não existir) para fins de demonstração.
 */
const initMockUsers = () => {
    const users = getAllUsers();
    if (!users.some(u => u.isAdmin)) {
        const adminUser = new User({
            id: 'admin-001',
            name: 'Admin Demo',
            email: 'admin@brturismo.com',
            cpf: '00000000000',
            phone: '99999999999',
            birthdate: '1980-01-01',
            passwordHash: 'admin123', // Senha de demonstração
            isAdmin: true
        });
        users.push(adminUser);
        saveAllUsers(users);
        console.log("Usuário Admin de demonstração criado: admin@brturismo.com / admin123");
    }
};

// Garante que o usuário mock exista ao carregar o script
initMockUsers();


export const AuthService = {
    login,
    register,
    logout,
    getCurrentUser
};