const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
      success: false,
      error: err.message 
    });
  };
  
  const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  
  module.exports = {
    errorHandler,
    asyncHandler
  };