"use client";

import { ChevronRight } from "lucide-react";
import { useMemo } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import type { CheckboxItem } from "./use-tree-state";

import { sampleData } from "./_data";
import { useTreeState } from "./use-tree-state";

// 汎用的なTreeComponentを作成
function TreeComponent({
  title,
  items,
  toggleCheck,
  toggleExpand,
}: {
  title: string;
  items: CheckboxItem[];
  toggleCheck: (path: number[], checked: boolean) => void;
  toggleExpand: (path: number[], expanded: boolean) => void;
}) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>

      <div className="space-y-2 rounded-lg border bg-gray-50 p-4">
        {items.map((item, index) => (
          <NestedCheckboxItem
            key={item.id}
            item={item}
            level={0}
            path={[index]}
            onToggleCheck={toggleCheck}
            onToggleExpand={toggleExpand}
          />
        ))}
      </div>
    </div>
  );
}

// NestedCheckboxItemコンポーネント
function NestedCheckboxItem({
  item,
  level,
  path,
  onToggleCheck,
  onToggleExpand,
}: {
  item: CheckboxItem;
  level: number;
  path: number[];
  onToggleCheck: (path: number[], checked: boolean) => void;
  onToggleExpand: (path: number[], expanded: boolean) => void;
}) {
  const hasChildren = !!item.children && item.children.length > 0;
  const isExpanded = item.expanded ?? false;
  const isChecked = item.checked ?? false;

  // 子要素のチェック状態を計算
  const childrenCheckState = useMemo(() => {
    if (!hasChildren) {
      return { allChecked: false, someChecked: false };
    }

    const childrenChecked =
      item.children?.map((child) => child.checked ?? false) ?? [];
    const allChecked = childrenChecked.every(Boolean);
    const someChecked = childrenChecked.some(Boolean);

    return { allChecked, someChecked };
  }, [hasChildren, item.children]);

  const handleCheckboxChange = (checked: boolean) => {
    onToggleCheck(path, checked);
  };

  const handleExpandedChange = () => {
    onToggleExpand(path, !isExpanded);
  };

  return (
    <div className={cn("ml-4", level === 0 && "ml-0")}>
      <div className="flex items-center space-x-2 py-1">
        {hasChildren ? (
          <Collapsible open={isExpanded} onOpenChange={handleExpandedChange}>
            <CollapsibleTrigger asChild>
              <button className="hover:bg-muted flex items-center space-x-2 rounded p-1">
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isExpanded && "rotate-90",
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </Collapsible>
        ) : (
          <div className="w-6" />
        )}

        <Checkbox
          id={item.id}
          checked={hasChildren ? childrenCheckState.allChecked : isChecked}
          onCheckedChange={handleCheckboxChange}
          className={cn(
            hasChildren &&
              childrenCheckState.someChecked &&
              !childrenCheckState.allChecked &&
              "data-[state=checked]:bg-muted-foreground",
          )}
        />

        <label
          htmlFor={item.id}
          className="cursor-pointer text-sm font-medium leading-none"
        >
          {item.label}
        </label>
      </div>

      {hasChildren && (
        <Collapsible open={isExpanded}>
          <CollapsibleContent className="ml-2">
            {item.children?.map((child, index) => (
              <NestedCheckboxItem
                key={child.id}
                item={child}
                level={level + 1}
                path={[...path, index]}
                onToggleCheck={onToggleCheck}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

// メインアプリケーション
export function MultiTreeApp() {
  const skillsTree = useTreeState(sampleData, {
    defaultExpanded: ["frontend", "backend"],
  });

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TreeComponent title="スキル選択" {...skillsTree} />
      </div>

      <div className="rounded-lg bg-gray-100 p-6">
        <h2 className="mb-4 text-lg font-semibold">選択結果サマリー</h2>

        <pre className="text-sm">{JSON.stringify(skillsTree, null, 2)}</pre>
      </div>
    </div>
  );
}
