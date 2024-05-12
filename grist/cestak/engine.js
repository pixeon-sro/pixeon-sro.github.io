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
const dbCestak = dbCestak()
async function dbCestak() {
    const dataFromCestak = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCestak
}

//načítanie údajov o Trasách
const dbTrasa = dbTrasa()
async function dbTrasa() {
    const dataFromTrasa = await grist.docApi.fetchTable("Trasa")
    return dataFromTrasa
}

//načítanie údajov o Vozidlách
const dbVozidlo = dbVozidlo()
async function dbVozidlo() {
    const dataFromVozidlo = await grist.docApi.fetchTable("Vozidlo")
    return dataFromVozidlo
}

//načítanie údajov o Náhradách
const dbNahrada = dbNahrada()
async function dbNahrada() {
    const dataFromNahrada = await grist.docApi.fetchTable("Nahrada")
    return dataFromNahrada
}

//načítanie údajov o PHM
const dbPHM = dbPHM()
async function dbPHM() {
    const dataFromPHM = await grist.docApi.fetchTable("PHM")
    return dataFromPHM
}

//načítanie údajov o Sumár
const dbSumar = dbSumar()
async function dbSumar() {
    const dataFromSumar = await grist.docApi.fetchTable("Sumar")
    return dataFromSumar
}

// zaokruhlovanie čísel
function round(num, decimal=0) {
  return Math.round((num  * 10 ** decimal) * (1 + Number.EPSILON)) /  10 ** decimal
}

//  pole všetkých Promisov
allPromises = [
  dbCestak,
  dbTrasa,
  dbVozidlo,
  dbNahrada,
  dbPHM,
  dbSumar
]

Promise.allSettled(allPromises).then(function(data){

  const tCestak = data
  console.log(tCestak)

}) //ukončenie Promise.allSettled
