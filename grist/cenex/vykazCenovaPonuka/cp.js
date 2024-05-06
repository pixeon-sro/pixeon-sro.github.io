//verzia scriptu do konzoly
console.log("*** cp.js - ver: 030")
      
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
    let ref = value[0]
    let material = ref.References.Vykaz_Vymer_Material
    let praca = ref.References.Vykaz_Vymer_Praca
    let naklady = ref.References.Pridruzene_naklady
    let cena = ref.References.Konecna_Cena
    let etapa = ref.References.Etapa

    function vykazVymerMaterial(){
        let vykazVymerMaterial = []
        material.forEach(function(row) {
            let item = {}
            console.log("/////////")
            console.log(row.etapa)
          //vykazVymerMaterial  
        })
        
        return vykazVymerMaterial
    }
    function vykazVymerPraca(){return praca}
    function vykazPridruzeneNaklady(){return naklady}
    function vykazKonecnaCena(){return cena}
    function vykazEtapa(){return etapa}

    //console.log("******")
    //console.log(ref)
    //console.log("******")
    //console.log(ref.References)
    console.log("******")
    console.log(material)
    console.log(praca)
    console.log(naklady)
    console.log(cena)
    console.log(etapa)
    console.log("******")
}
