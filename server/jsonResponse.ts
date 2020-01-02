

export interface SgResponse {
  status?: number,
  code: number,
  context: string,
  data: string | object,
}

const internalError = (serverMsg?: string): SgResponse => {
  if (serverMsg) {
    console.log(serverMsg);
  }
  return {
    status: 500,
    code: 500,
    context: "error",
    data: "Something went wrong. Please try again later.",
  }
}

const error = (status: number, code: number, context: string, data: string): SgResponse => {
  return {
    status,
    code,
    context,
    data,
  }
}

const success = (context: string, data: string | object, code?: number): SgResponse => {
  let scode = code ? code : 1;
  return {
    code: scode,
    context,
    data,
  }
}

const sgr = {
  error,
  success,
  internalError
};

export default sgr;
