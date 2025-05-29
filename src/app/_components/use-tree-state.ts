import { useReducer, useCallback, useMemo } from "react";

export interface CheckboxItem {
  id: string;
  label: string;
  checked?: boolean;
  expanded?: boolean;
  children?: CheckboxItem[];
}

// 最適化された状態管理
interface TreeState {
  items: CheckboxItem[];
  checkedIds: Set<string>;
  expandedIds: Set<string>;
  parentMap: Map<string, string>;
  childrenMap: Map<string, Set<string>>;
}

type TreeAction =
  | { type: "TOGGLE_CHECK"; id: string }
  | { type: "TOGGLE_EXPAND"; id: string };

// ヘルパー関数: ツリー構造からマップを構築
function buildTreeMaps(items: CheckboxItem[]) {
  const parentMap = new Map<string, string>();
  const childrenMap = new Map<string, Set<string>>();
  const checkedIds = new Set<string>();
  const expandedIds = new Set<string>();

  const traverse = (items: CheckboxItem[], parentId?: string) => {
    for (const item of items) {
      if (item.checked) {
        checkedIds.add(item.id);
      }
      if (item.expanded) {
        expandedIds.add(item.id);
      }

      if (parentId) {
        parentMap.set(item.id, parentId);
        if (!childrenMap.has(parentId)) {
          childrenMap.set(parentId, new Set());
        }
        childrenMap.get(parentId)!.add(item.id);
      }

      if (item.children) {
        traverse(item.children, item.id);
      }
    }
  };

  traverse(items);
  return { parentMap, childrenMap, checkedIds, expandedIds };
}

// ツリー構造を再構築（最適化版）
function rebuildTree(
  originalItems: CheckboxItem[],
  checkedIds: Set<string>,
  expandedIds: Set<string>,
): CheckboxItem[] {
  return originalItems.map((item) => ({
    ...item,
    checked: checkedIds.has(item.id),
    expanded: expandedIds.has(item.id),
    children: item.children
      ? rebuildTree(item.children, checkedIds, expandedIds)
      : undefined,
  }));
}

function treeReducer(state: TreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case "TOGGLE_CHECK": {
      const { id } = action;
      const newCheckedIds = new Set(state.checkedIds);

      // 現在の状態を確認して反転
      const isCurrentlyChecked = state.checkedIds.has(id);
      const newCheckedState = !isCurrentlyChecked;

      // 自分自身の状態を更新
      if (newCheckedState) {
        newCheckedIds.add(id);
      } else {
        newCheckedIds.delete(id);
      }

      // 子要素を再帰的に更新
      const updateChildren = (nodeId: string) => {
        const children = state.childrenMap.get(nodeId);
        if (children) {
          for (const childId of children) {
            if (newCheckedState) {
              newCheckedIds.add(childId);
            } else {
              newCheckedIds.delete(childId);
            }
            updateChildren(childId);
          }
        }
      };

      updateChildren(id);

      // 親要素の状態を更新
      const updateParents = (nodeId: string) => {
        const parentId = state.parentMap.get(nodeId);
        if (!parentId) {
          return;
        }

        const siblings = state.childrenMap.get(parentId);
        if (!siblings) {
          return;
        }

        const allSiblingsChecked = [...siblings].every((siblingId) =>
          newCheckedIds.has(siblingId),
        );

        if (allSiblingsChecked) {
          newCheckedIds.add(parentId);
        } else {
          newCheckedIds.delete(parentId);
        }

        updateParents(parentId);
      };

      updateParents(id);

      return {
        ...state,
        checkedIds: newCheckedIds,
        items: rebuildTree(state.items, newCheckedIds, state.expandedIds),
      };
    }

    case "TOGGLE_EXPAND": {
      const { id } = action;
      const newExpandedIds = new Set(state.expandedIds);

      // 現在の状態を確認して反転
      if (state.expandedIds.has(id)) {
        newExpandedIds.delete(id);
      } else {
        newExpandedIds.add(id);
      }

      return {
        ...state,
        expandedIds: newExpandedIds,
        items: rebuildTree(state.items, state.checkedIds, newExpandedIds),
      };
    }

    default: {
      return state;
    }
  }
}

// 初期化
function initializeItems(
  data: CheckboxItem[],
  options?: {
    defaultExpanded?: string[];
    defaultChecked?: string[];
  },
): CheckboxItem[] {
  if (!options?.defaultExpanded && !options?.defaultChecked) {
    return data;
  }

  const processItems = (items: CheckboxItem[]): CheckboxItem[] =>
    items.map((item) => ({
      ...item,
      expanded: options.defaultExpanded?.includes(item.id) ?? item.expanded,
      checked: options.defaultChecked?.includes(item.id) ?? item.checked,
      children: item.children ? processItems(item.children) : undefined,
    }));

  return processItems(data);
}

// 最適化されたカスタムフック
export function useTreeState(
  initialData: CheckboxItem[],
  options?: {
    defaultExpanded?: string[];
    defaultChecked?: string[];
  },
) {
  const initialState = useMemo((): TreeState => {
    const processedItems = initializeItems(initialData, options);
    const maps = buildTreeMaps(processedItems);

    return {
      items: processedItems,
      ...maps,
    };
  }, [initialData, options]);

  const [state, dispatch] = useReducer(treeReducer, initialState);

  // シンプルなトグル関数（IDのみ）
  const toggleCheck = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_CHECK", id });
  }, []);

  const toggleExpand = useCallback((id: string) => {
    dispatch({ type: "TOGGLE_EXPAND", id });
  }, []);

  const isChecked = useCallback(
    (id: string) => state.checkedIds.has(id),
    [state.checkedIds],
  );

  const isExpanded = useCallback(
    (id: string) => state.expandedIds.has(id),
    [state.expandedIds],
  );

  const getChildren = useCallback(
    (id: string) => state.childrenMap.get(id) ?? new Set(),
    [state.childrenMap],
  );

  return {
    items: state.items,
    toggleCheck,
    toggleExpand,
    isChecked,
    isExpanded,
    getChildren,
  };
}
