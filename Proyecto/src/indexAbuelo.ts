import * as components from "./components/indexPadre";
import CardCharacter, { Attribute } from "./components/Character/Character";
import { getCharacters } from "./services/dataFetch";

class AppContainer extends HTMLElement {
    create: CardCharacter[] = [];
    characters: any[] = []; // Almacenar personajes

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        await this.fetchCharacters(); // Obtener personajes al cargar
        this.mount();
    }

    async fetchCharacters() {
        try {
            const dataCharacters = await getCharacters();
            this.characters = dataCharacters.results; // Almacena los personajes
        } catch (error) {
            console.error("Error fetching characters:", error);
        }
    }

    mount() {
        this.render(0); // Renderizar inicialmente
        this.setupInput(); // Configurar eventos
    }

    setupInput() {
        const searchBar = this.ownerDocument.createElement("div");
        searchBar.setAttribute("id", "searchBar");

        const input = this.ownerDocument.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", "Ingresa el número de personajes");
        searchBar.appendChild(input);

        const button = this.ownerDocument.createElement("button");
        button.textContent = "Buscar";
        searchBar.appendChild(button);

        this.shadowRoot?.appendChild(searchBar);

        button.addEventListener('click', async () => {
            const count = parseInt(input.value || "0", 10);
            if (!isNaN(count) && count > 0) {
                await this.render(count); // Asegúrate de que se espera la promesa
            } else {
                alert("Por favor, ingresa un número válido.");
            }
        });
    }

    async render(count: number) {
        if (this.shadowRoot) {
            // Eliminar tarjetas anteriores
            this.shadowRoot.querySelectorAll('app-character').forEach(card => card.remove());

            const filteredCharacters = this.characters.slice(0, count); // Obtener solo los primeros 'count' personajes

            // Obtener nombres del primer episodio
            const charactersWithEpisodes = await Promise.all(filteredCharacters.map(async character => {
                const firstEpisodeUrl = character.episode[0]; // Asumiendo que el primer episodio está en el primer índice
                try {
                    const episodeData = await fetch(firstEpisodeUrl).then(res => res.json());
                    character.nameoffirstepisode = episodeData.name; // Almacena el nombre del episodio en el personaje
                } catch (error) {
                    console.error("Error fetching episode data:", error);
                    character.nameoffirstepisode = "N/A"; // Manejo de errores
                }
                return character;
            }));

            // Crear las tarjetas de personajes filtrados
            charactersWithEpisodes.forEach(character => {
                const card = this.ownerDocument.createElement("app-character") as CardCharacter;
                card.setAttribute(Attribute.image, character.image);
                card.setAttribute(Attribute.name, character.name);
                card.setAttribute(Attribute.status, character.status);
                card.setAttribute(Attribute.species, character.species);
                card.setAttribute(Attribute.type, character.type);
                card.setAttribute(Attribute.origin, character.origin.name);
                card.setAttribute(Attribute.episode, character.episode || "N/A"); // Manejo de posibles errores

                if (this.shadowRoot) {
                    this.shadowRoot.appendChild(card);
                }
            });
        }
    }
}

customElements.define("app-container", AppContainer);
