interface ResponseFormat {
  success?: boolean;
  status: string;
  message: string;
  data?: any;
  error?: any;
}

export const successResponse = (
  message: string,
  data: any = null
): ResponseFormat => {
  return {
    success: true,
    status: "success",
    message,
    data,
  };
};

export const validationErrorResponse = (
  message: string,
  errors: any
): ResponseFormat => {
  return {
    success: false,
    status: "validation_error",
    message,
    error: errors,
  };
};

export const serverErrorResponse = (
  message: string,
  error: any = null
): ResponseFormat => {
  return {
    success: false,
    status: "server_error",
    message,
    error,
  };
};

export const notFoundResponse = (message: string): ResponseFormat => {
  return {
    success: false,
    status: "not_found",
    message,
  };
};

export const methodNotAllowedResponse = (message: string): ResponseFormat => {
  return {
    success: false,
    status: "method_not_allowed",
    message,
  };
};
