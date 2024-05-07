/*
/
/ Načítanie údajov z tabuliek CENEXU
/
/ autor: Roman Holinec
/ verzia:
/
*/
console.log("*** cp.js - ver: 056")

// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov z CP
async function dataFromCP() {
    let dataFromCenex = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCenex
}
// vytvorenie objektu z CP
let dataCP = dataFromCP()
dataCP.then(
    function(value) { tabData(value) },
    function(error) { console.log(error) }
)

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
    console.log(value)
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
    console.log(value)
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
    let dataFromPridruzeneNaklady = await grist.docApi.fetchTable("Pridruzene_Naklady")
    return dataFromPridruzeneNaklady
}

function tabFromPriduzeneNaklady() {
  let tabPriduzeneNaklady = []
  dbPriduzeneNaklady.then(function(value){
    console.log(value)
    sumObj = value.id.length
    for (let i = 0; i < sumObj; i++) {
      let item = {}
      item.id = value.id[i]
      item.nazov = value.nazov[i]
      item.jednotka = value.jednotka[i]
      item.jednotkova_cena = value.jednotkova_cena[i]
      tabPriduzeneNaklady.push(item)
    }
  })
  return tabPriduzeneNaklady
}

// načítanie údajov z Etapa
let dbEtapa = dbTableEtapa()
let tableEtapa = tabFromEtapa()

async function dbTableEtapa() {
    let dataFromEtapa = await grist.docApi.fetchTable("Etapa")
    return dataFromEtapa
}

function tabFromEtapa() {
  let tabEtapa = []
  dbEtapa.then(function(value){
    sumObj = value.id.length
    for (let i = 0; i < sumObj; i++) {
      let item = {}
      item.id = value.id[i]
      item.etapa = value.etapa[i]
      item.popis = value.popis[i]
      tabEtapa.push(item)
    }
  })
  return tabEtapa
}

console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
console.log(tablePridruzeneNaklady)
