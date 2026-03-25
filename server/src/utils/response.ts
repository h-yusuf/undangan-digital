export function successResponse(data: any, message?: string) {
  return {
    success: true,
    message: message || 'Success',
    data,
  };
}

export function errorResponse(message: string, code?: number) {
  return {
    success: false,
    message,
    code: code || 500,
  };
}
