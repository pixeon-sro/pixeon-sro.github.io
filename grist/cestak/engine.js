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
console.log(dbCestak)
