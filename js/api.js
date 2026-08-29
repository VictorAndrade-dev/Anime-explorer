// ============================================
// CONFIGURAÇÃO DA API
// ============================================

const API_URL =
    "https://kitsu.io/api/edge/anime";

const SEARCH_LIMIT = 15;
const POPULAR_LIMIT = 6;


// ============================================
// PESQUISAR ANIMES
// ============================================

async function searchAnime(
    searchTerm,
    options = {}
) {

    const {
        page = 1,
        subtype = "",
        status = "",
        year = "",
        sort = "",
        genre = ""
    } = options;


    // ========================================
    // CONFIGURAÇÃO
    // ========================================

    const limitAPI = 20;

    // Quantos resultados queremos carregar
    // para permitir a paginação.
    const totalResultados = 100;


    // ========================================
    // FUNÇÃO PARA BUSCAR UMA PARTE
    // ========================================

    async function buscarParte(offset) {

        const params =
            new URLSearchParams();


        // Incluir gêneros relacionados
        params.append(
            "include",
            "genres"
        );


        // Texto da pesquisa

        if (
            searchTerm &&
            searchTerm.trim()
        ) {

            params.append(
                "filter[text]",
                searchTerm.trim()
            );

        }


        // Tipo

        if (subtype) {

            params.append(
                "filter[subtype]",
                subtype
            );

        }


        // Status

        if (status) {

            params.append(
                "filter[status]",
                status
            );

        }


        // Gênero

        if (genre) {

            params.append(
                "filter[genres]",
                genre
            );

        }


        // Ano

        if (year) {

            params.append(
                "filter[seasonYear]",
                year
            );

        }


        // Ordenação

        if (sort) {

            params.append(
                "sort",
                sort
            );

        }


        // Paginação da API

        params.append(
            "page[limit]",
            limitAPI
        );

        params.append(
            "page[offset]",
            offset
        );


        const url =
            `${API_URL}?${params.toString()}`;


        const response =
            await fetch(
                url,
                {
                    headers: {
                        Accept:
                            "application/vnd.api+json"
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );

        }


        const data =
            await response.json();


        // ========================================
        // PROCESSAR GÊNEROS
        // ========================================

        const included =
            data.included || [];


        return (data.data || []).map(
            function (anime) {

                const genreReferences =
                    anime.relationships
                        ?.genres
                        ?.data || [];


                const genres =
                    genreReferences
                        .map(
                            function (genreReference) {

                                const genre =
                                    included.find(
                                        function (item) {

                                            return (
                                                item.type === "genres" &&
                                                item.id === genreReference.id
                                            );

                                        }
                                    );


                                return (
                                    genre
                                        ?.attributes
                                        ?.name || null
                                );

                            }
                        )
                        .filter(Boolean);


                return {
                    ...anime,
                    genres: genres
                };

            }
        );

    }


    // ========================================
    // BUSCAR RESULTADOS
    // ========================================

    let todosAnimes = [];


    // Faz várias requisições.

    for (
        let offset = 0;
        offset < totalResultados;
        offset += limitAPI
    ) {

        const parte =
            await buscarParte(offset);


        // Adiciona os resultados.

        todosAnimes =
            todosAnimes.concat(parte);


        // Se retornou menos que 20,
        // não existem mais resultados.

        if (
            parte.length < limitAPI
        ) {

            break;

        }

    }


    // ========================================
    // REMOVER DUPLICADOS
    // ========================================

    const animesUnicos = [];

    const ids = new Set();


    todosAnimes.forEach(
        function (anime) {

            if (!ids.has(anime.id)) {

                ids.add(anime.id);

                animesUnicos.push(anime);

            }

        }
    );


    // ========================================
    // PAGINAÇÃO LOCAL
    // ========================================

    const inicio =
        (page - 1) * SEARCH_LIMIT;

    const fim =
        inicio + SEARCH_LIMIT;


    const resultadosPagina =
        animesUnicos.slice(
            inicio,
            fim
        );


    // ========================================
    // VERIFICAR SE EXISTE PRÓXIMA
    // ========================================

    const temProximaPagina =
        fim < animesUnicos.length;

    const temPaginaAnterior =
        page > 1;


    // ========================================
    // RETORNO
    // ========================================

    return {

        anime:
            resultadosPagina,

        links: {

            next:
                temProximaPagina
                    ? `page:${page + 1}`
                    : null,

            prev:
                temPaginaAnterior
                    ? `page:${page - 1}`
                    : null

        },

        meta: {

            total:
                animesUnicos.length

        },

        page,

        limit:
            SEARCH_LIMIT

    };

}


// ============================================
// BUSCAR ANIMES POPULARES
// ============================================

async function getPopularAnime() {

    const params =
        new URLSearchParams();


    params.append(
        "sort",
        "-userCount"
    );


    params.append(
        "page[limit]",
        POPULAR_LIMIT
    );


    params.append(
        "include",
        "genres"
    );


    params.append(
        "_",
        Date.now()
    );


    const url =
        `${API_URL}?${params.toString()}`;


    const response =
        await fetch(
            url,
            {
                cache: "no-store",

                headers: {
                    Accept:
                        "application/vnd.api+json"
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Erro HTTP: ${response.status}`
        );

    }


    const data =
        await response.json();


    const included =
        data.included || [];


    return (data.data || []).map(
        function (anime) {

            const genreReferences =
                anime.relationships
                    ?.genres
                    ?.data || [];


            const genres =
                genreReferences
                    .map(
                        function (genreReference) {

                            const genre =
                                included.find(
                                    function (item) {

                                        return (
                                            item.type === "genres" &&
                                            item.id === genreReference.id
                                        );

                                    }
                                );


                            return (
                                genre
                                    ?.attributes
                                    ?.name || null
                            );

                        }
                    )
                    .filter(Boolean);


            return {
                ...anime,
                genres: genres
            };

        }
    );

}

// ============================================
// BUSCAR ANIMES EM ALTA
// ============================================

async function getTrendingAnime() {

    const params = new URLSearchParams();

    params.append(
        "sort",
        "-userCount"
    );

    params.append(
        "page[limit]",
        12
    );

    params.append(
        "_",
        Date.now()
    );

    const url =
        `${API_URL}?${params.toString()}`;

    const response = await fetch(
        url,
        {
            cache: "no-store",
            headers: {
                Accept:
                    "application/vnd.api+json"
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `Erro HTTP: ${response.status}`
        );
    }

    const data =
        await response.json();

    return data.data || [];
}

// ============================================
// BUSCAR ANIME ALEATÓRIO
// ============================================

async function getRandomAnime() {

    const randomOffset =
        Math.floor(
            Math.random() * 50
        );


    const params =
        new URLSearchParams();


    params.append(
        "sort",
        "-userCount"
    );


    params.append(
        "page[limit]",
        1
    );


    params.append(
        "page[offset]",
        randomOffset
    );


    params.append(
        "include",
        "genres"
    );


    params.append(
        "_",
        Date.now()
    );


    const url =
        `${API_URL}?${params.toString()}`;


    const response =
        await fetch(
            url,
            {
                cache: "no-store",

                headers: {
                    Accept:
                        "application/vnd.api+json"
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Erro HTTP: ${response.status}`
        );

    }


    const data =
        await response.json();


    const anime =
        data.data?.[0];


    if (!anime) {
        return null;
    }


    const included =
        data.included || [];


    const genreReferences =
        anime.relationships
            ?.genres
            ?.data || [];


    const genres =
        genreReferences
            .map(
                function (genreReference) {

                    const genre =
                        included.find(
                            function (item) {

                                return (
                                    item.type === "genres" &&
                                    item.id === genreReference.id
                                );

                            }
                        );


                    return (
                        genre
                            ?.attributes
                            ?.name || null
                    );

                }
            )
            .filter(Boolean);


    return {
        ...anime,
        genres: genres
    };

}


// ============================================
// BUSCAR EPISÓDIOS
// ============================================

async function getEpisodes(
    animeId,
    offset = 0,
    limit = 20
) {

    const params =
        new URLSearchParams();


    params.append(
        "page[limit]",
        limit
    );


    params.append(
        "page[offset]",
        offset
    );


    const url =
        `${API_URL}/${animeId}/episodes?${params.toString()}`;


    const response =
        await fetch(
            url,
            {
                cache: "no-store",

                headers: {
                    Accept:
                        "application/vnd.api+json"
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `Erro HTTP: ${response.status}`
        );

    }


    const data =
        await response.json();


    return {

        episodes:
            data.data || [],

        next:
            data.links?.next || null,

        prev:
            data.links?.prev || null

    };

}

// ============================================
// BUSCAR ANIMES DA TEMPORADA ATUAL
// ============================================

async function getCurrentSeasonAnime() {

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    let season;

    if (month >= 1 && month <= 3) {
        season = "winter";
    } else if (month >= 4 && month <= 6) {
        season = "spring";
    } else if (month >= 7 && month <= 9) {
        season = "summer";
    } else {
        season = "fall";
    }

    const params = new URLSearchParams();

    params.append(
        "filter[seasonYear]",
        year
    );

    params.append(
        "filter[season]",
        season
    );

    params.append(
        "sort",
        "-userCount"
    );

    params.append(
        "page[limit]",
        12
    );

    const url =
        `${API_URL}?${params.toString()}`;

    const response = await fetch(
        url,
        {
            cache: "no-store",
            headers: {
                Accept:
                    "application/vnd.api+json"
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `Erro HTTP: ${response.status}`
        );
    }

    const data =
        await response.json();

    return data.data || [];
}