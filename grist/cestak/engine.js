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
let dbCestak = dbCestak()
async function dbCestak() {
    let dataFromCestak = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCestak
}

// zaokruhlovanie čísel
function round(num, decimal=0) {
  return Math.round((num  * 10 ** decimal) * (1 + Number.EPSILON)) /  10 ** decimal
}

//  pole všetkých Promisov
allPromises = [
  dbCestak
]

Promise.allSettled(allPromises).then(function(data){

  const tCestak = data
  console.log(tCestak)

}) //ukončenie Promise.allSettled
