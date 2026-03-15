"use client";

import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";

import EditCategoryDialog from "./edit-category-dialog";
import DeleteCategoryDialog from "./delete-category-dialog";

export default function CategoryItem({category, onUpdated, onDeleted}) {
  const isGlobal = category.scope === "GLOBAL";

  return (
    <Card>
      <CardContent className="flex justify-between items-center py-4">
        <div>
          <p className="font-medium">{category.name}</p>
          <p className="text-xs text-muted-foreground">{category.scope}</p>
        </div>

        <div className="flex gap-2">
          <EditCategoryDialog
            category={category}
            onUpdated={onUpdated}
            disabled={isGlobal}
          />

          <DeleteCategoryDialog
            category={category}
            onDeleted={onDeleted}
            disabled={isGlobal}
          />
        </div>
      </CardContent>
    </Card>
  );
}
