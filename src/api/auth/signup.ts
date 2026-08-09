import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";

class SignUpRequest {
  userName: string = "";
  password: string = "";
}
class SignUpRResponse {
  userId: string = "";
  userName: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleSignup(signupReq: SignUpRequest) {
  let signUpRes: SignUpRResponse = new SignUpRResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(`${apiUrl}/users/signup`, signupReq);
    //console.log(res.data);
    if (res && res?.data) {
      signUpRes = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      signUpRes.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      signUpRes.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      signUpRes.serviceResult.errorMsg = "Unknown exception from handleLogin";
    }
    signUpRes.serviceResult.errorCode = "400";
  }
  //console.log(loginRes);
  return signUpRes;
}

export async function handleAdminSignup(signupReq: SignUpRequest) {
  let signUpRes: SignUpRResponse = new SignUpRResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(`${apiUrl}/admin/signup`, signupReq);
    //console.log(res.data);
    if (res && res?.data) {
      signUpRes = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      signUpRes.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      signUpRes.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      signUpRes.serviceResult.errorMsg = "Unknown exception from handleLogin";
    }
    signUpRes.serviceResult.errorCode = "400";
  }
  //console.log(loginRes);
  return signUpRes;
}
