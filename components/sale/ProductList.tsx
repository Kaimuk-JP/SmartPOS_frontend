"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/lib/types";

interface ProductListProps {
    products: Product[];
    search: string;
    setSearch: (search: string) => void;
    addToCart: (product: any) => void;
    cart?: any[];
    categories?: { id: number; name: string }[];
    activeCategory?: string;
    setActiveCategory?: (name: string) => void;
}

export default function ProductList({
    products,
    search,
    setSearch,
    addToCart,
    cart = [],
    categories = [],
    activeCategory = "ทั้งหมด",
    setActiveCategory,
}: ProductListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    // Reset to page 1 when search changes
    const handleSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };
    const handleCategoryChange = (name: string) => {
        setActiveCategory?.(name);
        setCurrentPage(1);
    };

    // Pagination calculations
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return products.slice(start, start + itemsPerPage);
    }, [products, currentPage]);

    // Generate page numbers
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 3) pages.push('...');
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) pages.push(i);
            if (currentPage < totalPages - 2) pages.push('...');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="flex-1 flex flex-col min-w-0 p-2 md:pr-4 md:pt-4 md:pb-4 md:pl-4 gap-2 md:gap-4">
            {/* Header / Search */}
            <div className="flex items-center gap-4 bg-white p-3 md:p-4 rounded-xl border border-slate-200">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 md:w-5 md:h-5" />
                    <input
                        type="text"
                        placeholder="ค้นหาสินค้า..."
                        className="w-full pl-9 md:pl-10 pr-4 py-2.5 md:py-3 rounded-lg bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm md:text-base"
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                </div>
                {/* Product count */}
                <div className="hidden md:block text-sm text-slate-500 font-medium whitespace-nowrap">
                    {products.length} รายการ
                </div>
            </div>


            {/* Category filter */}
            {categories.length > 0 && setActiveCategory && (
                <div className="flex gap-2 overflow-x-auto pb-1 -mt-1" role="tablist" aria-label="หมวดหมู่สินค้า">
                    {["ทั้งหมด", ...categories.map((c) => c.name)].map((name) => (
                        <button
                            key={name}
                            role="tab"
                            aria-selected={activeCategory === name}
                            onClick={() => handleCategoryChange(name)}
                            className={`shrink-0 h-11 px-4 rounded-lg text-sm font-medium border transition-colors duration-150 ${activeCategory === name
                                ? "bg-indigo-600 border-indigo-600 text-white"
                                : "bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                                }`}
                        >
                            {name}
                        </button>
                    ))}
                </div>
            )}

            {/* Product Grid */}
            <div className="flex-1 overflow-y-auto min-h-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 pb-4">
                    {
                        paginatedProducts.map((product) => {
                            const cartItem = cart.find(item => item.id === product.id);
                            const qtyInCart = cartItem ? cartItem.qty : 0;
                            const displayStock = product.stock - qtyInCart;
                            const isOutOfStock = displayStock <= 0;

                            return (
                                <button
                                    type="button"
                                    key={product.id}
                                    onClick={() => !isOutOfStock && addToCart(product)}
                                    disabled={isOutOfStock}
                                    className={`text-left bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col transition-colors duration-150
                                    ${isOutOfStock
                                            ? "opacity-60 cursor-not-allowed"
                                            : "hover:border-indigo-400 active:bg-indigo-50 cursor-pointer"
                                        }`}
                                >
                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                        {product.imageUrl ? (
                                            <img
                                                src={product.imageUrl}
                                                alt=""
                                                className={`w-full h-full object-cover ${isOutOfStock ? "grayscale" : ""}`}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full items-center justify-center text-slate-300 font-semibold text-4xl select-none absolute inset-0 flex ${product.imageUrl ? 'hidden' : ''}`}>
                                            {product.name.charAt(0)}
                                        </div>
                                        {isOutOfStock ? (
                                            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
                                                สินค้าหมด
                                            </span>
                                        ) : displayStock < 10 ? (
                                            <span className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-md">
                                                เหลือ {displayStock}
                                            </span>
                                        ) : null}
                                        {qtyInCart > 0 && (
                                            <span className="absolute top-2 right-2 min-w-7 h-7 px-2 bg-indigo-600 text-white text-sm font-semibold rounded-full flex items-center justify-center">
                                                {qtyInCart}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-3 flex flex-col gap-1 flex-1">
                                        <h3 className="font-medium text-slate-800 text-sm leading-snug line-clamp-2 min-h-[2.5rem]">
                                            {product.name}
                                        </h3>
                                        <div className="flex items-end justify-between gap-2 mt-auto pt-1">
                                            <span className="text-lg font-semibold text-indigo-700">
                                                ฿{Number(product.price).toLocaleString()}
                                            </span>
                                            <span className="text-xs text-slate-500 truncate">
                                                {typeof product.category === 'object' ? product.category.name : product.category}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    }
                </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 bg-white p-3 rounded-xl border border-slate-200">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="w-11 h-11 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 text-slate-500" />
                    </button>

                    {getPageNumbers().map((page, idx) => (
                        page === '...' ? (
                            <span key={`dots-${idx}`} className="w-11 h-11 flex items-center justify-center text-slate-400">...</span>
                        ) : (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page as number)}
                                className={`w-11 h-11 flex items-center justify-center rounded-lg font-semibold text-sm transition-all ${currentPage === page
                                        ? 'bg-indigo-600 text-white'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    ))}

                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="w-11 h-11 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight className="w-4 h-4 text-slate-500" />
                    </button>

                    <span className="ml-3 text-sm text-slate-500 hidden sm:block">
                        หน้า {currentPage}/{totalPages}
                    </span>
                </div>
            )}
        </div>
    );
}
