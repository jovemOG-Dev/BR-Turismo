/**
 * MODELO: User
 * Representa a estrutura básica de um usuário (para fins de simulação).
 */
export class User {
    constructor({ id, name, email, cpf, phone, birthdate, passwordHash = null, isAdmin = false }) {
        this.id = id || `user-${Date.now()}`;
        this.name = name;
        this.email = email;
        this.cpf = cpf; // CPF será validado
        this.phone = phone;
        this.birthdate = birthdate;
        this.passwordHash = passwordHash; // Hash simulado (em um cenário real, nunca estaria no cliente)
        this.isAdmin = isAdmin;
        this.createdAt = new Date().toISOString();
    }

    // Método para garantir que dados sensíveis não sejam expostos
    getPublicData() {
        return {
            id: this.id,
            name: this.name,
            cpf: this.cpf,
            email: this.email,
            isAdmin: this.isAdmin
        };
    }
}