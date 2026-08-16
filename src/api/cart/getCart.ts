import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { CartProduct, Product } from "@/types";

class GetCartResponse {
  cartProductList: CartProduct[] = [];
  cartId: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleGetCartResponse(token: string) {
  let response: GetCartResponse = new GetCartResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.get(`${apiUrl}/cart/getCart`, {
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
        "Exception from handleGetProducts - " + error.message;
    } else {
      response.serviceResult.errorMsg =
        "Unknown exception from handleGetProducts";
    }
    response.serviceResult.errorCode = "400";
  }
  return response;
}
