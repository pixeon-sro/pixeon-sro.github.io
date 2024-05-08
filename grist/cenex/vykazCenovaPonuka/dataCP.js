/*
/
/ Načítanie údajov z tabuliek CENEXU
/
/ autor: Roman Holinec
/ verzia: 056
/
*/
console.log("*** cp.js - ver: 057")

let tabStack = {
  tabEtapa: new Array(),

  // zapisovač tabuľky
  writer: function(name, data) {
    if (name == "tabEtapa") {
      this.tabEtapa = data
      console.log("writer")
      console.log(this.tabEtapa)
    }
  },
//timeout = setTimeout(alertFunc, 3000);
  // čítač tabuľky
  reader: function(name) {
    if (name == "tabEtapa") {
      if (this.tabEtapa.length > 0) {
        console.log("reader1")
        console.log(this.tabEtapa)
        return this.tabEtapa
      }
      else {
        setTimeout( console.log("this.tabEtapa"), 3000);
      }
    }
  }
}


// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov z CP
//sparcovanie prebieha v cp.html
async function dataFromCP() {
    let dataFromCenex = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCenex
}

//načítanie údajov z Výkazu výmer - Materiál
let dbMaterial = dbTableMaterial()
let tableMaterial = tabFromMaterial()

async function dbTableMaterial() {
    let dataFromMaterial = await grist.docApi.fetchTable("Material")
    return dataFromMaterial
}

function tabFromMaterial() {
  let tabMaterial = []
  dbMaterial.then(function(value){
    sumObj = value.id.length
    for (let i = 0; i < sumObj; i++) {
      let item = {}
      item.id = value.id[i]
      item.nazov = value.nazov[i]
      item.jednotka = value.jednotka[i]
      item.jednotkova_cena = value.jednotkova_cena[i]
      tabMaterial.push(item)
    }
  })
  return tabMaterial
}

//načítanie údajov z Výkazu výmer - Práca
let dbPraca = dbTablePraca()
let tablePraca = tabFromPraca()

async function dbTablePraca() {
    let dataFromPraca = await grist.docApi.fetchTable("Praca")
    return dataFromPraca
}

function tabFromPraca() {
  let tabPraca = []
  dbPraca.then(function(value){
    sumObj = value.id.length
    for (let i = 0; i < sumObj; i++) {
      let item = {}
      item.id = value.id[i]
      item.nazov = value.nazov[i]
      item.jednotka = value.jednotka[i]
      item.jednotkova_cena = value.jednotkova_cena[i]
      tabPraca.push(item)
    }
  })
  return tabPraca
}

//načítanie údajov z Výkazu výmer - Pridruzene_naklady
let dbPridruzeneNaklady = dbTablePridruzeneNaklady()
let tablePridruzeneNaklady = tabFromPridruzeneNaklady()

async function dbTablePridruzeneNaklady() {
    let dataFromPridruzeneNaklady = await grist.docApi.fetchTable("Pridruzene_naklady")
    return dataFromPridruzeneNaklady
}

function tabFromPridruzeneNaklady() {
  let tabPridruzeneNaklady = []
  dbPridruzeneNaklady.then(function(value){
    sumObj = value.id.length
    for (let i = 0; i < sumObj; i++) {
      let item = {}
      item.id = value.id[i]
      item.nazov = value.nazov[i]
      item.jednotka = value.jednotka[i]
      item.jednotkova_cena = value.jednotkova_cena[i]
      tabPridruzeneNaklady.push(item)
    }
  })
  return tabPridruzeneNaklady
}

// načítanie údajov z Etapa
async function dbTableEtapa() {
    let dataFromEtapa = await grist.docApi.fetchTable("Etapa")
    return dataFromEtapa
}
const etapa = dbTableEtapa()
  .then(function(response){
    return settingEtapa(response)
  })
  .then(function(data){
    tabStack.writer("tabEtapa", data)
  })

function settingEtapa(value) {
    let etapa = new Array()
    sumObj = value.id.length
    for (let i = 0; i < sumObj; i++) {
        let item = {
            id:value.id[i],
            etapa:value.etapa[i],
            popis:value.popis[i]
        }
        etapa.push(item)
    }
  return etapa
}

console.log(tabStack.reader("tabEtapa"))
