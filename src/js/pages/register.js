/**
 * MÓDULO PÁGINA: Register
 * Lógica para o formulário de cadastro (register.html).
 * Responsabilidade: Coleta de dados, validação de front-end e chamada de serviço.
 */

import { Validator } from '../services/validator.js';
import { AuthService } from '../services/auth.js';

// Elementos DOM
const form = document.getElementById('register-form');
const nameInput = document.getElementById('register-name');
const emailInput = document.getElementById('register-email');
const cpfInput = document.getElementById('register-cpf');
const phoneInput = document.getElementById('register-phone');
const birthdateInput = document.getElementById('register-birthdate');
const passwordInput = document.getElementById('register-password');
const confirmPasswordInput = document.getElementById('register-confirm-password');
const globalError = document.getElementById('register-error');

/**
 * Exibe ou oculta o feedback visual de erro para um campo.
 * @param {HTMLElement} inputElement - O elemento <input> associado.
 * @param {string} errorId - O ID do elemento <p class="invalid-feedback">.
 * @param {boolean} isValid - Se o campo é válido (true) ou inválido (false).
 */
const setFieldError = (inputElement, errorId, isValid) => {
    const group = inputElement.closest('.input-group');
    const errorElement = document.getElementById(errorId);
    
    if (isValid) {
        inputElement.classList.remove('invalid');
        group?.classList.remove('error');
    } else {
        inputElement.classList.add('invalid');
        group?.classList.add('error');
    }
};

/**
 * Valida todos os campos do formulário e retorna o status.
 * @returns {boolean} True se todos os campos forem válidos, false caso contrário.
 */
const validateForm = () => {
    let isValid = true;

    // 1. Nome (Verificação simples de preenchimento)
    const nameValid = nameInput.value.trim().length > 2;
    setFieldError(nameInput, 'name-error', nameValid);
    if (!nameValid) isValid = false;

    // 2. Email
    const emailValid = Validator.isEmail(emailInput.value);
    setFieldError(emailInput, 'email-error', emailValid);
    if (!emailValid) isValid = false;

    // 3. CPF (Simulação de validação)
    const cpfValid = Validator.isCpfValid(cpfInput.value);
    setFieldError(cpfInput, 'cpf-error', cpfValid);
    if (!cpfValid) isValid = false;

    // 4. Telefone
    const phoneValid = Validator.isPhoneValid(phoneInput.value);
    setFieldError(phoneInput, 'phone-error', phoneValid);
    if (!phoneValid) isValid = false;

    // 5. Data de Nascimento (Mínimo 18 anos)
    const birthdateValid = Validator.isMinimumAge(birthdateInput.value, 18);
    setFieldError(birthdateInput, 'birthdate-error', birthdateValid);
    if (!birthdateValid) isValid = false;

    // 6. Senha Forte
    const passwordValid = Validator.isPasswordStrong(passwordInput.value);
    setFieldError(passwordInput, 'password-error', passwordValid);
    if (!passwordValid) isValid = false;
    
    // 7. Confirmação de Senha
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    setFieldError(confirmPasswordInput, 'confirm-password-error', passwordsMatch);
    if (!passwordsMatch) isValid = false;
    
    return isValid;
};

/**
 * Função de manipulação da submissão do formulário.
 * @param {Event} e - Evento de submissão.
 */
const handleRegister = async (e) => {
    e.preventDefault();
    globalError.style.display = 'none'; // Oculta erros globais anteriores

    if (!validateForm()) {
        globalError.textContent = 'Por favor, corrija os erros nos campos antes de prosseguir.';
        globalError.style.display = 'block';
        return;
    }

    const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        cpf: cpfInput.value,
        phone: phoneInput.value,
        birthdate: birthdateInput.value,
        password: passwordInput.value, // A senha será usada como hash simulado no auth.js
    };
    
    // Chama o serviço de autenticação
    const registeredUser = AuthService.register(userData);

    if (registeredUser) {
        // RF6: Cadastro bem-sucedido. Redireciona.
        window.location.href = 'index.html'; 
    } else {
        // RF7: Cadastro falhou (ex: e-mail já existe, falha no service)
        globalError.textContent = 'Erro ao tentar cadastrar. O e-mail pode já estar em uso.';
        globalError.style.display = 'block';
    }
};

/**
 * Inicializa a lógica da página de Registro.
 */
export const initRegisterPage = () => {
    if (!form) {
        console.error("Formulário de registro não encontrado.");
        return;
    }
    
    // Máscara de CPF e Telefone (Simples, remove não-dígitos)
    cpfInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
    });
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
    });
    
    form.addEventListener('submit', handleRegister);
    
    // Adicionar validação em tempo real para melhor UX (ex: ao sair do campo)
    [nameInput, emailInput, cpfInput, phoneInput, birthdateInput, passwordInput, confirmPasswordInput].forEach(input => {
        input.addEventListener('blur', () => {
            // A validação completa ocorre no submit, mas o blur melhora o feedback
            validateForm(); 
        });
    });
};