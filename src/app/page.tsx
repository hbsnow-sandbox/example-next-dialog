"use client";

import { sampleData } from "./_components/_data";
import { CheckboxTree } from "./_components/checkbox-tree";

export default function Page() {
  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold">サンプルページ</h1>

      <div className="container mx-auto p-6">
        <h1 className="mb-4 text-2xl font-bold">Tree Component</h1>

        <CheckboxTree
          data={sampleData}
          onSelectionChange={(args) => {
            console.log(args);
          }}
          defaultExpanded={[0, 1]}
          defaultSelected={[2]}
        />
      </div>
    </div>
  );
}
