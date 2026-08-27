// ============================================
// ELEMENTOS DA INTERFACE
// ============================================

const animeList =
    document.getElementById("anime-list");

const popularList =
    document.getElementById("popular-list");

const favoritesList =
    document.getElementById("favorites-list");

const emptyFavorites =
    document.getElementById("empty-favorites");

const resultsCount =
    document.getElementById("results-count");

const initialMessage =
    document.getElementById("initial-message");

const loadingMessage =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("error-message");

const errorText =
    document.getElementById("error-text");

const modal =
    document.getElementById("anime-modal");

const modalBody =
    document.getElementById("modal-body");

const themeButton =
    document.getElementById("theme-button");


// ============================================
// CRIAR CARD
// ============================================

function createAnimeCard(anime) {

    const card =
        document.createElement("article");

    card.classList.add("anime-card");

    const attributes =
        anime.attributes || {};

    // Título do anime.
    const title =
        attributes.titles?.en ||
        attributes.titles?.en_jp ||
        attributes.canonicalTitle ||
        "Título desconhecido";

    // Imagem.
    const image =
        attributes.posterImage?.large ||
        attributes.posterImage?.medium ||
        "https://via.placeholder.com/300x450?text=Sem+Imagem";

    // Nota.
    const score =
        attributes.averageRating ?? "N/A";

    // Episódios.
    const episodes =
        attributes.episodeCount ?? "N/A";

    // Ano.
    const releaseDate =
        attributes.startDate
            ? new Date(attributes.startDate).getFullYear()
            : "N/A";

    // Tipo.
    const type =
        attributes.subtype || "N/A";

    // Status.
    const status =
        attributes.status || "N/A";


    // HTML do card.
    card.innerHTML = `

        <div class="anime-image">

            <img
                src="${image}"
                alt="Capa do anime ${title}"
                loading="lazy"
            >

            <span class="anime-score">
                ⭐ ${score}
            </span>

        </div>

        <div class="anime-info">

            <h3 class="anime-title">
                ${title}
            </h3>

            <div class="anime-meta">

                <span>
                    📺 ${episodes} episódios
                </span>

                <span>
                    📅 ${releaseDate}
                </span>

            </div>

            <div class="anime-tags">

                <span class="anime-tag">
                    ${type}
                </span>

                <span class="anime-tag">
                    ${status}
                </span>

            </div>

            <button
                class="details-button"
                type="button"
            >
                Ver detalhes
            </button>

        </div>
    `;


    // ============================================
    // FAVORITO
    // ============================================

    const favoriteButton =
        document.createElement("button");

    favoriteButton.classList.add(
        "favorite-button"
    );

    favoriteButton.dataset.id =
        anime.id;

    updateFavoriteButton(
        favoriteButton,
        anime.id
    );

    favoriteButton.addEventListener(
        "click",
        function () {

            toggleFavorite(anime);
        }
    );

    const animeInfo =
        card.querySelector(".anime-info");

    animeInfo.appendChild(
        favoriteButton
    );


    // ============================================
    // DETALHES
    // ============================================

    const detailsButton =
        card.querySelector(".details-button");

    detailsButton.addEventListener(
        "click",
        function () {

            openAnimeModal(anime);
        }
    );

    return card;
}


// ============================================
// ATUALIZAR BOTÃO DE FAVORITO
// ============================================

function updateFavoriteButton(button, animeId) {

    if (isFavorite(animeId)) {

        button.textContent =
            "♥ Favoritado";

        button.classList.add(
            "favorited"
        );

    } else {

        button.textContent =
            "♡ Favoritar";

        button.classList.remove(
            "favorited"
        );
    }
}


// ============================================
// ATUALIZAR TODOS OS BOTÕES
// ============================================

function updateFavoriteButtons() {

    const buttons =
        document.querySelectorAll(
            ".favorite-button"
        );

    buttons.forEach(
        function (button) {

            updateFavoriteButton(
                button,
                button.dataset.id
            );
        }
    );
}


// ============================================
// RENDERIZAR FAVORITOS
// ============================================

function renderFavorites() {

    if (!favoritesList) {
        return;
    }

    favoritesList.innerHTML = "";

    if (favorites.length === 0) {

        if (emptyFavorites) {
            emptyFavorites.classList.remove(
                "hidden"
            );
        }

        return;
    }

    if (emptyFavorites) {
        emptyFavorites.classList.add(
            "hidden"
        );
    }

    favorites.forEach(
        function (anime) {

            favoritesList.appendChild(
                createAnimeCard(anime)
            );
        }
    );
}


// ============================================
// MODAL
// ============================================

let currentAnime = null;


