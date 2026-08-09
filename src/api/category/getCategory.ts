import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { Category } from "@/types";

class GetCategoryResponse {
  categoryList: Category[] = [];
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleGetCategories() {
  let response: GetCategoryResponse = new GetCategoryResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.get(`${apiUrl}/category/getAll`);
    //console.log(res.data);
    if (res && res?.data) {
      response = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      response.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      response.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      response.serviceResult.errorMsg = "Unknown exception from handleLogin";
    }
    response.serviceResult.errorCode = "400";
  }
  return response;
}
