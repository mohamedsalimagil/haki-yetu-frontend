export const mockOrders = [
  {
    id: 'ORD-8921',
    date: '12 Oct 2023',
    serviceType: 'Remote Notarization - Land Transfer',
    advocate: { name: 'J. Kamau, Esq.', avatar: 'JK' },
    cost: 3500,
    status: 'Completed'
  },
  {
    id: 'ORD-7743',
    date: '05 Oct 2023',
    serviceType: 'Virtual Consultation',
    advocate: { name: 'A. Ochieng', avatar: 'AO' },
    cost: 5000,
    status: 'Processing'
  },
  {
    id: 'ORD-6612',
    date: '28 Sep 2023',
    serviceType: 'Lease Agreement Drafting',
    advocate: { name: 'S. Wanjiku', avatar: 'SW' },
    cost: 12000,
    status: 'Completed'
  },
  {
    id: 'ORD-4110',
    date: '15 Sep 2023',
    serviceType: 'Affidavit Signing',
    advocate: { name: 'P. Mutua', avatar: 'PM' },
    cost: 1500,
    status: 'Completed'
  }
];

export const mockDisputes = {
  active: [
    {
      id: 'HY-2023-045',
      ref: 'HY-2023-045',
      serviceType: 'Land Sale Agreement',
      dateSubmitted: 'Nov 02, 2023',
      assignedAdvocate: { name: 'Adv. Sarah Wanjiku', avatar: 'SW' },
      status: 'In Progress',
      category: 'Payment Dispute',
      description: 'The advocate did not join the scheduled Zoom link. I waited 45 minutes.',
      priority: 'Medium',
      value: 5000
    },
    {
      id: 'HY-2023-052',
      ref: 'HY-2023-052',
      serviceType: 'Remote Notarization',
      dateSubmitted: 'Nov 15, 2023',
      assignedAdvocate: null,
      status: 'Pending Review',
      category: 'Service Quality',
      description: 'Documents were not properly notarized according to requirements.',
      priority: 'High',
      value: 2500
    },
    {
      id: 'HY-2023-112',
      ref: 'HY-2023-112',
      serviceType: 'Business Registration',
      dateSubmitted: 'Jan 10, 2024',
      assignedAdvocate: { name: 'Adv. Alice Mutua', avatar: 'AM' },
      status: 'In Progress',
      category: 'Delayed Delivery',
      description: 'Registration process is taking longer than promised timeline.',
      priority: 'Low',
      value: 15000
    }
  ],
  archived: [
    {
      id: 'HY-2023-001',
      ref: 'HY-2023-001',
      serviceType: 'Affidavit of Support',
      dateResolved: 'Oct 15, 2023',
      assignedAdvocate: { name: 'Adv. Kamau Njoroge', avatar: 'KN' },
      status: 'Resolved',
      category: 'Documentation Issue',
      resolution: 'Resolved in favor of Advocate',
      resolutionDate: 'Oct 15, 2023',
      originalSubmission: 'Oct 01, 2023'
    },
    {
      id: 'HY-2023-089',
      ref: 'HY-2023-089',
      serviceType: 'Virtual Consultation',
      dateResolved: 'Dec 05, 2023',
      assignedAdvocate: { name: 'Adv. David Ochieng', avatar: 'DO' },
      status: 'Resolved',
      category: 'Service Quality',
      resolution: 'Resolved',
      resolutionDate: 'Dec 05, 2023',
      originalSubmission: 'Nov 20, 2023'
    }
  ]
};

export const mockDisputeDetails = {
  'HY-4092': {
    id: 'HY-4092',
    caseId: '#HY-4092',
    parties: {
      client: 'J. Doe',
      advocate: 'Adv. Kember'
    },
    service: 'Notarization',
    status: 'Pending Review',
    openedDate: 'Oct 24, 2023',
    priority: 'High',
    value: 5000,
    description: 'The Advocate (Adv. Kember) did not join the scheduled Zoom link. I waited 45m.',
    evidence: ['invoice_402.pdf', 'screenshot_zoom.png'],
    communicationLog: [
      {
        sender: 'John Doe (Client)',
        message: 'Hello, I am in the waiting room.',
        timestamp: '10:00 AM',
        type: 'client'
      },
      {
        sender: 'System',
        message: 'Meeting ended. Reason: Host absent.',
        timestamp: '10:45 AM',
        type: 'system'
      }
    ]
  },
  'HY-4088': {
    id: 'HY-4088',
    caseId: '#HY-4088',
    parties: {
      client: 'Alice M.',
      advocate: 'Adv. Maina'
    },
    service: 'Consultation',
    status: 'Escalated',
    openedDate: 'Oct 20, 2023',
    priority: 'High',
    description: 'Payment Dispute',
    value: 8000
  },
  'HY-4012': {
    id: 'HY-4012',
    caseId: '#HY-4012',
    parties: {
      client: 'Sarah K.',
      advocate: 'Adv. Ochieng'
    },
    service: 'Drafting',
    status: 'Resolved',
    openedDate: 'Oct 10, 2023',
    resolvedDate: 'Oct 18, 2023',
    priority: 'Low',
    description: 'Quality of Service',
    value: 3000
  }
};

export const disputeCategories = [
  { value: 'payment', label: 'Payment Issue' },
  { value: 'quality', label: 'Service Quality' },
  { value: 'delay', label: 'Delayed Delivery' },
  { value: 'communication', label: 'Poor Communication' },
  { value: 'documentation', label: 'Documentation Error' },
  { value: 'breach', label: 'Breach of Contract' },
  { value: 'other', label: 'Other' }
];

export const resolutionMethods = [
  { value: 'email', label: 'Email', sublabel: 'Response in 24h', icon: 'mail' },
  { value: 'phone', label: 'Phone Call', sublabel: 'Schedulable', icon: 'phone' },
  { value: 'chat', label: 'In-App Chat', sublabel: 'Live Support', icon: 'message' }
];
