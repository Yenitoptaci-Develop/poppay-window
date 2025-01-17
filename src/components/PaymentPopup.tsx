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
  const [saveCard, setSaveCard] = useState(false);
  const { toast } = useToast();

  const baseAmount = 750.00;
  const currentBalance = 500.00;

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

  const bankAccounts = [
    {
      bankName: "Garanti Bankası",
      accountHolder: "ABC Teknoloji A.Ş.",
      iban: "TR12 3456 7890 1234 5678 9012 34",
      accountNumber: "1234567-8",
      branchCode: "123"
    },
    {
      bankName: "İş Bankası",
      accountHolder: "ABC Teknoloji A.Ş.",
      iban: "TR98 7654 3210 9876 5432 1098 76",
      accountNumber: "87654321-9",
      branchCode: "456"
    },
    {
      bankName: "Yapı Kredi",
      accountHolder: "ABC Teknoloji A.Ş.",
      iban: "TR45 6789 0123 4567 8901 2345 67",
      accountNumber: "2345678-9",
      branchCode: "789"
    }
  ];

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

            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-start gap-2 mb-4">
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
                    Ön bilgilendirme formunu ve iade hakkı şartlarını
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

      case 'bank-transfer':
        return (
          <div className="space-y-6">
            {bankAccounts.map((account, index) => (
              <div 
                key={account.iban} 
                className="p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-lg text-purple-700">{account.bankName}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-purple-600"
                    onClick={() => {
                      navigator.clipboard.writeText(account.iban);
                      toast({
                        title: "IBAN kopyalandı",
                        description: "IBAN numarası panoya kopyalandı.",
                      });
                    }}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    IBAN Kopyala
                  </Button>
                </div>
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hesap Sahibi:</span>
                    <span className="font-medium">{account.accountHolder}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IBAN:</span>
                    <span className="font-medium font-mono">{account.iban}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hesap No:</span>
                    <span className="font-medium">{account.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Şube Kodu:</span>
                    <span className="font-medium">{account.branchCode}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center font-bold">
                <span>Ödenecek Tutar:</span>
                <span className="text-purple-700">{baseAmount.toFixed(2)} TL</span>
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
            <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Tedarikçi Finansmanı Nasıl Çalışır?"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bank">Finansman Sağlayıcı</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Banka seçiniz" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hayat">Hayat Finans</SelectItem>
                  <SelectItem value="kuveyt">Kuveyttürk Bankası</SelectItem>
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
                <span>Hizmet Bedeli:</span>
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
