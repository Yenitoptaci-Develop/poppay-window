import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Building,
  Wallet,
  Factory,
  Smartphone
} from "lucide-react";

const paymentMethods = [
  {
    id: 'credit-card',
    name: 'Kredi Kartı ile Ödeme',
    icon: CreditCard
  },
  {
    id: 'bank-transfer',
    name: 'Havale/EFT ile Ödeme',
    icon: Building
  },
  {
    id: 'balance',
    name: 'Bakiye ile Ödeme',
    icon: Wallet
  },
  {
    id: 'supplier',
    name: 'Tedarikçi Finansmanı ile Ödeme',
    icon: Factory
  },
  {
    id: 'papara',
    name: 'Papara ile Ödeme',
    icon: Smartphone
  }
];

const PaymentPopup = () => {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0].id);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl min-h-[500px] flex overflow-hidden">
        {/* Payment Methods Sidebar */}
        <div className="w-80 bg-gray-50 p-6 border-r border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Ödeme Yöntemi</h2>
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all",
                    "hover:bg-purple-50",
                    selectedMethod === method.id
                      ? "bg-purple-100 text-purple-900 border-purple-200 border"
                      : "text-gray-700"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{method.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Form Area */}
        <div className="flex-1 p-8">
          <div className="max-w-xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </h3>
            
            {/* Placeholder for payment form content */}
            <div className="space-y-4">
              <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
              <div className="h-12 bg-gray-100 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;