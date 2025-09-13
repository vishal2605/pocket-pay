"use client";

import { useState } from "react"
import DepositForm from "./DepositForm";
import { useRecoilState } from "recoil";
import { DashboardState } from "../app/store/atoms/DashboardState";
import { TransferForm } from "./TransferForm";
import WithdrawForm from "./WithdrawForm";

export default function (){
    const tabs = ["Deposit", "Withdraw", "Transfer"]
    const [activeTab, setActiveTabs] = useRecoilState(DashboardState);
    return (
        <div className="w-full">
            <div className="flex space-x-4 border-b">
                {tabs.map((tab) => (
                    <button key={tab} onClick={() =>setActiveTabs(tab)} className={`py-2 px-4 font-medium border-b-2 transition-colors duration-200 ${
                        activeTab === tab
                          ? "text-blue-600 border-blue-600"
                          : "text-gray-500 border-transparent hover:text-blue-600"
                      }`}>{tab}</button>
                ))}
            </div>
            <div>
                {activeTab === "Deposit" && <DepositForm/>}
                {activeTab === "Withdraw" && <WithdrawForm/>}
                {activeTab === "Transfer" && <TransferForm/>}
            </div>
        </div>
        
    )
}
