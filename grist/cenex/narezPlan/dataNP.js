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

  const tNP = data[0].value
  console.log(tNP)

}
