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
const globalError = document.getElementById('global-error');

// Elementos DOM de Endereço ATUALIZADOS
const cepInput = document.getElementById('register-cep');
const cepSearchBtn = document.getElementById('cep-search-btn'); // NOVO BOTÃO DE BUSCA
const cepStatusMessage = document.getElementById('cep-message');
const fullAddressInput = document.getElementById('register-full-address'); // NOVO CAMPO ÚNICO DE ENDEREÇO
const numberInput = document.getElementById('register-number'); // Mantido

/**
 * Exibe ou oculta o feedback visual de erro para um campo.
 * @param {HTMLElement} inputElement - O elemento <input> associado.
 * @param {string} errorId - O ID do elemento <p class="invalid-feedback">.
 * @param {boolean} isValid - Se o campo é válido (true) ou inválido (false).
 */
const setFieldError = (inputElement, errorId, isValid) => {
    // Trata o caso especial de inputs sem um 'invalid-feedback'
    if (!errorId) {
        inputElement.classList.toggle('invalid', !isValid);
        inputElement.closest('.input-group')?.classList.toggle('error', !isValid);
        return;
    }
    
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

    // 1. Nome
    const nameValid = nameInput.value.trim().length > 2;
    setFieldError(nameInput, 'name-error', nameValid);
    if (!nameValid) isValid = false;

    // 2. Email
    const emailValid = Validator.isEmail(emailInput.value);
    setFieldError(emailInput, 'email-error', emailValid);
    if (!emailValid) isValid = false;

    // 3. CPF
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
    
    // 6. Número (Validação simples de preenchimento)
    const numberValid = numberInput.value.trim().length > 0;
    setFieldError(numberInput, 'number-error', numberValid);
    if (!numberValid) isValid = false;
    
    // 7. Endereço Completo (Deve ter sido preenchido pela busca do CEP)
    const addressValid = fullAddressInput.value.trim().length > 0;
    // O 'fullAddressInput' não tem um feedback-error dedicado, usamos setFieldError(input, null, isValid)
    setFieldError(fullAddressInput, null, addressValid); 
    if (!addressValid) {
        isValid = false;
        // Atualiza a mensagem de status do CEP para alertar o usuário
        if (cepStatusMessage) cepStatusMessage.textContent = 'Por favor, informe e busque um CEP válido.';
    }

    // 8. Senha Forte
    const passwordValid = Validator.isPasswordStrong(passwordInput.value);
    setFieldError(passwordInput, 'password-error', passwordValid);
    if (!passwordValid) isValid = false;
    
    // 9. Confirmação de Senha
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    setFieldError(confirmPasswordInput, 'confirm-password-error', passwordsMatch);
    if (!passwordsMatch) isValid = false;
    
    return isValid;
};

/**
 * Limpa os campos de endereço (o campo de endereço único).
 */
const clearAddressFields = () => {
    if (fullAddressInput) fullAddressInput.value = '';
    if (cepStatusMessage) cepStatusMessage.textContent = 'Informe um CEP válido e clique em Buscar.';
};

/**
 * Busca o endereço na API ViaCEP e preenche o campo único.
 * É disparada pelo clique no botão de busca.
 */
const fetchAddressByCep = () => {
    // Se o endereço foi digitado, remove o status de erro visual do campo
    setFieldError(fullAddressInput, null, true); 
    
    if (!cepInput || !fullAddressInput) return;

    // Limpa o CEP (mantém apenas dígitos)
    const cep = cepInput.value.replace(/[^0-9]/g, '').trim(); 
    clearAddressFields();

    // Validação de 8 dígitos
    if (cep.length !== 8) {
        if (cepStatusMessage) cepStatusMessage.textContent = '❌ CEP inválido. Deve ter 8 dígitos.';
        return;
    }

    // Feedback de status de busca
    if (cepStatusMessage) cepStatusMessage.textContent = '🔍 Buscando endereço...';
    if (cepSearchBtn) cepSearchBtn.disabled = true; // Desabilita o botão enquanto busca

    // Requisição à API ViaCEP
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição ViaCEP');
            }
            return response.json();
        })
        .then(data => {
            if (cepSearchBtn) cepSearchBtn.disabled = false;
            
            if (data.erro) {
                if (cepStatusMessage) cepStatusMessage.textContent = '❌ CEP não encontrado.';
                console.warn('CEP não encontrado na API.');
                return;
            }

            // RF5: Formatação do Endereço Completo
            const logradouro = data.logradouro || '';
            const bairro = data.bairro || '';
            const cidade = data.localidade || ''; // ViaCEP usa 'localidade' para cidade
            const uf = data.uf || '';
            
            fullAddressInput.value = `${logradouro}, ${bairro} - ${cidade}/${uf}`;
            
            if (cepStatusMessage) cepStatusMessage.textContent = '✅ Endereço preenchido!';
        })
        .catch(error => {
            if (cepSearchBtn) cepSearchBtn.disabled = false;
            console.error('Erro ao buscar o CEP:', error);
            if (cepStatusMessage) cepStatusMessage.textContent = '⚠️ Erro ao buscar o CEP.';
        });
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
        // Rola a tela para o primeiro erro se necessário
        document.querySelector('.input-group.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const userData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        cpf: cpfInput.value,
        phone: phoneInput.value,
        birthdate: birthdateInput.value,
        password: passwordInput.value, 
        // Adicionando os novos dados de endereço
        address: fullAddressInput.value.trim(),
        number: numberInput.value.trim(),
        cep: cepInput.value.replace(/[^0-9]/g, '').trim(),
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
    
    // 1. Configura o Listener do Botão de Busca de CEP (RF4)
    if (cepSearchBtn) {
        cepSearchBtn.addEventListener('click', fetchAddressByCep);
    } 
    
    // 2. Permite buscar também com 'Enter' no campo CEP
    if (cepInput) {
        cepInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchAddressByCep();
            }
        });
    }

    // Máscara de CPF e Telefone
    cpfInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
    });
    phoneInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '');
    });
    
    form.addEventListener('submit', handleRegister);
    
    // Adicionar validação em tempo real para melhor UX (ex: ao sair do campo)
    [nameInput, emailInput, cpfInput, phoneInput, birthdateInput, passwordInput, confirmPasswordInput, numberInput].forEach(input => {
        input.addEventListener('blur', () => {
            // A validação completa ocorre no submit, mas o blur melhora o feedback
            validateForm(); 
        });
    });
};