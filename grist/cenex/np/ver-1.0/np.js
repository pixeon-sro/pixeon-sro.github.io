/**
* Tlačová šablóna údajov pre Nárezový Plán
*
* @autor: Roman Holinec
* @mail: box@pixeon.sk
* @version: 01
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

// zitovanie prazdneho poľa
// ak je pole prazdne, vráti TRUE
// ak pole obsahuje prvky, vráti FALSE
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
    let dataFromCenex = await grist.docApi.fetchTable("Profil")
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
allPromises = [
  dbProfile,
  dbNP
]

// načítanie všetkych Promisov a príprava polí objektov
Promise.allSettled(allPromises).then(function(data) {

  // funkcia na vytvorenie a umiestnenie tabuľky
  function createPrintNP(printData, printPlace) {

    // profil spločnosti
    const tProfile = data[0].value
    document.getElementById("firma-meno").innerText = tProfile.nazov_spolocnosti[0]
    document.getElementById("firma-adresa").innerHTML = tProfile.ulica[0]+"<br/>"+tProfile.mesto[0]+"<br/>"+tProfile.psc[0]
    document.getElementById("firma-telefon").innerText = tProfile.telefon[0]
    document.getElementById("firma-mail").innerText = tProfile.mail[0]
    document.getElementById("firma-ico").innerText = tProfile.ico[0]
    document.getElementById("firma-dic").innerText = tProfile.dic[0]
    document.getElementById("firma-dic-dph").innerText = tProfile.dic_dph[0]
    document.getElementById("firma-iban").innerText = tProfile.iban[0]

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

      cellDrevina.innerHTML=item.drevina
      cellRezivo.innerHTML=item.rezivo
      cellVyska.innerHTML=item.vyska_mm_
      cellSirka.innerHTML=item.sirka_mm_
      cellDlzka.innerHTML=item.dlzka_mm_
      cellMnozstvo.innerHTML=item.mnozstvo_ks_
      cellObjem.innerHTML=round(item.objem_m3_, 2)
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
