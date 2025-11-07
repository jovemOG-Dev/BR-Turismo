/**
 * UTILITY: Validator
 * Conjunto de funções para validação de campos de formulário e regras de negócio.
 * Responsabilidade: Garantir a conformidade dos dados de entrada.
 */

// REGEX para validação de email (padrão aceitável)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida se a string é um e-mail válido.
 * @param {string} email
 * @returns {boolean}
 */
const isEmail = (email) => {
    if (!email || typeof email !== 'string') return false;
    return EMAIL_REGEX.test(email.trim());
};

/**
 * SIMULAÇÃO de Validação de CPF (Formato e estrutura básica).
 * Nota: A validação completa de CPF exige algoritmo complexo e não é 100% segura
 * no lado do cliente. Aqui, focamos na formatação e no tamanho.
 * @param {string} cpf - CPF com ou sem máscara (apenas dígitos).
 * @returns {boolean}
 */
const isCpfValid = (cpf) => {
    if (!cpf) return false;
    const cleanCpf = cpf.replace(/[^\d]/g, ''); // Remove todos os não-dígitos
    
    // Regra 1: Deve ter exatamente 11 dígitos
    if (cleanCpf.length !== 11) return false;
    
    // Regra 2: Evita sequências óbvias (ex: 111.111.111-11)
    if (/^(\d)\1{10}$/.test(cleanCpf)) return false;

    // Em um MVP estático, paramos aqui. Uma validação real envolveria o cálculo dos dígitos verificadores.
    return true; 
};

/**
 * Valida se a senha atende a um requisito mínimo de segurança.
 * Requisito WCAG: Senhas não devem exigir caracteres especiais de forma arbitrária.
 * @param {string} password
 * @returns {boolean}
 */
const isPasswordStrong = (password) => {
    // Requisito Mínimo: 8 caracteres de comprimento
    if (!password || password.length < 8) {
        return false;
    }
    // Adicionar outros requisitos, se necessário (ex: ter letra e número)
    const hasLetterAndNumber = /(?=.*[a-zA-Z])(?=.*[0-9])/.test(password);
    return hasLetterAndNumber;
};

/**
 * Valida se a data de nascimento implica uma idade mínima (ex: 18 anos).
 * @param {string} birthdate - Data no formato AAAA-MM-DD.
 * @param {number} minAge - Idade mínima exigida.
 * @returns {boolean}
 */
const isMinimumAge = (birthdate, minAge = 18) => {
    if (!birthdate) return false;
    
    const birthDate = new Date(birthdate);
    const today = new Date();
    
    // Calcula a data que a pessoa precisa ter para ter a idade mínima hoje
    const requiredDate = new Date(
        today.getFullYear() - minAge,
        today.getMonth(),
        today.getDate()
    );

    // Se a data de nascimento for anterior ou igual à data requerida, a idade é válida.
    return birthDate <= requiredDate;
};

/**
 * Valida o formato e tamanho do número de telefone (simples).
 * @param {string} phone - Telefone com ou sem máscara.
 * @returns {boolean}
 */
const isPhoneValid = (phone) => {
    if (!phone) return false;
    const cleanPhone = phone.replace(/[^\d]/g, '');
    // Aceita 10 (cidade + 8/9 dígitos) ou 11 dígitos (incluindo DDD e 9º dígito)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
};

export const Validator = {
    isEmail,
    isCpfValid,
    isPasswordStrong,
    isMinimumAge,
    isPhoneValid
};