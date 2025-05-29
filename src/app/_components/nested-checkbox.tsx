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

function TreeComponent({
  items,
  onCheckedChange,
  defaultChecked,
  defaultExpanded,
}: {
  items: CheckboxItem[];
  onCheckedChange?: (value: string) => void;
  defaultChecked?: string[];
  defaultExpanded?: string[];
}) {
  const {
    items: treeItems,
    toggleCheck,
    toggleExpand,
    isChecked,
    isExpanded,
    getChildren,
  } = useTreeState(items, {
    defaultChecked,
    defaultExpanded,
  });

  // レベルマップを構築（各アイテムのレベルを記録）
  // const levelMap = useMemo(() => {
  //   const map = new Map<string, number>();

  //   const traverse = (items: CheckboxItem[], level: number) => {
  //     for (const item of items) {
  //       map.set(item.id, level);
  //       if (item.children) {
  //         traverse(item.children, level + 1);
  //       }
  //     }
  //   };

  //   traverse(treeItems, 0);
  //   return map;
  // }, [treeItems]);

  const handleToggleCheck = (id: string) => {
    toggleCheck(id);

    if (onCheckedChange) {
      // const level = levelMap.get(id) ?? 0;
      onCheckedChange(id);
    }
  };

  return (
    <div>
      {treeItems.map((item) => (
        <NestedCheckboxItem
          key={item.id}
          item={item}
          level={0}
          toggleCheck={handleToggleCheck}
          toggleExpand={toggleExpand}
          isChecked={isChecked}
          isExpanded={isExpanded}
          getChildren={getChildren}
        />
      ))}
    </div>
  );
}

function NestedCheckboxItem({
  item,
  level,
  toggleCheck,
  toggleExpand,
  isChecked,
  isExpanded,
  getChildren,
}: {
  item: CheckboxItem;
  level: number;
  toggleCheck: (id: string) => void;
  toggleExpand: (id: string) => void;
  isChecked: (id: string) => boolean;
  isExpanded: (id: string) => boolean;
  getChildren: (id: string) => Set<string>;
}) {
  const hasChildren = useMemo(
    () => !!item.children && item.children.length > 0,
    [item.children],
  );
  const itemIsExpanded = isExpanded(item.id);
  const itemIsChecked = isChecked(item.id);

  const childrenCheckState = useMemo(() => {
    if (!hasChildren) {
      return { allChecked: false, someChecked: false };
    }

    const childrenIds = [...getChildren(item.id)];
    const childrenChecked = childrenIds.map((id) => isChecked(id));
    const allChecked =
      childrenChecked.length > 0 && childrenChecked.every(Boolean);
    const someChecked = childrenChecked.some(Boolean);

    return { allChecked, someChecked };
  }, [hasChildren, item.id, getChildren, isChecked]);

  const handleCheckboxChange = () => {
    toggleCheck(item.id);
  };

  const handleExpandedChange = () => {
    toggleExpand(item.id);
  };

  return (
    <div className={cn("ml-4", level === 0 && "ml-0")}>
      <div className="flex items-center space-x-2 py-1">
        {hasChildren ? (
          <Collapsible
            open={itemIsExpanded}
            onOpenChange={handleExpandedChange}
          >
            <CollapsibleTrigger asChild>
              <button
                className="hover:bg-muted flex items-center space-x-2 rounded p-1"
                aria-label={`${itemIsExpanded ? "折りたたむ" : "展開する"}: ${item.label}`}
                aria-expanded={itemIsExpanded}
              >
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    itemIsExpanded && "rotate-90",
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </Collapsible>
        ) : (
          <div className="w-6" />
        )}

        <label
          htmlFor={item.id}
          className="flex cursor-pointer items-center gap-2"
        >
          <Checkbox
            id={item.id}
            checked={
              hasChildren ? childrenCheckState.allChecked : itemIsChecked
            }
            onCheckedChange={handleCheckboxChange}
            // Checkboxコンポーネント自体のonCheckedChangeは使わず、labelのonClickで制御
          />
          {item.label}
        </label>
      </div>

      {hasChildren && (
        <Collapsible open={itemIsExpanded}>
          <CollapsibleContent className="ml-2">
            {item.children?.map((child) => (
              <NestedCheckboxItem
                key={child.id}
                item={child}
                level={level + 1}
                toggleCheck={toggleCheck}
                toggleExpand={toggleExpand}
                isChecked={isChecked}
                isExpanded={isExpanded}
                getChildren={getChildren}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function MultiTreeApp() {
  return (
    <div className="container mx-auto p-6">
      <TreeComponent
        items={sampleData}
        onCheckedChange={(value) => {
          console.log(`Item "${value}"`);
        }}
        defaultExpanded={["frontend", "backend"]}
        defaultChecked={["astro"]}
      />

      <div className="mt-6 space-y-2 text-xs">
        <strong>Sample Data:</strong>
        <pre className="mt-1 rounded bg-gray-50 p-2">
          {JSON.stringify(sampleData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
