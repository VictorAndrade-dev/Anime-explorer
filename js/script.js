// ============================================
// ELEMENTOS PRINCIPAIS
// ============================================

const searchForm =
    document.getElementById("search-form");

const searchInput =
    document.getElementById("search-input");

const searchButton =
    document.getElementById("search-button");

const randomButton =
    document.getElementById("random-button");

const closeModalButton =
    document.getElementById("close-modal");

const modalOverlay =
    document.querySelector(".modal-overlay");


// ============================================
// PAGINAÇÃO DA PESQUISA
// ============================================

let currentPage = 1;
let currentSearchTerm = "";

let nextPageUrl = null;
let previousPageUrl = null;


// ============================================
// PESQUISA
// ============================================

searchForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const searchTerm =
            searchInput.value.trim();

        if (searchTerm === "") {

            showError(
                "Digite o nome de um anime para pesquisar."
            );

            return;
        }

        // Nova pesquisa começa na primeira página.
        currentPage = 1;

        currentSearchTerm =
            searchTerm;

        await performSearch();
    }
);


// ============================================
// EXECUTAR PESQUISA
// ============================================

async function performSearch() {

    // Limpa resultados anteriores.
    animeList.innerHTML = "";

    resultsCount.textContent = "";

    showLoading();

    searchButton.disabled = true;

    try {

        // ====================================
        // BUSCAR API
        // ====================================

        const result = await searchAnime(
            currentSearchTerm,
            {
                page: currentPage
            }
        );

        const animes =
            result.anime || [];


        // ====================================
        // SALVAR LINKS DA KITSU
        // ====================================

        nextPageUrl =
            result.links?.next || null;

        previousPageUrl =
            result.links?.prev || null;


        // ====================================
        // NENHUM RESULTADO
        // ====================================

        if (animes.length === 0) {

            showError(
                `Nenhum anime encontrado para "${currentSearchTerm}".`
            );

            return;
        }


        // ====================================
        // MOSTRAR RESULTADOS
        // ====================================

        hideMessages();

        resultsCount.textContent =
            `${animes.length} resultado(s) — Página ${currentPage}`;


        // ====================================
        // CRIAR CARDS
        // ====================================

        animes.forEach(
            function (anime) {

                animeList.appendChild(
                    createAnimeCard(anime)
                );

            }
        );


        // ====================================
        // PAGINAÇÃO
        // ====================================

        renderPagination(result);

    }

    catch (error) {

        console.error(
            "Erro na pesquisa:",
            error
        );

        showError(
            "Não foi possível consultar os animes. " +
            "Verifique sua conexão e tente novamente."
        );

    }

    finally {

        searchButton.disabled = false;

    }
}


// ============================================
// PAGINAÇÃO
// ============================================

function renderPagination(result) {

    // Remove paginação anterior.
    const oldPagination =
        document.getElementById(
            "pagination"
        );

    if (oldPagination) {

        oldPagination.remove();

    }


    // ========================================
    // CRIAR CONTAINER
    // ========================================

    const pagination =
        document.createElement("div");

    pagination.id =
        "pagination";

    pagination.className =
        "pagination";


    // ========================================
    // BOTÃO ANTERIOR
    // ========================================

    const previousButton =
        document.createElement("button");

    previousButton.type =
        "button";

    previousButton.className =
        "pagination-button";

    previousButton.textContent =
        "‹ Anterior";


    // Desabilita se não existir página anterior.
    previousButton.disabled =
        !previousPageUrl;


    previousButton.addEventListener(
        "click",
        async function () {

            if (!previousPageUrl) {

                return;

            }


            // Usa a URL fornecida pela Kitsu.
            const url =
                previousPageUrl;


            // Não alteramos currentPage antes
            // da pesquisa terminar.

            currentPage--;

            // Passa a URL diretamente para a API.
            nextPageUrl = url;

            await performSearch();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    pagination.appendChild(
        previousButton
    );


    // ========================================
    // INDICADOR
    // ========================================

    const pageIndicator =
        document.createElement("span");

    pageIndicator.className =
        "pagination-current";

    pageIndicator.textContent =
        `Página ${currentPage}`;

    pagination.appendChild(
        pageIndicator
    );


    // ========================================
    // BOTÃO PRÓXIMO
    // ========================================

    const nextButton =
        document.createElement("button");

    nextButton.type =
        "button";

    nextButton.className =
        "pagination-button";

    nextButton.textContent =
        "Próxima ›";


    // Desabilita se não existir próxima página.
    nextButton.disabled =
        !nextPageUrl;


    nextButton.addEventListener(
        "click",
        async function () {

            if (!nextPageUrl) {

                return;

            }


            // Guarda a URL atual.
            const url =
                nextPageUrl;


            currentPage++;


            // Passa a URL da Kitsu.
            nextPageUrl = url;


            await performSearch();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    pagination.appendChild(
        nextButton
    );


    // ========================================
    // INSERIR PAGINAÇÃO
    // ========================================

    animeList.parentElement.appendChild(
        pagination
    );
}


// ============================================
// ANIMES POPULARES
// ============================================

async function loadPopularAnime() {

    try {

        const animes =
            await getPopularAnime();

        popularList.innerHTML =
            "";

        animes.forEach(
            function (anime) {

                popularList.appendChild(
                    createAnimeCard(anime)
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Erro ao carregar populares:",
            error
        );

        popularList.innerHTML =
            "<p>Não foi possível carregar os animes populares.</p>";

    }
}


// ============================================
// ANIME ALEATÓRIO
// ============================================

async function loadRandomAnime() {

    try {

        const anime =
            await getRandomAnime();

        if (anime) {

            openAnimeModal(anime);

        }

    }

    catch (error) {

        console.error(
            "Erro ao buscar anime aleatório:",
            error
        );

    }
}


// ============================================
// EVENTOS
// ============================================

randomButton.addEventListener(
    "click",
    loadRandomAnime
);


closeModalButton.addEventListener(
    "click",
    closeModal
);


modalOverlay.addEventListener(
    "click",
    closeModal
);


themeButton.addEventListener(
    "click",
    toggleTheme
);


// ============================================
// TECLA ESC
// ============================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeModal();

        }

    }
);


// ============================================
// INICIALIZAÇÃO
// ============================================

initializeTheme();

loadPopularAnime();

renderFavorites();