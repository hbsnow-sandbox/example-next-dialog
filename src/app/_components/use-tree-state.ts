import { useReducer, useCallback } from "react";

export interface CheckboxItem {
  id: string;
  label: string;
  checked?: boolean;
  expanded?: boolean;
  children?: CheckboxItem[];
}

type TreeAction =
  | { type: "TOGGLE_CHECK"; path: number[]; checked: boolean }
  | { type: "TOGGLE_EXPAND"; path: number[]; expanded: boolean }
  | { type: "BULK_CHECK"; ids: string[]; checked: boolean }
  | { type: "BULK_EXPAND"; ids: string[]; expanded: boolean };

interface TreeState {
  items: CheckboxItem[];
}

function treeReducer(state: TreeState, action: TreeAction): TreeState {
  const updateItemAtPath = (
    items: CheckboxItem[],
    path: number[],
    updater: (item: CheckboxItem) => CheckboxItem,
  ): CheckboxItem[] => {
    if (path.length === 0) {
      return items;
    }

    const [index, ...restPath] = path;

    return items.map((item, i) => {
      if (i !== index) {
        return item;
      }

      if (restPath.length === 0) {
        return updater(item);
      }

      return {
        ...item,
        children: item.children
          ? updateItemAtPath(item.children, restPath, updater)
          : undefined,
      };
    });
  };

  const updateChildrenRecursively = (
    children: CheckboxItem[],
    updates: Partial<CheckboxItem>,
  ): CheckboxItem[] => {
    return children.map((child) => ({
      ...child,
      ...updates,
      children: child.children
        ? updateChildrenRecursively(child.children, updates)
        : undefined,
    }));
  };

  const updateItemsById = (
    items: CheckboxItem[],
    ids: string[],
    updates: Partial<CheckboxItem>,
  ): CheckboxItem[] => {
    return items.map((item) => ({
      ...item,
      ...(ids.includes(item.id) ? updates : {}),
      children: item.children
        ? updateItemsById(item.children, ids, updates)
        : undefined,
    }));
  };

  switch (action.type) {
    case "TOGGLE_CHECK": {
      return {
        ...state,
        items: updateItemAtPath(state.items, action.path, (item) => ({
          ...item,
          checked: action.checked,
          children: item.children
            ? updateChildrenRecursively(item.children, {
                checked: action.checked,
              })
            : undefined,
        })),
      };
    }

    case "TOGGLE_EXPAND": {
      return {
        ...state,
        items: updateItemAtPath(state.items, action.path, (item) => ({
          ...item,
          expanded: action.expanded,
        })),
      };
    }

    case "BULK_CHECK": {
      return {
        ...state,
        items: updateItemsById(state.items, action.ids, {
          checked: action.checked,
        }),
      };
    }

    case "BULK_EXPAND": {
      return {
        ...state,
        items: updateItemsById(state.items, action.ids, {
          expanded: action.expanded,
        }),
      };
    }

    default: {
      return state;
    }
  }
}

// カスタムフック
export function useTreeState(
  initialData: CheckboxItem[],
  options?: {
    defaultExpanded?: string[] | ((item: CheckboxItem) => boolean);
    defaultChecked?: string[] | ((item: CheckboxItem) => boolean);
  },
) {
  const initializeItems = useCallback(
    (data: CheckboxItem[]) => {
      const { defaultExpanded, defaultChecked } = options || {};

      const processItems = (items: CheckboxItem[]): CheckboxItem[] => {
        return items.map((item) => ({
          ...item,
          expanded:
            typeof defaultExpanded === "function"
              ? defaultExpanded(item)
              : Array.isArray(defaultExpanded)
                ? defaultExpanded.includes(item.id)
                : item.expanded,
          checked:
            typeof defaultChecked === "function"
              ? defaultChecked(item)
              : Array.isArray(defaultChecked)
                ? defaultChecked.includes(item.id)
                : item.checked,
          children: item.children ? processItems(item.children) : undefined,
        }));
      };

      return processItems(data);
    },
    [options],
  );

  const [state, dispatch] = useReducer(treeReducer, {
    items: initializeItems(initialData),
  });

  // アクション関数をメモ化
  const toggleCheck = useCallback((path: number[], checked: boolean) => {
    dispatch({ type: "TOGGLE_CHECK", path, checked });
  }, []);

  const toggleExpand = useCallback((path: number[], expanded: boolean) => {
    dispatch({ type: "TOGGLE_EXPAND", path, expanded });
  }, []);

  const bulkCheck = useCallback((ids: string[], checked: boolean) => {
    dispatch({ type: "BULK_CHECK", ids, checked });
  }, []);

  const bulkExpand = useCallback((ids: string[], expanded: boolean) => {
    dispatch({ type: "BULK_EXPAND", ids, expanded });
  }, []);

  return {
    // 状態
    items: state.items,

    // アクション
    toggleCheck,
    toggleExpand,
    bulkCheck,
    bulkExpand,
  };
}
