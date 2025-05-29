import { useState, useMemo, useCallback } from "react";

import type { TreeNode, TreeState } from "./tree-utils";

import {
  flattenTree,
  buildRelationships,
  updateCheckedState,
} from "./tree-utils";

/**
 * ツリー構造の状態管理を行うカスタムフック
 *
 * @param data - ツリーのデータ構造
 * @param options - 初期設定オプション
 * @param options.defaultSelected - 初期選択状態のインデックス配列
 * @param options.defaultExpanded - 初期展開状態のインデックス配列
 * @returns ツリー操作に必要な状態と関数群
 */
export function useTree(
  data: TreeNode[],
  options: {
    defaultSelected?: number[];
    defaultExpanded?: number[];
  } = {},
) {
  // ツリーデータを一度だけ処理してフラット化と関係性マップを構築
  const treeData = useMemo(() => {
    const items = flattenTree(data);
    const relationships = buildRelationships(items);
    return { items, relationships };
  }, [data]);

  // ツリーの状態（チェック状態と展開状態）を管理
  const [state, setState] = useState<TreeState>(() => ({
    checked: new Set(options.defaultSelected ?? []),
    expanded: new Set(options.defaultExpanded ?? []),
  }));

  /**
   * ノードのチェック状態を切り替える
   * 親子関係に基づいて関連ノードの状態も自動更新される
   */
  const toggleCheck = useCallback(
    (index: number) => {
      setState((prev) => ({
        ...prev,
        checked: updateCheckedState(
          prev.checked,
          index,
          treeData.relationships,
        ),
      }));
    },
    [treeData.relationships],
  );

  /**
   * ノードの展開/折りたたみ状態を切り替える
   */
  const toggleExpand = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      expanded: prev.expanded.has(index)
        ? new Set([...prev.expanded].filter((i) => i !== index))
        : new Set([...prev.expanded, index]),
    }));
  }, []);

  /**
   * 指定されたインデックスのノードがチェックされているかどうかを判定
   */
  const isChecked = useCallback(
    (index: number) => state.checked.has(index),
    [state.checked],
  );

  /**
   * 指定されたインデックスのノードが展開されているかどうかを判定
   */
  const isExpanded = useCallback(
    (index: number) => state.expanded.has(index),
    [state.expanded],
  );

  /**
   * 指定されたノードをチェック/チェック解除した場合の
   * チェック済み葉ノード一覧を計算（実際の状態は変更しない）
   */
  const calculateCheckedLeafItems = useCallback(
    (targetIndex: number) => {
      const newChecked = updateCheckedState(
        state.checked,
        targetIndex,
        treeData.relationships,
      );
      const checkedLeafItems = treeData.items.filter(
        (item) => item.isLeaf && newChecked.has(item.index),
      );

      return checkedLeafItems;
    },
    [state.checked, treeData.relationships, treeData.items],
  );

  return {
    items: treeData.items, // フラット化されたツリーアイテム
    relationships: treeData.relationships, // 親子関係マップ
    toggleCheck, // チェック状態切り替え関数
    toggleExpand, // 展開状態切り替え関数
    isChecked, // チェック状態判定関数
    isExpanded, // 展開状態判定関数
    calculateCheckedLeafItems, // チェック済み葉ノード計算関数
  };
}
