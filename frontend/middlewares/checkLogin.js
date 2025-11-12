const CHECK_AUTHENTICATION_STATUS_URL = `${process.env.ACCOUNT_SERVICE_URL}/api/auth/status`;

async function checkLogin(req, res, next) {
  try {
    const token = req.cookies['jwt_token']
    if (!token) {
      throw new Error('No token found')
    }

    // Communicate with account service to verify credentials
    const response = await fetch(CHECK_AUTHENTICATION_STATUS_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });
    const data = await response.json();

    // Store user data per request
    req.locals = {
      loggedIn: data.loggedIn,
      user: data.user || null,
      token: token
    }
  } catch {
    req.locals = {
      loggedIn: false,
      user: null,
      token: null
    }
  }
  next();
}

module.exports = checkLogin;