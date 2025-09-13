import { BadgeCheck, ChartColumn, Gift, KeyRound, Store } from "lucide-react";
import { FeatureCard } from "../../../../components/FeatureCard";

export default function() {
    return <div>
        <div className="flex flex-col items-center justify-center text-center px-4 py-12">
            <h1 className="mb-6 text-6xl font-extrabold tracking-wider md:-tracking-tighter bg-gradient-to-r from-black to-blue-500 bg-clip-text text-transparent md:text-7xl lg:text-8xl">
                Send. Spend. Simplify.
            </h1>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
                PocketPay is your all-in-one digital wallet to manage money with ease. Whether you're sending cash to friends or paying merchants instantly—PocketPay keeps your payments seamless, secure, and swift.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard title="Instant Payments" description="Transfer money in real-time to friends, family, or merchants—anytime, anywhere." icon={BadgeCheck}></FeatureCard>
            <FeatureCard title="Merchant Payments Made Easy" description="Scan QR codes or tap to pay. PocketPay is accepted at thousands of local stores and online merchants." icon={Store}></FeatureCard>
            <FeatureCard title="Secure & Private" description="Your money is encrypted, your data protected. We use top-grade security to keep your finances safe." icon={KeyRound}></FeatureCard>
            <FeatureCard title="Track Every Rupee" description="Stay in control of your spending with real-time insights and transaction history." icon={ChartColumn}></FeatureCard>
            <FeatureCard title=" Rewards & Cashback" description="Earn exciting rewards and cashback every time you pay using PocketPay." icon={Gift}></FeatureCard>
        </div>
        <div className="mt-10">
            <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-700 mb-12">
                    Built for Everyone
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* For Users */}
                    <div className="bg-blue-200 rounded-2xl shadow-lg p-8 transition-transform hover:scale-[1.02] text-slate">
                        <div className="flex items-center mb-4 text-2xl font-bold">
                        🙋‍♂️ For Users
                        </div>
                        <ul className="space-y-4 list-disc list-inside marker:text-slate/80">
                        <li>Pay friends, split bills, or shop online.</li>
                        <li>Add money via UPI, debit card, or net banking.</li>
                        <li>Get exclusive offers just for you.</li>
                        </ul>
                    </div>

                    {/* For Merchants */}
                    <div className="bg-blue-200 rounded-2xl shadow-lg p-8 transition-transform hover:scale-[1.02] text-slate">
                        <div className="flex items-center mb-4 text-2xl font-bold">
                        🧑‍💼 For Merchants
                        </div>
                        <ul className="space-y-4 list-disc list-inside marker:text-slate/80">
                        <li>Accept payments instantly from customers.</li>
                        <li>Get daily settlement reports and analytics.</li>
                        <li>Grow your business with PocketPay merchant tools.</li>
                        </ul>
                    </div>

                    </div>
                </div>
            </section>
        </div>
    </div>
}