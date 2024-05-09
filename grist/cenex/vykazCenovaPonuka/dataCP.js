/*
/
/ Načítanie a príprava tlačových tabuliek z údajov tabuliek CENEXU
/
/ autor: Roman Holinec
/ verzia: 058
/
*/
//console.log("*** cp.js - ver: 058")

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

// zaokruhlovanie čísel
function round(num, decimal=0) {
    if (num < 0)
        return -round(-num, decimalPlaces);
    let p = Math.pow(10, decimalPlaces);
    let n = (num * p).toPrecision(15);
    return Math.round(n) / p;
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
  //console.log(tMaterial)
  const tPraca = convertor(data[2].value)
  //console.log(tPraca)
  const tNaklady = convertor(data[3].value)
  console.log(tNaklady)
  const tEtapa = convertor(data[4].value)
  //console.log(tEtapa)

  // vytvorenie referencií z tCP
  const vVMaterial = createVMaterial(tCP[0].References.Vykaz_Vymer_Material)
  console.log(vVMaterial)
  const vVPraca = createVPraca(tCP[0].References.Vykaz_Vymer_Praca)
  console.log(vVPraca)
  const vVNaklady = tCP[0].References.Pridruzene_naklady
  console.log(vVNaklady)
  const vCelkovaCena = tCP[0].References.Konecna_Cena
  console.log(vCelkovaCena)

  //tlač hlavičky CP
  document.getElementById("dielo").innerText = tCP[0].Dielo;
  document.getElementById("zakaznik").innerText = tCP[0].Zakaznik;
  document.getElementById("telefon").innerText = tCP[0].Telefon;;
  document.getElementById("mail").innerText = tCP[0].Mail;
  document.getElementById("datumVytvorenia").innerText = tCP[0].Datum_vytvorenia_ponuky;
  document.getElementById("datumPlatnosti").innerText = tCP[0].Datum_platnosti_ponuky;

  // vytvorenie tlačovej tabuľky výkazu Materiálov
  function createVMaterial(value) {
    let vMaterial = []
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
  // vypísanie Výkazu Výmer Materiál
  let tableMaterial = document.getElementById("material");
  vVMaterial.forEach(function(item) {
    let tRow = tableMaterial.insertRow(-1)
    let cellEtapa = tRow.insertCell(0)
    let cellMaterial = tRow.insertCell(1)
    let cellJednotka = tRow.insertCell(2)
    let cellJadnotkovCena = tRow.insertCell(3)
    let cellMnozstvo = tRow.insertCell(4)
    let cellCelkovaCena = tRow.insertCell(5)

    cellEtapa.innerText = item.etapa
    cellMaterial.innerText = item.material
    cellJednotka.innerText = item.jednotka
    cellJadnotkovCena.innerText = item.jednotkova_cena
    cellMnozstvo.innerText = item.mnozstvo
    cellCelkovaCena.innerText = round(item.celkova_cena, 2)
  })

  // vytvorenie tlačovej tabuľky výkazu Práce
  function createVPraca(value) {
    let vPraca = []
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
        tPraca.forEach((item) => {
          if (item.id == row.praca.rowId) {
            element.praca = item.nazov
          }
        })
      vPraca.push(element)
    })
    return vPraca
  }
  // vypísanie Výkazu Výmer Práce
  let tablePraca = document.getElementById("praca");
  vVPraca.forEach(function(item) {
    let tRow = tablePraca.insertRow(-1)
    let cellEtapa = tRow.insertCell(0)
    let cellPraca = tRow.insertCell(1)
    let cellJednotka = tRow.insertCell(2)
    let cellJadnotkovCena = tRow.insertCell(3)
    let cellMnozstvo = tRow.insertCell(4)
    let cellCelkovaCena = tRow.insertCell(5)

    cellEtapa.innerText = item.etapa
    cellPraca.innerText = item.praca
    cellJednotka.innerText = item.jednotka
    cellJadnotkovCena.innerText = item.jednotkova_cena
    cellMnozstvo.innerText = item.mnozstvo
    cellCelkovaCena.innerText = item.celkova_cena
  })

  // vytvorenie tlačovej tabuľky výkazu Pridružených nákladov
  function createVNaklady(value) {
    let vNaklady = []
    value.forEach(function(row) {
      console.log(row)
      let element = {}
        element.id=row.id
        element.jednotka=row.jednotka
        element.jednotkova_cena=row.jednotkova_cena
        element.naklady=row.naklady
        element.celkova_cena=row.celkova_cena
        //doplnenie etapy
        tEtapa.forEach((item) => {
          if (item.id == row.etapa.rowId) {
            element.etapa = item.etapa
          }
        })
        //doplnenie pridruzenych nákladov
        tNaklady.forEach((item) => {
          if (item.id == row.naklady.rowId) {
            element.naklady = item.naklady
          }
        })
      vNaklady.push(element)
    })
    return vPraca
  }
  // vypísanie Výkazu Výmer Pridružených nákladov
  let tableNaklady = document.getElementById("praca");
  vVNaklady.forEach(function(item) {
    let tRow = tableNaklady.insertRow(-1)
    let cellEtapa = tRow.insertCell(0)
    let cellNaklady = tRow.insertCell(1)
    let cellJednotka = tRow.insertCell(2)
    let cellJadnotkovCena = tRow.insertCell(3)
    let cellMnozstvo = tRow.insertCell(4)
    let cellCelkovaCena = tRow.insertCell(5)

    cellEtapa.innerText = item.etapa
    cellNaklady.innerText = item.naklady
    cellJednotka.innerText = item.jednotka
    cellJadnotkovCena.innerText = item.jednotkova_cena
    cellMnozstvo.innerText = item.mnozstvo
    cellCelkovaCena.innerText = item.celkova_cena
  })

}) //ukončenie Promise.allSettled
