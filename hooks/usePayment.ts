import { useState } from 'react';

interface PaymentState {
  loading: boolean;
  qrCode: string | null;
  payUrl: string | null;
  outTradeNo: string | null;
  error: string | null;
  tradeStatus: 'WAIT_BUYER_PAY' | 'TRADE_CLOSED' | 'TRADE_SUCCESS' | 'TRADE_FINISHED' | 'null' | null;
  paymentType: 'qrcode' | 'web' | null;
  traceId: string | null;
}

interface CreatePaymentParams {
  totalAmount: string;
  subject: string;
  paymentType?: 'qrcode' | 'web';
  returnUrl?: string;
}

export default function usePayment() {
  const [state, setState] = useState<PaymentState>({
    loading: false,
    qrCode: null,
    payUrl: null,
    outTradeNo: null,
    traceId: null,
    error: null,
    tradeStatus: null,
    paymentType: null,
  });

  /**
   * 创建新的支付
   */
  const createPayment = async ({ totalAmount, subject, paymentType = 'qrcode', returnUrl }: CreatePaymentParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const params: any = { totalAmount, subject, paymentType };
      
      // 如果是网页支付，需要提供returnUrl
      if (paymentType === 'web' && returnUrl) {
        params.returnUrl = returnUrl;
      }
      
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '创建支付失败');
      }
      
      console.log('创建支付请求返回数据:', data);
      
      setState(prev => ({
        ...prev,
        loading: false,
        qrCode: data.qrCode || null,  // 二维码URL
        payUrl: data.payUrl || null,  // 网页支付URL
        outTradeNo: data.outTradeNo || null,  // 订单号
        traceId: data.traceId || null,  // 追踪ID
        paymentType: data.paymentType || 'qrcode',  // 支付类型
      }));
      
      // 如果是网页支付，自动重定向
      if (data.payUrl) {
        window.location.href = data.payUrl;
      }
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发生未知错误';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  /**
   * 查询支付状态
   */
  const queryPayment = async (outTradeNo: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await fetch('/api/payment/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ outTradeNo }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // 如果状态码是非200，表示请求出错
        throw new Error(data.error || '查询支付状态失败');
      }
      
      // 即使请求成功，也可能返回交易未找到的消息
      if (data.message && data.message.includes('交易未创建或已过期')) {
        console.warn('交易未找到:', data.message);
        // 但仍然更新状态，因为API已经返回了一个默认的WAIT_BUYER_PAY状态
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        tradeStatus: data.tradeStatus,
      }));
      
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发生未知错误';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  };

  /**
   * 以指定间隔轮询支付状态
   * 返回一个清理函数以停止轮询
   */
  const pollPaymentStatus = (outTradeNo: string, intervalMs = 3000) => {
    if (!outTradeNo) return () => {};
    
    // 记录连续查询失败次数
    let failureCount = 0;
    const maxFailures = 3; // 最大允许连续失败次数
    
    const intervalId = setInterval(async () => {
      try {
        const result = await queryPayment(outTradeNo);
        
        // 重置失败计数
        failureCount = 0;
        
        // 如果支付完成或失败，停止轮询
        if (
          result.tradeStatus === 'TRADE_SUCCESS' || 
          result.tradeStatus === 'TRADE_FINISHED' || 
          result.tradeStatus === 'TRADE_CLOSED'
        ) {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('轮询支付状态时出错:', error);
        
        // 增加失败计数
        failureCount++;
        
        // 如果连续多次失败，停止轮询
        if (failureCount >= maxFailures) {
          console.warn(`连续${maxFailures}次轮询失败，停止轮询`);
          clearInterval(intervalId);
          
          // 更新状态，显示错误
          setState(prev => ({ 
            ...prev, 
            loading: false, 
            error: '查询支付状态失败，请刷新页面重试或联系客服' 
          }));
        }
      }
    }, intervalMs);
    
    // 返回清理函数
    return () => clearInterval(intervalId);
  };

  return {
    ...state,
    createPayment,
    queryPayment,
    pollPaymentStatus,
  };
} 