const {
  getWorkersByInput,
} = require('../services/worker');

const getList = async (req, res) => {
  try {
    const result = await getWorkersByInput(req.query);

    res.send(result);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

module.exports = {
  getList,
};
