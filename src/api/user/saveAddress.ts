import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";
import { AddressForm, CartProduct, Product } from "@/types";

class SaveAddressResponse {
  addressId: string = "";
  serviceResult: ServiceResult = new ServiceResult();
}

export async function handleSaveAddress(
  addressForm: AddressForm,
  token: string,
) {
  let response: SaveAddressResponse = new SaveAddressResponse();

  try {
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    //console.log(apiUrl);
    let res = await axios.post(`${apiUrl}/users/address/save`, addressForm, {
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
        "Exception from handleSaveAddress - " + error.message;
    } else {
      response.serviceResult.errorMsg =
        "Unknown exception from handleSaveAddress";
    }
    response.serviceResult.errorCode = "400";
  }
  return response;
}
