import { FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";

interface MockDataBadgeProps {
  className?: string;
}

/** Shared visual marker for development-only fixtures. */
export function MockDataBadge({ className }: MockDataBadgeProps) {
  return (
    <Badge
      role="status"
      variant="outline"
      className={className}
      title="Nội dung này được lấy từ mock data để kiểm tra giao diện"
    >
      <FlaskConical aria-hidden="true" data-icon="inline-start" />
      Dữ liệu mô phỏng
    </Badge>
  );
}
