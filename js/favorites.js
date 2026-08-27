// ============================================
// SISTEMA DE FAVORITOS
// ============================================

// Carrega os favoritos salvos no navegador.
//
// JSON.parse() transforma o texto armazenado
// no localStorage novamente em objeto JavaScript.

let favorites =
    JSON.parse(
        localStorage.getItem("animeFavorites")
    ) || [];


// ============================================
// SALVAR FAVORITOS
// ============================================

function saveFavorites() {

    // JSON.stringify() transforma o array
    // em texto para armazenamento.

    localStorage.setItem(
        "animeFavorites",
        JSON.stringify(favorites)
    );
}


// ============================================
// VERIFICAR FAVORITO
// ============================================

function isFavorite(animeId) {

    return favorites.some(
        function (anime) {
            return anime.id === animeId;
        }
    );
}


// ============================================
// ADICIONAR / REMOVER
// ============================================

function toggleFavorite(anime) {

    if (isFavorite(anime.id)) {

        // Remove o anime.
        favorites = favorites.filter(
            function (favoriteAnime) {
                return favoriteAnime.id !== anime.id;
            }
        );

    } else {

        // Adiciona o anime.
        favorites.push(anime);
    }

    // Salva no navegador.
    saveFavorites();

    // Atualiza a interface.
    renderFavorites();
    updateFavoriteButtons();
}