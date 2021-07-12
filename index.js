const puppeteer = require('puppeteer')
var readline = require('readline');

function cryptoConsult() {
    new Promise(async (resolve, reject) => {
        this.browser = await newBrowser({ headless: true })
        resolve(this.browser)
    }).then(async browser => {
        this.page = await newPage(browser)
        return this.page
    }).then(async page => {
        await page.goto('https://br.investing.com/crypto/currencies')
    })
    this.moeda = null
}

cryptoConsult.prototype.consultCrypto = async function consultCrypto(callback) {
    if (this.page) {
        try {
            await this.page.evaluate((moeda) => {
                tableRow = document.querySelector(`td[title="${moeda[0].toUpperCase()}"]`).parentElement
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
    else setTimeout(() => {
        this.consultCrypto(callback)
    }, 3000);
}

const newBrowser = async (options) => {
    return await puppeteer.launch({ headless: options.headless });
}
const newPage = async (browser) => {
    return await browser.newPage()
}
const closeApp = async (browser) => {
    browser.close()
}

module.exports = {
    cryptoConsult,
    closeApp
}