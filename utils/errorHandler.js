const AppError = require("./AppError");

const handleCastErrorDB = (err) => {
  const message = `Cast Error! Invalid Value ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFields = (err) => {
  console.log(err);
  const value = err.message;

  const message = `Duplicate field value. ${value}. Plz use another value!`;

  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors}`;
  return new AppError(message, 400);
};


const sendError = (err, req, res) => {

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Some Error Occured at our End!",
  });
};

module.exports = (err, req, res, next) => {
  console.log("-----------------------------");
  console.log(err);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  let error = { ...err };
  error.message = err.message;

  if (error.message && error.message.startsWith("Cast"))
    error = handleCastErrorDB(error);

  if (error.code === 11000) error = handleDuplicateFields(error);

  if (
    error._message &&
    (error._message.includes("Validation failed") ||
      error._message.includes("validation failed"))
  )
    error = handleValidationError(error);

  sendError(error, req, res);
};
