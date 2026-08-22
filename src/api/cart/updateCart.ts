import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { AddToCart } from "@/types";

class UpdateCartResponse {
  cartId: string = "";
  prodId: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}

class UpdateCartRequest {
  cartId: string = "";
  prodId: string = "";
  quantity: number = 0;
}
export async function handleUpdateCart(
  updateCartReq: UpdateCartRequest,
  token: string,
) {
  let updateCartRes: UpdateCartResponse = new UpdateCartResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.put(`${apiUrl}/cart/update`, updateCartReq, {
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
