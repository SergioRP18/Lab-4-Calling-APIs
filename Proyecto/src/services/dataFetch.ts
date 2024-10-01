export const getCharacters = async () => {
    try {
        const dataCharacters = await fetch("https://rickandmortyapi.com/api/character").then(res => res.json());
        return dataCharacters;
    } catch(error){
        console.error(error);
    }
};