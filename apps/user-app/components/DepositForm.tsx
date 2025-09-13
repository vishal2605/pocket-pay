import { useRecoilState } from 'recoil';
import PaymentOption from "./PaymentOption";
import { paymentMethodState } from '../app/store/atoms/PaymentOptionState';
import CreditCardForm from './CreditCardForm';
import NetBankingForm from './NetBankingForm';


export default function DepositForm() {
  const [paymentMethod] = useRecoilState(paymentMethodState);

  return (
    <div className="flex flex-1">
      <div className="w-80 border-r border-slate-300 mr-4 pt-5">
        <div>
          <PaymentOption/>
        </div>
      </div>
      <div>
        {paymentMethod === 'creditcard' && <CreditCardForm />}
        {paymentMethod === 'netbanking' && <NetBankingForm />}
        {!paymentMethod && (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a payment method
          </div>
        )}
      </div>
    </div>
  );
}