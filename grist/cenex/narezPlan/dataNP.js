/*
/
/ Načítanie a príprava tlačových údajov pre Nárezový Plán
/
/ autor: Roman Holinec
/ box@pixeon.sk
/ verzia: 001
/
*/

console.log("*** Print teplate for Nárezový Plán")
console.log("*** dataNP.js - ver: 001")
console.log("*** autor: Roman Holinec")
console.log("*** mail: box@pixeon.sk")

// zaokruhlovanie čísel
function round(num, decimal=0) {
  return Math.round((num  * 10 ** decimal) * (1 + Number.EPSILON)) /  10 ** decimal
}
// zitovanie prazdneho poľa
// ak je pole prazdne, vráti TRUE
// ak pole obsahuje prvky, vráti FALSE
function isEmpty(value) {
  if (value instanceof Array) {
    if (value.legth === 0) {
      return true
    }
    else {
      return false
    }
  }
  else if (value instanceof Object) {
    if (value.legth === 0) {
      return true
    }
    else {
      return false
    }
  }
  else {
    console.log("this is not Array or Object")
    console.log(value)
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
  function createPrintTable(printData, printPlace) {

    // profil spločnosti v hlavičke dokumentu
    const tProfile = data[0].value
    //console.log(tProfile)
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
  if (!isEmpty(data)) {
    const tNP = data[0].value
    console.log(tNP)
    createPrintTable(tNP, "placeNP")
  }

}) //end of promises
