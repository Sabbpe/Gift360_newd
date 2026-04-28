export interface TokenGenerationRequest {
  transaction_userid: string;
  transaction_merchantid: string;
  client_Id: string;
  transaction_timestamp: string; 
  processor: string;
}

// Token Generation Response
export interface TokenGenerationResponse {
  token: string; // Response is a string token
}

export interface PaymentProcessRequest {
  payInstrument: {
    extras: {
      udf1: string;  // orderNumber
      udf2: string;  // client_id
      udf3: string;  // token
      udf4: string;  // subchannel
      udf5: string;
      udf6: string,
      udf7: string,
      udf8: string,
      udf9: string,
      udf10: string  
    };
    payDetails: {
      amount: number;
      product: string;
      custAccNo: null;
      txnCurrency: string;
    };
    custDetails: {
      custFirstName: string;
      custEmail: string;
      custMobile: string;
    };
    headDetails: {
      api: string;
      version: string;
      platform: string;
    };
    merchDetails: {
      userId: string;
      merchId: string;
      merchTxnId: string;  // orderNumber
      merchTxnDate: string;
    };
    // payModeSpecificData: {
    //   subChannel: string|null;
    // };
    // payModeSpecificData: object;
  };
}

// Payment response from backend
export interface PaymentResponse {
  atomTokenId: number;
  responseDetails: {
    txnStatusCode: string;
    txnDescription: string;
  };
  // Additional properties that might be returned
  data?: string;
  accessKey?: string;
  status?: boolean | number;
  message?: string;
}

// SabbPe Initiate Request - matches the exact payload structure needed
export interface SabbPeInitiateRequest {
  sabbpe_token: string;
  productinfo: string;
  amount: number;
  frontend_url: string;
  encrypted_order_ref?: string;
  customer: {
    firstname: string;
    email: string;
    phone: string;
  };
}

// SabbPe Initiate Response
export interface SabbPeInitiateResponse {
  status: boolean;
  transactionId?: string;
  merchantOrderRef?: string;
  paymentUrl?: string;
  payment_url?: string;
  gateway?: string;
  txnid?: string;
  initiationStatus?: string;
  message?: string;
  data?: string;
}

// AtomPaynetz options
export interface AtomPaynetzOptions {
  atomTokenId: number;
  merchId: string;
  custEmail: string;
  custMobile: string;
  returnUrl: string;
}

// Declare global AtomPaynetz class
declare global {
  interface Window {
    AtomPaynetz: new (options: AtomPaynetzOptions, env: string) => void;
  }
}

// This is required for TypeScript modules
export {};
