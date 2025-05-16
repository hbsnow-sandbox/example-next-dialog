import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dialogを使用しない例 | シンプルストア",
  description: "シンプルなECサイト",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
