import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ComplaintCard } from "./complaint-card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { Complaint, ComplaintStatus } from "@shared/schema";

interface KanbanBoardProps {
  complaints: Complaint[];
  isLoading: boolean;
}

const COLUMNS = [
  { id: "new", title: "New", color: "red" },
  { id: "in-progress", title: "In Progress", color: "yellow" },
  { id: "resolved", title: "Resolved", color: "green" },
  { id: "closed", title: "Closed", color: "gray" },
] as const;

export function KanbanBoard({ complaints, isLoading }: KanbanBoardProps) {
  const [draggedComplaint, setDraggedComplaint] = useState<Complaint | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateComplaintMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: ComplaintStatus }) => {
      return apiRequest("PATCH", `/api/complaints/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/complaints"] });
      queryClient.invalidateQueries({ queryKey: ["/api/complaints/stats"] });
      toast({
        title: "Success",
        description: "Complaint status updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive",
      });
    },
  });

  const handleDragStart = (complaint: Complaint) => {
    setDraggedComplaint(complaint);
  };

  const handleDragEnd = () => {
    setDraggedComplaint(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e: React.DragEvent, newStatus: ComplaintStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (draggedComplaint && draggedComplaint.status !== newStatus) {
      updateComplaintMutation.mutate({
        id: draggedComplaint.id,
        status: newStatus,
      });
    }
    setDraggedComplaint(null);
  };

  const getComplaintsByStatus = (status: string) => {
    return complaints.filter(complaint => complaint.status === status);
  };

  const getStatusCounts = () => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = getComplaintsByStatus(column.id).length;
      return acc;
    }, {} as Record<string, number>);
  };

  const statusCounts = getStatusCounts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COLUMNS.map((column) => (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-8" />
            </div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {COLUMNS.map((column) => {
        const columnComplaints = getComplaintsByStatus(column.id);
        const isDragOver = dragOverColumn === column.id;

        return (
          <div key={column.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <span className={`w-3 h-3 bg-${column.color}-500 rounded-full mr-2`}></span>
                {column.title}
              </h4>
              <span className={`bg-${column.color}-100 text-${column.color}-800 text-xs px-2 py-1 rounded-full`}>
                {statusCounts[column.id] || 0}
              </span>
            </div>
            
            <div
              className={`
                border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[400px] space-y-3 
                drag-drop-zone transition-colors
                ${isDragOver ? "drag-over" : ""}
              `}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id as ComplaintStatus)}
            >
              {columnComplaints.map((complaint) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  onDragStart={() => handleDragStart(complaint)}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedComplaint?.id === complaint.id}
                />
              ))}
              
              {columnComplaints.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No complaints in this status
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
