"use client";

import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { useState } from "react";

interface FormDataIF {
    name: string; // 姓名
    email: string; // 電子郵件
    password: string; // 密碼
    gender: string; // 性別
}

const authService = {
    register: async (formData: FormDataIF) => {
        try {
            // 串接後端API
            const response = await fetch("https://ottfwogpkzhitdekrnkq.supabase.co/rest/v1/UsersTbl", {
                // 使用 POST 方法
                method: "POST",
                // 設定 headers
                headers: {
                    // 設定 apikey
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dGZ3b2dwa3poaXRkZWtybmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzQxMzMsImV4cCI6MjA2NDcxMDEzM30.56I4EssOz4RGnPcKeHl-vLI0D_QYEPbuKdzxWjMYmXU',
                    // 設定 Content-Type
                    'Content-Type': 'application/json',
                    // 設定 Prefer (回傳的內容不要太多廢話)
                    'Prefer': 'return=minimal'
                },
                // 設定 body
                body: JSON.stringify(formData)
            });
            // 如果 API 請求失敗，則拋出錯誤
            if (!response.ok) {
                throw new Error(`API請求失敗: ${response.status}`);
            }
            // 如果 API 請求成功，則回傳 true
            return true;
        } catch (error) {
            // 如果 API 請求失敗，則拋出錯誤
            console.error('註冊錯誤:', error);
            return false;
        }
    }
}

export default function MemberForm() {
    // 表單狀態
    const [formData, setFormData] = useState<FormDataIF>({
        name: "",
        email: "",
        password: "",
        gender: "",
    });


    // 處理表單提交
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const success = await authService.register(formData);

            if (success) {
                const formDataString =
                    "姓名: " +
                    formData.name +
                    "\n" +
                    "電子郵件: " +
                    formData.email +
                    "\n" +
                    "密碼: " +
                    formData.password +
                    "\n" +
                    "性別: " +
                    formData.gender +
                    "\n";
                alert("註冊成功! \n表單資料: \n" + formDataString);
            } else {
                alert("註冊失敗，請稍後再試");
            }
        } catch (error) {
            console.error('提交表單錯誤:', error);
            alert("發生錯誤，請稍後再試");
        }
    };

    return (
        // css flex: 使用 flexbox 來排版
        // justify-center: 水平置中
        // items-center: 垂直置中
        <div className="flex justify-center items-center h-full">
            <Card title="會員註冊" className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name">
                            姓名
                        </label>
                        <InputText
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">電子郵件</label>
                        <InputText
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="password">密碼</label>
                        <InputText
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>性別</label>
                        <div className="flex gap-4">
                            <div className="flex items-center">
                                <RadioButton
                                    inputId="male"
                                    name="gender"
                                    value="male"
                                    checked={formData.gender === "male"}
                                    onChange={(e) =>
                                        setFormData({ ...formData, gender: e.value })
                                    }
                                />
                                <label htmlFor="male" className="ml-2">
                                    男性
                                </label>
                            </div>
                            <div className="flex items-center">
                                <RadioButton
                                    inputId="female"
                                    name="gender"
                                    value="female"
                                    checked={formData.gender === "female"}
                                    onChange={(e) =>
                                        setFormData({ ...formData, gender: e.value })
                                    }
                                />
                                <label htmlFor="female" className="ml-2">
                                    女性
                                </label>
                            </div>
                        </div>
                    </div>
                    <Button type="submit" label="註冊" className="mt-4" />
                </form>
            </Card>
        </div>
    );
}
