
import {atom } from 'recoil'

export type PaymentMethod = 'creditcard' | 'netbanking' | null;

export const paymentMethodState = atom<PaymentMethod>({
    key:'paymentMethodState',
    default:'netbanking'
})
