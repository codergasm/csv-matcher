import translationsObject from "./translationsObject";

const getTranslationContent = (id) => {
    return translationsObject[id];
}

export default getTranslationContent;
