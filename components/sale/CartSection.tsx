"use client";

import { Plus, Minus, Trash2, User, X, Gift, ShoppingBag, Clock, Printer, History } from "lucide-react";

interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
    promotion?: {
        id: number;
        title: string;
        discount_type: 'percentage' | 'fixed_amount';
        discount_value: number;
    } | null;
}

interface Customer {
    id: number;
    name: string;
    phone: string;
    points: number;
}

interface CartSectionProps {
    cart: CartItem[];
    subtotal: number;
    discount: number;
    total: number;
    selectedCustomer: Customer | null;
    setSelectedCustomer: (customer: Customer | null) => void;
    setShowCustomerModal: (show: boolean) => void;
    updateQty: (id: number, delta: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    onHoldBill: () => void;
    setShowPaymentModal: (show: boolean) => void;
    heldBillsCount: number;
    onOpenHeldBills: () => void;
    lastBill: any | null;
    onPrintLastBill: () => void;
    onOpenBillHistory: () => void;
}

export default function CartSection({
    cart,
    subtotal,
    discount,
    total,
    selectedCustomer,
    setSelectedCustomer,
    setShowCustomerModal,
    updateQty,
    removeItem,
    clearCart,
    onHoldBill,
    setShowPaymentModal,
    heldBillsCount,
    onOpenHeldBills,
    lastBill,
    onPrintLastBill,
    onOpenBillHistory,
}: CartSectionProps) {
    return (
        <div className="w-full md:w-[400px] flex flex-col bg-white md:border-l border-slate-200 z-30">
            {/* Customer Section */}
            <div className="p-4 border-b border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-700">ตะกร้าสินค้า</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={onOpenBillHistory}
                            className="bg-slate-100 text-slate-600 w-11 h-11 flex items-center justify-center rounded-lg hover:bg-slate-200 transition-colors"
                            title="ประวัติการขาย"
                        >
                            <History className="w-5 h-5" />
                        </button>
                        {heldBillsCount > 0 && (
                            <button
                                onClick={onOpenHeldBills}
                                className="bg-amber-100 text-amber-700 px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 hover:bg-amber-200 transition-colors"
                            >
                                <Clock className="w-4 h-4" />
                                <span>{heldBillsCount}</span>
                            </button>
                        )}
                    </div>
                </div>

                {selectedCustomer ? (
                    <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-xl border border-indigo-200 shadow-sm relative overflow-hidden">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 relative z-10 pr-8">
                            <h3 className="font-bold text-slate-900 text-lg leading-none">
                                {selectedCustomer.name}
                            </h3>

                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-slate-400">|</span>
                                <span className="text-slate-700 font-medium">
                                    {selectedCustomer.phone || "-"}
                                </span>
                            </div>

                            <div className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200 whitespace-nowrap">
                                <Gift className="w-3 h-3" />
                                {(selectedCustomer.points || 0).toLocaleString()}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedCustomer(null)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/50 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowCustomerModal(true)}
                        className="w-full h-12 rounded-lg border-2 border-dashed border-slate-300 text-slate-500 flex items-center justify-center gap-2 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
                    >
                        <User className="w-5 h-5" />
                        เลือกลูกค้า (สมาชิก)
                    </button>
                )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <ShoppingBag className="w-16 h-16 opacity-50" />
                        <p className="text-sm font-medium">ยังไม่มีรายการสินค้า</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex flex-col gap-2 pb-3 border-b border-slate-100 last:border-0">
                            <div className="flex items-start gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-800 text-sm leading-snug line-clamp-2">
                                        {item.name}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-xs text-slate-500">฿{item.price.toLocaleString()} ต่อชิ้น</p>
                                        {item.promotion && (
                                            <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-medium">
                                                {item.promotion.title}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            <div className="text-right w-24 shrink-0">
                                {item.promotion ? (
                                    <>
                                        <div className="text-xs text-slate-400 line-through">
                                            ฿{(item.price * item.qty).toLocaleString()}
                                        </div>
                                        <div className="font-semibold text-orange-600">
                                            ฿{(() => {
                                                const originalTotal = item.price * item.qty;
                                                let discount = 0;
                                                if (item.promotion.discount_type === 'percentage') {
                                                    discount = (originalTotal * item.promotion.discount_value) / 100;
                                                } else {
                                                    discount = item.promotion.discount_value * item.qty;
                                                }
                                                return (originalTotal - discount).toLocaleString();
                                            })()}
                                        </div>
                                    </>
                                ) : (
                                    <div className="font-semibold text-slate-900">
                                        ฿{(item.price * item.qty).toLocaleString()}
                                    </div>
                                )}
                            </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
                                    <button
                                        onClick={() => updateQty(item.id, -1)}
                                        aria-label="ลดจำนวน"
                                        className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-10 text-center font-semibold text-slate-800">{item.qty}</span>
                                    <button
                                        onClick={() => updateQty(item.id, 1)}
                                        aria-label="เพิ่มจำนวน"
                                        className="w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    aria-label="ลบรายการ"
                                    className="w-10 h-10 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Totals & Actions */}
            <div className="p-4 bg-white border-t border-slate-200 z-40">
                <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-slate-500">
                        <span>
                            ยอดรวม ({cart.reduce((a, b) => a + b.qty, 0)} รายการ)
                        </span>
                        <span>฿{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-orange-500">
                        <span>ส่วนลด</span>
                        <span>-฿{discount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-900 font-semibold text-2xl pt-3 border-t border-slate-100">
                        <span>สุทธิ</span>
                        <span>฿{total.toLocaleString()}</span>
                    </div>
                </div>

                <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={cart.length === 0}
                    className="w-full h-14 rounded-xl bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    ชำระเงิน ฿{total.toLocaleString()}
                </button>
                <div className="grid grid-cols-2 gap-3 mt-3">
                    <button
                        onClick={onHoldBill}
                        disabled={cart.length === 0}
                        className="h-11 rounded-lg border border-amber-300 bg-amber-50 text-amber-800 font-medium hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        พักบิล
                    </button>
                    <button
                        onClick={clearCart}
                        disabled={cart.length === 0}
                        className="h-11 rounded-lg border border-slate-200 bg-white text-slate-700 font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        ล้างตะกร้า
                    </button>
                </div>
            </div>
        </div>
    );
}
