// src/js/models/user.js

/**
 * MODELO: User
 * Representa a estrutura básica de um usuário (para fins de simulação).
 * ATUALIZADO: Adicionadas as propriedades 'role' e 'active' para suportar 
 * a lógica de permissão e status do AuthService e Admin Panel.
 */
export class User {
    // Adicionamos 'role' e 'active' no desestruturamento para capturar as propriedades passadas.
    constructor({ 
        id, 
        name, 
        email, 
        cpf, 
        phone, 
        birthdate, 
        passwordHash = null, 
        isAdmin = false,
        role = 'user', // <-- NOVO: Define o papel padrão como 'user'
        active = true  // <-- NOVO: Define o status padrão como ativo
    }) {
        this.id = id || `user-${Date.now()}`;
        this.name = name;
        this.email = email;
        this.cpf = cpf; 
        this.phone = phone;
        this.birthdate = birthdate;
        this.passwordHash = passwordHash; 

        // Se 'role' for passado (como 'admin' no AuthService), ele será usado.
        // Caso contrário, ele usa o padrão 'user'.
        this.role = role; 
        
        // Mantemos 'isAdmin' para compatibilidade, mas usamos 'role' como a fonte de verdade.
        // Se a role for 'admin', isAdmin é true.
        this.isAdmin = this.role === 'admin'; 

        this.active = active; // <-- NOVO: Propriedade usada no login do AuthService.
        this.createdAt = new Date().toISOString();
    }

    // Método para garantir que dados sensíveis não sejam expostos
    getPublicData() {
        return {
            id: this.id,
            name: this.name,
            cpf: this.cpf,
            email: this.email,
            role: this.role, // <-- CRUCIAL: Retorna a função de permissão
            isAdmin: this.isAdmin,
            active: this.active
        };
    }
}