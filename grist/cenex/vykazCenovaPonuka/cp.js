/*
/
/ Tlačová šablóna pre Cenex - Cenová ponuka
/
/ autor: Roman Holinec
/ verzia:
/
*/
console.log("*** cp.js - ver: 056")

// grist požaduje plný prístup
grist.ready({ requiredAccess: 'full' })

// načítanie údajov z CP
async function dataFromCP() {
    let dataFromCenex = await grist.docApi.fetchSelectedTable(options = {format:"rows"})
    return dataFromCenex
}
// vytvorenie objektu z CP
let dataCP = dataFromCP()
dataCP.then(
    function(value) { tabData(value) },
    function(error) { console.log(error) }
)

//načítanie údajov z Výkazu výmer - Materiál
let dbMaterial = dbTableMaterial()
let tableMaterial = tabFromMaterial()

async function dbTableMaterial() {
    let dataFromMaterial = await grist.docApi.fetchTable("VykazVymerMaterial")
    return dataFromMaterial
}

function tabFromMaterial() {
  let tabMaterial = []
  dbMaterial.then(function(value){
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    console.log(value)
    sumObj = value.id.length
    for (let i = 0; i < sumObj; i++) {
      let item = {}
      item.id = value.id[i]
      //item.etapa = value.etapa[i]
      //item.popis = value.popis[i]
      tabMaterial.push(item)
    }
  })
  return tabMaterial
}

// načítanie údajov z Etapa
let dbEtapa = dbTableEtapa()
let tableEtapa = tabFromEtapa()

async function dbTableEtapa() {
    let dataFromEtapa = await grist.docApi.fetchTable("Etapa")
    return dataFromEtapa
}

function tabFromEtapa() {
  let tabEtapa = []
  dbEtapa.then(function(value){
    sumObj = value.id.length
    for (let i = 0; i < sumObj; i++) {
      let item = {}
      item.id = value.id[i]
      item.etapa = value.etapa[i]
      item.popis = value.popis[i]
      tabEtapa.push(item)
    }
  })
  return tabEtapa
}



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
            mapEtapa = rEtapa.forEach(function(r) {
                            if (r.id == row.etapa.rowID) {
                                console.log(r.Etapa)
                                return r.Etapa
                            }
                            else { return "chybka" }
                        })

            let item = {
                etapa:mapEtapa,
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
    console.log(rMaterial)
    console.log(rPraca)
    console.log(rNaklady)
    console.log(rCena)
    console.log(rEtapa)
    console.log("******")
}








      function printTable(tableID, data) {
        let table = ""

        if (tableID === null) {
          console.log("Nie je určená cieľová tebulka")
        }
        else {
          table = document.getElementById(tableID)
        }
        data.forEach(function(row) {

          let tr = table.insertRow(-1)

          if (row.etapa) {
            let td1 = tr.insertCell(0)
            td1.innerHTML = row.etapa
          }
          if (row.material) {
            let td2 = tr.insertCell(1)
            td2.innerHTML = row.material
          }
          if (row.jednotka) {
            let td3 = tr.insertCell(2)
            td3.innerHTML = row.jednotka
          }
          if (row.jednotkova_cena) {
            let td4 = tr.insertCell(3)
            td4.innerHTML = row.jednotkova_cena
          }
          if (row.mnozstvo) {
            let td5 = tr.insertCell(4)
            td5.innerHTML = row.mnozstvo
          }
          if (row.celkova_cena) {
            let td6 = tr.insertCell(5)
            td6.innerHTML = row.celkova_cena.toFixed(2)
          }
        })
      }
      /*
      function cp(data) {


        // uvodne zobrazenie informacii o zakaznikovi
        document.getElementById("dielo").innerText=ref.Dielo
        document.getElementById("zakaznik").innerText=ref.Zakaznik
        document.getElementById("telefon").innerText=ref.Telefon
        document.getElementById("mail").innerText=ref.Mail
        //datum vytvorenia ponuky
        let datumVytvorenia = ref.Datum_vytvorenia_ponuky.toLocaleDateString('sk-SK')
        document.getElementById("datumVytvorenia").innerText=datumVytvorenia
        let datumPlatnosti = ref.Datum_platnosti_ponuky.toLocaleDateString('sk-SK')
        document.getElementById("datumPlatnosti").innerText=datumPlatnosti

       }

*/

// urcene do cp.js








//console.log(m.get(1))
/*
//vytvorenie oddelených objektov pre tlačové tabulky
function tabData(value) {
    let ref = value[0]
    let rMaterial = ref.References.Vykaz_Vymer_Material
    let rPraca = ref.References.Vykaz_Vymer_Praca
    let rNaklady = ref.References.Pridruzene_naklady
    let rCena = ref.References.Konecna_Cena
    let rEtapa = ref.References.Etapa

    function vykazVymerMaterial(){
        let vykazVymerMaterial = []
        rMaterial.forEach(function(row) {
            console.log("/////////")
            console.log(row)
            mapEtapa = rEtapa.forEach(function(r) {
                            if (r.id == row.etapa.rowID) {
                                console.log(r.Etapa)
                                return r.Etapa
                            }
                            else { return "chybka" }
                        })
            mapMaterial = rEtapa.forEach(function(r) {
                            if (r.id == row.etapa.rowID) {
                                console.log(r.Etapa)
                                return r.Etapa
                            }
                            else { return "chybka" }
                        })

            let item = {
                etapa:mapEtapa,
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
    console.log(rMaterial)
    console.log(rPraca)
    console.log(rNaklady)
    console.log(rCena)
    console.log(rEtapa)
    console.log("******")
}
*/
