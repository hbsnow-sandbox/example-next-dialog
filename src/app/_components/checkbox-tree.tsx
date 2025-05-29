"use client";

import { ChevronRight } from "lucide-react";
import { useMemo, useCallback } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import type { TreeNode, FlatTreeItem, RelationshipMap } from "./tree-utils";

import { useTree } from "./use-tree-state";

/**
 * ツリー構造を表示するメインコンポーネント
 *
 * 階層構造のあるデータをチェックボックス付きツリービューで表示し、親子関係に基づいた選択状態の管理を行う
 */
export function CheckboxTree({
  data,
  onSelectionChange,
  defaultSelected,
  defaultExpanded,
}: {
  data: TreeNode[];
  onSelectionChange?: (selectedItems: FlatTreeItem[]) => void;
  defaultSelected?: number[];
  defaultExpanded?: number[];
}) {
  // ツリーの状態管理と操作関数を取得
  const {
    items,
    relationships,
    toggleCheck,
    toggleExpand,
    isChecked,
    isExpanded,
    calculateCheckedLeafItems,
  } = useTree(data, {
    defaultSelected,
    defaultExpanded,
  });

  /**
   * チェックボックスのクリック処理
   * 選択状態を更新し、外部にチェック済み葉ノードの一覧を通知
   */
  const handleCheck = useCallback(
    (item: FlatTreeItem) => {
      toggleCheck(item.index);

      // チェック後の葉ノード一覧を計算して外部に通知
      const checkedLeafItems = calculateCheckedLeafItems(item.index);
      onSelectionChange?.(checkedLeafItems);
    },
    [toggleCheck, onSelectionChange, calculateCheckedLeafItems],
  );

  const rootItems = useMemo(
    () => items.filter((item) => item.level === 0),
    [items],
  );

  return (
    <div className="space-y-1">
      {rootItems.map((item) => (
        <TreeItem
          key={item.index}
          item={item}
          relationships={relationships}
          onCheck={handleCheck}
          onExpand={toggleExpand}
          isChecked={isChecked}
          isExpanded={isExpanded}
        />
      ))}
    </div>
  );
}

/**
 * 個別のツリーアイテムを表示するコンポーネント
 *
 * 再帰的に子要素を描画し、階層構造を表現する
 */
function TreeItem({
  item,
  relationships,
  onCheck,
  onExpand,
  isChecked,
  isExpanded,
}: {
  item: FlatTreeItem;
  relationships: RelationshipMap;
  onCheck: (item: FlatTreeItem) => void;
  onExpand: (index: number) => void;
  isChecked: (index: number) => boolean;
  isExpanded: (index: number) => boolean;
}) {
  const checked = isChecked(item.index);
  const expanded = isExpanded(item.index);

  // 子アイテムのインデックス配列を取得
  const childIndices = useMemo(
    () => relationships.children.get(item.index),
    [relationships, item.index],
  );

  const handleCheckboxChange = useCallback(() => {
    onCheck(item);
  }, [onCheck, item]);

  const handleExpandChange = useCallback(() => {
    onExpand(item.index);
  }, [onExpand, item.index]);

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded px-2 py-1 hover:bg-gray-50"
        style={{ paddingLeft: `${item.level * 16}px` }} // レベルに応じたインデント
      >
        {/* 展開/折りたたみボタン（子要素がある場合のみ表示） */}
        {childIndices?.length ? (
          <Collapsible open={expanded} onOpenChange={handleExpandChange}>
            <CollapsibleTrigger asChild>
              <button aria-label={expanded ? "折りたたむ" : "展開する"}>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expanded && "rotate-90", // 展開時は90度回転
                  )}
                />
              </button>
            </CollapsibleTrigger>
          </Collapsible>
        ) : (
          // 子要素がない場合はスペーサーを表示
          <div className="w-6" />
        )}

        {/* チェックボックスとラベル */}
        <label className="flex flex-1 cursor-pointer items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={handleCheckboxChange} />
          {item.label}
        </label>
      </div>

      {/* 子要素の表示エリア（展開時のみ表示） */}
      {!!childIndices?.length && (
        <Collapsible open={expanded}>
          <CollapsibleContent>
            {childIndices.map((childIndex) => {
              const childItem = relationships.byIndex.get(childIndex)!;
              return (
                // 再帰的に子要素を描画
                <TreeItem
                  key={childItem.index}
                  item={childItem}
                  relationships={relationships}
                  onCheck={onCheck}
                  onExpand={onExpand}
                  isChecked={isChecked}
                  isExpanded={isExpanded}
                />
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
