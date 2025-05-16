import Link from "next/link";

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">サンプルページ</h1>

      <ul className="space-y-2">
        <li>
          <Link href="/example-01" className="underline">
            Dialogを使用しない例
          </Link>
        </li>
        <li>
          <Link href="/example-02" className="underline">
            SearchParamsを使ったダイアログ実装
          </Link>
        </li>
        <li>
          <Link href="/example-03" className="underline">
            Parallel RoutesとIntercepting Routesを使ったダイアログ実装
          </Link>
        </li>
      </ul>
    </div>
  );
}
