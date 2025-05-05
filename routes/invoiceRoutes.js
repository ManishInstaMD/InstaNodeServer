const express = require("express");
const {
  getInvoiceByCID,
  createInvoice,
  Updateinvoice,
  getinvoiceById,
} = require("../controller/invoiceController");

const router = express.Router();

router.get("/invoices/:company_id", getInvoiceByCID);
router.post("/InvoiceCreate/:company_id", createInvoice);
router.get("/invoice/:invoiceID", getinvoiceById);
router.put("/invoiceUpdate/:InvoiceID", Updateinvoice);

module.exports = router;
