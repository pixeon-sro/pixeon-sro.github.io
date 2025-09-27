function updateInvoice(row) {
  console.log("GOT...", JSON.stringify(row))
  const loger = document.getElementById('loger')
  loger.innerText(JSON.stringify(row))
}

grist.ready()
grist.onRecord(updateInvoice)
