//verzia scriptu do konzoly
console.log("*** ver: 025")
      
// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie tabuľky grist
async function dataFromCenex() {
    let dataFromCenex = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCenex
}

// vytvorenie objektu z načítaných dát
let data = dataFromCenex()
data.then(
    function(value) { separeTab(value) },
    function(error) { console.log(error) }
)

//vytvorenie premenných pre tlačové tabulky
let tabMaterial = ""
let tabPraca = ""
let tabNaklady = ""
let tabCena = ""
let tabEtapa = ""

//vytvorenie oddelených objektov pre tlačové tabulky
function separeTab(value) {
    let ref = value[0]
    tabMaterial = ref.References.Vykaz_Vymer_Material
    tabPraca = ref.References.Vykaz_Vymer_Praca
    tabNaklady = ref.References.Pridruzene_naklady
    tabCena = ref.References.Konecna_Cena
    tabEtapa = ref.References.Etapa
}


console.log("******")
console.log(ref)
console.log("******")
console.log(ref.References)
console.log("******")
console.log(tabMaterial)
console.log(tabPraca)
console.log(tabNaklady)
console.log(tabCena)
console.log(tabEtapa)
console.log("******")
