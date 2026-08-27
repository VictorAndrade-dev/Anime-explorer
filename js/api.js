// ============================================
// CONFIGURAÇÃO DA API
// ============================================

// URL principal da Kitsu API.
const API_URL = "https://kitsu.io/api/edge/anime";

// Quantidade de resultados da pesquisa.
const SEARCH_LIMIT = 12;

// Quantidade de animes populares.
const POPULAR_LIMIT = 6;


// ============================================
// PESQUISAR ANIMES
// ============================================

async function searchAnime(searchTerm) {

    // Converte o texto para um formato seguro para URL.
    const encodedSearch = encodeURIComponent(searchTerm);

    // Monta a URL da requisição.
    const url =
        `${API_URL}?filter[text]=${encodedSearch}&page[limit]=${SEARCH_LIMIT}`;

    // Faz a requisição para a API.
    const response = await fetch(url);

    // Verifica se houve erro HTTP.
    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Converte a resposta para JSON.
    const data = await response.json();

    return data.data;
}


// ============================================
// BUSCAR ANIMES POPULARES
// ============================================

async function getPopularAnime() {

    const url =
        `${API_URL}?sort=-userCount&page[limit]=${POPULAR_LIMIT}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.data;
}


// ============================================
// BUSCAR ANIME ALEATÓRIO
// ============================================

async function getRandomAnime() {

    // Escolhe uma posição aleatória.
    const randomOffset =
        Math.floor(Math.random() * 50);

    const url =
        `${API_URL}?sort=-userCount&page[limit]=1&page[offset]=${randomOffset}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.data[0];
}


// ============================================
// BUSCAR EPISÓDIOS
// ============================================

async function getEpisodes(animeId) {

    const url =
        `${API_URL}/${animeId}/episodes?page[limit]=20`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.data;
}