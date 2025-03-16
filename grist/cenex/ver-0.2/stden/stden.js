/**
 * Tlačová šablóna údajov pre Stavebný Denník
 *
 * @autor: Roman Holinec
 * @mail: box@pixeon.sk
 * @version: 01
 *
 * @example: pri vitvorení widgetu v griste je potrebne použiť URL:
 *           https://pixeon-sro.github.io/grist/stavex/stavebny-dennik/ver-01/stden.html
 *
 **/

console.log("*** Print teplate for Stavebný denník");
console.log("*** stden.js - ver: 01");
console.log("*** autor: Roman Holinec");
console.log("*** mail: box@pixeon.sk");

/**
 * Zaokruhlovanie čísel
 * funkcia vracia zaokrúhlené číslo
 *
 * @param {number} num - Zaokrúhlované číslo
 * @param {number} decimal - počet desatinných miest po zaokrúhlení
 *
 **/
function _round(num, decimal = 0) {
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
    if (value.legth === 0) {
      return true;
    } else {
      return false;
    }
  } else if (typeof value === "object") {
    if (value.legth === 0) {
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

// grist požaduje plný prístup
grist.ready({ requiredAccess: "full" });

// načítanie údajov Investora
const dbStavba = getStavba();
async function getStavba() {
  let dataFromCenex = await grist.docApi.fetchTable("STAVBA");
  return dataFromCenex;
}

// načítanie údajov Stavebného Denníka
const dbStavDennik = getStavDennik();
async function getStavDennik() {
  let dataFromCenex = await grist.docApi.fetchSelectedTable(
    (options = { format: "rows" }),
  );
  return dataFromCenex;
}

// spracovanie údajov pre tlač
//  pole všetkých Promisov
const allPromises = [dbStavba, dbStavDennik];

// načítanie všetkych Promisov a príprava polí objektov
Promise.allSettled(allPromises).then(function (data) {
  //console.log(data)

  const stavba = data[0].value;
  //console.log(stavba)
  const stavDennik = data[1].value;
  // zoradenie záznamov podľa dátumu
  stavDennik.sort(function (a, b) {
    return a.Zaciatok - b.Zaciatok;
  });
  console.log(stavDennik);

  document.getElementById("stavba-dielo").innerText = stavba.Dielo;
  document.getElementById("stavba-adresa").innerText =
    stavba.Ulica + ", " + stavba.Psc + " " + stavba.Mesto;
  //investor
  document.getElementById("inv-meno").innerText = stavba.Investor_meno;
  document.getElementById("inv-telefon").innerText = stavba.Investor_telefon;
  document.getElementById("inv-mail").innerText = stavba.Investor_email;
  document.getElementById("inv-adresa").innerText = stavba.Investor_adresa;
  document.getElementById("inv-ico").innerText = stavba.Investor_Ico;
  document.getElementById("inv-dic").innerText = stavba.Investor_Dic;
  document.getElementById("inv-dic-dph").innerText = stavba.Investor_Dic_DPH;

  // profil spločnosti
  document.getElementById("zh-meno").innerText = stavba.Zhotovitel_meno;
  document.getElementById("zh-adresa").innerText = stavba.Zhotovitel_adresa;
  document.getElementById("zh-telefon").innerText = stavba.Zhotovitel_telefon;
  document.getElementById("zh-mail").innerText = stavba.Zhotovitel_email;
  document.getElementById("zh-ico").innerText = stavba.Zhotovitel_Ico;
  document.getElementById("zh-dic").innerText = stavba.Zhotovitel_Dic;
  document.getElementById("zh-dic-dph").innerText = stavba.Zhotovitel_Dic_DPH;

  // funkcia vytvára jednotlivé záznami v stavebnom denníku
  function printElementSD(value) {
    const parrentDiv = document.getElementById("stavDennik");

    const divDate = document.createElement("div");
    divDate.classList.add(
      "grid",
      "box-border-date",
      "margin-bottom",
      "no-break-page",
    );
    const dateStart = document.createElement("div");
    dateStart.classList.add("s-6", "m-6", "l-6", "padding-left");
    dateStart.innerHTML =
      "<strong>Začiatok</strong>: " +
      value.Zaciatok.toLocaleDateString() +
      " - " +
      value.Zaciatok.toLocaleTimeString();
    divDate.appendChild(dateStart);
    const dateEnd = document.createElement("div");
    dateEnd.classList.add("s-6", "m-6", "l-6");
    dateEnd.innerHTML =
      "<strong>Koniec</strong>: " +
      value.Koniec.toLocaleDateString() +
      " - " +
      value.Koniec.toLocaleTimeString();
    divDate.appendChild(dateEnd);
    parrentDiv.appendChild(divDate);

    const divPocasie = document.createElement("div");
    divPocasie.classList.add("grid", "margin-bottom");
    const pocLabel = document.createElement("div");
    pocLabel.classList.add("s-2", "m-2", "l-2");
    pocLabel.innerHTML = "<strong>Počasie</strong>: ";
    divPocasie.appendChild(pocLabel);
    const pocValue = document.createElement("div");
    pocValue.classList.add("s-10", "m-10", "l-10");
    let checkPocasie = "";
    if (!_isEmpty(value.Pocasie)) {
      checkPocasie = value.Pocasie;
    } else {
      checkPocasie = "Počasie nebolo zapísané!";
    }
    pocValue.innerHTML = checkPocasie;
    divPocasie.appendChild(pocValue);
    parrentDiv.appendChild(divPocasie);

    const divPracovnici = document.createElement("div");
    divPracovnici.classList.add("grid", "margin-bottom");
    const pracLabel = document.createElement("div");
    pracLabel.classList.add("s-2", "m-2", "l-2");
    pracLabel.innerHTML = "<strong>Pracovníci</strong>: ";
    divPracovnici.appendChild(pracLabel);
    const pracValue = document.createElement("div");
    pracValue.classList.add("s-10", "m-10", "l-10");
    let checkPracovnici = "";
    if (!_isEmpty(value.Pracovnici)) {
      checkPracovnici = value.Pracovnici;
    } else {
      checkPracovnici = "Pracovníci neboli zapísaný!";
    }
    pracValue.innerHTML = checkPracovnici;
    divPracovnici.appendChild(pracValue);
    parrentDiv.appendChild(divPracovnici);

    const divSupisPrac = document.createElement("div");
    divSupisPrac.classList.add("grid", "margin-bottom");
    const supisLabel = document.createElement("div");
    supisLabel.classList.add("s-2", "m-2", "l-2");
    supisLabel.innerHTML = "<strong>Súpis prác</strong>: ";
    divSupisPrac.appendChild(supisLabel);
    const supisValue = document.createElement("div");
    supisValue.classList.add("s-10", "m-10", "l-10");
    let checkSupisPrac = "";
    if (!_isEmpty(value.Supis_prac)) {
      checkSupisPrac = value.Supis_prac;
    } else {
      checkSupisPrac = "Súpis prác je prázdny!";
    }
    supisValue.innerHTML = checkSupisPrac;
    divSupisPrac.appendChild(supisValue);
    parrentDiv.appendChild(divSupisPrac);

    const divPoznamka = document.createElement("div");
    divPoznamka.classList.add("grid", "margin-bottom");
    const poznamkaLabel = document.createElement("div");
    poznamkaLabel.classList.add("s-2", "m-2", "l-2");
    poznamkaLabel.innerHTML = "<strong>Poznámka</strong>: ";
    divPoznamka.appendChild(poznamkaLabel);
    const poznamkaValue = document.createElement("div");
    poznamkaValue.classList.add("s-10", "m-10", "l-10");
    let checkPoznamka = "";
    if (!_isEmpty(value.Poznamka)) {
      checkPoznamka = value.Poznamka;
    } else {
      checkPoznamka = "Bez poznámky k pracovnému dňu.";
    }
    poznamkaValue.innerHTML = checkPoznamka;
    divPoznamka.appendChild(poznamkaValue);
    parrentDiv.appendChild(divPoznamka);
  }

  Object.entries(stavDennik).forEach(([, value]) => {
    if (value == null) {
      return null;
    }
    printElementSD(value);
  });
});
