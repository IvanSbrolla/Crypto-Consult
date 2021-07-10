const puppeteer = require('puppeteer')

function cryptoConsult(moeda) {
    this.moeda = moeda
}

cryptoConsult.prototype.consultCrypto = async function consultCrypto(callback) {
    try {
        const browser = await newBrowser({ headless: true })
        const page = await newPage(browser)
        await page.goto('https://br.investing.com/crypto/currencies');
        await page.evaluate((moeda) => {
            tableRow = document.querySelector(`td[title="${moeda[0]}"]`).parentElement
            const data = {
                val_nome: tableRow.children[2].getAttribute('title'),
                val_cod: tableRow.children[3].getAttribute('title'),
                val_precoUSD: tableRow.children[4].children[0].innerHTML,
                val_capitalizacao: tableRow.children[5].innerHTML,
                val_vol24h: tableRow.children[6].innerHTML,
                val_volTotal: tableRow.children[7].innerHTML,
                val_var24h: tableRow.children[8].innerHTML,
                val_var7d: tableRow.children[9].innerHTML
            }
            return Promise.resolve(data)
        }, [this.moeda]).then(data => callback(data, null))
    } catch (error) {
        return callback(null, error)
    }
}

const newBrowser = async (options) => {
    return await puppeteer.launch({ headless: options.headless });
}
const newPage = async (browser) => {
    return await browser.newPage()
}

module.exports = {
    cryptoConsult
}