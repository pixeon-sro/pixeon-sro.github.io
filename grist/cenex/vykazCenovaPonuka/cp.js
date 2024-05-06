//verzia scriptu do konzoly
console.log("*** cp.js - ver: 033")
      
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
    let rMaterial = ref.References.Vykaz_Vymer_Material
    let rPraca = ref.References.Vykaz_Vymer_Praca
    let rNaklady = ref.References.Pridruzene_naklady
    let rCena = ref.References.Konecna_Cena
    let rEetapa = ref.References.Etapa

    function vykazVymerMaterial(){
        let vykazVymerMaterial = []
        rMaterial.forEach(function(row) {
            console.log("/////////")
            console.log(row)
            mapEtapa = rEtapa.forEach(function(r)
                            if r.id == row.etapa.rowID {
                                console.log(r.Etapa)
                                return r.Etapa
                            }
                            else { return "chybka" }
                        ),
            
            let item = {
                etapa:mapEtapa
                material:row.material,
                jednotka:row.jednotka,
                jednotkova_cena:row.jednotkova_cena,
                mnozstvo:row.mnozstvo,
                celkova_cena:row.celkova_cena
            }
            vykazVymerMaterial.push(item)
            console.log("/////////")
            console.log(vykazVymerMaterial)
          //vykazVymerMaterial  
        })
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
