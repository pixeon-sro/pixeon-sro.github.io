/*
/
/ Načítanie a príprava tlačových tabuliek z údajov tabuliek CENEXU
/
/ autor: Roman Holinec
/ box@pixeon.sk
/ verzia: 02
/
*/

console.log("*** Print teplate for CENEX");
console.log("*** cp.js - ver: 02");
console.log("*** autor: Roman Holinec");
console.log("*** mail: box@pixeon.sk");

// grist požaduje plný prístup
grist.ready({ requiredAccess: "full" });

// načítanie údajov z CP
let getCP = dbCP();
async function dbCP() {
  let dataFromCP = await grist.docApi.fetchSelectedTable(
    (options = { format: "rows" }),
  );
  return dataFromCP;
}
//načítanie údajov z Výkaz Výmer Materiál
let getMaterial = dbMaterial();
async function dbMaterial() {
  let dataFromMaterial = await grist.docApi.fetchTable("VYKAZ_VYMER_MATERIAL");
  return dataFromMaterial;
}
//načítanie údajov z Výkaz Výmer Práca
let getPraca = dbPraca();
async function dbPraca() {
  let dataFromPraca = await grist.docApi.fetchTable("VYKAZ_VYMER_PRACA");
  return dataFromPraca;
}
//načítanie údajov z Výkaz Výmer Pridružené náklady
let getNaklady = dbNaklady();
async function dbNaklady() {
  let dataFromNaklady = await grist.docApi.fetchTable("VYKAZ_VYMER_PRIDRUZENE_NAKLADY");
  return dataFromNaklady;
}
//načítanie údajov z Konečná Cena
let getCena = dbCena();
async function dbCena() {
  let dataFromCena = await grist.docApi.fetchTable("KONECNA_CENA");
  return dataFromCena;
}

/**
 * Zaokruhlovanie čísel
 * funkcia vracia zaokrúhlené číslo
 *
 * @param {number} num - Zaokrúhlované číslo
 * @param {number} decimal - počet desatinných miest po zaokrúhlení
 *
 **/
function round(num, decimal = 0) {
  return Math.round(num * 10 ** decimal * (1 + Number.EPSILON)) / 10 ** decimal;
}

/**
 * Zitovanie prazdnej hodnoty
 * funkcia vracia boolen
 *
 * @param {any} value - ak je hodnota pázdna/nezadaná vracia true, inak false
 *
 **/
function _isEmpty(value) {
  if (typeof value === "array") {
    if (value.length === 0) {
      return true;
    } else {
      return false;
    }
  } else if (typeof value === "object") {
    if (value.id.length === 0) {
      return true;
    } else {
      return false;
    }
  } else if (typeof value === "string") {
    if (value == "") {
      return true;
    } else {
      return false;
    }
  } else {
    console.log("_isEmpty() - neriešená hodnota:" + typeof value);
    return true;
  }
}

/**
* vytvorenie prázdnej tabuľky
*
* @param {string} id - oznacuje id objektu, do ktorého sa tabuľka vloží
* @param {array} column - pole s označením stĺpcov v tabuľke
**/
function createTable(id, caption, column) { 
  const place = document.getElementById(id)
  const table = document.createElement("table")
  table.setAttribute("id", id + "_table")
  place.appendChild(table)
  const tabCaption = table.createCaption()
  tabCaption.innerHTML = "<H1>" + caption + "</h1>";
  const header = table.createTHead()
  const row = header.insertRow()
  column.forEach(function th(value) {
    thCell = document.createElement("TH")
    thCell.innerText = value
    row.appendChild(thCell)
  })
  table.createTBody()
}

/**
* vytvorenie záznamu v tabuľke
*
* @param {string} id - oznacuje id tabulky, do ktorej sa vloží záznam
* @param {array} column - pole s hodnotamy stĺpcov záznamu
**/
function createEntry(id, column) {
  const table = document.getElementById(id).getElementsByTagName('tbody')[0]
  row = table.insertRow(-1)
  column.forEach(function td(value) {
    tdCell = row.insertCell(-1)
    tdCell.innerText = value
    row.appendChild(tdCell)
  })
}

// spracovanie údajov pre tlač
//  pole všetkých Promisov
allPromises = [
  getCP,
  getMaterial,
  getPraca,
  getNaklady,
  getCena
];

