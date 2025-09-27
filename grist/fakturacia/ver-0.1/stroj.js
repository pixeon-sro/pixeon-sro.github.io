function conLog(log){
  console.log(
    "%c pxn log: " + log,
    "background: #157A54; color: #fff; padding: 3px"
  )
}

conLog("pokusný log")

function updateInvoice(row) {
  console.log("GOT...", JSON.stringify(row))
  const loger = document.getElementById('loger')
  loger.innerText(JSON.stringify(row))
}

grist.ready()
grist.onRecord(updateInvoice)
