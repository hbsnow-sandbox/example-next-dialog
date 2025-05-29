export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface FlatTreeItem {
  id: string;
  label: string;
  level: number;
  isLeaf: boolean;
  index: number;
  parentIndex?: number;
}

export interface TreeState {
  checked: Set<number>;
  expanded: Set<number>;
}

/**
 * 親子関係を表すマップオブジェクトの型
 */
export type RelationshipMap = {
  byIndex: Map<number, FlatTreeItem>;
  children: Map<number, number[]>;
  parent: Map<number, number>;
};

/**
 * ツリー構造をフラット化し、各ノードにインデックスを付与
 *
 * @param nodes - 変換対象のツリーノード配列
 * @returns フラット化されたアイテム配列
 */
export function flattenTree(nodes: TreeNode[]): FlatTreeItem[] {
  const result: FlatTreeItem[] = [];
  let globalIndex = 0;

  const traverse = (nodes: TreeNode[], level = 0, parentIndex?: number) => {
    for (const node of nodes) {
      const currentIndex = globalIndex++;
      const hasChildren = !!node.children?.length;

      result.push({
        id: node.id,
        label: node.label,
        level,
        isLeaf: !hasChildren,
        index: currentIndex,
        parentIndex,
      });

      if (hasChildren) {
        traverse(node.children!, level + 1, currentIndex);
      }
    }
  };

  traverse(nodes);
  return result;
}

/**
 * フラット化されたアイテムからインデックスベースの関係マップを構築
 *
 * @param items - フラット化されたアイテム配列
 * @returns 親子関係を表すマップオブジェクト
 */
export function buildRelationships(items: FlatTreeItem[]): RelationshipMap {
  // インデックスをキーとしたアイテムマップ
  const byIndex = new Map<number, FlatTreeItem>();

  // 親インデックス -> 子インデックス配列のマップ
  const children = new Map<number, number[]>();

  // 子インデックス -> 親インデックスのマップ
  const parent = new Map<number, number>();

  for (const item of items) {
    byIndex.set(item.index, item);

    if (item.parentIndex !== undefined) {
      // 親子関係を記録
      parent.set(item.index, item.parentIndex);

      // 親の子リストに追加
      if (!children.has(item.parentIndex)) {
        children.set(item.parentIndex, []);
      }
      children.get(item.parentIndex)!.push(item.index);
    }
  }

  return { byIndex, children, parent };
}

/**
 * チェック状態の更新ロジック（インデックスベース）
 *
 * 指定されたノードのチェック状態を切り替え、
 * 子ノードと親ノードの状態も適切に更新する
 *
 * @param currentChecked - 現在のチェック状態セット
 * @param targetIndex - 切り替え対象のインデックス
 * @param relationships - 親子関係マップ
 * @returns 更新されたチェック状態セット
 */
export function updateCheckedState(
  currentChecked: Set<number>,
  targetIndex: number,
  relationships: RelationshipMap,
): Set<number> {
  const newChecked = new Set(currentChecked);
  const shouldCheck = !currentChecked.has(targetIndex);

  // 1. 対象ノード自身の状態を更新
  if (shouldCheck) {
    newChecked.add(targetIndex);
  } else {
    newChecked.delete(targetIndex);
  }

  // 2. 子ノードの状態を更新（再帰的）
  updateChildrenState(newChecked, targetIndex, shouldCheck, relationships);

  // 3. 親ノードの状態を更新（上向きに伝播）
  updateParentState(newChecked, targetIndex, relationships);

  return newChecked;
}

/**
 * 子ノードの状態を再帰的に更新
 *
 * 親がチェックされた場合：全ての子をチェック
 * 親のチェックが外された場合：全ての子のチェックを外す
 */
function updateChildrenState(
  checkedSet: Set<number>,
  parentIndex: number,
  shouldCheck: boolean,
  relationships: RelationshipMap,
): void {
  const childIndices = relationships.children.get(parentIndex) || [];

  for (const childIndex of childIndices) {
    // 子ノード自身を更新
    if (shouldCheck) {
      checkedSet.add(childIndex);
    } else {
      checkedSet.delete(childIndex);
    }

    // 孫ノードも再帰的に更新
    updateChildrenState(checkedSet, childIndex, shouldCheck, relationships);
  }
}

/**
 * 親ノードの状態を上向きに更新
 *
 * 全ての兄弟ノードがチェックされている場合：親もチェック
 * そうでない場合：親のチェックを外す
 */
function updateParentState(
  checkedSet: Set<number>,
  childIndex: number,
  relationships: RelationshipMap,
): void {
  const parentIndex = relationships.parent.get(childIndex);

  if (parentIndex === undefined) {
    return; // ルートノードに到達
  }

  const siblingIndices = relationships.children.get(parentIndex) || [];
  const allSiblingsChecked = siblingIndices.every((siblingIndex) =>
    checkedSet.has(siblingIndex),
  );

  // 親の状態を更新
  if (allSiblingsChecked) {
    checkedSet.add(parentIndex);
  } else {
    checkedSet.delete(parentIndex);
  }

  // さらに上の親も再帰的に更新
  updateParentState(checkedSet, parentIndex, relationships);
}
