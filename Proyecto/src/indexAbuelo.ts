import * as components from "./components/indexPadre"
import CardCharacter, {Attribute} from "./components/Character/Character";
import { getCharacters } from "./services/dataFetch";

class AppContainer extends HTMLElement {
    create: CardCharacter[] = [];
    searchCharacter = "";

    constructor(){
        super();
        this.attachShadow({mode:'open'});
    }

    async connectedCallback(){
        this.mount();
    }

    async mount(){
        await this.render("");
        this.input();
    }

    input(){
        const input = this.shadowRoot?.querySelector('input');
        const btn = this.shadowRoot?.querySelector('button');
        input?.addEventListener('change', (dataCharacters: any) => {
            const searchCharacter = dataCharacters.target?.value;
            btn?.addEventListener('click', () => {
                this.render(searchCharacter);
            });
        });
    }

    async render(searchCharacter: string){
        if(this.shadowRoot){
            const dataCharacters = await getCharacters();

            this.create = [];

            dataCharacters.forEach((dataCharacters: any) => {
                if(dataCharacters.name.includes(searchCharacter)){

                    const card = this.ownerDocument.createElement("app-character") as CardCharacter;
                    card.setAttribute(Attribute.image, dataCharacters.image);
                    card.setAttribute(Attribute.name, dataCharacters.name);
                    card.setAttribute(Attribute.status, dataCharacters.status);
                    card.setAttribute(Attribute.species, dataCharacters.species);
                    card.setAttribute(Attribute.type, dataCharacters.type);
                    card.setAttribute(Attribute.origin, dataCharacters.origin);
                    card.setAttribute(Attribute.nameoffirstepisode, dataCharacters.nameoffirstepisode);
                    
                    this.create.push(card);
                }
            });

            this.shadowRoot.innerHTML = ``;

            const searchBar = this.ownerDocument.createElement("div");
                searchBar.setAttribute("id", "searchBar");
            const input = this.ownerDocument.createElement("input");
                input.setAttribute("type", "text");
                input.textContent = this.searchCharacter;
                searchBar.appendChild(input);
            const button = this.ownerDocument.createElement("button");
                button.textContent = "search";
                searchBar.appendChild(button);

            this.shadowRoot.appendChild(searchBar);

            this.create.forEach((dataCharacters: any) => {
                this.shadowRoot?.appendChild(dataCharacters);
            });

            this.input();
        };
    }
};
customElements.define("app-container", AppContainer);