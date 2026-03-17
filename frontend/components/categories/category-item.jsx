"use client";

import {Card, CardContent} from "@/components/ui/card";

import EditCategoryDialog from "./edit-category-dialog";

import DeleteCategoryDialog from "./delete-category-dialog";

export default function CategoryItem({category, onUpdated, onDeleted}) {
  if (!category) return null;

  const isGlobal = category.scope === "GLOBAL";

  return (
    <Card className="relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-white/20">
      <CardContent className="p-4 flex items-center justify-between">
        {/* Left: Name + Scope */}

        <div className="flex flex-col">
          <p className="text-sm font-semibold leading-tight">{category.name}</p>

          <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
            {category.scope}
          </p>
        </div>

        {/* Right: Actions */}

        {!isGlobal && (
          <div className="flex gap-2">
            <EditCategoryDialog category={category} onUpdated={onUpdated} />

            <DeleteCategoryDialog category={category} onDeleted={onDeleted} />
          </div>
        )}
      </CardContent>

      {/* subtle glow */}

      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
    </Card>
  );
}
