import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { CategoryFormData } from "@/types";

class AddCategoryResponse {
  categoryId: string = "";
  categoryName: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleAddCategory(
  categoryReq: CategoryFormData,
  token: string,
) {
  let response: AddCategoryResponse = new AddCategoryResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    // let res = await axios.post(`${apiUrl}/category/getAll`, categoryReq);
    const formData = new FormData();
    formData.append(
      "categoryReq",
      new Blob(
        [
          JSON.stringify({
            categoryName: categoryReq.categoryName,
            categoryDescription: categoryReq.categoryDesc,
          }),
        ],
        { type: "application/json" },
      ),
    );

    if (categoryReq.image) {
      formData.append("categoryImage", categoryReq.image);
    }
    console.log(token);
    console.log(formData);
    let res = await axios.post(`${apiUrl}/category/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res.data);
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
