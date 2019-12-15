const xlsx = require('xlsx');
const moment = require('moment');
const { Op } = require('sequelize');

const { Item, ItemDistribution, DistributionPlace } = require('../models');

const CATEGORY_ID = 6;

const loadDataForReport1 = async (start, end) => {
  const query = {
    attributes: ['id', 'date', 'amount'],
    include: [
      {
        model: DistributionPlace,
        as: 'place',
        attributes: ['id', 'name'],
      },
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'name', 'amount'],
        where: {
          categoryId: CATEGORY_ID,
        },
      },
    ],
    where: {
      date: {
        [Op.gte]: start,
        [Op.lt]: end,
      },
    },
    order: [['date', 'asc']],
  };

  const result = await ItemDistribution.findAll(query);

  return result;
};

const createExcelReport = async (start, end) => {
  const data = await loadDataForReport1(start, end);

  const wb = xlsx.utils.book_new();

  wb.SheetNames.push('Расходники');

  const fields = [
    'Наименование',
    'Место списания',
    'Дата списания',
    'Количество',
  ];

  const result = data.map(value => {
    return [
      value.item.name,
      value.place.name,
      value.date,
      value.amount,
    ];
  });

  result.unshift(fields);
  const ws = xlsx.utils.aoa_to_sheet(result);

  const wscols = [
    { wch:70 },
    { wch:20 },
    { wch:20 },
    { wch:20 },
  ];

  ws['!cols'] = wscols;

  wb.Sheets['Расходники'] = ws;

  const filename = `report-${Date.now()}.xlsx`;

  await xlsx.writeFile(wb, `./reports/${filename}`);

  return filename;
};

module.exports = {
  createExcelReport,
};
