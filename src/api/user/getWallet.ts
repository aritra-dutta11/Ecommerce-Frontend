import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { CartProduct, Product } from "@/types";

class GetWalletResponse {
  walletId: string = "";
  amount: number = 0.0;
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleGetWalletResponse(token: string) {
  let response: GetWalletResponse = new GetWalletResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.get(`${apiUrl}/users/wallet/get`, {
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
        "Exception from handleGetWalletResponse - " + error.message;
    } else {
      response.serviceResult.errorMsg =
        "Unknown exception from handleGetWalletResponse";
    }
    response.serviceResult.errorCode = "400";
  }
  return response;
}
