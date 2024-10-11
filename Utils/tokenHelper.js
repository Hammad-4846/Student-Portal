const { success } = require("./responseWrapper");

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();

  //options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };


  res
    .status(statusCode)
    .cookie("growthxtoken", token, options)
    .send(
      success(statusCode, {
        success: true,
        user,
      })
    );
};

module.exports = sendToken;
