
function _getBaseUrl(category) {
    return category === 'Food' ? 'https://world.openfoodfacts.org' : 'https://world.openbeautyfacts.org';
}

export async function getProduct(ean, category) {
    const url = `${_getBaseUrl(category)}/api/v0/product/${ean}.json`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        });
        const product = await response.json();
        if (product.status === 0) {
            return null;
        }
        return product;
    } catch (error) {
        console.error(error);
        return null;
    }
}