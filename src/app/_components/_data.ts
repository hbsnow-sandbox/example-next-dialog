import type { TreeNode } from "./types";

export const sampleData: TreeNode[] = [
  {
    id: "frontend",
    label: "フロントエンド",
    children: [
      {
        id: "react",
        label: "React",
        children: [
          { id: "react", label: "React" },
          { id: "nextjs", label: "Next.js" },
          { id: "astro", label: "Astro" },
        ],
      },
      { id: "vue", label: "Vue.js" },
      { id: "angular", label: "Angular" },
    ],
  },
  {
    id: "backend",
    label: "バックエンド",
    children: [
      { id: "nodejs", label: "Node.js" },
      { id: "go", label: "Go" },
    ],
  },
];
