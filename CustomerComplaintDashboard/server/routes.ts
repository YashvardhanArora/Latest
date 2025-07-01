import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertComplaintSchema, 
  updateComplaintSchema,
  COMPLAINT_STATUSES,
  COMPLAINT_PRIORITIES,
  COMPLAINT_SOURCES,
  COMPLAINT_TYPES,
  AREA_OF_CONCERNS,
  SUB_CATEGORIES
} from "@shared/schema";
import { z } from "zod";
import * as XLSX from 'xlsx';

export async function registerRoutes(app: Express): Promise<Server> {
  // Get complaint statistics (must come before single complaint route)
  app.get("/api/complaints/stats", async (req, res) => {
    try {
      const stats = await storage.getComplaintStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaint statistics" });
    }
  });

  // Get complaint trends (must come before single complaint route)
  app.get("/api/complaints/trends/:days", async (req, res) => {
    try {
      const days = parseInt(req.params.days) || 7;
      const trends = await storage.getComplaintTrends(days);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaint trends" });
    }
  });

  // Get complaint options (must come before single complaint route)
  app.get("/api/complaints/options", async (req, res) => {
    try {
      res.json({
        statuses: COMPLAINT_STATUSES,
        priorities: COMPLAINT_PRIORITIES,
        sources: COMPLAINT_SOURCES,
        types: COMPLAINT_TYPES,
        areaOfConcerns: AREA_OF_CONCERNS,
        subCategories: SUB_CATEGORIES,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaint options" });
    }
  });

  // Export complaints (must come before single complaint route)
  app.get("/api/complaints/export", async (req, res) => {
    try {
      const complaints = await storage.getComplaints();
      const stats = await storage.getComplaintStats();
      
      // Prepare data for Excel export with actual complaint fields
      const worksheetData = complaints.map(complaint => ({
        'S.no.': complaint.id,
        'Complaint Source': complaint.complaintSource,
        'Place of Supply': complaint.placeOfSupply,
        'Complaint Receiving Location': complaint.complaintReceivingLocation,
        'Month': complaint.month,
        'Depo/Party Name': complaint.depoPartyName,
        'Email': complaint.email,
        'Contact Number': complaint.contactNumber,
        'Invoice No.': complaint.invoiceNo,
        'Invoice Date': complaint.invoiceDate,
        'LR Number': complaint.lrNumber,
        'Transporter Name': complaint.transporterName,
        'Transporter Number': complaint.transporterNumber,
        'Complaint Type': complaint.complaintType,
        'VOC': complaint.voc,
        'Sale Person Name': complaint.salePersonName,
        'Product Name': complaint.productName,
        'Area of Concern': complaint.areaOfConcern,
        'Sub Category': complaint.subCategory,
        'Action Taken': complaint.actionTaken,
        'Credit Date': complaint.creditDate,
        'Credit Note Number': complaint.creditNoteNumber,
        'Credit Amount': complaint.creditAmount,
        'Person Responsible': complaint.personResponsible,
        'Root Cause/Action Plan': complaint.rootCauseActionPlan,
        'Status': complaint.status,
        'Priority': complaint.priority,
        'Final Status': complaint.finalStatus,
        'Complaint Creation': complaint.complaintCreation ? new Date(complaint.complaintCreation).toLocaleDateString() : '',
        'Date of Resolution': complaint.dateOfResolution ? new Date(complaint.dateOfResolution).toLocaleDateString() : '',
        'Date of Closure': complaint.dateOfClosure ? new Date(complaint.dateOfClosure).toLocaleDateString() : '',
        'Days to Resolve': complaint.daysToResolve
      }));
      
      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(worksheetData);
      
      // Add summary stats as a second sheet
      const statsData = [
        ['Metric', 'Count'],
        ['Total Complaints', stats.total],
        ['New', stats.new],
        ['In Progress', stats.inProgress],
        ['Resolved', stats.resolved],
        ['Closed', stats.closed],
        ['Resolved Today', stats.resolvedToday]
      ];
      const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);
      
      // Add worksheets to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Complaints');
      XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Statistics');
      
      // Generate Excel buffer
      const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      // Set headers for Excel download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=complaints-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      res.send(excelBuffer);
    } catch (error) {
      res.status(500).json({ message: "Failed to export complaints" });
    }
  });

  // Get all complaints
  app.get("/api/complaints", async (req, res) => {
    try {
      const { status, priority, search } = req.query;
      
      let complaints;
      
      if (search) {
        complaints = await storage.searchComplaints(search as string);
      } else if (status) {
        complaints = await storage.getComplaintsByStatus(status as any);
      } else if (priority) {
        complaints = await storage.getComplaintsByPriority(priority as string);
      } else {
        complaints = await storage.getComplaints();
      }
      
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  // Get single complaint
  app.get("/api/complaints/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const complaint = await storage.getComplaint(id);
      
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaint" });
    }
  });

  // Create new complaint
  app.post("/api/complaints", async (req, res) => {
    try {
      const validatedData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(validatedData);
      res.status(201).json(complaint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid complaint data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create complaint" });
    }
  });

  // Update complaint
  app.patch("/api/complaints/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = updateComplaintSchema.parse(req.body);
      
      const complaint = await storage.updateComplaint(id, validatedData);
      
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      
      res.json(complaint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid complaint data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update complaint" });
    }
  });

  // Delete complaint
  app.delete("/api/complaints/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteComplaint(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete complaint" });
    }
  });

  // Get complaint history
  app.get("/api/complaints/:id/history", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const history = await storage.getComplaintHistory(id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaint history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
