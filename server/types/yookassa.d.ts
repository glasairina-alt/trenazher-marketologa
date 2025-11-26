declare module 'yookassa' {
  interface YooKassaConfig {
    shopId: string;
    secretKey: string;
  }

  interface Amount {
    value: string;
    currency: string;
  }

  interface PaymentMethodData {
    type: string;
  }

  interface Confirmation {
    type: string;
    return_url?: string;
    confirmation_url?: string;
  }

  interface ReceiptItem {
    description: string;
    quantity: string;
    amount: Amount;
    vat_code: number;
    payment_subject?: string;
    payment_mode?: string;
  }

  interface Receipt {
    customer: {
      email?: string;
      phone?: string;
    };
    items: ReceiptItem[];
  }

  interface CreatePaymentParams {
    amount: Amount;
    capture?: boolean;
    confirmation?: {
      type: string;
      return_url: string;
    };
    description?: string;
    metadata?: Record<string, string>;
    payment_method_data?: PaymentMethodData;
    receipt?: Receipt;
  }

  interface Payment {
    id: string;
    status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
    paid: boolean;
    amount: Amount;
    confirmation: Confirmation;
    created_at: string;
    description?: string;
    metadata?: Record<string, string>;
    payment_method?: {
      type: string;
      id: string;
      saved: boolean;
    };
    recipient?: {
      account_id: string;
      gateway_id: string;
    };
    refundable: boolean;
    test: boolean;
  }

  class YooKassa {
    constructor(config: YooKassaConfig);
    createPayment(params: CreatePaymentParams, idempotenceKey?: string): Promise<Payment>;
    getPayment(paymentId: string): Promise<Payment>;
    capturePayment(paymentId: string, amount?: Amount): Promise<Payment>;
    cancelPayment(paymentId: string): Promise<Payment>;
  }

  export default YooKassa;
}
