"use client";

import {Card, CardContent} from "@/components/ui/card";

import EditCategoryDialog from "./edit-category-dialog";
import DeleteCategoryDialog from "./delete-category-dialog";

export default function CategoryItem({category, onUpdated, onDeleted}) {
  if (!category) return null;

  const isGlobal = category.scope === "GLOBAL";

  return (
    <Card>
      <CardContent className="flex justify-between items-center py-4">
        <div>
          <p className="font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.scope}</p>
        </div>

        {/* Only show actions for non-global categories */}
        {!isGlobal && (
          <div className="flex gap-2">
            <EditCategoryDialog category={category} onUpdated={onUpdated} />

            <DeleteCategoryDialog category={category} onDeleted={onDeleted} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
