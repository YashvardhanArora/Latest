import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const complaints = pgTable("complaints", {
  id: serial("id").primaryKey(),
  // Basic Information
  complaintSource: text("complaint_source").notNull(),
  placeOfSupply: text("place_of_supply").notNull(),
  complaintReceivingLocation: text("complaint_receiving_location").notNull(),
  month: text("month"),
  
  // Party/Customer Details
  depoPartyName: text("depo_party_name").notNull(),
  email: text("email"),
  contactNumber: text("contact_number"),
  
  // Invoice & Transport Details
  invoiceNo: text("invoice_no"),
  invoiceDate: text("invoice_date"),
  lrNumber: text("lr_number"),
  transporterName: text("transporter_name"),
  transporterNumber: text("transporter_number"),
  
  // Complaint Details
  complaintType: text("complaint_type").notNull(),
  voc: text("voc"), // Voice of Customer
  salePersonName: text("sale_person_name"),
  productName: text("product_name"),
  
  // Classification
  areaOfConcern: text("area_of_concern"),
  subCategory: text("sub_category"),
  
  // Resolution Details
  actionTaken: text("action_taken"),
  creditDate: text("credit_date"),
  creditNoteNumber: text("credit_note_number"),
  creditAmount: text("credit_amount"),
  personResponsible: text("person_responsible"),
  rootCauseActionPlan: text("root_cause_action_plan"),
  
  // Status & Dates
  status: text("status").notNull().default("new"),
  priority: text("priority").notNull().default("medium"),
  complaintCreation: timestamp("complaint_creation").defaultNow(),
  dateOfResolution: timestamp("date_of_resolution"),
  dateOfClosure: timestamp("date_of_closure"),
  finalStatus: text("final_status").default("Open"),
  daysToResolve: integer("days_to_resolve"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const complaintHistory = pgTable("complaint_history", {
  id: serial("id").primaryKey(),
  complaintId: integer("complaint_id").notNull(),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  changedBy: text("changed_by").notNull(),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
});

export const insertComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateComplaintSchema = createInsertSchema(complaints).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial();

export const insertComplaintHistorySchema = createInsertSchema(complaintHistory).omit({
  id: true,
  changedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Complaint = typeof complaints.$inferSelect;
export type InsertComplaint = z.infer<typeof insertComplaintSchema>;
export type UpdateComplaint = z.infer<typeof updateComplaintSchema>;
export type ComplaintHistory = typeof complaintHistory.$inferSelect;
export type InsertComplaintHistory = z.infer<typeof insertComplaintHistorySchema>;

export const COMPLAINT_STATUSES = ["new", "in-progress", "resolved", "closed"] as const;
export const COMPLAINT_PRIORITIES = ["low", "medium", "high"] as const;
export const COMPLAINT_SOURCES = ["Depo", "Management", "Customer", "Partner"] as const;
export const COMPLAINT_TYPES = ["Complaint", "Query", "Feedback"] as const;
export const AREA_OF_CONCERNS = ["Transit", "Packaging", "Quality", "Variation in Weight", "Variation in Rate", "Billing"] as const;
export const SUB_CATEGORIES = ["Leakages", "Mis match Stock", "Stock Short", "Exceptional case"] as const;

export type ComplaintStatus = typeof COMPLAINT_STATUSES[number];
export type ComplaintPriority = typeof COMPLAINT_PRIORITIES[number];
export type ComplaintSource = typeof COMPLAINT_SOURCES[number];
export type ComplaintType = typeof COMPLAINT_TYPES[number];
export type AreaOfConcern = typeof AREA_OF_CONCERNS[number];
export type SubCategory = typeof SUB_CATEGORIES[number];
