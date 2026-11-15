import { Coins, Receipt, Calculator } from "lucide-react";

interface StatsGridProps {
    todaySales: any;
    dailyViewMode: "today" | "yesterday";
}

export default function StatsGrid({ todaySales, dailyViewMode }: StatsGridProps) {
    const isToday = dailyViewMode === "today";

    const cards = [
        {
            title: isToday ? "ยอดขายวันนี้" : "ยอดขายเมื่อวาน",
            value: isToday ? todaySales.totalAmount : (todaySales.yesterdayTotal || 0),
            secondaryText: isToday
                ? `เมื่อวาน: ${(todaySales.yesterdayTotal || 0).toLocaleString()} บาท`
                : `วันนี้: ${(todaySales.totalAmount || 0).toLocaleString()} บาท`,
            icon: <Coins className="w-6 h-6" />,
            tone: "bg-indigo-50 text-indigo-700",
        },
        {
            title: isToday ? "จำนวนบิลวันนี้" : "จำนวนบิลเมื่อวาน",
            value: isToday ? todaySales.billCount : (todaySales.yesterdayBillCount || 0),
            unit: "บิล",
            secondaryText: isToday
                ? `เมื่อวาน: ${todaySales.yesterdayBillCount || 0} บิล`
                : `วันนี้: ${todaySales.billCount || 0} บิล`,
            icon: <Receipt className="w-6 h-6" />,
            tone: "bg-indigo-50 text-indigo-700",
        },
        {
            title: isToday ? "ค่าเฉลี่ยต่อบิลวันนี้" : "ค่าเฉลี่ยต่อบิลเมื่อวาน",
            value: isToday ? todaySales.averagePerBill : (todaySales.yesterdayAveragePerBill || 0),
            secondaryText: isToday
                ? `เมื่อวาน: ${(todaySales.yesterdayAveragePerBill || 0).toLocaleString()} บาท`
                : `วันนี้: ${(todaySales.averagePerBill || 0).toLocaleString()} บาท`,
            icon: <Calculator className="w-6 h-6" />,
            tone: "bg-indigo-50 text-indigo-700",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.tone}`}>
                            {card.icon}
                        </div>
                        <h3 className="text-base font-medium text-slate-600">{card.title}</h3>
                    </div>
                    <div className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight">
                        {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                        <span className="text-base ml-2 font-normal text-slate-500">{card.unit ?? "บาท"}</span>
                    </div>
                    <div className="text-sm text-slate-500 mt-3 pt-3 border-t border-slate-100">
                        {card.secondaryText}
                    </div>
                </div>
            ))}
        </div>
    );
}
