
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
        currentSearchTerm = searchTerm;

        await performSearch();
    }
);


// ============================================
// EXECUTAR PESQUISA
// ============================================

async function performSearch() {

    animeList.innerHTML = "";
    resultsCount.textContent = "";

    showLoading();

    searchButton.disabled = true;

    try {

        const result =
            await searchAnime(
                currentSearchTerm,
                {
                    page: currentPage
                }
            );

        const animes =
            result.anime || [];

        if (!animes || animes.length === 0) {

            showError(
                `Nenhum anime encontrado para "${currentSearchTerm}".`
            );

            return;
        }

        hideMessages();

        resultsCount.textContent =
            `${animes.length} resultado(s) — Página ${currentPage}`;

        // Cria os cards.
        animes.forEach(
            function (anime) {

                animeList.appendChild(
                    createAnimeCard(anime)
                );

            }
        );

        // Atualiza a paginação.
        renderPagination(result);

    } catch (error) {

        console.error(
            "Erro na pesquisa:",
            error
        );

        showError(
            "Não foi possível consultar os animes. " +
            "Verifique sua conexão e tente novamente."
        );

    } finally {

        searchButton.disabled = false;

    }
}


// ============================================
// PAGINAÇÃO
// ============================================

function renderPagination(result) {

    // Remove paginação antiga.
    const oldPagination =
        document.getElementById("pagination");

    if (oldPagination) {
        oldPagination.remove();
    }

    // Cria o container.
    const pagination =
        document.createElement("div");

    pagination.id = "pagination";
    pagination.className = "pagination";

    // Botão anterior.
    const previousButton =
        document.createElement("button");

    previousButton.type = "button";
    previousButton.className = "pagination-button";
    previousButton.textContent = "‹ Anterior";

    previousButton.disabled =
        currentPage === 1;

    previousButton.addEventListener(
        "click",
        function () {

            if (currentPage > 1) {

                currentPage--;

                performSearch();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );

    pagination.appendChild(previousButton);


    // Página atual.
    const pageIndicator =
        document.createElement("span");

    pageIndicator.className =
        "pagination-current";

    pageIndicator.textContent =
        `Página ${currentPage}`;

    pagination.appendChild(pageIndicator);


    // Botão próximo.
    const nextButton =
        document.createElement("button");

    nextButton.type = "button";
    nextButton.className = "pagination-button";
    nextButton.textContent = "Próxima ›";

    /*
     * Se retornaram menos que SEARCH_LIMIT,
     * provavelmente chegamos ao final.
     */
    nextButton.disabled =
    (result.anime || []).length < SEARCH_LIMIT;
    nextButton.addEventListener(
        "click",
        function () {

            if (!nextButton.disabled) {

                currentPage++;

                performSearch();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }

        }
    );

    pagination.appendChild(nextButton);


    // Coloca depois dos cards.
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

        popularList.innerHTML = "";

        animes.forEach(
            function (anime) {

                popularList.appendChild(
                    createAnimeCard(anime)
                );

            }
        );

    } catch (error) {

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

    } catch (error) {

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

