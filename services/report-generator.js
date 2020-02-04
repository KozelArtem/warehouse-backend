const xlsx = require('xlsx');
const { Op } = require('sequelize');

const { Item, ItemDistribution, DistributionPlace, sequelize } = require('../models');

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
    'Кол-во',
    'Общее кол-во',
    'Причина замены',
  ];

  const groupedByItemName = data
    .reduce((acc, value) => {
      const objValue = value.toJSON();

      acc[objValue.item.name] = acc[objValue.item.name] || [];
      acc[objValue.item.name].push(objValue);

      return acc;
    }, {});

  const result = [];
  const merges = [];
  let startRowInd = 0;

  Object.keys(groupedByItemName)
    .forEach(key => {
      const items = groupedByItemName[key];
      let mergeName = {
        s: { r: startRowInd + 1, c: 0 },
        e: { r: startRowInd + items.length, c: 0 },
      };
      let mergeTotalAmount = {
        s: { r: startRowInd + 1, c: 4 },
        e: { r: startRowInd + items.length, c: 4 },
      };
      startRowInd += items.length;
      
      merges.push(mergeName);
      merges.push(mergeTotalAmount);

      const totalAmount = items.reduce((acc, item) => acc + item.amount, 0);

      items.forEach((value, i) => {
        result.push([
          i === 0 ? [key] : '',
          value.place.name,
          value.date,
          value.amount,
          i === 0 ? totalAmount : '',
        ]);
      });
    });

  result.unshift(fields);
  const ws = xlsx.utils.aoa_to_sheet(result);

  const wscols = [
    { wch: 70 },
    { wch: 20 },
    { wch: 13 },
    { wch: 7 },
    { wch: 13 },
    { wch: 70 },
  ];

  ws['!cols'] = wscols;  
  ws['!merges'] = merges;

  wb.Sheets['Расходники'] = ws;

  const file = xlsx.write(wb, { bookType:'xlsx',  type: 'buffer' });

  return file;
};

module.exports = {
  createExcelReport,
};
