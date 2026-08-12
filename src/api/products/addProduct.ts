import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { CategoryFormData, ProductFormData } from "@/types";

class AddProductResponse {
  productName: string = "";
  productId: string = "";
  productDesc: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleAddNewProduct(
  productReq: ProductFormData,
  token: string,
) {
  let response: AddProductResponse = new AddProductResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    //let res = await axios.post(`${apiUrl}/category/getAll`, categoryReq);
    const formData = new FormData();
    formData.append(
      "productReq",
      new Blob(
        [
          JSON.stringify({
            productName: productReq.productName,
            productBrand: productReq.brand,
            categoryId: productReq.category,
            productDesc: productReq.productDesc,
            price: productReq.price,
            quantity: productReq.quantity,
          }),
        ],
        { type: "application/json" },
      ),
    );

    for (let i = 0; i < productReq.images.length; i++) {
      formData.append("productImages", productReq.images[i]);
    }
    //console.log(token);
    //console.log(formData);
    let res = await axios.post(`${apiUrl}/products/create`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res?.data);
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
