import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Parallel RoutesとIntercepting Routesを使ったダイアログ実装 | シンプルストア",
  description: "シンプルなECサイト",
};

export default function Layout({
  children,
  dialog,
}: {
  children: React.ReactNode;
  dialog: React.ReactNode;
}) {
  return (
    <>
      {children}
      {dialog}
    </>
  );
}
