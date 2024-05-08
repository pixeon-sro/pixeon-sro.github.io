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
async function dbTableMaterial() {
    let dataFromMaterial = await grist.docApi.fetchTable("Material")
    return dataFromMaterial
}

//načítanie údajov z Výkazu výmer - Práca
let dbPraca = dbTablePraca()
async function dbTablePraca() {
    let dataFromPraca = await grist.docApi.fetchTable("Praca")
    return dataFromPraca
}

//načítanie údajov z Výkazu výmer - Pridruzene_naklady
let dbPridruzeneNaklady = dbTablePridruzeneNaklady()
async function dbTablePridruzeneNaklady() {
    let dataFromPridruzeneNaklady = await grist.docApi.fetchTable("Pridruzene_naklady")
    return dataFromPridruzeneNaklady
}

// načítanie údajov z Etapa
let dbEtapa = dbTableEtapa()
async function dbTableEtapa() {
    let dataFromEtapa = await grist.docApi.fetchTable("Etapa")
    return dataFromEtapa
}

function convertor(value) {
  let convertData = []
  let sumObj = value.id.length
  for (let i = 0; i < sumObj; i++) {
    let item = {}
    item.id = value.id[i]
    if(typeof value.etapa !== 'undefined') { item.etapa = value.etapa[i] }
    if(typeof value.popis !== 'undefined') { item.popis = value.popis[i] }
    if(typeof value.nazov !== 'undefined') { item.nazov = value.nazov[i] }
    if(typeof value.jednotka !== 'undefined') { item.jednotka = value.jednotka[i] }
    if(typeof value.jednotkova_cena !== 'undefined') { item.jednotkova_cena = value.jednotkova_cena[i] }
    if(typeof value.mnozstvo !== 'undefined') { item.mnozstvo = value.mnozstvo[i] }
    convertData.push(item)
  }
  return convertData
}

// spracovanie údajov pre tlač
//  pole všetkých Promisov
allPromises = [
  dbCP,
  dbMaterial,
  dbPraca,
  dbPridruzeneNaklady,
  dbEtapa
]
// načítanie všetkych Promisov a príprava polí objektov
Promise.allSettled(allPromises).then(function(data){
  console.log(data)

  const tCP = data[0].value
  console.log(tCP)
  const tMaterial = convertor(data[1].value)
  console.log(tMaterial)
  const tPraca = convertor(data[2].value)
  console.log(tPraca)
  const tNaklady = convertor(data[3].value)
  console.log(tNaklady)
  const tEtapa = convertor(data[4].value)
  console.log(tEtapa)

  // vytvorenie referencií z tCP
  const vVMaterial = createVMaterial(tCP[0].References.Vykaz_Vymer_Material)
  console.log(vVMaterial)
  const vVPraca = tCP[0].References.Vykaz_Vymer_Praca
  console.log(vVPraca)
  const vVNaklady = tCP[0].References.Pridruzene_naklady
  console.log(vVNaklady)
  const vCelkovaCena = tCP[0].References.Konecna_Cena
  console.log(vCelkovaCena)

  //tlač hlavičky CP
  document.getElementById("dielo").innerText = data[0].Dielo;

  // vytvorenie tlačovej tabuľky výkazu Materiálov
  function createVMaterial(value) {
    let vMaterial = []
    //vVMaterial.forEach(function(row) {
    value.forEach(function(row) {
      console.log(row)
      let element = {}
        element.id=row.id
        element.jednotka=row.jednotka
        element.jednotkova_cena=row.jednotkova_cena
        element.mnozstvo=row.mnozstvo
        element.celkova_cena=row.celkova_cena
        //doplnenie etapy
        tEtapa.forEach((item) => {
          if (item.id == row.etapa.rowId) {
            element.etapa = item.etapa
          }
        })
        //doplnenie materiálu
        tMaterial.forEach((item) => {
          if (item.id == row.material.rowId) {
            element.material = item.nazov
          }
        })
      vMaterial.push(element)
    })
    return vMaterial
  }

}) //ukončenie Promise.allSettled
