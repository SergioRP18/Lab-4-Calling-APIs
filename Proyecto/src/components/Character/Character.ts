export enum Attribute {
    "image" = "image",
    "name" = "name",
    "status" = "status",
    "species" = "species",
    "type" = "type",
    "origin" = "origin",
    "nameoffirstepisode" = "nameoffirstepisode",
};

class CardCharacter extends HTMLElement {
    image? : string;
    name? : string;
    status? : string;
    species? : string;
    type? : string;
    origin? : string;
    nameoffirstepisode? : string;

    static get observedAttributes(){
        return Object.keys(Attribute);
    }

    attributeChangedCallback(propName:Attribute, oldValue: string | undefined, newValue: string | undefined){
        switch(propName){
            default:
                this[propName] = newValue;
                break;
        }        
    }

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.render();
    }
    
    render(){
        if(this.shadowRoot){
            this.shadowRoot.innerHTML = `
            <section>
                <img src="${this.image}">
                <h2>${this.name}</h2>
                <h4>${this.status}</h4>
                <p>${this.species}</p>
                <h5>${this.type}</h5>
                <h5>${this.origin}</h5>
                <h2>${this.nameoffirstepisode}</h2>
            </section>
            `;
        };
    }
}
customElements.define("app-character", CardCharacter);
export default CardCharacter;