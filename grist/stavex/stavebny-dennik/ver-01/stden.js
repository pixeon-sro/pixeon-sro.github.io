/*
/
/ Načítanie a príprava tlačových tabuliek z údajov tabuliek CENEXU
/
/ autor: Roman Holinec
/ box@pixeon.sk
/ verzia: 060
/
*/

console.log("*** Print teplate for Stavebný denník")
console.log("*** stden.js - ver: 001")
console.log("*** autor: Roman Holinec")
console.log("*** mail: box@pixeon.sk")

// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov Investora
const dbInvestor = getInvestor()
async function getInvestor() {
    let dataFromCenex = await grist.docApi.fetchTable("INVESTOR")
    return dataFromCenex
}

// načítanie údajov Zhotoviteľa
const dbZhotovitel = getZhotovitel()
async function getZhotovitel() {
    let dataFromCenex = await grist.docApi.fetchTable("ZHOTOVITEL")
    return dataFromCenex
}

// načítanie údajov Stavebného Denníka
const dbStavDennik = getStavDennik()
async function getStavDennik() {
    let dataFromCenex = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCenex
}

function _isEmpty(value) {
  if (typeof(value) === "array") {
    if (value.legth === 0) {
      return true
    }
    else {
      return false
    }
  }
  else if (typeof(value) === "object") {
    if (value.legth === 0) {
      return true
    }
    else {
      return false
    }
  }
  else if (typeof(value) === "string") {
    if (value == "") {
      return true
    }
    else {
      return false
    }
  }
  else {
    console.log("_isEmpty() - neriešená hodnota:" + typeof(value))
    return true
  }
}

// zaokruhlovanie čísel
function round(num, decimal=0) {
  return Math.round((num  * 10 ** decimal) * (1 + Number.EPSILON)) /  10 ** decimal
}

// spracovanie údajov pre tlač
//  pole všetkých Promisov
allPromises = [
  dbInvestor,
  dbZhotovitel,
  dbStavDennik
]

