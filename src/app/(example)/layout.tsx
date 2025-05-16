import { ArrowLeft, ShoppingBag, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-gray-800 p-4">
        <Link href="/" className="inline-flex gap-2 align-middle text-gray-100">
          <ArrowLeft />
          トップページに戻る
        </Link>
      </div>
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6" />
            <span className="text-xl font-medium">シンプルストア</span>
          </div>

          <nav className="flex items-center space-x-4">
            <Link href="#" className="p-2 hover:text-gray-600">
              <User className="h-5 w-5" />
            </Link>
            <Link href="#" className="p-2 hover:text-gray-600">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex-grow px-4 py-8">{children}</main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>シンプルストア</p>
        </div>
      </footer>
    </div>
  );
}
