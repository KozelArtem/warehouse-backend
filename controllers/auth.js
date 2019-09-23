const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const privateUser = {
  id: 1,
  username: '$2b$13$ehdZEYkpRQ6bGakbukI07egpmAlMnjqbQa47VS0GA1WeARavv1tCi',
  password: '$2b$13$eDZ4mODUY/v7968V6HXHAey2fJRW/mAHGmhwhHiHjZrb1JC4GrVey'
};

const signIn = async (req, res, next) => {
  try {
    let user = null;
    const crypted = await bcrypt.compare(req.body.username, privateUser.username);
    if (crypted) {
      user = privateUser;
    }

    if (!user) {
      next({ status: 401 });

      return;
    }

    const result = await bcrypt.compare(req.body.password, user.password);

    if (result) {
      const payload = {
        id: user.id,
      };
    
      const token = jwt.sign(payload, 'secretKey123');
      res.send({ token });

      return;
    }

    next({ status: 401 });
  } catch (err) {
    next(err);
  }

};

module.exports = {
  signIn,
};
