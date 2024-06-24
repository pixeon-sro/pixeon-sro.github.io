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

function createPrintTable(printData, printPlace) {

  //vytvorenie a umiestnenie tabuľky
  const place=document.getElementById("printPlace")
  const tab=document.createElement("table")
  tab.setAttribute("id", printPlace+"_table")
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

  cellDrevina="Drevina"
  cellRezivo="Rezivo"
  cellVyska="Výška (mm)"
  cellSirka="Šírka (mm)"
  cellDlzka="Dĺžka (mm)"
  cellMnozstvo="Množstvo (ks)"
  cellObjem="Objem (m3)"

  printData.forEach(function(item) {
    const itemRow=tab.insertRow(-1)
    const cellDrevina=itemRow.insertCell(0)
    const cellRezivo=itemRow.insertCell(1)
    const cellVyska=itemRow.insertCell(2)
    const cellSirka=itemRow.insertCell(3)
    const cellDlzka=itemRow.insertCell(4)
    const cellMnozstvo=itemRow.insertCell(5)
    const cellObjem=itemRow.insertCell(6)

    cellDrevina=item.drevina
    cellRezivo=item.rezivo
    cellVyska=item.vyska
    cellSirka=item.sirka
    cellDlzka=item.dlzka
    cellMnozstvo=item.mnozstvo
    cellObjem=item.objem
  })
}

// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov z NP
let dbNP = dbTableNP()
async function dbTableNP() {
    let dataFromCenex = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCenex
}

// spracovanie údajov pre tlač
//  pole všetkých Promisov
allPromises = [
  dbNP
]

// načítanie všetkych Promisov a príprava polí objektov
Promise.allSettled(allPromises).then(function(data){

  /*
  /  ak existuje tabuľka Nárezový plán a
  /  obsahuje údaje, vytvorí sa tlačová tabuľka
  */
  if (!isEmpty(data)) {
    const tNP = data[0].value
    console.log(tNP)
    createPrintTable(tNP, "placeNP")
  }
})
