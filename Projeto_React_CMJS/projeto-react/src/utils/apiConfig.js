/**
 * apiConfig.js — Configuração centralizada da URL da API do backend.
 * 
 * Detecta automaticamente se a aplicação está rodando no GitHub Codespaces
 * e ajusta a URL do backend para a porta correta (3000).
 * 
 * @module utils/apiConfig
 */

/**
 * Detecta a URL base do backend automaticamente.
 * - Em GitHub Codespaces: substitui a porta do frontend pela porta 3000 do backend.
 * - Em ambiente local: retorna `http://localhost:3000`.
 * 
 * @returns {string} A URL base da API backend (sem barra final).
 */
export const getBackendBaseUrl = () => {
    if (typeof window === 'undefined' || !window.location.href) {
        return 'http://localhost:3000';
    }

    const currentUrl = window.location.href;
    const codespacePattern = /-\d+\.app\.github\.dev/;
    const hostMatch = currentUrl.match(/https:\/\/[^\/]+/);
    const currentHost = hostMatch ? hostMatch[0] : '';

    if (codespacePattern.test(currentHost)) {
        return currentHost.replace(/-\d+\.app\.github\.dev/, '-3000.app.github.dev');
    }

    return 'http://localhost:3000';
};

/** URL base da API, calculada uma única vez ao importar o módulo. */
export const API_BASE_URL = getBackendBaseUrl();
