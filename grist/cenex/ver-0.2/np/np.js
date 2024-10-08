/**
* Tlačová šablóna údajov pre Nárezový Plán
*
* @autor: Roman Holinec
* @mail: box@pixeon.sk
* @version: 01
*
* @example: pri vitvorení widgetu v griste je potrebne použiť URL:
*           https://pixeon-sro.github.io/grist/cenex/np/ver-01/np.html
*
**/

console.log("*** Print teplate for Nárezový Plán")
console.log("*** np.js - ver: 01")
console.log("*** autor: Roman Holinec")
console.log("*** mail: box@pixeon.sk")

/**
* Zaokruhlovanie čísel
* funkcia vracia zaokrúhlené číslo
*
* @param {number} num - Zaokrúhlované číslo
* @param {number} decimal - počet desatinných miest po zaokrúhlení
*
**/
function round(num, decimal=0) {
  return Math.round((num  * 10 ** decimal) * (1 + Number.EPSILON)) /  10 ** decimal
}

/**
* Zitovanie prazdnej hodnoty
* funkcia vracia boolen
*
* @param {any} value - ak je hodnota pázdna/nezadaná vracia true, inak false
*
**/
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


// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov z Profilu
let dbProfile = dbTableProfile()
async function dbTableProfile() {
    let dataFromCenex = await grist.docApi.fetchTable("FIREMNE_UDAJE")
    return dataFromCenex
}

// načítanie údajov z NP
let dbNP = dbTableNP()
async function dbTableNP() {
    let dataFromCenex = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCenex
}

// spracovanie údajov pre tlač
//  pole všetkých Promisov
const allPromises = [
  dbProfile,
  dbNP
]

// načítanie všetkych Promisov a príprava polí objektov
Promise.allSettled(allPromises).then(function(data) {

  // funkcia na vytvorenie a umiestnenie tabuľky
  function createPrintNP(printData, printPlace) {

    // profil spločnosti
    const tProfile = data[0].value
    console.log(tProfile)
    document.getElementById("firma-meno").innerText = tProfile.Nazov
    document.getElementById("firma-adresa").innerHTML = tProfile.Ulica+"<br/>"+tProfile.Mesto+"<br/>"+tProfile.Psc
    document.getElementById("firma-telefon").innerText = tProfile.Telefon
    document.getElementById("firma-mail").innerText = tProfile.Email
    document.getElementById("firma-ico").innerText = tProfile.Ico
    document.getElementById("firma-dic").innerText = tProfile.Dic
    document.getElementById("firma-dic-dph").innerText = tProfile.Dic_DPH
    document.getElementById("firma-iban").innerText = tProfile.Iban

    // Tlač nárezového plánu
    const place=document.getElementById(printPlace)
    const tab=document.createElement("table")
    tab.setAttribute("id", printPlace + "_table")
    place.appendChild(tab)

    const tRow=tab.insertRow(-1)
    tRow.setAttribute("class", "header")
    const cellDrevina=tRow.insertCell(0)
    const cellRezivo=tRow.insertCell(1)
    const cellVyska=tRow.insertCell(2)
    const cellSirka=tRow.insertCell(3)
    const cellDlzka=tRow.insertCell(4)
    const cellMnozstvo=tRow.insertCell(5)
    const cellObjem=tRow.insertCell(6)

    cellDrevina.innerHTML="Drevina"
    cellRezivo.innerHTML="Rezivo"
    cellVyska.innerHTML="Výška (mm)"
    cellSirka.innerHTML="Šírka (mm)"
    cellDlzka.innerHTML="Dĺžka (mm)"
    cellMnozstvo.innerHTML="Množstvo (ks)"
    cellObjem.innerHTML="Objem (m3)"

    printData.forEach(function(item) {
      const itemRow=tab.insertRow(-1)
      const cellDrevina=itemRow.insertCell(0)
      const cellRezivo=itemRow.insertCell(1)
      const cellVyska=itemRow.insertCell(2)
      const cellSirka=itemRow.insertCell(3)
      const cellDlzka=itemRow.insertCell(4)
      const cellMnozstvo=itemRow.insertCell(5)
      const cellObjem=itemRow.insertCell(6)

      cellDrevina.innerHTML=item.Drevina
      cellRezivo.innerHTML=item.Rezivo
      cellVyska.innerHTML=item.Vyska_mm_
      cellSirka.innerHTML=item.Sirka_mm_
      cellDlzka.innerHTML=item.Dlzka_mm_
      cellMnozstvo.innerHTML=item.Mnozstvo_ks_
      cellObjem.innerHTML=round(item.Objem_m3_, 2)
    })
  }

  /*
  /  ak existuje tabuľka Nárezový plán a
  /  obsahuje údaje, vytvorí sa tlačová tabuľka
  */
  if (!_isEmpty(data)) {
    const tNP = data[1].value
    //console.log(tNP)
    createPrintNP(tNP, "placeNP")
  }

}) //end of promises
