/*
async function example() {
  return await grist.docApi.fetchSelectedTable();
}
*/

// grist pozaduje pristu na čítanie tabulky
grist.ready({ requiredAccess: 'read' })

grist.docApi.fetchSelectedTable(then(resp) => {
            myDisplay(resp)
      }
);

myDisplay(loadData("VykazVymerMaterial"))
console.log(loadData("VykazVymerMaterial"))
