// src/js/services/validator.js
/**
 * UTILITY: ValidatorService
 * Conjunto de funções para validação de campos de formulário e regras de negócio.
 * Responsabilidade: Garantir a conformidade dos dados de entrada.
 */

// REGEX para validação de email (padrão aceitável)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// --- VALIDAÇÕES BÁSICAS (existentes) ---

const isEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    return EMAIL_REGEX.test(email.trim());
};

const isCpfValid = (cpf) => {
    if (!cpf) return false;
    const cleanCpf = cpf.replace(/[^\d]/g, ''); 
    if (cleanCpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;
    return true; 
};

const isPasswordStrong = (password) => {
    if (!password || password.length < 8) return false;
    const hasLetterAndNumber = /(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
    return hasLetterAndNumber;
};

const isMinimumAge = (birthdate, minAge = 18) => {
    if (!birthdate) return false;
    const birthDate = new Date(birthdate);
    const today = new Date();
    const requiredDate = new Date(
        today.getFullYear() - minAge,
        today.getMonth(),
        today.getDate()
    );
    return birthDate <= requiredDate;
};

const isPhoneValid = (phone) => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/[^\d]/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

// --- VALIDAÇÃO DE REGRA DE NEGÓCIO (NOVA) ---

/**
 * Valida os dados de um pacote de viagem.
 * @param {object} data - Objeto com os dados do formulário do pacote.
 * @returns {{isValid: boolean, errors: object}}
 */
const validatePackage = (data) => {
    const errors = {};
    const requiredFields = ['title', 'description', 'price', 'imageUrl', 'location'];

    // 1. Validação de campos obrigatórios
    requiredFields.forEach(field => {
        if (!data[field] || String(data[field]).trim() === '') {
            errors[field] = 'Este campo é obrigatório.';
        }
    });

    // 2. Validação de formato/tipo
    
    // Preço
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) {
        errors.price = 'O preço deve ser um valor numérico positivo.';
    }

    // URL da Imagem (formato básico)
    if (data.imageUrl && !/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(data.imageUrl)) {
         // Validação básica para garantir que pareça uma URL de imagem
        errors.imageUrl = 'URL da imagem inválida (deve ser um link HTTP/HTTPS que termina com extensão de imagem).';
    }

    // Rating (Avaliação)
    const rating = parseFloat(data.rating);
    if (isNaN(rating) || rating < 1.0 || rating > 5.0) {
        errors.rating = 'A avaliação deve ser um número entre 1.0 e 5.0.';
    }

    // 3. Resultado final
    const isValid = Object.keys(errors).length === 0;

    return { isValid, errors };
};


// --- EXPORTAÇÃO CORRIGIDA ---
export const Validator = { // <-- NOME CORRIGIDO PARA 'ValidatorService'
    isEmail,
    isCpfValid,
    isPasswordStrong,
    isMinimumAge,
    isPhoneValid,
    validatePackage // <-- NOVA FUNÇÃO DE VALIDAÇÃO DE PACOTES
};