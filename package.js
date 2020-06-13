const fs = require('fs');

let rawData = fs.readFileSync('./products.json');
let parsedData = JSON.parse(rawData);

console.log('DATA::', parsedData);

let data = ['name,description,stock,brand'];
for(let key in parsedData) {
    let item = parsedData[key];
    data.push(`"${item.name}","${item.description.replace('"', "'")}","${item.stock}","${item.brand}"`);
}

fs.writeFile("products.csv", data.join('\r\n'), "utf8", () => {
    console.log('DONE');
});