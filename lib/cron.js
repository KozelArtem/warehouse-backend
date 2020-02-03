const moment = require('moment');
const fs = require('fs');
const CronJob  = require('cron').CronJob;

const { createExcelReport } = require('../services/report-generator');
const { sendMail } = require('../services/mailer');

moment.locale('ru');

const cron = new CronJob(process.env.CRON_TIME, async () => {
  console.log('Cron started', moment().format());
  
  const prevMonth = moment().subtract(1, 'month');
  const start = prevMonth.startOf('month').format();
  const end = prevMonth.endOf('month').format();
  const file = await createExcelReport(start, end);
  
  const to = process.env.MAIL_TO;
  const subject = `Отчет за ${prevMonth.format('MMMM YYYY')}`;
  const attachments = {
    filename: `${subject}.xlsx`,
    content: file,
  };

  await sendMail(to, subject, '', attachments);
});

cron.start();
