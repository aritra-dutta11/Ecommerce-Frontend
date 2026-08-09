import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";

class LoginRequest {
  userId: string = "";
  password: string = "";
}
class LoginResponse {
  userId: string = "";
  userName: string = "";
  token: string = "";
  admin: boolean = false;
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleLogin(loginReq: LoginRequest) {
  let loginRes: LoginResponse = new LoginResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(`${apiUrl}/users/login`, loginReq);
    //console.log(res.data);
    if (res && res?.data) {
      loginRes = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      loginRes.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      loginRes.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      loginRes.serviceResult.errorMsg = "Unknown exception from handleLogin";
    }
    loginRes.serviceResult.errorCode = "400";
  }
  //console.log(loginRes);
  return loginRes;
}

export async function handleAdminLogin(loginReq: LoginRequest) {
  let loginRes: LoginResponse = new LoginResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(`${apiUrl}/admin/login`, loginReq);
    //console.log(res.data);
    if (res && res?.data) {
      loginRes = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      loginRes.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      loginRes.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      loginRes.serviceResult.errorMsg = "Unknown exception from handleLogin";
    }
    loginRes.serviceResult.errorCode = "400";
  }
  //console.log(loginRes);
  return loginRes;
}
