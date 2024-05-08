/*
/
/ Načítanie údajov z tabuliek CENEXU
/
/ autor: Roman Holinec
/ verzia: 058
/
*/
console.log("*** cp.js - ver: 058")

// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov z CP
let dbCP = dbTableCP()
async function dbTableCP() {
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
        let item = {
            id:value.id[i],
            etapa:value.etapa[i],
            popis:value.popis[i]
        }
        tabEtapa.push(item)
      }
    })
  return tabEtapa
}

function convertor(value) {
  console.log("convertor")
  console.log(value)
  //let convertData = []
}

// spracovanie údajov pre tlač

//  dokončenie všetkých Promisov
allPromises = [
  dbCP,
  dbMaterial,
  dbPraca,
  dbPridruzeneNaklady,
  dbEtapa
]

Promise.allSettled(allPromises).then(function(data){
  console.log(data)

  const tCP = data[0].value
  console.log(tCP)
  const tMaterial = data[1].value
  console.log(tMaterial)
  const tPraca = data[2].value
  console.log(tPraca)
  const tNaklady = data[3].value
  console.log(tNaklady)
  const tEtapa = data[4].value
  console.log(tEtapa)

  // vytvorenie referencií z tCP
  const vVMaterial = ""

  // zápis hlavičky CP

})
