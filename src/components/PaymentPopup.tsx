import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Building,
  Wallet,
  Factory,
  Smartphone,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

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
  const [selectedInstallment, setSelectedInstallment] = useState('1');
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const { toast } = useToast();

  const baseAmount = 750.00;
  const currentBalance = 500.00; // Örnek bakiye

  const calculateInstallmentAmount = (installment: string) => {
    const interestRates: { [key: string]: number } = {
      '1': 0,
      '3': 0.05,
      '6': 0.09,
      '9': 0.13
    };
    
    const rate = interestRates[installment] || 0;
    const totalAmount = baseAmount * (1 + rate);
    const monthlyAmount = totalAmount / Number(installment);
    
    return {
      total: totalAmount.toFixed(2),
      monthly: monthlyAmount.toFixed(2),
      interestAmount: (totalAmount - baseAmount).toFixed(2)
    };
  };

  const handleBalancePayment = () => {
    if (currentBalance < baseAmount) {
      toast({
        variant: "destructive",
        title: "Yetersiz Bakiye",
        description: "Bakiyeniz yetersiz. Lütfen bakiye yükleyiniz.",
        action: (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.href = '/bakiye-yukle'}
          >
            Bakiye Yükle
          </Button>
        ),
      });
      return;
    }
    // Ödeme işlemine devam et...
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'credit-card':
        const installmentDetails = calculateInstallmentAmount(selectedInstallment);
        
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Kart Numarası</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" maxLength={19} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Son Kullanma Tarihi</Label>
                <Input id="expiryDate" placeholder="MM/YY" maxLength={5} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV/CVC</Label>
                <Input id="cvv" placeholder="123" maxLength={3} type="password" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardHolder">Kart Sahibinin Adı Soyadı</Label>
              <Input id="cardHolder" placeholder="Ad Soyad" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installment">Taksit Seçeneği</Label>
              <Select value={selectedInstallment} onValueChange={setSelectedInstallment}>
                <SelectTrigger>
                  <SelectValue placeholder="Taksit seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Tek Çekim</SelectItem>
                  <SelectItem value="3">3 Taksit</SelectItem>
                  <SelectItem value="6">6 Taksit</SelectItem>
                  <SelectItem value="9">9 Taksit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 p-4 bg-purple-50 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Ürün Tutarı:</span>
                <span className="font-medium">{baseAmount.toFixed(2)} TL</span>
              </div>
              {selectedInstallment !== '1' && (
                <div className="flex justify-between items-center text-purple-600">
                  <span className="text-sm">Vade Farkı:</span>
                  <span className="font-medium">+{installmentDetails.interestAmount} TL</span>
                </div>
              )}
              <div className="flex justify-between items-center font-bold border-t border-purple-200 pt-2 mt-2">
                <span>Toplam Tutar:</span>
                <span>{installmentDetails.total} TL</span>
              </div>
              {selectedInstallment !== '1' && (
                <div className="flex justify-between items-center text-sm text-purple-600">
                  <span>Aylık Taksit Tutarı:</span>
                  <span>{installmentDetails.monthly} TL</span>
                </div>
              )}
            </div>

            <div className="flex items-start gap-2 mt-4">
              <input
                type="checkbox"
                id="terms"
                className="mt-1"
                checked={hasAgreedToTerms}
                onChange={(e) => setHasAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                <a 
                  href="/siparis-sozlesmesi" 
                  target="_blank" 
                  className="text-purple-600 hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('/siparis-sozlesmesi', '_blank');
                  }}
                >
                  Sipariş sözleşmesini
                </a>
                {' '}okudum ve kabul ediyorum.
              </label>
            </div>

            <div className="flex items-start gap-2 mt-4">
              <input
                type="checkbox"
                id="saveCard"
                className="mt-1"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
              />
              <label htmlFor="saveCard" className="text-sm text-gray-600">
                Kartımı daha sonraki ödemelerim için kaydet
              </label>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="preInformation"
                  className="mt-1"
                />
                <label htmlFor="preInformation" className="text-sm text-gray-600">
                  <a 
                    href="/on-bilgilendirme-formu" 
                    target="_blank" 
                    className="text-purple-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('/on-bilgilendirme-formu', '_blank');
                    }}
                  >
                    Ön bilgilendirme formunu
                  </a>
                  {' '}okudum ve kabul ediyorum.
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="returnRights"
                  className="mt-1"
                />
                <label htmlFor="returnRights" className="text-sm text-gray-600">
                  <a 
                    href="/iade-hakki" 
                    target="_blank" 
                    className="text-purple-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('/iade-hakki', '_blank');
                    }}
                  >
                    İade hakkı şartlarını
                  </a>
                  {' '}okudum ve kabul ediyorum.
                </label>
              </div>

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="distanceSelling"
                  className="mt-1"
                />
                <label htmlFor="distanceSelling" className="text-sm text-gray-600">
                  <a 
                    href="/mesafeli-satis-sozlesmesi" 
                    target="_blank" 
                    className="text-purple-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open('/mesafeli-satis-sozlesmesi', '_blank');
                    }}
                  >
                    Mesafeli satış sözleşmesini
                  </a>
                  {' '}okudum ve kabul ediyorum.
                </label>
              </div>
            </div>
          </div>
        );

      case 'balance':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Mevcut Bakiye</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">{currentBalance.toFixed(2)} TL</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => window.location.href = '/bakiyem'}
                  >
                    <Plus className="w-4 h-4" />
                    Bakiye Yükle
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Ödenecek Tutar</span>
                <span className="text-lg font-bold text-purple-600">{baseAmount.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Kalan Bakiye</span>
                <span className="text-lg font-bold">{(currentBalance - baseAmount).toFixed(2)} TL</span>
              </div>
            </div>
            <Button 
              className="w-full" 
              onClick={handleBalancePayment}
              disabled={currentBalance < baseAmount}
            >
              {currentBalance < baseAmount ? 'Yetersiz Bakiye' : 'Bakiye ile Öde'}
            </Button>
          </div>
        );

      case 'supplier':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Tedarikçi</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Tedarikçi seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier1">Tedarikçi A</SelectItem>
                  <SelectItem value="supplier2">Tedarikçi B</SelectItem>
                  <SelectItem value="supplier3">Tedarikçi C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Vade</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Vade seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 Gün</SelectItem>
                  <SelectItem value="60">60 Gün</SelectItem>
                  <SelectItem value="90">90 Gün</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Finansman Limiti:</span>
                <span className="font-medium">100.000 TL</span>
              </div>
              <div className="flex justify-between">
                <span>Faiz Oranı:</span>
                <span className="font-medium">%1.89</span>
              </div>
            </div>
          </div>
        );

      case 'papara':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paparaNumber">Papara Numarası</Label>
              <Input id="paparaNumber" placeholder="Papara numaranızı giriniz" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paparaEmail">E-posta veya Telefon</Label>
              <Input id="paparaEmail" placeholder="E-posta veya telefon numaranız" />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Ödenecek Tutar</span>
                <span className="text-lg font-bold text-purple-600">750,00 TL</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            
            {renderPaymentForm()}

            <div className="mt-8">
              <Button className="w-full">Ödemeyi Tamamla</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPopup;
