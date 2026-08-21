// ============================================
// TESTE DA ANILIST API
// ============================================

// Endpoint oficial da AniList.
const API_URL = "https://graphql.anilist.co";


// ============================================
// QUERY GRAPHQL
// ============================================

// Aqui dizemos exatamente quais informações
// queremos receber da API.
//
// Estamos procurando por "Naruto".
const query = `
    query {
        Page(perPage: 5) {
            media(search: "Naruto", type: ANIME) {
                id

                title {
                    romaji
                    english
                }

                episodes
                averageScore

                coverImage {
                    large
                }
            }
        }
    }
`;


// ============================================
// FUNÇÃO DE TESTE
// ============================================

async function testAPI() {

    try {

        console.log("Conectando com a AniList...");

        // Fazemos uma requisição POST para a API.
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },

            // Enviamos nossa query dentro do corpo
            // da requisição.
            body: JSON.stringify({
                query: query
            })
        });


        // Verificamos se a resposta HTTP deu certo.
        if (!response.ok) {

            throw new Error(
                `Erro HTTP: ${response.status}`
            );
        }


        // Convertemos a resposta para JSON.
        const data = await response.json();


        // Mostramos o JSON completo no Console.
        console.log("Resposta da AniList:");

        console.log(data);


        // Mostramos os animes encontrados.
        console.log(
            "Animes encontrados:",
            data.data.Page.media
        );


    } catch (error) {

        console.error(
            "Erro ao conectar com a AniList:",
            error
        );
    }
}


// Executamos o teste.
testAPI();