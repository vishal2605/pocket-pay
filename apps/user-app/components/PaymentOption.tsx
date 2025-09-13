"use client"
import { useState } from "react";
import { CreditCard, Landmark } from "lucide-react";
import PaymentOptionCard from "./ui/PaymentOptionCard";
import NetBankingForm from "./NetBankingForm";
import CreditCardForm from "./CreditCardForm";
import { useSetRecoilState } from "recoil";
import { paymentMethodState } from "../app/store/atoms/PaymentOptionState";

export default function PaymentOptions() {
  const setPaymentMethod = useSetRecoilState(paymentMethodState);
  return (
    <div className="flex">
        <div className="space-y-4">
        <div className="flex item-center justify-center text-lg font-bold">
            Payment Option
        </div>
            <div 
                onClick={() => setPaymentMethod("netbanking")}
                className="cursor-pointer"
            >
                <PaymentOptionCard 
                icon={Landmark} 
                title="Net banking" 
                description="All major bank are available"
                />
            </div>
            <div 
                onClick={() => setPaymentMethod("creditcard")}
                className="cursor-pointer"
            >
                <PaymentOptionCard 
                icon={CreditCard} 
                title="Credit Card" 
                description="Visa,Mastercard,Amex,Rupay and More"
                />
            </div>
        </div>
    </div>
  );
}