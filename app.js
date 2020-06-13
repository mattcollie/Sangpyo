const fs = require('fs');
const request = require('request');

async function getProductInfo(productId) {
    return new Promise(async (resolve, reject) => {
        await request(`https://shopee.ph/api/v2/item/get?itemid=${productId}&shopid=20115612`, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode !== 200) {
                reject('error');
            }
            resolve(body);
        });
    });
}

function getProductsFromData() {
    let items = [];
    let rawDataFiles = ['./data/data.json', './data/data1.json'];
    for (let i in rawDataFiles) {
        if (rawDataFiles.hasOwnProperty(i)) {
            let path = rawDataFiles[i];
            let rawData = fs.readFileSync(path);
            let parsedJson = JSON.parse(rawData);
            items.push(...parsedJson.items);
        }
    }
    return items;
}

function getProducts() {
    let items = getProductsFromData();
    return Promise.all(items.map(async item => {
        let productInfo = JSON.parse(await getProductInfo(item.itemid));
        console.log('PRODUCT::', productInfo);
        return {
            id: item.itemid,
            name: item.name,
            description: productInfo.item.description,
            stock: productInfo.item.stock,
            brand: productInfo.item.brand,
        };
    }));
}

getProducts().then(items => {
    fs.writeFile("products.json", JSON.stringify(items), "utf8", () => {
        console.log('DONE');
    });
})



