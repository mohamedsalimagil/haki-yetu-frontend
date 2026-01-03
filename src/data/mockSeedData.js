// Mock seed data for demo purposes until real data is populated
export const mockTransactions = [
  {
    id: 1,
    order_number: "#ORD-2024-001",
    service_name: "Affidavit Drafting",
    lawyer_name: "Adv. Sarah Wanjiku",
    created_at: "2024-02-15T10:30:00Z",
    total_amount: 2500,
    status: "completed"
  },
  {
    id: 2,
    order_number: "#ORD-2024-002",
    service_name: "Contract Review",
    lawyer_name: "Adv. James Kiprop",
    created_at: "2024-02-10T14:20:00Z",
    total_amount: 1500,
    status: "completed"
  },
  {
    id: 3,
    order_number: "#ORD-2024-003",
    service_name: "Will Preparation",
    lawyer_name: "Adv. Mary Njoroge",
    created_at: "2024-02-08T09:15:00Z",
    total_amount: 3500,
    status: "completed"
  },
  {
    id: 4,
    order_number: "#ORD-2024-004",
    service_name: "Business Registration",
    lawyer_name: "Adv. Peter Kamau",
    created_at: "2024-02-05T11:45:00Z",
    total_amount: 5000,
    status: "pending"
  },
  {
    id: 5,
    order_number: "#ORD-2024-005",
    service_name: "Property Transfer",
    lawyer_name: "Adv. Grace Oduya",
    created_at: "2024-02-01T16:30:00Z",
    total_amount: 8000,
    status: "completed"
  }
];

export const mockDocuments = [
  {
    id: 1,
    original_name: "Employment Contract.pdf",
    filename: "employment_contract_001.pdf",
    url: "#",
    created_at: "2024-02-15T10:30:00Z",
    status: "verified",
    size: "2.5 MB"
  },
  {
    id: 2,
    original_name: "Affidavit of Identity.docx",
    filename: "affidavit_identity_002.docx",
    url: "#",
    created_at: "2024-02-10T14:20:00Z",
    status: "verified",
    size: "1.8 MB"
  },
  {
    id: 3,
    original_name: "Will and Testament.pdf",
    filename: "will_testament_003.pdf",
    url: "#",
    created_at: "2024-02-08T09:15:00Z",
    status: "verified",
    size: "3.2 MB"
  },
  {
    id: 4,
    original_name: "Lease Agreement.docx",
    filename: "lease_agreement_004.docx",
    url: "#",
    created_at: "2024-02-05T11:45:00Z",
    status: "pending",
    size: "4.1 MB"
  },
  {
    id: 5,
    original_name: "Business Registration Certificate.pdf",
    filename: "business_registration_005.pdf",
    url: "#",
    created_at: "2024-02-01T16:30:00Z",
    status: "verified",
    size: "1.2 MB"
  },
  {
    id: 6,
    original_name: "Partnership Agreement.pdf",
    filename: "partnership_agreement_006.pdf",
    url: "#",
    created_at: "2024-01-28T13:20:00Z",
    status: "verified",
    size: "5.7 MB"
  }
];

export const mockDashboardStats = {
  activeCases: 3,
  pendingDocs: 2,
  upcomingAppointments: 1,
  recentActivity: [
    {
      id: 1,
      type: "document",
      title: "Employment Contract Verified",
      description: "Your employment contract has been reviewed and verified by Adv. Sarah Wanjiku",
      timestamp: "2024-02-15T10:30:00Z",
      status: "completed"
    },
    {
      id: 2,
      type: "appointment",
      title: "Consultation Scheduled",
      description: "Your consultation with Adv. James Kiprop is scheduled for tomorrow at 2:00 PM",
      timestamp: "2024-02-14T15:45:00Z",
      status: "upcoming"
    },
    {
      id: 3,
      type: "case",
      title: "Contract Review Completed",
      description: "Your contract review case has been completed successfully",
      timestamp: "2024-02-10T14:20:00Z",
      status: "completed"
    },
    {
      id: 4,
      type: "document",
      title: "Will Drafting In Progress",
      description: "Your will document is being drafted by Adv. Mary Njoroge",
      timestamp: "2024-02-08T09:15:00Z",
      status: "in_progress"
    }
  ]
};
