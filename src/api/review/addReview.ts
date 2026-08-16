import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { AddToCart } from "@/types";

class ProductReviewResponse {
  productId: string = "";
  userId: string = "";
  comment: string = "";
  rating: number = 0.0;
  reviewId: string = "";
  createdAt: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}

class ProductReviewRequest {
  productId: string = "";
  comment: string = "";
  rating: number = 0.0;
}
export async function handleAddProductReview(
  productReviewReq: ProductReviewRequest,
  token: string,
) {
  let response: ProductReviewResponse = new ProductReviewResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(
      `${apiUrl}/products/reviews/add`,
      productReviewReq,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
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
  //console.log(loginRes);
  return response;
}
