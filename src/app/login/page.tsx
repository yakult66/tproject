
"use client";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useState } from "react";

// 宣告一個 FormDataIF 介面，裡面有 email, password, rememberMe 屬性 用於存放 表單資料
interface FormDataIF {
    email: string; // 帳號
    password: string; // 密碼
    rememberMe: boolean; // 記住我
}
// 宣告一個 UserInfoIF 介面，裡面有 name, email, password, gender 屬性 用於顯示 使用者資訊
interface UserInfoIF {
    name: string; // 姓名
    email: string; // 電子郵件
    password: string; // 密碼
    gender: string; // 性別
}

// 宣告一個 service 物件，裡面有 getUserInfo 方法  若是有串後端API 則在此處串接
const authService = {
    login: async (email: string, password: string) => {
        try {
            // 串接後端API
            const response = await fetch(
                // https://ottfwogpkzhitdekrnkq.supabase.co/rest/v1/UsersTbl 是後端API的URL
                // ?select=*&email=eq.${encodeURIComponent(email)} 是後端API的參數
                // encodeURIComponent(email) 是將 email 進行編碼
                `https://ottfwogpkzhitdekrnkq.supabase.co/rest/v1/UsersTbl?select=*&email=eq.${encodeURIComponent(email)}`,
                {
                    // 使用 GET 方法
                    method: 'GET',
                    // 設定 headers
                    headers: {
                        // 設定 apikey
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dGZ3b2dwa3poaXRkZWtybmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzQxMzMsImV4cCI6MjA2NDcxMDEzM30.56I4EssOz4RGnPcKeHl-vLI0D_QYEPbuKdzxWjMYmXU',
                    }
                }
            );

            if (!response.ok) {
                throw new Error('API請求失敗');
            }

            const data = await response.json();

            if (data && data.length > 0 && data[0].password === password) {
                return {
                    email: data[0].email,
                    password: data[0].password,
                    name: data[0].name || '未知',
                    gender: data[0].gender || '未知'
                };
            }

            return undefined;
        } catch (error) {
            console.error('登入錯誤:', error);
            return undefined;
        }
    },
};


export default function LoginForm() {

    // 宣告一個 formData 變數，用於存放 表單資料
    const [formData, setFormData] = useState<FormDataIF>({
        email: "",
        password: "",
        rememberMe: false,
    });

    // 宣告一個 userInfo 變數，用於存放 登入後使用者資訊
    const [userInfo, setUserInfo] = useState<UserInfoIF | undefined>(undefined);

    // 宣告一個 isInfoVisible 變數，用於控制 使用者資訊是否顯示
    const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);

    // 宣告一個 error 變數，用於存放 錯誤訊息
    const [error, setError] = useState<string | undefined>(undefined);

    // 宣告一個 handleLogin 方法，用於處理 登入
    const handleLogin = async () => {
        try {
            // 呼叫 service 物件的 login 方法，並將 formData 的 email 和 password 傳入
            const resultUserInfo = await authService.login(formData.email, formData.password);
            // 如果 resultUserInfo 有值
            if (resultUserInfo) {
                // 將 resultUserInfo 的值設定給 userInfo 變數
                setUserInfo(resultUserInfo);
                // 將 isInfoVisible 設為 true
                setIsInfoVisible(true);
                // 將 error 設為 undefined
                setError(undefined);
            }
            // 如果 resultUserInfo 沒有值
            else {
                // 將 isInfoVisible 設為 false
                setIsInfoVisible(false);
                // 將 error 設為 "帳號或密碼錯誤"
                setError("帳號或密碼錯誤");
            }
        } catch (err) {
            console.error('登入處理錯誤:', err);
            setIsInfoVisible(false);
            setError("登入失敗，請稍後再試");
        }
    };



    // 宣告一個css 變數 ： 垂直排列  水平(副軸)靠左 各元件間距 間距為 0.5rem
    const cssUserInfoItem = 'flex flex-col items-start gap-2 ';


    return (
        <div className="flex justify-center items-center h-full bg-gray-100 gap-4">
            <Card className="w-96" title="登入">
                <div className="space-y-4">
                    {/* tip */}
                    <p className="text-gray-500">
                        帳號: test@test.com
                        <br />
                        密碼: 123456
                    </p>
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <InputText
                            id="email"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({ ...formData, email: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="block font-medium text-gray-700"
                        >
                            密碼
                        </label>
                        <InputText
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <div>
                            <Checkbox
                                inputId="rememberMe"
                                checked={formData.rememberMe}
                                onChange={(e) =>
                                    setFormData({ ...formData, rememberMe: e.checked ?? false })
                                }
                            />
                            <label htmlFor="rememberMe" className="ml-2 text-gray-700">
                                記住我
                            </label>
                        </div>
                        {error &&
                            <p id='error' className="text-red-500">
                                {error}
                            </p>
                        }
                    </div>
                    <Button
                        label="登入"
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                        onClick={handleLogin}
                    />
                </div>
            </Card>

            <Card title="使用者資訊" className={`w-96 ${isInfoVisible ? '' : 'hidden'}`}>
                <div className="flex flex-col gap-4 ">
                    <div className={`${cssUserInfoItem}`}>
                        <label htmlFor="email" className="font-medium">Email:</label>
                        <div className="p-2 bg-gray-100 rounded">
                            {userInfo?.email}
                        </div>
                    </div>
                    <div className={`${cssUserInfoItem}`}>
                        <label htmlFor="password" className="font-medium">密碼:</label>
                        <div className="p-2 bg-gray-100 rounded">
                            {userInfo?.password}
                        </div>
                    </div>
                    <div className={`${cssUserInfoItem}`}>
                        <label htmlFor="name" className="font-medium">姓名:</label>
                        <div className="p-2 bg-gray-100 rounded">
                            {userInfo?.name}
                        </div>
                    </div>
                    <div className={`${cssUserInfoItem}`}>
                        <label htmlFor="gender" className="font-medium">性別:</label>
                        <div className="p-2 bg-gray-100 rounded">
                            {userInfo?.gender}
                        </div>
                    </div>
                </div>
            </Card>

        </div>
    );
}
