import axios from "axios";

export const fetchWordInfo = (word) => axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word ?? ""}`)