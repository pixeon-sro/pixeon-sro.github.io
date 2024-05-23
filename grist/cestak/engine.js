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
  dbCestak
]

Promise.allSettled(allPromises).then(function(data) {

// vytvorenie tlačovej tabuľky vozidla
  function createTabForVehicle(item) {

    let place=document.getElementById("placeTable")
    let tab=document.createElement("table")
    tab.setAttribute("id", item.spz)
    place.appendChild(tab)

    let tRowA=tab.insertRow(-1)
    tRowA.setAttribute("class", "header")
    let cellVehicleH=tRowA.insertCell(0)
    let cellVehicleV=tRowA.insertCell(1)
    let cellSpzH=tRowA.insertCell(2)
    let cellSpzV=tRowA.insertCell(3)
    let cellNahradaH=tRowA.insertCell(4)
    cellNahradaH.colSpan=2
    let cellNahradaV=tRowA.insertCell(5)

    cellVehicleH.innerHTML="vozidlo:"
    cellVehicleV.innerHTML=item.vozidlo
    cellSpzH.innerHTML="ŠPZ:"
    cellSpzV.innerHTML=item.spz
    cellNahradaH.innerHTML="Cestovné náhrady:"
    cellNahradaV.innerHTML=item.cenaKM

    let tRowB=tab.insertRow(-1)
    tRowB.setAttribute("class", "header")
    let cellPalivoH=tRowB.insertCell(0)
    let cellPalivoV=tRowB.insertCell(1)
    let cellSpotrH=tRowB.insertCell(2)
    let cellSpotrV=tRowB.insertCell(3)
    let cellCenaPalivaH=tRowB.insertCell(4)
    cellCenaPalivaH.colSpan=2
    let cellCenaPalivaV=tRowB.insertCell(5)

    cellPalivoH.innerHTML="Palivo:"
    cellPalivoV.innerHTML=item.palivo
    cellSpotrH.innerHTML="Priemerna spotreba:"
    cellSpotrV.innerHTML=item.spotreba
    cellCenaPalivaH.innerHTML="Cena paliva:"
    cellCenaPalivaV.innerHTML=item.cenaPHM

    let tRowC=tab.insertRow(-1)
    let cellDate=tRowC.insertCell(0)
    let cellRoute=tRowC.insertCell(1)
    let cellStart=tRowC.insertCell(2)
    let cellEnd=tRowC.insertCell(3)
    let cellLong=tRowC.insertCell(4)
    let cellCenaKM=tRowC.insertCell(5)
    let cellCenaFoot=tRowC.insertCell(6)

    cellDate.innerHTML="Dátum"
    cellRoute.innerHTML="Trasa"
    cellStart.innerHTML="Začiatok"
    cellEnd.innerHTML="Koniec"
    cellLong.innerHTML="Vzdialenosť (km)"
    cellCenaKM.innerHTML="Náhrada PHM"
    cellCenaFoot.innerHTML="Stravné"
  }

  function createRowForRoute(item, spz) {

    tab=document.getElementById(spz)
    const tRow=tab.insertRow(-1)
    const cellDate=tRow.insertCell(0)
    const cellRoute=tRow.insertCell(1)
    const cellStart=tRow.insertCell(2)
    const cellEnd=tRow.insertCell(3)
    const cellLong=tRow.insertCell(4)
    const cellCenaKM=tRow.insertCell(5)
    const cellCenaFoot=tRow.insertCell(6)

    cellDate.innerHTML=item.date
    cellRoute.innerHTML=item.route.replace("\n", "<br />")
    cellStart.innerHTML=item.start
    cellEnd.innerHTML=item.end
    cellLong.innerHTML=item.dlzka
    cellCenaKM.innerHTML=round(item.cenaKM, 2)
    cellCenaFoot.innerHTML=round(item.stravne, 2)

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

      vehicles.forEach(function(vehicle) {
        if (vehicle.spz == item.spz) {
          // zostavenie záznamu o ceste
          const route = {}
          route.date = item.datum
          route.route = item.trasa
          route.cenaKM = item.cestovne_nahrady
          route.dlzka = item.kilometre
          route.start = item.zaciatok
          route.end = item.koniec
          route.stravne = item.stravne_nahrady
          // vlozenie zaznamu o ceste do vozidla
          vehicle.routes.push(route)
        }
      })

    })

    // vytvorenie tlačovej zostavy
    let sumaNahradaPHM=0
    let sumaNahradaStrava=0
    const tabForVehicle = []
    vehicles.forEach(function(item) {
      createTabForVehicle(item)
      item.routes.forEach(function(route) {
        createRowForRoute(route, item.spz)
        sumaNahradaPHM = sumaNahradaPHM + round(route.cenaKM, 2)
        sumaNahradaStrava = sumaNahradaStrava + round(route.stravne, 2)
      })
    })
    let place=document.getElementById("placeTable")
    let tab=document.createElement("table")
    tab.setAttribute("id", "sumar")
    place.appendChild(tab)

    let tRowA=tab.insertRow(-1)
    tRowA.setAttribute("class", "header")
    let cellHeader=tRowA.insertCell(0)
    cellHeader.colSpan=3
    cellHeader.innerHTML="Celkové náhrady"
    let cellSumar=tRowA.insertCell(1)
    cellSumar.innerHTML=sumaNahradaPHM + sumaNahradaStrava
    let cellSignH=tRowA.insertCell(2)
    cellSignH.innerHTML="Podpis"

    let tRowB=tab.insertRow(-1)
    tRowB.setAttribute("class", "header")
    let cellPhmH=tRowB.insertCell(0)
    let cellPhmV=tRowB.insertCell(1)
    cellPhmH.innerHTML="Celkové náhrady za PHM"
    cellPhmV.innerHTML=sumaNahradaPHM
    let cellPreddavokH=tRowB.insertCell(2)
    let cellPreddavokV=tRowB.insertCell(3)
    cellPreddavokH.innerHTML="Preddavok:"
    cellPreddavokV.setAttribute("class", "white")
    let cellSignV=tRowB.insertCell(4)
    cellSignV.setAttribute("id", "sign")
    cellSignV.rowSpan=2

    let tRowC=tab.insertRow(-1)
    tRowC.setAttribute("class", "header")
    let cellStravaH=tRowC.insertCell(0)
    let cellStravaV=tRowC.insertCell(1)
    cellStravaH.innerHTML="Celkové náhrady za stravu"
    cellStravaV.innerHTML=sumaNahradaStrava
    let cellDoplatokH=tRowC.insertCell(2)
    let cellDoplatokV=tRowC.insertCell(3)
    cellDoplatokH.innerHTML="Doplatok:"
    cellDoplatokV.setAttribute("class", "white")

  }
  else {
    console.log("Cesťák je prázdny")
  }

}) //ukončenie Promise.allSettled
