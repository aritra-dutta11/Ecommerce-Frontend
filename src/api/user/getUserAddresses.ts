import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { Address } from "@/types";

class GetUserAddressResponse {
  addressList: Address[] = [];
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleGetUserAddresses(token: string) {
  let response: GetUserAddressResponse = new GetUserAddressResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.get(`${apiUrl}/users/address/get`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(res.data);
    if (res && res?.data) {
      response = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      response.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      response.serviceResult.errorMsg =
        "Exception from handleGetUserAddresses - " + error.message;
    } else {
      response.serviceResult.errorMsg =
        "Unknown exception from handleGetUserAddresses";
    }
    response.serviceResult.errorCode = "400";
  }
  return response;
}
