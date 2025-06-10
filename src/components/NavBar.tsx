"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Menubar } from "primereact/menubar";

export default function NavBar() {
    const router = useRouter();
    const items = [
        {
            label: "首頁 Home",
            icon: "pi pi-home",
            command: () => router.push("/"),
        },
        {
            label:'註冊',
            icon:'pi pi-user',
            command:()=>router.push('/register')
        },
        {
            label:'登入',
            icon:'pi pi-user',
            command:()=>router.push('/login')
        },
        {
            label:'會員管理',
            icon:'pi pi-user',
            command:()=>router.push('/usermanager')
        },
        {
            label:'購物車',
            icon:'pi pi-shopping-cart',
            command:()=>router.push('/order')
        }
    ];
    const end = (
        <div className="flex align-items-center gap-2">
            <Button icon="pi pi-user" rounded text />
        </div>
    );

    return (
        <div className="card">
        <Menubar model={items} end={end} />
        </div>
    );
}