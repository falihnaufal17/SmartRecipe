import { NativeModules, Platform } from 'react-native';

const { MLKitTranslateText: NativeMLKitTranslateText } = NativeModules;

export const LANG_TAGS = {
    ENGLISH: "en",
    INDONESIAN: "id"
}
export type LANG_TAGS_TYPE = 'ENGLISH'|'INDONESIAN';

const identifyLanguage = (text: string) => {
    return new Promise((resolver, rejecter) => {
        NativeMLKitTranslateText.identifyLanguage(
            text,
            (v) => { resolver(v); },
            (e) => { rejecter(e); });
    });
}
const identifyPossibleLanguages = (text: string) => {
    return new Promise((resolver, rejecter) => {
        NativeMLKitTranslateText.identifyLanguage(
            text,
            (v) => { resolver(v); },
            (e) => { rejecter(e); });
    });
}
const translateText = (text: string, sourceLanguageTag:LANG_TAGS_TYPE,targetLanguageTag: LANG_TAGS_TYPE) => {
    return new Promise((resolver, rejecter) => {
        NativeMLKitTranslateText.translateText(
            text,
            sourceLanguageTag,
            targetLanguageTag,
            (v) => { resolver(v); },
            (e) => { rejecter(e); });
    });
}
const isModelDownloaded = (language:LANG_TAGS_TYPE) => {

    return new Promise((resolver, rejecter) => {
        NativeMLKitTranslateText.isModelDownloaded(
            language,
            (v) => { 
                if(Platform.OS === 'ios') {
                    resolver(v === 1 ? true : false); 
                }else{
                    resolver(v);
                }
            },
            // (e) => { rejecter(e); } // no need for now
        );
    });
}
const deleteDownloadedModel = (language: LANG_TAGS_TYPE) => {
    return new Promise((resolver, rejecter) => {
        NativeMLKitTranslateText.deleteDownloadedModel(
            LANG_TAGS[language],
            (v) => { resolver(v); },
            (e) => { rejecter(e); }
        );
    });
}
const downloadModel = (language: LANG_TAGS_TYPE) => {
    return new Promise((resolver, rejecter) => {
        NativeMLKitTranslateText.downloadModel(
            language,
            (v) => { resolver(v); },
            (e) => { rejecter(e); }
        );
    });
}

const MLKitTranslator = {
    identifyLanguage,
    identifyPossibleLanguages,
    translateText,
    isModelDownloaded,
    deleteDownloadedModel,
    downloadModel
}
export default MLKitTranslator;
export {
    identifyLanguage,
    identifyPossibleLanguages,
    translateText,
    isModelDownloaded,
    deleteDownloadedModel,
    downloadModel
}