import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { Product } from "@/types";

class GetProductResponse {
  prodList: Product[] = [];
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleGetProducts(pageNo: number) {
  let response: GetProductResponse = new GetProductResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.get(`${apiUrl}/products/getProducts/${pageNo}`);
    //console.log(res.data);
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
