import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { PlaceOrderRequest } from "@/types";

class PlaceOrderResponse {
  orderId: string = "";
  netAmt: number = 0.0;
  shippingCharges: number = 0.0;
  serviceResult: ServiceResult = new ServiceResult();
}
export async function handleOrderPlace(req: PlaceOrderRequest, token: string) {
  let updateCartRes: PlaceOrderResponse = new PlaceOrderResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(`${apiUrl}/order/placeorder`, req, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res?.data);
    if (res && res?.data) {
      updateCartRes = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      updateCartRes.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      updateCartRes.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      updateCartRes.serviceResult.errorMsg =
        "Unknown exception from handleLogin";
    }
    updateCartRes.serviceResult.success = false;
    updateCartRes.serviceResult.errorCode = "400";
  }
  //console.log(loginRes);
  return updateCartRes;
}
