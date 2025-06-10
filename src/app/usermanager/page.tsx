"use client";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    status: string;
    password: string;
    lastLogin: string;
    gender: string;
}

const userService = {
    getUsers: async () => {
        try {
            const response = await fetch('https://ottfwogpkzhitdekrnkq.supabase.co/rest/v1/UsersTbl?select=*', {
                headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dGZ3b2dwa3poaXRkZWtybmtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxMzQxMzMsImV4cCI6MjA2NDcxMDEzM30.56I4EssOz4RGnPcKeHl-vLI0D_QYEPbuKdzxWjMYmXU'
                }
            });

            if (!response.ok) {
                throw new Error('API請求失敗');
            }

            const data = await response.json();

            // 添加缺少的字段
            return data.map((user: {
                id: number;
                name: string;
                email: string;
                password: string;
                gender: string;
                created_at: string;
            }) => ({
                ...user,
                status: "active",
                lastLogin: "2024-03-15 14:30"
            }));
        } catch (error) {
            console.error('獲取用戶數據時出錯:', error);
            return [];
        }
    }
}

export default function UserList() {
    // 使用者資料
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // 使用 useEffect 來取得使用者資料
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            const data = await userService.getUsers();
            setUsers(data);
            setLoading(false);
        };

        fetchUsers();
    }, []);

    // 狀態標籤模板
    const statusTemplate = (rowData: User) => {
        return (
            <Tag
                value={rowData.status === "active" ? "啟用" : "停用"}
                severity={rowData.status === "active" ? "success" : "danger"}
            />
        );
    };

    // 性別模板
    const genderTemplate = (rowData: User) => {
        return rowData.gender === "male" ? "男" : "女";
    };

    // 操作按鈕模板
    const actionTemplate = (rowData: User) => {
        return (
            <div className="flex gap-2">
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-text p-button-sm"
                    tooltip="編輯"
                    onClick={() => alert(`編輯 ${rowData.name}`)}
                />
                <Button
                    icon="pi pi-trash"
                    className="p-button-rounded p-button-text p-button-danger p-button-sm"
                    tooltip="刪除"
                    onClick={() => alert(`刪除 ${rowData.name}`)}
                />
            </div>
        );
    };

    return (
        <div className="card">
            <DataTable
                value={users}
                paginator
                rows={5}
                loading={loading}
                rowsPerPageOptions={[5, 10, 25, 50]}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="顯示第 {first} 到 {last} 筆，共 {totalRecords} 筆"
                className="p-datatable-sm"
            >
                <Column
                    field="id"
                    header="ID"
                    sortable
                    className="w-[5%]"
                />
                <Column
                    field="name"
                    header="姓名"
                    sortable
                    className="w-[15%]"
                />
                <Column
                    field="email"
                    header="電子郵件"
                    sortable
                    className="w-[20%]"
                />
                <Column
                    field="password"
                    header="密碼"
                    sortable
                    className="w-[10%]"
                />
                <Column
                    field="gender"
                    header="性別"
                    body={genderTemplate}
                    sortable
                    className="w-[10%]"
                />
                <Column
                    field="status"
                    header="狀態"
                    body={statusTemplate}
                    sortable
                    className="w-[10%]"
                />
                <Column
                    field="lastLogin"
                    header="最後登入"
                    sortable
                    className="w-[15%]"
                />
                <Column
                    body={actionTemplate}
                    header="操作"
                    className="w-[10%]"
                />
            </DataTable>
        </div>
    );
}
