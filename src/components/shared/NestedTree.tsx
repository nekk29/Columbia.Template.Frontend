"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";
import { Plus, Minus } from "@tailgrids/icons";

export interface NestedTreeNode<T> {
  item: T;
  children: NestedTreeNode<T>[];
}

export interface NestedTreeRenderContext {
  level: number;
  hasChildren: boolean;
  isExpanded: boolean;
  toggle: () => void;
}

export interface NestedTreeProps<T> {
  items: T[];
  getId: (item: T) => string;
  getParentId: (item: T) => string | null | undefined;
  renderNode: (item: T, context: NestedTreeRenderContext) => React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}

function buildTree<T>(
  items: T[],
  getId: (item: T) => string,
  getParentId: (item: T) => string | null | undefined
): NestedTreeNode<T>[] {
  const byId = new Map<string, NestedTreeNode<T>>();
  items.forEach((item) => byId.set(getId(item), { item, children: [] }));

  const roots: NestedTreeNode<T>[] = [];

  byId.forEach((node) => {
    const parentId = getParentId(node.item);
    const parentNode = parentId ? byId.get(parentId) : undefined;

    if (parentNode) {
      parentNode.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

function NestedTreeNodeRow<T>({
  node,
  level,
  getId,
  getParentId,
  renderNode,
  defaultExpanded
}: {
  node: NestedTreeNode<T>;
  level: number;
  getId: (item: T) => string;
  getParentId: (item: T) => string | null | undefined;
  renderNode: NestedTreeProps<T>["renderNode"];
  defaultExpanded: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = node.children.length > 0;
  const toggle = () => setIsExpanded((prev) => !prev);

  return (
    <div className="w-full">
      <div className="flex items-start gap-2">
        {hasChildren ? (
          <button
            type="button"
            onClick={toggle}
            className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-base-100 text-text-100"
          >
            {isExpanded ? <Minus className="size-3" /> : <Plus className="size-3" />}
          </button>
        ) : (
          <span className="mt-0.5 size-5 shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          {renderNode(node.item, { level, hasChildren, isExpanded, toggle })}
        </div>
      </div>

      {hasChildren && isExpanded && (
        <div className="border-(--border-color-base-50) ml-2.5 mt-2 mb-2 border-l pl-3">
          {node.children.map((child) => (
            <NestedTreeNodeRow
              key={getId(child.item)}
              node={child}
              level={level + 1}
              getId={getId}
              getParentId={getParentId}
              renderNode={renderNode}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function NestedTree<T>({
  items,
  getId,
  getParentId,
  renderNode,
  className,
  defaultExpanded = true
}: NestedTreeProps<T>) {
  const roots = buildTree(items, getId, getParentId);

  if (roots.length === 0) return null;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {roots.map((node) => (
        <NestedTreeNodeRow
          key={getId(node.item)}
          node={node}
          level={0}
          getId={getId}
          getParentId={getParentId}
          renderNode={renderNode}
          defaultExpanded={defaultExpanded}
        />
      ))}
    </div>
  );
}
