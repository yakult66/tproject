"use client";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputNumber } from "primereact/inputnumber";
import { useState } from "react";

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

// 宣告一個 service 物件，裡面有 getProducts 方法  若是有串後端API 則在此處串接
const productService = {
    getProducts: (): Product[] => {
        return [
            { id: 1, name: "商品 A", price: 100, quantity: 0 },
            { id: 2, name: "商品 B", price: 200, quantity: 0 },
            { id: 3, name: "商品 C", price: 300, quantity: 0 },
        ];
    }
}
export default function ShoppingCart() {
    // 商品列表狀態
    const [products, setProducts] = useState<Product[]>(productService.getProducts());

    // 總金額狀態
    const [total, setTotal] = useState<number>(0);

    // 更新商品數量
    const updateQuantity = (id: number, quantity: number) => {
        setProducts(
            // 遍歷 products 陣列每一個商品 類似for迴圈
            products.map((product) =>
                // 如果商品 id 與要更新的 id 相同，則更新數量，否則保持原樣
                product.id === id ? { ...product, quantity } : product
            )
        );

    };

    // 計算總金額
    const calculateTotal = () => {
        let sum = 0; // 用來累加總金額
        for (const product of products) {
            sum += product.price * product.quantity;
        }
        setTotal(sum); // 設定總金額
    };

    // 生成採購單內容
    const generatePurchaseOrder = () => {
        const date = new Date().toLocaleDateString('zh-TW');
        let content = `採購單\n日期：${date}\n\n`;
        content += '商品名稱\t數量\t單價\t小計\n';
        content += '----------------------------------------\n';

        products.forEach(product => {
            if (product.quantity > 0) {
                content += `${product.name}\t${product.quantity}\t${product.price}\t${product.price * product.quantity}\n`;
            }
        });

        content += '----------------------------------------\n';
        content += `總金額：${total}`;

        return content;
    };

    // 列印採購單
    const printPurchaseOrder = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            const content = `
                <html>
                    <head>
                        <title>採購單</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                padding: 20px;
                            }
                            pre {
                                white-space: pre-wrap;
                                font-family: monospace;
                                font-size: 14px;
                                line-height: 1.5;
                            }
                            @media print {
                                body {
                                    padding: 0;
                                }
                            }
                        </style>
                        <script>
                            function printAndClose() {
                                window.print();
                                // 使用 setTimeout 確保列印對話框出現後再關閉
                                setTimeout(function() {
                                    window.close();
                                }, 1000);
                            }
                            // 頁面載入完成後執行
                            window.onload = printAndClose;
                        </script>
                    </head>
                    <body>
                        <pre>${generatePurchaseOrder()}</pre>
                    </body>
                </html>
            `;
            printWindow.document.write(content);
            printWindow.document.close();
        }
    };

    return (
        <Card title="購物車" className="shadow-lg rounded-xl bg-slate-50">
            <div className="flex flex-col overflow-x-auto">
                {/* 標題列 */}
                <div className="flex flex-row items-center font-bold text-base border-b py-2 bg-gray-100">
                    <div className="flex-1 text-left pl-2">商品名稱</div>
                    <div className="flex-1 text-blue-700 text-center">單價</div>
                    <div className="flex-1 text-center">數量</div>
                    <div className="flex-1 text-green-700 text-center">小計</div>
                </div>
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="flex flex-row items-center rounded-lg shadow mb-2 bg-white gap-2 p-2"
                    >
                        <div className="flex-1 font-bold">{product.name}</div>
                        <div className="flex-1 text-blue-600 text-center">${product.price}</div>
                        <div className="flex-1 flex justify-center">
                            <InputNumber
                                value={product.quantity}
                                onValueChange={(e) => updateQuantity(product.id, e.value || 0)}
                                showButtons
                                min={0}
                                max={10}
                                className="w-20"
                            />
                        </div>
                        <div className="flex-1 text-green-600 font-semibold text-center">
                            小計: ${product.price * product.quantity}
                        </div>
                    </div>
                ))}

                <div className="flex flex-col items-center gap-4 mt-4">
                    <Button label="計算總金額" onClick={calculateTotal} className="rounded-full px-8 py-3 text-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow" />
                    <div className="text-2xl font-bold text-green-600">總金額: ${total}</div>

                    {/* 採購單顯示區域 */}
                    {total > 0 && (
                        <div className="mt-4 p-4 bg-white rounded-lg shadow w-full max-w-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">簡易採購單</h3>
                                <Button
                                    icon="pi pi-print"
                                    label="列印採購單"
                                    onClick={printPurchaseOrder}
                                    className="p-button-rounded p-button-outlined"
                                />
                            </div>
                            <pre className="whitespace-pre-wrap font-mono text-sm">
                                {generatePurchaseOrder()}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
