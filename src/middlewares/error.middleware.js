export const errorHandler = (error, _request, response, _next) => {
  const statusCode = error.statusCode || 500;
  console.log('Error:', error.message || error);
  return response.status(statusCode).json({
    success: false,
    message: error.message || 'Internal server error',
  });
};
