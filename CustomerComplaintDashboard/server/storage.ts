import { 
  users, 
  complaints, 
  complaintHistory,
  type User, 
  type InsertUser, 
  type Complaint, 
  type InsertComplaint,
  type UpdateComplaint,
  type ComplaintHistory,
  type InsertComplaintHistory,
  type ComplaintStatus 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Complaint methods
  getComplaints(): Promise<Complaint[]>;
  getComplaint(id: number): Promise<Complaint | undefined>;
  getComplaintsByStatus(status: ComplaintStatus): Promise<Complaint[]>;
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  updateComplaint(id: number, updates: UpdateComplaint): Promise<Complaint | undefined>;
  deleteComplaint(id: number): Promise<boolean>;
  searchComplaints(query: string): Promise<Complaint[]>;
  getComplaintsByPriority(priority: string): Promise<Complaint[]>;

  // Complaint history methods
  getComplaintHistory(complaintId: number): Promise<ComplaintHistory[]>;
  addComplaintHistory(history: InsertComplaintHistory): Promise<ComplaintHistory>;

  // Analytics methods
  getComplaintStats(): Promise<{
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    closed: number;
    resolvedToday: number;
  }>;
  getComplaintTrends(days: number): Promise<Array<{
    date: string;
    new: number;
    resolved: number;
  }>>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private complaints: Map<number, Complaint>;
  private complaintHistory: Map<number, ComplaintHistory>;
  private currentUserId: number;
  private currentComplaintId: number;
  private currentHistoryId: number;

  constructor() {
    this.users = new Map();
    this.complaints = new Map();
    this.complaintHistory = new Map();
    this.currentUserId = 1;
    this.currentComplaintId = 1;
    this.currentHistoryId = 1;
    
    // Add sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Create sample complaints based on real complaint structure
    const sampleComplaints = [
      {
        complaintSource: "Depo",
        placeOfSupply: "Bhimasar",
        complaintReceivingLocation: "Rani Jhansi Road",
        month: "June 2024",
        depoPartyName: "Magnum Impex",
        email: "asheesh@magnumimpex.net.in",
        contactNumber: "+91-9876543210",
        invoiceNo: "IN/2425/100599",
        invoiceDate: "21/6/24",
        lrNumber: "2765",
        transporterName: "KUTCH HIGHWAY",
        transporterNumber: "GJ-12BZ-2036",
        complaintType: "Complaint",
        voc: "SIMPLY GOLD PALMOLIEN 15 KG TIN :1160 -1060 ,SIMPLY FRESH SOYA REFINED OIL 15 KG TIN  :600-700",
        salePersonName: "Gaurav Kumar",
        productName: "Simply Gold Palm",
        areaOfConcern: "Variation in Weight",
        subCategory: "Mis match Stock",
        actionTaken: "credit note Issue - Palm 15 KG TIN Qty.- 100 Nug.",
        creditAmount: "152599.65",
        personResponsible: "Packaging Team",
        priority: "high",
        status: "resolved",
        finalStatus: "Closed"
      },
      {
        complaintSource: "Management",
        placeOfSupply: "Mathura",
        complaintReceivingLocation: "Delhi",
        month: "January 2025",
        depoPartyName: "Healthy Value Distributors",
        email: "sales@healthyvalue.com",
        contactNumber: "+91-9876543211",
        invoiceNo: "IN/2425/100600",
        invoiceDate: "15/1/25",
        lrNumber: "2766",
        transporterName: "Express Logistics",
        transporterNumber: "DL-8CAA-1234",
        complaintType: "Query",
        voc: "Rate variation inquiry for bulk orders",
        salePersonName: "Priya Sharma",
        productName: "Healthy Value Oil",
        areaOfConcern: "Variation in Rate",
        subCategory: "Stock Short",
        actionTaken: "Rate clarification provided",
        personResponsible: "Sales Team",
        priority: "medium",
        status: "in-progress",
        finalStatus: "Open"
      },
      {
        complaintSource: "Customer",
        placeOfSupply: "Mumbai",
        complaintReceivingLocation: "Mumbai",
        month: "December 2024",
        depoPartyName: "Metro Retail Chain",
        email: "complaints@metroretail.com",
        contactNumber: "+91-9876543212",
        invoiceNo: "IN/2425/100601",
        invoiceDate: "20/12/24",
        lrNumber: "2767",
        transporterName: "Fast Track Transport",
        transporterNumber: "MH-01AA-5678",
        complaintType: "Complaint",
        voc: "Packaging leakage in multiple containers causing product wastage",
        salePersonName: "Raj Patel",
        productName: "Nutrica Oil",
        areaOfConcern: "Packaging",
        subCategory: "Leakages",
        actionTaken: "Replacement sent and packaging team notified",
        creditAmount: "45000.00",
        personResponsible: "Quality Control",
        priority: "high",
        status: "closed",
        finalStatus: "Closed"
      },
      {
        complaintSource: "Depo",
        placeOfSupply: "Bangalore",
        complaintReceivingLocation: "Bangalore",
        month: "January 2025",
        depoPartyName: "South India Foods",
        email: "procurement@southindiafoods.com",
        contactNumber: "+91-9876543213",
        complaintType: "Complaint",
        voc: "Transit damage reported in latest shipment",
        salePersonName: "Arjun Kumar",
        productName: "Premium Cooking Oil",
        areaOfConcern: "Transit",
        subCategory: "Exceptional case",
        actionTaken: "Investigation ongoing with transporter",
        personResponsible: "Logistics Team",
        priority: "medium",
        status: "new",
        finalStatus: "Open"
      },
      {
        complaintSource: "Partner",
        placeOfSupply: "Chennai",
        complaintReceivingLocation: "Chennai",
        month: "January 2025",
        depoPartyName: "Tamil Nadu Distributors",
        email: "operations@tndist.com",
        contactNumber: "+91-9876543214",
        invoiceNo: "IN/2425/100602",
        invoiceDate: "10/1/25",
        complaintType: "Query",
        voc: "Quality specifications clarification needed",
        salePersonName: "Lakshmi Narayanan",
        productName: "Traditional Oil Blend",
        areaOfConcern: "Quality",
        actionTaken: "Quality parameters shared",
        personResponsible: "Technical Team",
        priority: "low",
        status: "in-progress",
        finalStatus: "Open"
      },
      {
        complaintSource: "Customer",
        placeOfSupply: "Kolkata",
        complaintReceivingLocation: "Kolkata",
        month: "December 2024",
        depoPartyName: "Bengal Traders",
        email: "support@bengaltraders.com",
        contactNumber: "+91-9876543215",
        invoiceNo: "IN/2425/100603",
        invoiceDate: "25/12/24",
        lrNumber: "2768",
        transporterName: "Eastern Express",
        transporterNumber: "WB-07X-9876",
        complaintType: "Complaint",
        voc: "Billing discrepancy in invoice amount",
        salePersonName: "Subrata Das",
        productName: "Economy Cooking Oil",
        areaOfConcern: "Billing",
        actionTaken: "Credit note issued for difference",
        creditAmount: "12500.00",
        creditNoteNumber: "CN/2425/001",
        personResponsible: "Accounts Team",
        priority: "medium",
        status: "resolved",
        finalStatus: "Closed"
      }
    ];

    for (const complaint of sampleComplaints) {
      await this.createComplaint(complaint as any);
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Complaint methods
  async getComplaints(): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getComplaint(id: number): Promise<Complaint | undefined> {
    return this.complaints.get(id);
  }

  async getComplaintsByStatus(status: ComplaintStatus): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).filter(
      complaint => complaint.status === status
    );
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = this.currentComplaintId++;
    const now = new Date();
    const complaint: Complaint = { 
      ...insertComplaint,
      status: insertComplaint.status || "new",
      priority: insertComplaint.priority || "medium",
      finalStatus: insertComplaint.finalStatus || "Open",
      complaintCreation: insertComplaint.complaintCreation || now,
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.complaints.set(id, complaint);

    // Add history entry
    await this.addComplaintHistory({
      complaintId: id,
      fromStatus: null,
      toStatus: complaint.status,
      assignedTo: complaint.personResponsible || null,
      notes: "Complaint created",
      changedBy: "system"
    });

    return complaint;
  }

  async updateComplaint(id: number, updates: UpdateComplaint): Promise<Complaint | undefined> {
    const existing = this.complaints.get(id);
    if (!existing) return undefined;

    const updated: Complaint = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };

    this.complaints.set(id, updated);

    // Add history entry for status changes
    if (updates.status && updates.status !== existing.status) {
      await this.addComplaintHistory({
        complaintId: id,
        fromStatus: existing.status,
        toStatus: updates.status,
        assignedTo: updates.assignedTo || existing.assignedTo,
        notes: `Status changed from ${existing.status} to ${updates.status}`,
        changedBy: updates.assignedTo || "system"
      });
    }

    return updated;
  }

  async deleteComplaint(id: number): Promise<boolean> {
    return this.complaints.delete(id);
  }

  async searchComplaints(query: string): Promise<Complaint[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.complaints.values()).filter(complaint =>
      complaint.depoPartyName.toLowerCase().includes(lowerQuery) ||
      complaint.productName?.toLowerCase().includes(lowerQuery) ||
      complaint.voc?.toLowerCase().includes(lowerQuery) ||
      complaint.complaintType.toLowerCase().includes(lowerQuery) ||
      complaint.areaOfConcern?.toLowerCase().includes(lowerQuery)
    );
  }

  async getComplaintsByPriority(priority: string): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).filter(
      complaint => complaint.priority === priority
    );
  }

  // Complaint history methods
  async getComplaintHistory(complaintId: number): Promise<ComplaintHistory[]> {
    return Array.from(this.complaintHistory.values())
      .filter(history => history.complaintId === complaintId)
      .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());
  }

  async addComplaintHistory(insertHistory: InsertComplaintHistory): Promise<ComplaintHistory> {
    const id = this.currentHistoryId++;
    const history: ComplaintHistory = {
      ...insertHistory,
      assignedTo: insertHistory.assignedTo || null,
      fromStatus: insertHistory.fromStatus || null,
      notes: insertHistory.notes || null,
      id,
      changedAt: new Date()
    };
    this.complaintHistory.set(id, history);
    return history;
  }

  // Analytics methods
  async getComplaintStats(): Promise<{
    total: number;
    new: number;
    inProgress: number;
    resolved: number;
    closed: number;
    resolvedToday: number;
  }> {
    const allComplaints = Array.from(this.complaints.values());
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      total: allComplaints.length,
      new: allComplaints.filter(c => c.status === "new").length,
      inProgress: allComplaints.filter(c => c.status === "in-progress").length,
      resolved: allComplaints.filter(c => c.status === "resolved").length,
      closed: allComplaints.filter(c => c.status === "closed").length,
      resolvedToday: allComplaints.filter(c => 
        c.status === "resolved" && new Date(c.updatedAt) >= today
      ).length,
    };
  }

  async getComplaintTrends(days: number): Promise<Array<{
    date: string;
    new: number;
    resolved: number;
  }>> {
    const trends = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const newComplaints = Array.from(this.complaints.values()).filter(c => {
        const createdAt = new Date(c.createdAt);
        return createdAt >= date && createdAt < nextDate;
      }).length;

      const resolvedComplaints = Array.from(this.complaints.values()).filter(c => {
        const updatedAt = new Date(c.updatedAt);
        return c.status === "resolved" && updatedAt >= date && updatedAt < nextDate;
      }).length;

      trends.push({
        date: date.toISOString().split('T')[0],
        new: newComplaints,
        resolved: resolvedComplaints
      });
    }

    return trends;
  }
}

export const storage = new MemStorage();
