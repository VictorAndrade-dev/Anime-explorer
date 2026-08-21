// ============================================
// CONFIGURAÇÃO DA API
// ============================================

// URL base da Kitsu API.
const API_URL = "https://kitsu.io/api/edge/anime";


// ============================================
// ELEMENTOS DO HTML
// ============================================

// Pegamos os elementos da página através dos IDs.
// Isso permite que o JavaScript altere o conteúdo
// do HTML dinamicamente.

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");

const animeList = document.getElementById("anime-list");
const resultsCount = document.getElementById("results-count");

const initialMessage = document.getElementById("initial-message");
const loadingMessage = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const errorText = document.getElementById("error-text");

const modal = document.getElementById("anime-modal");
const modalBody = document.getElementById("modal-body");
const closeModalButton = document.getElementById("close-modal");

const randomButton = document.getElementById("random-button");
const popularList = document.getElementById("popular-list");


// ============================================
// EVENTO DO FORMULÁRIO
// ============================================

// Detecta quando o usuário envia a pesquisa.
searchForm.addEventListener("submit", function (event) {

    // Impede o navegador de recarregar a página.
    event.preventDefault();

    // Pegamos o texto digitado pelo usuário.
    // trim() remove espaços desnecessários.
    const searchTerm = searchInput.value.trim();

    // Verificamos se o campo está vazio.
    if (searchTerm === "") {

        showError("Digite o nome de um anime para pesquisar.");

        return;
    }

    // Inicia a pesquisa.
    searchAnime(searchTerm);
});


// ============================================
// PESQUISAR ANIME
// ============================================

async function searchAnime(searchTerm) {

    // Limpamos os resultados anteriores.
    animeList.innerHTML = "";

    // Limpamos o contador.
    resultsCount.textContent = "";

    // Mostramos a mensagem de carregamento.
    showLoading();

    try {

        // encodeURIComponent transforma o texto pesquisado
        // em um formato seguro para colocar na URL.
        const encodedSearch = encodeURIComponent(searchTerm);

        // Montamos a URL da API.
        const url =
            `${API_URL}?filter[text]=${encodedSearch}&page[limit]=12`;


        // ============================================
        // FETCH
        // ============================================

        // fetch() faz a requisição para a API.
        //
        // await faz o JavaScript esperar a resposta.
        const response = await fetch(url);


        // Verificamos se a resposta foi bem-sucedida.
        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );
        }


        // ============================================
        // JSON
        // ============================================

        // Convertemos a resposta da API para JSON.
        const data = await response.json();


        // ============================================
        // VERIFICAR RESULTADOS
        // ============================================

        if (!data.data || data.data.length === 0) {

            showError(
                `Nenhum anime encontrado para "${searchTerm}".`
            );

            return;
        }


        // Escondemos as mensagens.
        hideMessages();


        // Mostramos a quantidade de resultados.
        resultsCount.textContent =
            `${data.data.length} resultado(s)`;


        // Percorremos todos os animes encontrados.
        data.data.forEach(function (anime) {

            // Criamos o card.
            const card = createAnimeCard(anime);

            // Adicionamos o card à página.
            animeList.appendChild(card);
        });

    } catch (error) {

        console.error("Erro na pesquisa:", error);

        showError(
            "Não foi possível consultar os animes. " +
            "Tente novamente."
        );
    }
}


// ============================================
// CRIAR CARD
// ============================================

