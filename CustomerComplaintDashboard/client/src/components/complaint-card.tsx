import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { formatRelativeTime, getPriorityColor } from "@/lib/utils";
import type { Complaint } from "@shared/schema";

interface ComplaintCardProps {
  complaint: Complaint;
  onDragStart: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export function ComplaintCard({ complaint, onDragStart, onDragEnd, isDragging }: ComplaintCardProps) {
  return (
    <Card
      className={`
        complaint-card cursor-move shadow-sm border-gray-200
        ${isDragging ? "opacity-50" : ""}
      `}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge className={getPriorityColor(complaint.priority)}>
            {complaint.priority} Priority
          </Badge>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(complaint.createdAt)}
          </span>
        </div>
        
        <h5 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {complaint.subject}
        </h5>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {complaint.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Customer {complaint.customerId}
          </span>
          <div className="flex items-center text-xs text-gray-500">
            <User className="w-3 h-3 mr-1" />
            {complaint.assignedTo || "Unassigned"}
          </div>
        </div>
        
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            {complaint.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