// načítanie všetkych Promisov a príprava polí objektov
Promise.allSettled(allPromises).then(function(data) {
  console.log(data)
  
  const investor = data[0].value
  //console.log(investor)
  const zhotovitel = data[1].value
  //console.log(zhotovitel)
  const stavDennik = data[2].value
  //console.log(stavDennik)

  // investor
  document.getElementById("inv-meno").innerText = investor.meno
  document.getElementById("inv-telefon").innerText = investor.telefon
  document.getElementById("inv-mail").innerText = investor.mail
  document.getElementById("inv-adresa").innerHTML = investor.ulica+"<br/>"+investor.psc+" "+investor.mesto

  // profil spločnosti
  document.getElementById("zh-meno").innerText = zhotovitel.meno
  document.getElementById("zh-adresa").innerHTML = zhotovitel.ulica+"<br/>"+zhotovitel.psc+" "+zhotovitel.mesto
  document.getElementById("zh-telefon").innerText = zhotovitel.telefon[0]
  document.getElementById("zh-mail").innerText = zhotovitel.mail[0]
  document.getElementById("zh-ico").innerText = zhotovitel.ico[0]
  document.getElementById("zh-dic").innerText = zhotovitel.dic[0]
  document.getElementById("zh-dic-dph").innerText =zhotovitel.dic_dph[0]

  // funkcia vytvára jednotlivé záznami v stavebnom denníku
  function printElementSD(value) {
    const parrentDiv = document.getElementById("stavDennik")
    
    const divDate = document.createElement("div")
      divDate.classList.add("grid","box-border-date","margin-bottom")
    const dateStart = document.createElement("div")
      dateStart.classList.add("s-6","m-6","l-6","padding-left")
      dateStart.innerHTML = "<strong>Začiatok</strong>: " + value.zaciatok.toLocaleDateString() + " - " + value.zaciatok.toLocaleTimeString()
      divDate.appendChild(dateStart)
    const dateEnd = document.createElement("div")
      dateEnd.classList.add("s-6","m-6","l-6")
      dateEnd.innerHTML = "<strong>Koniec</strong>: " + value.koniec.toLocaleDateString() + " - " + value.koniec.toLocaleTimeString()
      divDate.appendChild(dateEnd)
      parrentDiv.appendChild(divDate)

    const divPocasie = document.createElement("div")
      divPocasie.classList.add("grid","margin-bottom")
    const pocLabel = document.createElement("div")
      pocLabel.classList.add("s-2","m-2","l-2")
      pocLabel.innerHTML = "<strong>Počasie</strong>: "
      divPocasie.appendChild(pocLabel)
    const pocValue = document.createElement("div")
      pocValue.classList.add("s-10","m-10","l-10")
      let checkPocasie = ""
      if (!_isEmpty(value.pocasie)) {
        checkPocasie = value.pocasie
      }
      else {
        checkPocasie = "Počasie nebolo zapísané!"
      }
      pocValue.innerHTML = checkPocasie
      divPocasie.appendChild(pocValue)
      parrentDiv.appendChild(divPocasie)

    const divPracovnici = document.createElement("div")
      divPracovnici.classList.add("grid","margin-bottom")
    const pracLabel = document.createElement("div")
      pracLabel.classList.add("s-2","m-2","l-2")
      pracLabel.innerHTML = "<strong>Pracovníci</strong>: "
      divPracovnici.appendChild(pracLabel)
    const pracValue = document.createElement("div")
      pracValue.classList.add("s-10","m-10","l-10")
      let checkPracovnici = ""
      if (!_isEmpty(value.pracovnici)) {
        checkPracovnici = value.pracovnici
      }
      else {
        checkPracovnici = "Pracovníci neboli zapísaný!"
      }
      pracValue.innerHTML = checkPracovnici
      divPracovnici.appendChild(pracValue)
      parrentDiv.appendChild(divPracovnici)

    const divSupisPrac = document.createElement("div")
      divSupisPrac.classList.add("grid","margin-bottom")
    const supisLabel = document.createElement("div")
      supisLabel.classList.add("s-2","m-2","l-2")
      supisLabel.innerHTML = "<strong>Súpis prác</strong>: "
      divSupisPrac.appendChild(supisLabel)
    const supisValue = document.createElement("div")
      supisValue.classList.add("s-10","m-10","l-10")
      let checkSupisPrac = ""
      if (!_isEmpty(value.supis_prac)) {
        checkSupisPrac = value.supis_prac
      }
      else {
        checkSupisPrac = "Súpis prác je prázdny!"
      }
      supisValue.innerHTML = checkSupisPrac
      divSupisPrac.appendChild(supisValue)
      parrentDiv.appendChild(divSupisPrac)

    const divPoznamka = document.createElement("div")
      divPoznamka.classList.add("grid","margin-bottom")
    const poznamkaLabel = document.createElement("div")
      poznamkaLabel.classList.add("s-2","m-2","l-2")
      poznamkaLabel.innerHTML = "<strong>Poznámka</strong>: "
      divPoznamka.appendChild(poznamkaLabel)
    const poznamkaValue = document.createElement("div")
      poznamkaValue.classList.add("s-10","m-10","l-10")
      let checkPoznamka = ""
      if (!_isEmpty(value.poznamka)) {
        checkPoznamka = value.poznamka
      }
      else {
        checkPoznamka = "Bez poznámky k pracovnému dňu."
      }
      poznamkaValue.innerHTML = checkPoznamka
      divPoznamka.appendChild(poznamkaValue)
      parrentDiv.appendChild(divPoznamka)
  }

  Object.entries(stavDennik).forEach(([key,value]) => {
    if (value == null) {
      return null
    }
    printElementSD(value)
  })
/*
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
      cellCelkovaCena.innerHTML = round(item.celkova_cena, 2)+" €"
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
      cellCelkovaCena.innerHTML = round(item.celkova_cena, 2)+" €"
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
      cellCelkovaCena.innerHTML = round(item.celkova_cena, 2)+" €"
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
    cellMaterial.innerHTML = round(item.material, 2)+" €"
    cellPraca.innerHTML = round(item.praca, 2)+" €"
    cellNaklady.innerHTML = round(item.pridruzene_naklady, 2)+" €"
    cellCelkovaCena.innerHTML = round(item.celkova_cena, 2)+" €"
  })*/

}) //ukončenie Promise.allSettled