Promise.allSettled(allPromises).then(function (data) {
  //console.log(data)
  
  // tlač hlavičky CP
  const cp = data[0].value[0];
  document.getElementById("dielo").innerText = cp.Dielo;
  document.getElementById("inv-meno").innerText = cp.Investor;
  document.getElementById("inv-adresa").innerText = cp.Investor_adresa;
  document.getElementById("inv-telefon").innerText = cp.Investor_telefon;
  document.getElementById("inv-email").innerText = cp.Investor_email;
  document.getElementById("inv-telefon").innerText = cp.Investor_telefon;
  document.getElementById("inv-ico").innerText = cp.Investor_Ico;
  document.getElementById("inv-dic").innerText = cp.Investor_Dic;
  document.getElementById("inv-dic-dph").innerText = cp.Investor_Dic_DPH;
  document.getElementById("zhot-meno").innerText = cp.Zhotovitel;
  document.getElementById("zhot-adresa").innerText = cp.Zhotovitel_adresa;
  document.getElementById("zhot-telefon").innerText = cp.Zhotovitel_telefon;
  document.getElementById("zhot-email").innerText = cp.Zhotovitel_email;
  document.getElementById("zhot-telefon").innerText = cp.Zhotovitel_telefon;
  document.getElementById("zhot-ico").innerText = cp.Zhotovitel_Ico;
  document.getElementById("zhot-dic").innerText = cp.Zhotovitel_Dic;
  document.getElementById("zhot-dic-dph").innerText = cp.Zhotovitel_Dic_DPH;
  document.getElementById("datum-cp").innerText = cp.Datum_CP;
  document.getElementById("platnost-cp").innerText = cp.Platnost_CP;

  // tlač Materiálu
  const material = data[1].value;
  //console.log(material)
  if (!_isEmpty(material)) {
    const column = ["etapa", "materiál", "jednotka", "jednotková\ncena", "množstvo", "celková\ncena"]
    const caption = "Výkaz Materiál"
    createTable("material", caption, column)
    
    const sumObj = material.id.length
    for (let i = 0; i < sumObj; i++) {
      const idObj = i
      const entry = []
      entry.push(material.Referencie[idObj][1].Etapa[1].Etapa)
      entry.push(material.Referencie[idObj][1].Material[1].Nazov)
      entry.push(material.Referencie[idObj][1].Jednotka)
      entry.push(round(material.Referencie[idObj][1].Cena, 2) + " €")
      entry.push(material.Referencie[idObj][1].Mnozstvo)
      entry.push(round(material.Referencie[idObj][1].Celkova_cena, 2) + " €")
      createEntry("material_table", entry)
    }
  }
  else {
    const place = document.getElementById("material")
    const text = document.createElement("h3")
    place.appendChild(text)
    text.innerText = "Ponuka vypracovaná bez položiek MATERIÁLU"
  }

  // tlač Práca
  const praca = data[2].value;
  //console.log(praca)
  if (!_isEmpty(praca)) {
    const column = ["etapa", "práca", "jednotka", "jednotková\ncena", "množstvo", "celková\ncena"]
    const caption = "Výkaz Práce"
    createTable("praca", caption, column)
    
    const sumObj = praca.id.length
    for (let i = 0; i < sumObj; i++) {
      const idObj = i
      const entry = []
      entry.push(praca.Referencie[idObj][1].Etapa[1].Etapa)
      entry.push(praca.Referencie[idObj][1].Praca[1].Nazov)
      entry.push(praca.Referencie[idObj][1].Jednotka)
      entry.push(round(praca.Referencie[idObj][1].Jednotkova_cena,2)+" €")
      entry.push(praca.Referencie[idObj][1].Mnozstvo)
      entry.push(round(praca.Referencie[idObj][1].Celkova_cena,2)+" €")
      createEntry("praca_table", entry)
    }
  }
  else {
    const place = document.getElementById("praca")
    const text = document.createElement("h3")
    place.appendChild(text)
    text.innerText = "Ponuka vypracovaná bez položiek PRÁCE"
  }
  
  // tlač Pridružené náklady
  const naklady = data[3].value;
  //console.log(naklady)
  if (!_isEmpty(naklady)) {
    const column = ["etapa", "pridružené\nnáklady", "jednotka", "jednotková\ncena", "množstvo", "celková\ncena"]
    const caption = "Výkaz Pridružených nákladov"
    createTable("naklady", caption, column)
    
    const sumObj = naklady.id.length
    for (let i = 0; i < sumObj; i++) {
      const idObj = i
      const entry = []
      entry.push(naklady.Referencie[idObj][1].Etapa[1].Etapa)
      entry.push(naklady.Referencie[idObj][1].Naklady[1].Nazov)
      entry.push(naklady.Referencie[idObj][1].Jednotka)
      entry.push(round(naklady.Referencie[idObj][1].Jednotkova_cena,2)+" €")
      entry.push(naklady.Referencie[idObj][1].Mnozstvo)
      entry.push(round(naklady.Referencie[idObj][1].Celkova_cena,2)+" €")
      createEntry("naklady_table", entry)
    }
  }
  else {
    const place = document.getElementById("naklady")
    const text = document.createElement("h3")
    place.appendChild(text)
    text.innerText = "Ponuka vypracovaná bez položiek PRIDRUŽENÝCH NÁKLADOV"
  }
  
  // tlač Celková ceny
  const cena = data[4].value;
  //console.log(cena)
  if (!_isEmpty(cena)) {
    const column = ["položka", "materiál", "práca", "pridružené\nnáklady", "celková\ncena"]
    const caption = "Celková Cena"
    createTable("cena", caption, column)
    
    const sumObj = cena.id.length
    for (let i = 0; i < sumObj; i++) {
      const idObj = i
      const entry = []
      entry.push(cena.Polozka[idObj])
      entry.push(round(cena.Material[idObj],2)+" €")
      entry.push(round(cena.Praca[idObj],2)+" €")
      entry.push(round(cena.Pridruzene_naklady[idObj],2)+" €")
      entry.push(round(cena.Celkova_cena[idObj],2)+" €")
      createEntry("cena_table", entry)
    }
  }
}); //ukončenie Promise.allSettled[idObj]