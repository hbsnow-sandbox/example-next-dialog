import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SearchParamsを使ったダイアログ実装 | シンプルストア",
  description: "シンプルなECサイト",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
