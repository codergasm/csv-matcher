import translationsObject from "./translationsObject";

const getTranslationContent = (id) => {
    return translationsObject[id] || translationsObject['pl'];
}

export default getTranslationContent;
