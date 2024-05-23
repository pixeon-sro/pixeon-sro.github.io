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

// vytvorenie tlačovej tabuľky vozidla
  function createTabForVehicle(item) {

    let place=document.getElementById("placeTable")
    let tab=document.createElement("table")
    tab.setAttribute("id", item.spz)
    place.appendChild(tab)

    let tRowA=tab.insertRow(-1)
    let cellVehicleH=tRowA.insertCell(0)
    let cellVehicleV=tRowA.insertCell(1)
    let cellSpzH=tRowA.insertCell(2)
    let cellSpzV=tRowA.insertCell(3)
    let cellNahradaH=tRowA.insertCell(4)
    let cellNahradaV=tRowA.insertCell(5)

    cellVehicleH.innerHTML="vozidlo:"
    cellVehicleV.innerHTML=item.vozidlo
    cellSpzH.innerHTML="ŠPZ:"
    cellSpzV.innerHTML=item.spz
    cellNahradaH.innerHTML="Cestovné náhrady:"
    cellNahradaV.innerHTML=item.cenaKM

    let tRowB=tab.insertRow(-1)
    let cellPalivoH=tRowB.insertCell(0)
    let cellPalivoV=tRowB.insertCell(1)
    let cellSpotrH=tRowB.insertCell(2)
    let cellSpotrV=tRowB.insertCell(3)
    let cellCenaPalivaH=tRowB.insertCell(4)
    let cellCenaPalivaV=tRowB.insertCell(5)

    cellPalivoH.innerHTML="Palivo:"
    cellPalivoV.innerHTML=item.palivo
    cellSpotrH.innerHTML="Priemerna spotreba:"
    cellSpotrV.innerHTML=item.spotreba
    cellCenaPalivaH.innerHTML="Cena paliva:"
    cellCenaPalivaV.innerHTML=item.cenaPHM
  }


  /*
   * prvá časť - zostavenie objektov vozidiel aj s referenciami
   * druhá časť - vytvorenie tlačovej zostavy
  */

  const vehicles = []

  if ( !isEmpty(data) ) {

    // zostavenie vozidiel
    const vehiclesID = []
    const list=data[0].value

    list.forEach(function(item) {
      if (!vehiclesID.includes(item.spz)) {
        vehiclesID.push(item.spz)
        const vehicle = {}
        vehicle.spz = item.spz
        vehicle.vozidlo = item.prostriedok
        vehicle.routes = []

        //priradenie referencií na vozidlo
        item.references.ref_vozidlo.forEach(function(car) {
          if (car.spz == item.spz) {
            vehicle.cenaKM = car.nahrada_za_kilometer
            vehicle.spotreba = car.spotreba

            // pridanie referencií na palivo
            item.references.ref_phm.forEach(function(phm){
              if (car.palivo.rowId == phm.id) {
                vehicle.palivo = phm.palivo
                vehicle.cenaPHM = phm.cena
              }
            })
          }
        })
        vehicles.push(vehicle)
      }

      // zostavenie záznamov o cestách
      console.log(item)
      const route = {}
      route.date = item.datum
      route.cenaKM = item.cestovne_nahrady
      route.dlzka = item.kilometre
      route.start = item.zaciatok
      route.end = item.koniec

      // uloženie trasy do vozidla
      vehicle.routes.push(route)
    })
console.log(vehicles)

    // vytvorenie tlačovej zostavy
    const tabForVehicle = []
    vehicles.forEach(function(item) {
      if (!tabForVehicle.includes(item.spz)) {
        tabForVehicle.push(item.spz)
        createTabForVehicle(item)
        //createTabRow(list)
      }

    })

  }
  else {
    console.log("Cesťák je prázdny")
  }

}) //ukončenie Promise.allSettled
