/*
/
/ Načítanie a príprava tlačových údajov pre CESŤÁK
/
/ autor: Roman Holinec
/ box@pixeon.sk
/ verzia: 001
/
*/

console.log("*** Print teplate for CESTAK")
console.log("*** engine.js - ver: 001")
console.log("*** autor: Roman Holinec")
console.log("*** mail: box@pixeon.sk")

// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov z Cestaku
const dbCestak = dbTableCestak()
async function dbTableCestak() {
    const dataFromCestak = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCestak
}

//načítanie údajov o Trasách
const dbTrasa = dbTableTrasa()
async function dbTableTrasa() {
    const dataFromTrasa = await grist.docApi.fetchTable("Trasa")
    return dataFromTrasa
}

//načítanie údajov o Vozidlách
const dbVozidlo = dbTableVozidlo()
async function dbTableVozidlo() {
    const dataFromVozidlo = await grist.docApi.fetchTable("Vozidlo")
    return dataFromVozidlo
}

//načítanie údajov o Náhradách
const dbNahrada = dbTableNahrada()
async function dbTableNahrada() {
    const dataFromNahrada = await grist.docApi.fetchTable("Nahrada")
    return dataFromNahrada
}

//načítanie údajov o PHM
const dbPHM = dbTablePHM()
async function dbTablePHM() {
    const dataFromPHM = await grist.docApi.fetchTable("PHM")
    return dataFromPHM
}

//načítanie údajov o Sumár
const dbSumar = dbTableSumar()
async function dbTableSumar() {
    const dataFromSumar = await grist.docApi.fetchTable("Sumar")
    return dataFromSumar
}

// zaokruhlovanie čísel
function round(num, decimal=0) {
  return Math.round((num  * 10 ** decimal) * (1 + Number.EPSILON)) /  10 ** decimal
}

// zitovanie prazdneho poľa
// ak je pole prazdne, vráti TRUE
// ak pole obsahuje prvky, vráti FALSE
function isEmpty(value) {
  if (value instanceof Array) {
    console.log("this is Array")
    if (value.legth === 0) {
      return true
    }
    else {
      return false
    }
  }
  else if (value instanceof Object) {
    console.log("this is Object")
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



//  pole všetkých Promisov
allPromises = [
  dbCestak,
  //dbTrasa,
  //dbVozidlo,
  //dbNahrada,
  //dbPHM,
  //dbSumar
]

Promise.allSettled(allPromises).then(function(data) {

  //vytvorenie poľa vozidiel
  const vehicles = []

  //zostavenie objektov vozidiel aj s referenciami
  if ( !isEmpty(data) ) {
    const vehiclesID = []
    const list=data[0].value
console.log(list)

    list.forEach(function(item) {
console.log(item.spz)
      if (!vehiclesID.includes(item.spz)) {
        vehiclesID.push(item.spz)
console.log(vehiclesID)
        const vehicle = {}
        vehicle.id = item.spz
        vehicle.vozidlo = item.prostriedok
        item.references.ref_vozidlo.forEach(function(voz){
          //priradenie referencií na vozidlo
          if (voz.spz == item.spz) {
            vehicle.cenaKM = item.nahrada_za_kilometer
            vehicle.spotreba = item.spotreba
          }
        })
        vehicles.push(vehicle)
      }
    })
  }
  else {
    console.log("Cesťák je prázdny")
  }
console.log(vehicles)

  // vytvorenie tlačovej tabuľky vozidla
  function vehiclePrintTable(item) {
    //referencia na vozidlo
    let rVozidlo
    item.references.ref_vozidlo.forEach(function(ref) {
      if (item.spz == ref.spz) {
        rVozidlo=ref
        console.log(rVozidlo)
      }
    })
    //referencia na phm
    let place=document.getElementById("placeTable")
    let tab=document.createElement("table")
    tab.setAttribute("id", item.spz)
    place.appendChild(tab)

    let tRowA=tab.insertRow(-1)
    let cellVehicleH=tRowA.insertCell(0)
    let cellVehicleV=tRowA.insertCell(1)
    let cellSpzH=tRowA.insertCell(2)
    let cellSpzV=tRowA.insertCell(3)

    cellVehicleH.innerHTML="vozidlo:"
    cellVehicleV.innerHTML=item.prostriedok
    cellSpzH.innerHTML="ŠPZ:"
    cellSpzV.innerHTML=item.spz

    let tRowB=tab.insertRow(-1)
    let cellSpotrH=tRowB.insertCell(0)
    let cellSpotrV=tRowB.insertCell(1)
    let cellPalivoH=tRowB.insertCell(2)
    let cellPalivoV=tRowB.insertCell(3)
    let cellNahradaH=tRowB.insertCell(4)
    let cellNahradaV=tRowB.insertCell(5)

    cellSpotrH.innerHTML="Priemerna spotreba:"
    cellSpotrV.innerHTML="dopln"
    cellPalivoH.innerHTML="Cena paliva:"
    cellPalivoV.innerHTML="dopln"
    cellNahradaH.innerHTML="Cestovné náhrady:"
    cellNahradaV.innerHTML=item.cestovne_nahrady
  }
}) //ukončenie Promise.allSettled
