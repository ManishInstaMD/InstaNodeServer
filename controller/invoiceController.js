const company_sales_invoice = require("../models/company_sales_invoice");

const getInvoiceByCID = async (req, res) => {
    try {
      const { company_id } = req.params;
  
      const invoices = await company_sales_invoice.findAll({
        where: { company_id, is_delete: 0 },
      });
  
      if (!invoices.length) {
        return res
          .status(404)
          .json({ success: false, message: "No invoices found." });
      }
  
      res.json({ success: true, data: invoices });
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  };

const getinvoiceById = async (req, res) => {
    try {
      const invoiceId = req.params.invoiceID;
      const invoice = await company_sales_invoice.findByPk(invoiceId);
      if (!invoice)
        return res
          .status(404)
          .json({ success: false, message: "invoice not found" });
      res.json({ success: true, data: invoice });
    } catch (error) {
      console.error("Error fetching invoice:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };



  const Updateinvoice = async (req, res) => {
    try {
      const invoiceId = req.params.InvoiceID;
      const invoiceData = req.body;
      if (!invoiceData || Object.keys(invoiceData).length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "No data provided to update" });
      }
      const updatedinvoice = await company_sales_invoice.update(invoiceData, {
        where: { invoice_id: invoiceId },
      });
  
      if (updatedinvoice[0] === 0) {
        return res
          .status(404)
          .json({ success: false, message: "invoice not found" });
      }
      res.json({
        success: true,
        message: "invoice updated successfully",
        updatedinvoice: invoiceData,
      });
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ success: false, message: "Server error " });
    }
  };


  const createInvoice = async (req, res) => {
    const InvoiceData = req.body;
    const { company_id } = req.params;
    
    InvoiceData.company_id = company_id;
    try {
      if (
        !InvoiceData.company_id ||
        !InvoiceData.invoice_number ||
        !InvoiceData.invoice_date
      ) {
        return res.status(400).json({
          error:
            "Required fields are missing: company_id, invoice_number, invoice_date.",
        });
      }
      const newInvoice = await company_sales_invoice.create(InvoiceData);
      const updatedData = await company_sales_invoice.findAll();
      req.io.emit("updateData", updatedData);
  
      return res.json(newInvoice);
    } catch (error) {
      console.error("Error creating Invoice:", error);
      if (error.name === "SequelizeValidationError") {
        const validationErrors = error.errors.map((err) => err.message);
        return res
          .status(400)
          .json({ error: "Validation Error", details: validationErrors });
      }
      return res
        .status(500)
        .json({ error: "Error creating Invoice", message: error });
    }
  };


  module.exports = {
    getInvoiceByCID,
    createInvoice,
    Updateinvoice,
    getinvoiceById,
  };