//verzia scriptu do konzoly
console.log("*** cp.js - ver: 027")
      
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
    function(value) { tabData(value) },
    function(error) { console.log(error) }
)

//vytvorenie oddelených objektov pre tlačové tabulky
function tabData(value) {
    const ref = value[0]
    const tabMaterial = ref.References.Vykaz_Vymer_Material
    const tabPraca = ref.References.Vykaz_Vymer_Praca
    const tabNaklady = ref.References.Pridruzene_naklady
    const tabCena = ref.References.Konecna_Cena
    const etapa = ref.References.Etapa

    function vykazVymerMaterial(){return tabMaterial}
    function vykazVymerPraca(){return tabPraca}
    function vykazPridruzeneNaklady(){return tabNaklady}
    function vykazKonecnaCena(){return tabCena}
    function etapa(){return etapa}

    console.log("******")
    console.log(ref)
    console.log("******")
    console.log(ref.References)
    console.log("******")
    console.log(tabMaterial)
    console.log(tabPraca)
    console.log(tabNaklady)
    console.log(tabCena)
    console.log(etapa)
    console.log("******")
}
