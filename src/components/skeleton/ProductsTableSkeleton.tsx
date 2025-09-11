import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface ProductsTableSkeletonProps {
  showStatusColumn: boolean;
}

export function ProductsTableSkeleton({ showStatusColumn }: ProductsTableSkeletonProps) {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: showStatusColumn ? 6 : 5 }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-3/4" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-muted/50">
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              {showStatusColumn && (
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
