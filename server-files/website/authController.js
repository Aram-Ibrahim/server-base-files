const { port,pool,limiter,argon2Config } = require('./config');

const authController = async (req, res, next) => {
  const session_id = req.cookies.sessionId;
  const curPage = req.url;
  
  if (curPage === '/account/login' || curPage === '/account/register') 
  {
    return next();
  }
  if (!session_id) 
  {
    return res.redirect('/account/login');
  }

  try {

    const user_id_q = `SELECT Users.user_id FROM Users JOIN Sessions WHERE session_id = ?`;
    const [user_id] = await pool.query(user_id_q, [session_id]);

    if (!user_id) 
    {
      return res.redirect('/account/login');
    }

    req.user_id = user_id;

    next();
  } 
  catch (err) 
  {
    console.error(err);
    res.status(500).send('Error: verifying session failed!');
  }
}

module.exports = authController;