function openAnimeModal(anime) {

    currentAnime = anime;

    const attributes =
        anime.attributes || {};

    const title =
        attributes.titles?.en ||
        attributes.titles?.en_jp ||
        attributes.canonicalTitle ||
        "Título desconhecido";

    const image =
        attributes.posterImage?.large ||
        attributes.posterImage?.medium ||
        "https://via.placeholder.com/300x450?text=Sem+Imagem";

    const synopsis =
        attributes.synopsis ||
        "Sinopse não disponível.";

    const score =
        attributes.averageRating ?? "N/A";

    const episodes =
        attributes.episodeCount ?? "N/A";

    const status =
        attributes.status || "N/A";

    const type =
        attributes.subtype || "N/A";

    const releaseDate =
        attributes.startDate
            ? new Date(attributes.startDate).getFullYear()
            : "N/A";


    modalBody.innerHTML = `

        <div class="modal-anime">

            <img
                src="${image}"
                alt="Capa do anime ${title}"
                class="modal-image"
            >

            <div class="modal-info">

                <h2>${title}</h2>

                <p class="modal-synopsis">
                    ${synopsis}
                </p>

                <div class="modal-details">

                    <p>
                        ⭐ <strong>Nota:</strong>
                        ${score}
                    </p>

                    <p>
                        📺 <strong>Episódios:</strong>
                        ${episodes}
                    </p>

                    <p>
                        📅 <strong>Ano:</strong>
                        ${releaseDate}
                    </p>

                    <p>
                        🎬 <strong>Tipo:</strong>
                        ${type}
                    </p>

                    <p>
                        📌 <strong>Status:</strong>
                        ${status}
                    </p>

                </div>

                <button
                    id="episodes-button"
                    class="episodes-button"
                    type="button"
                >
                    📺 Ver episódios
                </button>

            </div>

        </div>
    `;


    // Botão de episódios.
    const episodesButton =
        document.getElementById(
            "episodes-button"
        );

    episodesButton.addEventListener(
        "click",
        function () {

            loadEpisodesView(
                anime.id,
                title
            );
        }
    );


    modal.classList.remove("hidden");

    document.body.style.overflow =
        "hidden";
}


// ============================================
// FECHAR MODAL
// ============================================

function closeModal() {

    modal.classList.add("hidden");

    document.body.style.overflow = "";
}


// ============================================
// MENSAGENS
// ============================================

function showLoading() {

    initialMessage.classList.add("hidden");
    errorMessage.classList.add("hidden");
    loadingMessage.classList.remove("hidden");
}


function hideMessages() {

    initialMessage.classList.add("hidden");
    loadingMessage.classList.add("hidden");
    errorMessage.classList.add("hidden");
}


function showError(message) {

    initialMessage.classList.add("hidden");
    loadingMessage.classList.add("hidden");

    errorMessage.classList.remove("hidden");

    errorText.textContent = message;

    resultsCount.textContent = "";
}


// ============================================
// EPISÓDIOS
// ============================================

async function loadEpisodesView(
    animeId,
    animeTitle
) {

    modalBody.innerHTML = `

        <div class="message">

            <span>⏳</span>

            <h3>
                Carregando episódios...
            </h3>

            <p>
                Aguarde enquanto buscamos os episódios.
            </p>

        </div>
    `;


    try {

        const episodes =
            await getEpisodes(animeId);


        if (!episodes || episodes.length === 0) {

            modalBody.innerHTML = `

                <div class="message">

                    <span>📺</span>

                    <h3>
                        Nenhum episódio encontrado
                    </h3>

                    <p>
                        Não existem episódios disponíveis.
                    </p>

                </div>
            `;

            return;
        }


        const episodesHTML =
            episodes.map(
                function (episode, index) {

                    const attributes =
                        episode.attributes || {};

                    const number =
                        attributes.number ||
                        index + 1;

                    const episodeTitle =
                        attributes.titles?.en ||
                        attributes.canonicalTitle ||
                        "Título não disponível";

                    const airDate =
                        attributes.airdate
                            ? new Date(
                                attributes.airdate
                            ).toLocaleDateString(
                                "pt-BR"
                            )
                            : "Data não disponível";


                    return `

                        <article class="episode-card">

                            <div class="episode-number">
                                ${number}
                            </div>

                            <div class="episode-info">

                                <h3>
                                    ${episodeTitle}
                                </h3>

                                <p>
                                    📅 ${airDate}
                                </p>

                            </div>

                        </article>
                    `;
                }
            ).join("");


        modalBody.innerHTML = `

            <div class="episodes-container">

                <button
                    id="back-details"
                    class="back-details-button"
                    type="button"
                >
                    ← Voltar aos detalhes
                </button>

                <h2>
                    📺 Episódios de ${animeTitle}
                </h2>

                <div class="episodes-list">
                    ${episodesHTML}
                </div>

            </div>
        `;


        document
            .getElementById("back-details")
            .addEventListener(
                "click",
                function () {

                    openAnimeModal(
                        currentAnime
                    );
                }
            );


    } catch (error) {

        console.error(
            "Erro ao carregar episódios:",
            error
        );

        modalBody.innerHTML = `

            <div class="message">

                <span>😕</span>

                <h3>
                    Erro ao carregar episódios
                </h3>

                <p>
                    Tente novamente mais tarde.
                </p>

            </div>
        `;
    }
}


// ============================================
// TEMA
// ============================================

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            "animeTheme"
        );

    if (savedTheme === "light") {

        document.body.classList.add(
            "light-theme"
        );

        themeButton.textContent =
            "🌙 Tema escuro";
    }
}


function toggleTheme() {

    document.body.classList.toggle(
        "light-theme"
    );

    const isLight =
        document.body.classList.contains(
            "light-theme"
        );

    if (isLight) {

        themeButton.textContent =
            "🌙 Tema escuro";

        localStorage.setItem(
            "animeTheme",
            "light"
        );

    } else {

        themeButton.textContent =
            "☀️ Tema claro";

        localStorage.setItem(
            "animeTheme",
            "dark"
        );
    }
}