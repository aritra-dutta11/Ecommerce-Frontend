import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";

class GetCheckoutDetailsResponse {
  totalAmt: number = 0.0;
  shippingCharges: number = 0.0;
  shippingChargesLimit: number = 0.0;
  serviceResult: ServiceResult = new ServiceResult();
}
class GetCheckoutDetailsRequest {
  cartId: string = "";
}

export async function getCheckoutDetails(
  req: GetCheckoutDetailsRequest,
  token: string,
) {
  let response: GetCheckoutDetailsResponse = new GetCheckoutDetailsResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(`${apiUrl}/order/get/checkout/details`, req, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
