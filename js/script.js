// ============================================
// CONFIGURAÇÃO DA API
// ============================================

// URL principal da Kitsu API.
// A API retorna os dados dos animes no formato JSON.
const API_URL = "https://kitsu.io/api/edge/anime";

// Quantidade de animes exibidos em uma pesquisa.
const SEARCH_LIMIT = 12;

// Quantidade de animes exibidos na seção "Populares".
const POPULAR_LIMIT = 6;

// ============================================
// ELEMENTOS DO HTML
// ============================================

// Pegamos os elementos da página através dos IDs.
// Isso permite que o JavaScript altere o conteúdo
// do HTML dinamicamente.

const themeButton = document.getElementById("theme-button");

const favoritesList = document.getElementById("favorites-list");
const emptyFavorites = document.getElementById("empty-favorites");

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

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

// Detecta quando o usuário envia uma pesquisa.
searchForm.addEventListener("submit", function (event) {
  // Impede o navegador de recarregar a página.
  event.preventDefault();

  // Pegamos o texto digitado pelo usuário.
  // trim() remove espaços desnecessários no início e no fim.
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

  // Desabilitamos o botão enquanto a requisição acontece.
  searchButton.disabled = true;

  try {
    // encodeURIComponent transforma o texto pesquisado
    // em um formato seguro para ser utilizado na URL.
    const encodedSearch = encodeURIComponent(searchTerm);

    // Montamos a URL da API utilizando o filtro de texto.
    const url = `${API_URL}?filter[text]=${encodedSearch}&page[limit]=${SEARCH_LIMIT}`;

    // ============================================
    // FETCH
    // ============================================

    // fetch() realiza a requisição para a API.
    //
    // await faz o JavaScript esperar a resposta
    // antes de continuar a execução.
    const response = await fetch(url);

    // Verificamos se a resposta HTTP foi bem-sucedida.
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // ============================================
    // JSON
    // ============================================

    // A API retorna os dados no formato JSON.
    //
    // response.json() converte essa resposta
    // para um objeto que pode ser manipulado pelo JavaScript.
    const data = await response.json();

    // ============================================
    // VERIFICAR RESULTADOS
    // ============================================

    // Verificamos se a API retornou dados.
    if (!data.data || data.data.length === 0) {
      showError(`Nenhum anime encontrado para "${searchTerm}".`);

      return;
    }

    // Escondemos as mensagens de carregamento e erro.
    hideMessages();

    // Mostramos a quantidade de resultados encontrados.
    resultsCount.textContent = `${data.data.length} resultado(s)`;

    // Percorremos todos os animes retornados pela API.
    data.data.forEach(function (anime) {
      // Criamos um card para cada anime.
      const card = createAnimeCard(anime);

      // Adicionamos o card à página.
      animeList.appendChild(card);
    });
  } catch (error) {
    // Mostramos o erro no console para facilitar
    // a identificação de problemas durante o desenvolvimento.
    console.error("Erro na pesquisa:", error);

    // Mostramos uma mensagem amigável para o usuário.
    showError(
      "Não foi possível consultar os animes. " +
        "Verifique sua conexão e tente novamente.",
    );
  } finally {
    // Independentemente de sucesso ou erro,
    // o botão volta a ficar disponível.
    searchButton.disabled = false;
  }
}

// ============================================
// CRIAR CARD DO ANIME
// ============================================

function createAnimeCard(anime) {
  // Criamos um elemento <article> para representar
  // o card do anime.
  const card = document.createElement("article");

  // Adicionamos a classe CSS responsável pelo visual.
  card.classList.add("anime-card");

  // ============================================
  // DADOS DO ANIME
  // ============================================

  // Os dados principais do anime ficam dentro
  // do objeto "attributes".
  const attributes = anime.attributes || {};

  // Título do anime.
  // Utilizamos diferentes opções caso algum título
  // não esteja disponível.
  const title =
    attributes.titles?.en ||
    attributes.titles?.en_jp ||
    attributes.canonicalTitle ||
    "Título desconhecido";

  // Imagem da capa.
  // A API oferece diferentes tamanhos de imagem.
  const image =
    attributes.posterImage?.large ||
    attributes.posterImage?.medium ||
    "https://via.placeholder.com/300x450?text=Sem+Imagem";

  // Nota do anime.
  const score = attributes.averageRating ?? "N/A";

  // Quantidade de episódios.
  const episodes = attributes.episodeCount ?? "N/A";

  // Data de lançamento.
  // Extraímos somente o ano da data completa.
  const releaseDate = attributes.startDate
    ? new Date(attributes.startDate).getFullYear()
    : "N/A";

  // Tipo do anime.
  const type = attributes.subtype || "N/A";

  // Status do anime.
  const status = attributes.status || "N/A";

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


            <div class="anime-tags">

                <span class="anime-tag">
                    ${type}
                </span>

                <span class="anime-tag">
                    ${status}
                </span>

            </div>


            <button class="details-button" type="button">
                Ver detalhes
            </button>

        </div>
    `;

  // ============================================
  // BOTÃO DE FAVORITO
  // ============================================

  const favoriteButton = document.createElement("button");

  favoriteButton.classList.add("favorite-button");

  favoriteButton.dataset.id = anime.id;

  // Verificamos se o anime já é favorito.
  if (isFavorite(anime.id)) {
    favoriteButton.textContent = "♥ Favoritado";

    favoriteButton.classList.add("favorited");
  } else {
    favoriteButton.textContent = "♡ Favoritar";
  }

  // Quando o botão for clicado,
  // adicionamos ou removemos o anime.
  favoriteButton.addEventListener("click", function () {
    toggleFavorite(anime);
  });

  // Adicionamos o botão ao card.
  const animeInfo = card.querySelector(".anime-info");

  animeInfo.appendChild(favoriteButton);
  // ============================================
  // BOTÃO DE DETALHES
  // ============================================

  // Encontramos o botão criado dentro do card.
  const detailsButton = card.querySelector(".details-button");

  // Quando o usuário clicar,
  // abrimos o modal com os detalhes daquele anime.
  detailsButton.addEventListener("click", function () {
    openAnimeModal(anime);
  });

  // Retornamos o card pronto.
  return card;
}

// ============================================
// MODAL DE DETALHES
// ============================================

function openAnimeModal(anime) {
  // Pegamos os atributos do anime.
  const attributes = anime.attributes || {};

  // ============================================
  // DADOS
  // ============================================

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
  const synopsis = attributes.synopsis || "Sinopse não disponível.";

  // Nota.
  const score = attributes.averageRating ?? "N/A";

  // Episódios.
  const episodes = attributes.episodeCount ?? "N/A";

  // Status.
  const status = attributes.status || "N/A";

  // Tipo.
  const type = attributes.subtype || "N/A";

  // Data.
  const releaseDate = attributes.startDate
    ? new Date(attributes.startDate).getFullYear()
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

  // Impedimos a página de rolar enquanto o modal está aberto.
  document.body.style.overflow = "hidden";
}

// ============================================
// FECHAR MODAL
// ============================================

// Botão X.
closeModalButton.addEventListener("click", closeModal);

// Fundo escuro do modal.
document.querySelector(".modal-overlay").addEventListener("click", closeModal);

// Função responsável por fechar o modal.
function closeModal() {
  modal.classList.add("hidden");

  // Devolvemos a rolagem da página.
  document.body.style.overflow = "";
}

// ============================================
// ANIMES POPULARES
// ============================================

// A Kitsu permite ordenar os animes pela quantidade
// de usuários que os adicionaram à biblioteca.
//
// Aqui buscamos os animes mais populares
// quando a página é carregada.

async function loadPopularAnime() {
  try {
    // Montamos a URL para buscar os animes
    // mais populares.
    const url = `${API_URL}?sort=-userCount&page[limit]=${POPULAR_LIMIT}`;

    // Fazemos a requisição para a API.
    const response = await fetch(url);

    // Verificamos se houve algum problema HTTP.
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Convertendo a resposta da API para JSON.
    const data = await response.json();

    // Verificamos se existem resultados.
    if (!data.data || data.data.length === 0) {
      throw new Error("Nenhum anime popular encontrado.");
    }

    // Limpamos a área de animes populares.
    popularList.innerHTML = "";

    // Criamos um card para cada anime.
    data.data.forEach(function (anime) {
      const card = createAnimeCard(anime);

      popularList.appendChild(card);
    });
  } catch (error) {
    // Registramos o erro no console.
    console.error("Erro ao carregar populares:", error);

    // Informamos o problema ao usuário.
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

// A API não possui um endpoint específico para
// buscar um anime aleatório.
//
// Por isso, fazemos uma consulta ordenada por
// popularidade e utilizamos um offset aleatório.

async function loadRandomAnime() {
  try {
    // Escolhemos uma posição aleatória entre 0 e 49.
    const randomOffset = Math.floor(Math.random() * 50);

    // Montamos a URL da requisição.
    const url = `${API_URL}?sort=-userCount&page[limit]=1&page[offset]=${randomOffset}`;

    // Fazemos a requisição.
    const response = await fetch(url);

    // Verificamos se a API respondeu corretamente.
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // Convertendo a resposta para JSON.
    const data = await response.json();

    // Verificamos se recebemos um anime.
    if (data.data && data.data.length > 0) {
      // Abrimos diretamente o modal.
      openAnimeModal(data.data[0]);
    } else {
      throw new Error("Nenhum anime aleatório encontrado.");
    }
  } catch (error) {
    // Registramos o erro no console.
    console.error("Erro ao buscar anime aleatório:", error);
  }
}

// ============================================
// BOTÃO DE ANIME ALEATÓRIO
// ============================================

// Quando o usuário clicar no botão,
// buscamos um anime aleatório.
randomButton.addEventListener("click", loadRandomAnime);

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

// Mostra uma mensagem de erro.
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

// Permite fechar o modal pressionando a tecla ESC.

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// ============================================
// SISTEMA DE FAVORITOS
// ============================================

// Pegamos os favoritos salvos no navegador.
//
// JSON.parse() transforma o texto salvo
// pelo localStorage novamente em objeto JavaScript.
//
// Se não existir nenhum favorito,
// usamos um array vazio.
let favorites = JSON.parse(localStorage.getItem("animeFavorites")) || [];

// ============================================
// SALVAR FAVORITOS
// ============================================

function saveFavorites() {
  // JSON.stringify() transforma o array
  // em texto para poder ser armazenado.
  localStorage.setItem("animeFavorites", JSON.stringify(favorites));
}

// ============================================
// VERIFICAR SE É FAVORITO
// ============================================

function isFavorite(animeId) {
  // some() verifica se existe algum anime
  // com o mesmo ID dentro dos favoritos.
  return favorites.some(function (anime) {
    return anime.id === animeId;
  });
}

// ============================================
// ADICIONAR / REMOVER FAVORITO
// ============================================

function toggleFavorite(anime) {
  // Verificamos se o anime já está nos favoritos.
  const alreadyFavorite = isFavorite(anime.id);

  if (alreadyFavorite) {
    // Se já estiver, removemos.
    favorites = favorites.filter(function (favoriteAnime) {
      return favoriteAnime.id !== anime.id;
    });
  } else {
    // Se não estiver, adicionamos.
    favorites.push(anime);
  }

  // Salvamos a nova lista.
  saveFavorites();

  // Atualizamos a tela de favoritos.
  renderFavorites();

  // Atualizamos os botões dos cards.
  updateFavoriteButtons();
}

// ============================================
// ATUALIZAR BOTÕES DE FAVORITO
// ============================================

function updateFavoriteButtons() {
  // Procuramos todos os botões de favorito.
  const buttons = document.querySelectorAll(".favorite-button");

  buttons.forEach(function (button) {
    const animeId = button.dataset.id;

    const favorite = isFavorite(animeId);

    if (favorite) {
      button.textContent = "♥ Favoritado";

      button.classList.add("favorited");
    } else {
      button.textContent = "♡ Favoritar";

      button.classList.remove("favorited");
    }
  });
}

// ============================================
// RENDERIZAR FAVORITOS
// ============================================

function renderFavorites() {
  // Limpamos a lista atual.
  favoritesList.innerHTML = "";

  // Verificamos se não existem favoritos.
  if (favorites.length === 0) {
    emptyFavorites.classList.remove("hidden");

    return;
  }

  // Escondemos a mensagem vazia.
  emptyFavorites.classList.add("hidden");

  // Criamos um card para cada favorito.
  favorites.forEach(function (anime) {
    const card = createAnimeCard(anime);

    favoritesList.appendChild(card);
  });

  // Atualizamos os botões.
  updateFavoriteButtons();
}

// ============================================
// SISTEMA DE TEMA
// ============================================

// Verificamos se existe um tema salvo.
const savedTheme =
    localStorage.getItem("animeTheme");


// Aplicamos o tema salvo.
if (savedTheme === "light") {

    document.body.classList.add("light-theme");

    themeButton.textContent = "🌙 Tema escuro";
}


// ============================================
// ALTERAR TEMA
// ============================================

themeButton.addEventListener(
    "click",
    function () {

        // Alternamos a classe do tema claro.
        document.body.classList.toggle(
            "light-theme"
        );


        // Verificamos qual tema está ativo.
        const isLightTheme =
            document.body.classList.contains(
                "light-theme"
            );


        if (isLightTheme) {

            themeButton.textContent =
                "🌙 Tema escuro";

            // Salvamos a preferência.
            localStorage.setItem(
                "animeTheme",
                "light"
            );

        } else {

            themeButton.textContent =
                "☀️ Tema claro";

            // Salvamos a preferência.
            localStorage.setItem(
                "animeTheme",
                "dark"
            );
        }

    }
);

// ============================================
// INICIALIZAÇÃO
// ============================================

// Assim que a página carregar,
// buscamos os animes populares.

loadPopularAnime();
renderFavorites();
