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
  console.log(data)
  /*
  /  ak existuje tabuľka Nárezový plán a
  /  obsahuje data, vytvoria sa údaje pre tlač
  */
  if (!isEmpty(data)) {
    const tNP = data[0].value
    console.log(tNP)
  }


}
