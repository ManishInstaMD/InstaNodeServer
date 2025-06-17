const db = require("../config/database");
const moment = require("moment");
const { Op } = require("sequelize");

const totals = async (req, res) => {
  try {
    const [calls, appointments, followUps] = await Promise.all([
      db.models.Call.findAll({
        where: { is_delete: false },
        order: [["createdAt", "DESC"]],
        limit: 30,
      }),
      db.models.appointment.findAll({
        where: { is_delete: 0 },
        order: [["createdAt", "DESC"]],
        limit: 30,
      }),
      db.models.follow_up.findAll({
        where: { is_delete: 0 },
        order: [["followup_create_date", "DESC"]],
        limit: 30,
      }),
    ]);

    // Get unique pmt_ids
    const uniquePmtIds = new Set();
    calls.forEach((call) => {
      if (call.pmt_id) {
        uniquePmtIds.add(call.pmt_id);
      }
    });

    res.json({
      total_calls: calls.length,
      unique_calls: uniquePmtIds.size,
      total_appointments: appointments.length,
      total_followups: followUps.length,
    });
  } catch (err) {
    console.error("Error fetching summary:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};





const summary = async (req, res) => {
  try {
    const range = req.query.range || "30days"; // default to 30 days
    let fromDate, toDate;

    const today = moment().startOf("day");

    if (range === "today") {
      fromDate = today.clone();
      toDate = today.clone().endOf("day");
    } else {
      fromDate = moment().subtract(29, "days").startOf("day");
      toDate = today.clone().endOf("day");
    }

    const [calls, appointments, followups] = await Promise.all([
      db.models.Call.findAll({
        where: { is_delete: false, createdAt: { [Op.between]: [fromDate.toDate(), toDate.toDate()] } },
      }),
      db.models.appointment.findAll({
        where: { is_delete: 0, createdAt: { [Op.between]: [fromDate.toDate(), toDate.toDate()] } },
      }),
      db.models.follow_up.findAll({
        where: { is_delete: 0, followup_create_date: { [Op.between]: [fromDate.format("YYYY-MM-DD"), toDate.format("YYYY-MM-DD")] } },
      }),
    ]);

    const dataMap = {};

    for (let i = 0; i <= (range === "today" ? 0 : 29); i++) {
      const dateKey = moment(fromDate).add(i, "days").format("YYYY-MM-DD");
      dataMap[dateKey] = { date: dateKey, calls: 0, appointments: 0, followups: 0 };
    }

    calls.forEach((item) => {
      const dateKey = moment(item.createdAt).format("YYYY-MM-DD");
      if (dataMap[dateKey]) dataMap[dateKey].calls += 1;
    });

    appointments.forEach((item) => {
      const dateKey = moment(item.createdAt).format("YYYY-MM-DD");
      if (dataMap[dateKey]) dataMap[dateKey].appointments += 1;
    });

    followups.forEach((item) => {
      const dateKey = moment(item.followup_create_date).format("YYYY-MM-DD");
      if (dataMap[dateKey]) dataMap[dateKey].followups += 1;
    });

    const finalData = Object.values(dataMap);

    res.json(finalData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary", details: err.message });
  }
};



module.exports = {
  totals,
  summary,
};
