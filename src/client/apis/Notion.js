import Axios from "axios";

const baseURL = "";

export const getIngredients = () => Axios.get(`${baseURL}/ingredients`)
    .then(response => {
        return (response.data.results);
    }).catch(error => {
        console.log(error);
    });

export const getIngredientByEAN = (ean) => Axios.get(`${baseURL}/ingredients/ean/${ean}`)
    .then(response => {
        return (response.data.results);
    }).catch(error => {
        console.log(error);
    });

export const getIngredientByName = (name) => Axios.get(`${baseURL}/ingredients/name/${name}`)
    .then(response => {
        return (response.data.results);
    }).catch(error => {
        console.log(error);
    });

export const postIngredient = (name, brand, ean) => Axios.post(`${baseURL}/ingredients`, {
    Name: name,
    Brand: brand,
    EAN: ean
}).catch(error => {
    console.log(error);
});

export const addStock = (pageId, stock) => Axios.patch(`${baseURL}/ingredients/${pageId}/stock`, {
    Stock: stock
}).catch(error => {
    console.log(error);
});