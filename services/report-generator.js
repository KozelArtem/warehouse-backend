const xlsx = require('xlsx');
const moment = require('moment');
const { Op } = require('sequelize');

const { Item, ItemDistribution, DistributionPlace } = require('../models');

const CATEGORY_ID = 6;

const loadDataForReport = async (start, end) => {
  const query = {
    attributes: ['id', 'name', 'amount'],
    where: {
      categoryId: CATEGORY_ID,
    },
    include: [
      {
        model: ItemDistribution,
        as: 'distributions',
        attributes: ['id', 'date', 'amount'],
        include: {
          model: DistributionPlace,
          as: 'place',
          attributes: ['id', 'name'],
          order: ['date'],
        },
        required: true,
        where: {
          date: {
            [Op.gte]: start,
            [Op.lt]: end,
          },
        },
      },
    ],
  };

  const result = await Item.findAll(query);

  return result;
};

const createExcelReport = async (start, end) => {
  const data = await loadDataForReport(start, end);

  const wb = xlsx.utils.book_new();

  wb.SheetNames.push('Расходники');

  const result = [
    [
      'Наименование',
      'Остаток',
      'Место списания',
      'Дата списания',
      'Количество',
    ]
  ];
  const maxWidth = [];
  data.forEach(value => {
    const row = [value.name];
    if (value.name.length > maxWidth[0]) {
      maxWidth[0] = value.name.length;
    } 
    const distributions = (value.distributions || []).map(distribution => {
        const { date, amount } = distribution;

        return row.concat(distribution.place.name, moment(date).format('DD-MM-YYYY'), amount);
    });

    result.push(...distributions);

    return row;
  });

  
  const result1 = result.sort((a, b) => {
    const res = moment(a[2]) - moment().isBefore(moment(b[2]))

    return res ? 1 : -1;
  });

  const ws = xlsx.utils.aoa_to_sheet(result1);

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
