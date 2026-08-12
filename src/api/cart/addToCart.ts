import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { AddToCart } from "@/types";

class AddToCartResponse {
  cartId: string = "";
  prodId: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}
export async function handleAddToCart(addToCartReq: AddToCart, token: string) {
  let addToCartRes: AddToCartResponse = new AddToCartResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(`${apiUrl}/cart/add`, addToCartReq, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //console.log(res.data);
    if (res && res?.data) {
      addToCartRes = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      addToCartRes.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      addToCartRes.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      addToCartRes.serviceResult.errorMsg =
        "Unknown exception from handleLogin";
    }
    addToCartRes.serviceResult.errorCode = "400";
  }
  //console.log(loginRes);
  return addToCartRes;
}
