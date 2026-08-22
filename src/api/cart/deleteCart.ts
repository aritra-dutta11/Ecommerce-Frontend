import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { AddToCart } from "@/types";

class DeleteCartResponse {
  cartId: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}

class DeleteCartRequest {
  cartId: string = "";
}
export async function handleDeleteCart(
  deleteCartReq: DeleteCartRequest,
  token: string,
) {
  let deleteCartRes: DeleteCartResponse = new DeleteCartResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    console.log(apiUrl);
    let res = await axios.delete(`${apiUrl}/cart/delete`, {
      data: deleteCartReq,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res?.data);
    if (res && res?.data) {
      deleteCartRes = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      deleteCartRes.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      deleteCartRes.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      deleteCartRes.serviceResult.errorMsg =
        "Unknown exception from handleLogin";
    }
    deleteCartRes.serviceResult.success = false;
    deleteCartRes.serviceResult.errorCode = "400";
  }
  //console.log(loginRes);
  return deleteCartRes;
}
