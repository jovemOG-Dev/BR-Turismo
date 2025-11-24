/**
 * MÓDULO PÁGINA: Login
 * Arquivo: src/js/pages/login.js
 * Responsabilidade: Manipulação do formulário de login e chamada de serviço.
 */
import { AuthService } from '../services/auth.js';
import { Validator } from '../services/validator.js'; // Assumindo que o Validator existe

// Elementos DOM
const form = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const globalError = document.getElementById('login-error');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');

/**
 * Exibe ou oculta o feedback visual de erro para um campo.
 * @param {HTMLElement} inputElement - O elemento <input> associado.
 * @param {HTMLElement} errorElement - O elemento <p class="invalid-feedback">.
 * @param {boolean} isValid - Se o campo é válido (true) ou inválido (false).
 */
const setFieldError = (inputElement, errorElement, isValid) => {
    const group = inputElement.closest('.input-group');
    
    if (isValid) {
        inputElement.classList.remove('invalid');
        group?.classList.remove('error');
        errorElement.style.display = 'none';
    } else {
        inputElement.classList.add('invalid');
        group?.classList.add('error');
        errorElement.style.display = 'block';
    }
};


/**
 * Valida os campos do formulário antes da submissão.
 * @returns {boolean} True se os campos forem válidos, false caso contrário.
 */
const validateForm = () => {
    let isValid = true;
    
    // 1. Email
    const emailValid = Validator.isEmail(emailInput.value);
    setFieldError(emailInput, emailError, emailValid);
    if (!emailValid) isValid = false;

    // 2. Senha (Simples, verificando apenas o comprimento mínimo)
    // Usamos uma verificação mais simples aqui, pois a validação de força total 
    // é mais crucial no cadastro. Assumimos minLength >= 8.
    const passwordMinLength = 8;
    const passwordValid = passwordInput.value.length >= passwordMinLength;
    setFieldError(passwordInput, passwordError, passwordValid);
    if (!passwordValid) {
        passwordError.textContent = `A senha deve ter no mínimo ${passwordMinLength} caracteres.`;
        isValid = false;
    }

    return isValid;
};


/**
 * Função de manipulação da submissão do formulário.
 * @param {Event} e - Evento de submissão.
 */
const handleLogin = (e) => {
    e.preventDefault(); // RF2: Previne o envio padrão (GET)
    globalError.style.display = 'none'; // Oculta erros globais anteriores

    if (!validateForm()) {
        globalError.textContent = 'Por favor, corrija os erros nos campos.';
        globalError.style.display = 'block';
        return;
    }

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    // RF4: Chama o serviço de autenticação
    const user = AuthService.login(email, password);

    if (user) {
        // RF5: Login bem-sucedido. Redireciona.
        console.log(`Login bem-sucedido para: ${user.email}`);
        window.location.href = 'index.html'; 
    } else {
        // RF6: Login falhou (credenciais incorretas)
        globalError.textContent = 'Credenciais inválidas. Verifique seu e-mail e senha.';
        globalError.style.display = 'block';
        passwordInput.value = ''; // Limpa o campo da senha por segurança
    }
};

/**
 * Inicializa a lógica da página de Login.
 */
export const initLoginPage = () => {
    if (!form) {
        console.error("Formulário de login não encontrado.");
        return;
    }
    
    form.addEventListener('submit', handleLogin);
    
    // Adiciona validação visual ao sair dos campos
    [emailInput, passwordInput].forEach(input => {
        input.addEventListener('blur', () => {
            validateForm(); 
        });
    });
};