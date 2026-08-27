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

        animeList.innerHTML = "";

        resultsCount.textContent = "";

        showLoading();

        searchButton.disabled = true;

        try {

            // A função está no arquivo api.js.
            const animes =
                await searchAnime(searchTerm);

            if (!animes || animes.length === 0) {

                showError(
                    `Nenhum anime encontrado para "${searchTerm}".`
                );

                return;
            }

            hideMessages();

            resultsCount.textContent =
                `${animes.length} resultado(s)`;

            animes.forEach(
                function (anime) {

                    animeList.appendChild(
                        createAnimeCard(anime)
                    );
                }
            );

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
);


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