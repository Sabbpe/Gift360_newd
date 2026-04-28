// src/api/paymentApi.ts
import axios from "axios";
import type {
  PaymentProcessRequest,
  PaymentResponse,
  SabbPeInitiateRequest,
  SabbPeInitiateResponse,
} from "@/types/payment";

const PAYMENT_URL = import.meta.env.VITE_PAYMENT_API_URL;

// SabbPe API URL from environment
const SABBPE_API_URL = import.meta.env.VITE_PAYMENT_API_URL;

// Helper to generate timestamp in required format
const generateTimestamp = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// ✅ Generate SabbPe Token using wrapper endpoint
// Uses /sabbpe/v1/token instead of /PaymentGenerateToken
export const generatePaymentToken = async (merchantOrderRef: string): Promise<{
  status: boolean;
  sabbpe_token?: string;
  transaction_id?: string;
  message?: string;
}> => {
  const timestamp = generateTimestamp();

  const requestData = {
    sabbpe_userid: import.meta.env.VITE_SABBPE_USERID,
    sabbpe_merchantid: import.meta.env.VITE_SABBPE_MERCHANTID,
    sabbpe_password: import.meta.env.VITE_SABBPE_PASSWORD,
    timestamp: timestamp,
    merchant_order_ref: merchantOrderRef,
  };

  console.log("🔑 Generating SabbPe token with:", requestData);

  const response = await axios.post(
    `${SABBPE_API_URL}/token`,
    requestData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("✅ SabbPe token response:", response.data);

  return response.data;
};

// Initiate Payment Process - FOR NTT DATA
export const initiatePaymentProcess = async (
  amount: number,
  orderNumber: string,
  encryptedData: string,
  token: string
): Promise<PaymentResponse> => {
  const now = new Date();

  // Get current timestamp in IST
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const payload: PaymentProcessRequest = {
    payInstrument: {
      extras: {
        udf1: "-",
        udf2: import.meta.env.VITE_PAYMENT_CLIENT_ID,
        udf3: "-",
        udf4: import.meta.env.VITE_PAYMENT_CLIENT,
        udf5: "-",
        udf6: token,
        udf7: import.meta.env.VITE_PAYMENT_RETURN_URL,
        udf8: "-",
        udf9: "-",
        udf10: encryptedData,
      },
      payDetails: {
        amount: Number(amount.toFixed(2)),
        product: import.meta.env.VITE_PAYMENT_PRODUCT,
        custAccNo: null,
        txnCurrency: "INR",
      },
      custDetails: {
        custFirstName: import.meta.env.VITE_PAYMENT_CUSTFIRSTNAME,
        custEmail: import.meta.env.VITE_PAYMENT_CUSTEMAIL,
        custMobile: import.meta.env.VITE_PAYMENT_CUSTMOBILE,
      },
      headDetails: {
        api: "AUTH",
        version: "OTSv1.1",
        platform: "FLASH",
      },
      merchDetails: {
        userId: import.meta.env.VITE_PAYMENT_TRANSACTION_USERID,
        merchId: import.meta.env.VITE_PAYMENT_TRANSACTION_MERCHANTID,
        merchTxnId: orderNumber,
        merchTxnDate: timestamp,
      },
      // payModeSpecificData: {
      // subChannel: import.meta.env.VITE_PAYMENT_SUBCHANNEL === "ALL" ? null :  import.meta.env.VITE_PAYMENT_SUBCHANNEL
      // }
    },
  };

  console.log("💳 Initiating NTT Data payment process with:", payload);

  const response = await axios.post<PaymentResponse>(
    `${PAYMENT_URL}/PaymentProcess`,
    payload
  );

  console.log("✅ NTT Data payment response:", response.data);

  return response.data;
};

// ✅ Initiate Sabbpe Payment - Direct payment with token
// This is the new flow: generate token first, then initiate payment with that token
export const initiateSabbpePayment = async (
  sabbpeToken: string,
  amount: number,
  productinfo: string,
  frontendUrl: string,
  encryptedOrderRef: string | undefined,
  customer: {
    firstname: string;
    email: string;
    phone: string;
  }
): Promise<SabbPeInitiateResponse> => {
  const payload: SabbPeInitiateRequest = {
    sabbpe_token: sabbpeToken,
    productinfo: productinfo,
    amount: amount,
    frontend_url: frontendUrl,
    encrypted_order_ref: encryptedOrderRef,
    customer: customer,
  };

  console.log("💳 Initiating Sabbpe payment with:", payload);

  const response = await axios.post<SabbPeInitiateResponse>(
    `${SABBPE_API_URL}/initiate`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("✅ Sabbpe initiate response:", response.data);

  return response.data;
};
