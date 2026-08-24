import axios from "axios";
import { ServiceResult } from "../ServiceResult/ServiceResult";

class DeleteAddressResponse {
  serviceResult: ServiceResult = new ServiceResult();
}

class DeleteAddressRequest {
  addressId: string = "";
}
export async function handleDeleteUserAddress(
  deleteAddrReq: DeleteAddressRequest,
  token: string,
) {
  let deleteAddrRes: DeleteAddressResponse = new DeleteAddressResponse();
  try {
    //console.log(loginReq);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;

    console.log(apiUrl);
    let res = await axios.delete(`${apiUrl}/users/address/delete`, {
      data: deleteAddrReq,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(res?.data);
    if (res && res?.data) {
      deleteAddrRes = res?.data;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      deleteAddrRes.serviceResult.errorMsg = "Axios error: " + error.message;
    } else if (error instanceof Error) {
      deleteAddrRes.serviceResult.errorMsg =
        "Exception from handleLogin - " + error.message;
    } else {
      deleteAddrRes.serviceResult.errorMsg =
        "Unknown exception from handleLogin";
    }
    deleteAddrRes.serviceResult.success = false;
    deleteAddrRes.serviceResult.errorCode = "400";
  }
  //console.log(loginRes);
  return deleteAddrRes;
}
