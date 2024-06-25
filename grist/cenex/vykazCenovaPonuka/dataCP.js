/*
/
/ Načítanie a príprava tlačových tabuliek z údajov tabuliek CENEXU
/
/ autor: Roman Holinec
/ box@pixeon.sk
/ verzia: 060
/
*/

console.log("*** Print teplate for CENEX")
console.log("*** cp.js - ver: 060")
console.log("*** autor: Roman Holinec")
console.log("*** mail: box@pixeon.sk")

// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov z Profilu
let dbProfile = dbTableProfile()
async function dbTableProfile() {
    let dataFromCenex = await grist.docApi.fetchTable("Profil")
    return dataFromCenex
}

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
  return Math.round((num  * 10 ** decimal) * (1 + Number.EPSILON)) /  10 ** decimal
}

// spracovanie údajov pre tlač
//  pole všetkých Promisov
allPromises = [
  dbProfile,
  dbCP,
  dbMaterial,
  dbPraca,
  dbPridruzeneNaklady,
  dbEtapa
]
// načítanie všetkych Promisov a príprava polí objektov
Promise.allSettled(allPromises).then(function(data) {

  const tProfile = data[0].value
  //console.log(tProfile)
  const tCP = data[1].value
  //console.log(tCP)
  const tMaterial = convertor(data[2].value)
  //console.log(tMaterial)
  const tPraca = convertor(data[3].value)
  //console.log(tPraca)
  const tNaklady = convertor(data[4].value)
  //console.log(tNaklady)
  const tEtapa = convertor(data[5].value)
  //console.log(tEtapa)

  // vytvorenie tlačovej tabuľky výkazu Materiálov
  function createVMaterial(value) {
    if (value == null) {
      return null
    }
    let vMaterial = []
    value.forEach(function(row) {
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
  const vVMaterial = createVMaterial(tCP[0].References.Vykaz_Vymer_Material)

  // vytvorenie tlačovej tabuľky výkazu Práce
  function createVPraca(value) {
    if (value == null) {
      return null
    }
    let vPraca = []
    value.forEach(function(row) {
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
  const vVPraca = createVPraca(tCP[0].References.Vykaz_Vymer_Praca)

  // vytvorenie tlačovej tabuľky výkazu Pridružených nákladov
  function createVNaklady(value) {
    if (value == null) {
      return null
    }
    let vNaklady = []
    value.forEach(function(row) {
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
        //doplnenie pridruzenych nákladov
        tNaklady.forEach((item) => {
          if (item.id == row.naklady.rowId) {
            element.naklady = item.nazov
            element.popis = item.popis
          }
        })
      vNaklady.push(element)
    })
    return vNaklady
  }
  const vVNaklady = createVNaklady(tCP[0].References.Pridruzene_naklady)

  const vCelkovaCena = tCP[0].References.Konecna_Cena
  //console.log(vCelkovaCena)

  //tlač hlavičky CP
  document.getElementById("dielo").innerText = tCP[0].Dielo;
  document.getElementById("zakaznik").innerText = tCP[0].Zakaznik;
  document.getElementById("telefon").innerText = tCP[0].Telefon;;
  document.getElementById("mail").innerText = tCP[0].Mail;
  document.getElementById("datumVytvorenia").innerText = tCP[0].Datum_vytvorenia_ponuky;
  document.getElementById("datumPlatnosti").innerText = tCP[0].Datum_platnosti_ponuky;

  // profil spločnosti
  const placeProfile=document.getElementById("profil")
  const tabProfile=document.createElement("table")
  tabProfile.setAttribute("id", "profile_table")
  placeProfile.appendChild(tabProfile)

  const tProfRowA=tabProfile.insertRow(-1)
  const cellNameKey=tProfRowA.insertCell(0)
  const cellNameValue=tProfRowA.insertCell(1)
  const cellIcoKey=tProfRowA.insertCell(2)
  const cellIcoValue=tProfRowA.insertCell(3)
  cellNameKey.innerHTML="Názov:"
  cellNameValue.innerHTML=tProfile.nazov_spolocnosti[0]
  cellIcoKey.innerHTML="IČO:"
  cellIcoValue.innerHTML=tProfile.ico[0]

  const tProfRowB=tabProfile.insertRow(-1)
  const cellAddressKey=tProfRowB.insertCell(0)
  cellAddressKey.rowSpan=3
  const cellAddressValue=tProfRowB.insertCell(1)
  cellAddressValue.rowSpan=3
  const cellDicKey=tProfRowB.insertCell(2)
  const cellDicValue=tProfRowB.insertCell(3)
  cellAddressKey.innerHTML="Adresa:"
  cellAddressValue.innerHTML=tProfile.ulica[0]+"<br/>"+tProfile.mesto[0]+"<br/>"+tProfile.psc[0]
  cellDicKey.innerHTML="Dič:"
  cellDicValue.innerHTML=tProfile.dic[0]

  const tProfRowC=tabProfile.insertRow(-1)
  const cellDphKey=tProfRowC.insertCell(0)
  const cellDphValue=tProfRowC.insertCell(1)
  cellDphKey.innerHTML="Dič DPH:"
  cellDphValue.innerHTML=tProfile.dic_dph[0]

  const tProfRowD=tabProfile.insertRow(-1)
  const cellIbanKey=tProfRowD.insertCell(0)
  const cellIbanValue=tProfRowD.insertCell(1)
  cellIbanKey.innerHTML="iBAN:"
  cellIbanValue.innerHTML=tProfile.iban[0]

  const tProfRowE=tabProfile.insertRow(-1)
  const cellMailKey=tProfRowE.insertCell(0)
  const cellMailValue=tProfRowE.insertCell(1)
  const cellTelKey=tProfRowE.insertCell(2)
  const cellTelValue=tProfRowE.insertCell(3)
  cellMailKey.innerHTML="E-mail:"
  cellMailValue.innerHTML=tProfile.mail[0]
  cellTelKey.innerHTML="Telefón:"
  cellTelValue.innerHTML=tProfile.telefon[0]

  // vypísanie Výkazu Výmer Materiál
  let htmlH1Material = document.getElementById("htmlH1Material")
  let htmlTableMaterial = document.getElementById("htmlTableMaterial");
  if (vVMaterial != null) {
    vVMaterial.forEach(function(item) {
      let tRow = htmlTableMaterial.insertRow(-1)
      let cellEtapa = tRow.insertCell(0)
      let cellMaterial = tRow.insertCell(1)
      let cellJednotka = tRow.insertCell(2)
      let cellJadnotkovCena = tRow.insertCell(3)
      let cellMnozstvo = tRow.insertCell(4)
      let cellCelkovaCena = tRow.insertCell(5)

      cellEtapa.innerHTML = item.etapa
      cellMaterial.innerHTML = item.material
      cellJednotka.innerHTML = item.jednotka
      cellJadnotkovCena.innerHTML = item.jednotkova_cena
      cellMnozstvo.innerHTML = item.mnozstvo
      cellCelkovaCena.innerHTML = round(item.celkova_cena, 2)
    })
  }
  else {
    htmlH1Material.style.display="none"
    htmlTableMaterial.style.display="none"
  }
  // vypísanie Výkazu Výmer Práce
  let htmlH1Praca = document.getElementById("htmlH1Praca")
  let htmlTablePraca = document.getElementById("htmlTablePraca");
  if (vVPraca != null) {
    vVPraca.forEach(function(item) {
      let tRow = htmlTablePraca.insertRow(-1)
      let cellEtapa = tRow.insertCell(0)
      let cellPraca = tRow.insertCell(1)
      let cellJednotka = tRow.insertCell(2)
      let cellJadnotkovCena = tRow.insertCell(3)
      let cellMnozstvo = tRow.insertCell(4)
      let cellCelkovaCena = tRow.insertCell(5)

      cellEtapa.innerHTML = item.etapa
      cellPraca.innerHTML = item.praca
      cellJednotka.innerHTML = item.jednotka
      cellJadnotkovCena.innerHTML = item.jednotkova_cena
      cellMnozstvo.innerHTML = item.mnozstvo
      cellCelkovaCena.innerHTML = round(item.celkova_cena, 2)
    })
  }
  else {
    htmlH1Praca.style.display="none"
    htmlTablePraca.style.display="none"
  }

  // vypísanie Výkazu Výmer Pridružených nákladov
  let htmlH1Naklady = document.getElementById("htmlH1Naklady")
  let htmlTableNaklady = document.getElementById("htmlTableNaklady");
  if (vVNaklady != null) {
    vVNaklady.forEach(function(item) {
      let tRow = htmlTableNaklady.insertRow(-1)
      let cellEtapa = tRow.insertCell(0)
      let cellNaklady = tRow.insertCell(1)
      let cellPopis = tRow.insertCell(2)
      let cellJednotka = tRow.insertCell(3)
      let cellJadnotkovCena = tRow.insertCell(4)
      let cellMnozstvo = tRow.insertCell(5)
      let cellCelkovaCena = tRow.insertCell(6)

      cellEtapa.innerHTML = item.etapa
      cellNaklady.innerHTML = item.naklady
      cellPopis.innerHTML = item.popis
      cellJednotka.innerHTML = item.jednotka
      cellJadnotkovCena.innerHTML = item.jednotkova_cena
      cellMnozstvo.innerHTML = item.mnozstvo
      cellCelkovaCena.innerHTML = round(item.celkova_cena, 2)
    })
  }
  else {
    htmlH1Naklady.style.display="none"
    htmlTableNaklady.style.display="none"
  }

  // vypísanie Celkovej ceny
  let htmlTableCena = document.getElementById("htmlTableCena");
  vCelkovaCena.forEach(function(item) {
    let tRow = htmlTableCena.insertRow(-1)
    let cellPolozka = tRow.insertCell(0)
    let cellMaterial = tRow.insertCell(1)
    let cellPraca = tRow.insertCell(2)
    let cellNaklady = tRow.insertCell(3)
    let cellCelkovaCena = tRow.insertCell(4)

    cellPolozka.innerHTML = item.polozka
    cellMaterial.innerHTML = round(item.material, 2)
    cellPraca.innerHTML = round(item.praca, 2)
    cellNaklady.innerHTML = round(item.pridruzene_naklady, 2)
    cellCelkovaCena.innerHTML = round(item.celkova_cena, 2)
  })

}) //ukončenie Promise.allSettled
