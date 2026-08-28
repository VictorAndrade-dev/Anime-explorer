
// ============================================
// CONFIGURAÇÃO DA API
// ============================================

// URL principal da Kitsu API.
const API_URL = "https://kitsu.io/api/edge/anime";

// Quantidade de resultados por página.
const SEARCH_LIMIT = 15;

// Quantidade de animes populares.
const POPULAR_LIMIT = 6;


// ============================================
// PESQUISAR ANIMES
// ============================================

async function searchAnime(searchTerm, options = {}) {

    const {
        page = 1,
        subtype = "",
        status = "",
        year = "",
        sort = "-userCount"
    } = options;

    // Calcula o deslocamento da página.
    const offset = (page - 1) * SEARCH_LIMIT;

    // Cria os parâmetros da URL.
    const params = new URLSearchParams();

    // Texto da pesquisa.
    if (searchTerm.trim()) {
        params.append("filter[text]", searchTerm.trim());
    }

    // Filtro por tipo:
    // TV, movie, OVA, ONA, special, music
    if (subtype) {
        params.append("filter[subtype]", subtype);
    }

    // Filtro por status:
    // current, finished, upcoming
    if (status) {
        params.append("filter[status]", status);
    }

    // Filtro por ano de lançamento.
    if (year) {
        params.append("filter[seasonYear]", year);
    }

    // Ordenação.
    if (sort) {
        params.append("sort", sort);
    }

    // Paginação.
    params.append("page[limit]", SEARCH_LIMIT);
    params.append("page[offset]", offset);

    const url = `${API_URL}?${params.toString()}`;

    // Faz a requisição.
    const response = await fetch(url);

    // Verifica erro HTTP.
    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Converte a resposta.
    const data = await response.json();

    // Retorna resultados + informações de paginação.
    return {
        anime: data.data || [],
        links: data.links || {},
        meta: data.meta || {},
        page,
        limit: SEARCH_LIMIT
    };
}


// ============================================
// BUSCAR ANIMES POPULARES
// ============================================

async function getPopularAnime() {

    const params = new URLSearchParams();

    params.append("sort", "-userCount");
    params.append("page[limit]", POPULAR_LIMIT);

    const url = `${API_URL}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.data || [];
}


// ============================================
// BUSCAR ANIME ALEATÓRIO
// ============================================

async function getRandomAnime() {

    // Escolhe uma posição aleatória.
    const randomOffset = Math.floor(Math.random() * 50);

    const params = new URLSearchParams();

    params.append("sort", "-userCount");
    params.append("page[limit]", 1);
    params.append("page[offset]", randomOffset);

    const url = `${API_URL}?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    return data.data?.[0] || null;
}


// ============================================
// BUSCAR EPISÓDIOS
// ============================================

async function getEpisodes(animeId, offset = 0, limit = 20) {

    const params = new URLSearchParams();

    params.append("page[limit]", limit);
    params.append("page[offset]", offset);

    const url = `${API_URL}/${animeId}/episodes?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
    }

    const data = await response.json();

    return {
        episodes: data.data || [],
        next: data.links?.next || null
    };
}

