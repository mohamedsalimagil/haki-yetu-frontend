// Centralized mock data for demo purposes - fallback when APIs fail
export const mockDocuments = [
  {
    id: 1,
    original_name: "Land Sale Agreement.pdf",
    filename: "land_sale_agreement_001.pdf",
    url: "#",
    created_at: "2024-03-15T10:30:00Z",
    status: "verified",
    size: "2.5 MB"
  },
  {
    id: 2,
    original_name: "Affidavit of Support.pdf",
    filename: "affidavit_support_002.pdf",
    url: "#",
    created_at: "2024-03-10T14:20:00Z",
    status: "verified",
    size: "1.8 MB"
  },
  {
    id: 3,
    original_name: "Business Registration Certificate.pdf",
    filename: "business_registration_cert_003.pdf",
    url: "#",
    created_at: "2024-03-08T09:15:00Z",
    status: "pending",
    size: "3.2 MB"
  },
  {
    id: 4,
    original_name: "Employment Contract.docx",
    filename: "employment_contract_004.docx",
    url: "#",
    created_at: "2024-03-05T11:45:00Z",
    status: "verified",
    size: "4.1 MB"
  },
  {
    id: 5,
    original_name: "Lease Agreement.pdf",
    filename: "lease_agreement_005.pdf",
    url: "#",
    created_at: "2024-03-01T16:30:00Z",
    status: "rejected",
    size: "1.2 MB"
  },
  {
    id: 6,
    original_name: "Partnership Agreement.pdf",
    filename: "partnership_agreement_006.pdf",
    url: "#",
    created_at: "2024-02-28T13:20:00Z",
    status: "verified",
    size: "5.7 MB"
  }
];

export const mockActiveCases = [
  {
    id: 1,
    case_title: "Property Dispute - Kiambu",
    case_id: "#CASE-2024-001",
    created_at: "2024-03-10T09:00:00Z",
    next_hearing_date: "2024-03-25T10:00:00Z",
    status: "Open",
    lawyer_name: "Adv. Sarah Wanjiku"
  },
  {
    id: 2,
    case_title: "Business Incorporation",
    case_id: "#CASE-2024-002",
    created_at: "2024-03-05T14:30:00Z",
    next_hearing_date: "2024-03-20T11:00:00Z",
    status: "Active",
    lawyer_name: "Adv. James Kiprop"
  },
  {
    id: 3,
    case_title: "Contract Review - Nairobi",
    case_id: "#CASE-2024-003",
    created_at: "2024-02-28T16:45:00Z",
    next_hearing_date: "2024-03-15T09:30:00Z",
    status: "Open",
    lawyer_name: "Adv. Mary Njoroge"
  }
];

export const mockTransactions = [
  {
    id: 1,
    order_number: "#ORD-2024-001",
    service_name: "Affidavit Drafting",
    lawyer_name: "Adv. Sarah Wanjiku",
    created_at: "2024-03-15T10:30:00Z",
    total_amount: 2500,
    status: "completed"
  },
  {
    id: 2,
    order_number: "#ORD-2024-002",
    service_name: "Contract Review",
    lawyer_name: "Adv. James Kiprop",
    created_at: "2024-03-10T14:20:00Z",
    total_amount: 1500,
    status: "completed"
  },
  {
    id: 3,
    order_number: "#ORD-2024-003",
    service_name: "Will Preparation",
    lawyer_name: "Adv. Mary Njoroge",
    created_at: "2024-03-08T09:15:00Z",
    total_amount: 3500,
    status: "completed"
  },
  {
    id: 4,
    order_number: "#ORD-2024-004",
    service_name: "Business Registration",
    lawyer_name: "Adv. Peter Kamau",
    created_at: "2024-03-05T11:45:00Z",
    total_amount: 5000,
    status: "pending"
  },
  {
    id: 5,
    order_number: "#ORD-2024-005",
    service_name: "Property Transfer",
    lawyer_name: "Adv. Grace Oduya",
    created_at: "2024-03-01T16:30:00Z",
    total_amount: 8000,
    status: "completed"
  },
  {
    id: 6,
    order_number: "#ORD-2024-006",
    service_name: "Trademark Registration",
    lawyer_name: "Adv. David Kiprop",
    created_at: "2024-02-28T13:20:00Z",
    total_amount: 12000,
    status: "completed"
  },
  {
    id: 7,
    order_number: "#ORD-2024-007",
    service_name: "Divorce Filing",
    lawyer_name: "Adv. Esther Wanjiku",
    created_at: "2024-02-25T10:15:00Z",
    total_amount: 15000,
    status: "pending"
  },
  {
    id: 8,
    order_number: "#ORD-2024-008",
    service_name: "Criminal Defense",
    lawyer_name: "Adv. Michael Oduya",
    created_at: "2024-02-20T15:45:00Z",
    total_amount: 25000,
    status: "completed"
  },
  {
    id: 9,
    order_number: "#ORD-2024-009",
    service_name: "Estate Planning",
    lawyer_name: "Adv. Lucy Kiprop",
    created_at: "2024-02-18T11:30:00Z",
    total_amount: 10000,
    status: "completed"
  },
  {
    id: 10,
    order_number: "#ORD-2024-010",
    service_name: "Employment Dispute",
    lawyer_name: "Adv. Robert Kamau",
    created_at: "2024-02-15T09:00:00Z",
    total_amount: 18000,
    status: "pending"
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
      timestamp: "2024-03-15T10:30:00Z",
      status: "completed"
    },
    {
      id: 2,
      type: "appointment",
      title: "Consultation Scheduled",
      description: "Your consultation with Adv. James Kiprop is scheduled for tomorrow at 2:00 PM",
      timestamp: "2024-03-14T15:45:00Z",
      status: "upcoming"
    },
    {
      id: 3,
      type: "case",
      title: "Contract Review Completed",
      description: "Your contract review case has been completed successfully",
      timestamp: "2024-03-10T14:20:00Z",
      status: "completed"
    },
    {
      id: 4,
      type: "document",
      title: "Will Drafting In Progress",
      description: "Your will document is being drafted by Adv. Mary Njoroge",
      timestamp: "2024-03-08T09:15:00Z",
      status: "in_progress"
    }
  ]
};