function createAnimeCard(anime) {

    // Criamos um elemento HTML <article>.
    const card = document.createElement("article");

    // Adicionamos a classe CSS.
    card.classList.add("anime-card");


    // ============================================
    // DADOS DO ANIME
    // ============================================

    // Os dados principais do anime ficam dentro
    // do objeto "attributes".
    const attributes = anime.attributes;


    // Título principal.
    const title =
        attributes.titles?.en ||
        attributes.titles?.en_jp ||
        attributes.canonicalTitle ||
        "Título desconhecido";


    // Imagem da capa.
    const image =
        attributes.posterImage?.large ||
        attributes.posterImage?.medium ||
        "https://via.placeholder.com/300x450?text=Sem+Imagem";


    // Nota do anime.
    const score =
        attributes.averageRating ||
        "N/A";


    // Quantidade de episódios.
    const episodes =
        attributes.episodeCount ||
        "N/A";


    // Data de lançamento.
    const releaseDate =
        attributes.startDate
            ? new Date(attributes.startDate)
                .getFullYear()
            : "N/A";


    // ============================================
    // HTML DO CARD
    // ============================================

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


            <button class="details-button">
                Ver detalhes
            </button>

        </div>
    `;


    // ============================================
    // BOTÃO DE DETALHES
    // ============================================

    const detailsButton =
        card.querySelector(".details-button");


    detailsButton.addEventListener(
        "click",
        function () {

            openAnimeModal(anime);

        }
    );


    // Retornamos o card pronto.
    return card;
}


// ============================================
// MODAL DE DETALHES
// ============================================

function openAnimeModal(anime) {

    const attributes = anime.attributes;


    // Título.
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


    // Sinopse.
    const synopsis =
        attributes.synopsis ||
        "Sinopse não disponível.";


    // Nota.
    const score =
        attributes.averageRating ||
        "N/A";


    // Episódios.
    const episodes =
        attributes.episodeCount ||
        "N/A";


    // Status.
    const status =
        attributes.status ||
        "N/A";


    // Tipo.
    const type =
        attributes.subtype ||
        "N/A";


    // Data.
    const releaseDate =
        attributes.startDate
            ? new Date(attributes.startDate)
                .getFullYear()
            : "N/A";


    // ============================================
    // HTML DO MODAL
    // ============================================

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

            </div>

        </div>
    `;


    // Mostramos o modal.
    modal.classList.remove("hidden");
}


// ============================================
// FECHAR MODAL
// ============================================

// Botão X.
closeModalButton.addEventListener(
    "click",
    closeModal
);


// Fundo do modal.
document
    .querySelector(".modal-overlay")
    .addEventListener(
        "click",
        closeModal
    );


// Função para fechar.
function closeModal() {

    modal.classList.add("hidden");
}


// ============================================
// ANIMES POPULARES
// ============================================

// A Kitsu permite ordenar os animes pela
// quantidade de favoritos.
//
// Aqui carregamos alguns animes populares
// quando a página abre.

async function loadPopularAnime() {

    try {

        const url =
            `${API_URL}?sort=-userCount&page[limit]=6`;


        const response = await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );
        }


        const data = await response.json();


        // Limpamos a área de populares.
        popularList.innerHTML = "";


        // Criamos os cards.
        data.data.forEach(function (anime) {

            const card = createAnimeCard(anime);

            popularList.appendChild(card);
        });


    } catch (error) {

        console.error(
            "Erro ao carregar populares:",
            error
        );

        popularList.innerHTML = `
            <p>
                Não foi possível carregar os animes populares.
            </p>
        `;
    }
}


// ============================================
// ANIME ALEATÓRIO
// ============================================

// A API não possui um endpoint específico de
// "anime aleatório", então fazemos uma busca
// usando uma página aleatória.

async function loadRandomAnime() {

    try {

        // Geramos uma página aleatória.
        const randomPage =
            Math.floor(Math.random() * 10) + 1;


        const url =
            `${API_URL}?sort=-userCount&page[limit]=1&page[offset]=${randomPage}`;


        const response = await fetch(url);


        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );
        }


        const data = await response.json();


        if (data.data && data.data.length > 0) {

            openAnimeModal(data.data[0]);
        }


    } catch (error) {

        console.error(
            "Erro ao buscar anime aleatório:",
            error
        );
    }
}


// ============================================
// BOTÃO DE ANIME ALEATÓRIO
// ============================================

randomButton.addEventListener(
    "click",
    loadRandomAnime
);


// ============================================
// MENSAGENS DA INTERFACE
// ============================================

// Mostra a tela de carregamento.
function showLoading() {

    initialMessage.classList.add("hidden");

    errorMessage.classList.add("hidden");

    loadingMessage.classList.remove("hidden");
}


// Esconde todas as mensagens.
function hideMessages() {

    initialMessage.classList.add("hidden");

    loadingMessage.classList.add("hidden");

    errorMessage.classList.add("hidden");
}


// Mostra mensagem de erro.
function showError(message) {

    initialMessage.classList.add("hidden");

    loadingMessage.classList.add("hidden");

    errorMessage.classList.remove("hidden");

    errorText.textContent = message;

    resultsCount.textContent = "";
}


// ============================================
// TECLA ESC
// ============================================

// Permite fechar o modal pressionando ESC.

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

// Assim que a página carregar,
// buscamos os animes populares.

loadPopularAnime();