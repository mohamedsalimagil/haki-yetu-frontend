// Mock data for Lawyer Portal

export const lawyerStats = {
  pendingNotarizations: 12,
  todaysConsultations: 4,
  totalEarnings: 45000,
  clientRating: 4.8,
  earnedToday: 8500,
  urgentDeadlines: 4,
};

export const notarizationQueue = [
  {
    id: 'NOT-001',
    client: {
      name: 'Wanjiku Mwangi',
      avatar: 'WM',
      type: 'New Client',
      email: 'wanjiku.m@example.com',
    },
    documentType: 'Affidavit of Support',
    submittedAt: '10:30 AM',
    deadline: 'Today 5:00 PM',
    urgency: 'Pending',
    status: 'Awaiting Review',
  },
  {
    id: 'NOT-002',
    client: {
      name: 'Kevin Omondi',
      avatar: 'KO',
      type: 'Returning',
      email: 'kevin.o@example.com',
    },
    documentType: 'Land Sale Agreement',
    submittedAt: '09:15 AM',
    deadline: 'Tomorrow 12:00 PM',
    urgency: 'Pending',
    status: 'Awaiting Review',
  },
  {
    id: 'NOT-003',
    client: {
      name: 'Faith Mutua',
      avatar: 'FM',
      type: 'Urgent Request',
      email: 'faith.m@example.com',
    },
    documentType: 'Power of Attorney',
    submittedAt: 'Yesterday',
    deadline: 'Today 2:00 PM',
    urgency: 'Urgent',
    status: 'Awaiting Review',
  },
  {
    id: 'NOT-004',
    client: {
      name: 'James Kariuki',
      avatar: 'JK',
      type: 'New Client',
      email: 'james.k@example.com',
    },
    documentType: 'Statutory Declaration',
    submittedAt: '2 days ago',
    deadline: 'Today 3:00 PM',
    urgency: 'Urgent',
    status: 'Awaiting Review',
  },
  {
    id: 'NOT-005',
    client: {
      name: 'Grace Muthoni',
      avatar: 'GM',
      type: 'VIP Client',
      email: 'grace.m@example.com',
    },
    documentType: 'Consent Form',
    submittedAt: '11:00 AM',
    deadline: 'Tomorrow 10:00 AM',
    urgency: 'Normal',
    status: 'Awaiting Review',
  },
];

export const todaysConsultations = [
  {
    id: 'CON-001',
    title: 'Civil Case - Amina Juma',
    time: '2:00 PM - 2:45 PM',
    client: {
      name: 'Amina Juma',
      avatar: 'https://ui-avatars.com/api/?name=Amina+Juma&background=random',
    },
    type: 'Video Call',
    status: 'Starting Soon',
  },
  {
    id: 'CON-002',
    title: 'Property - David Kamau',
    time: '4:30 PM - 5:00 PM',
    client: {
      name: 'David Kamau',
      avatar: 'https://ui-avatars.com/api/?name=David+Kamau&background=random',
    },
    type: 'Video Call',
    status: 'Upcoming',
  },
];

export const recentMessages = [
  {
    id: 'MSG-001',
    sender: {
      name: 'Sarah Njoroge',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Njoroge&background=random',
    },
    preview: 'Attached the ID document you requested...',
    time: '2m ago',
    unread: true,
  },
  {
    id: 'MSG-002',
    sender: {
      name: 'John Kibet',
      avatar: 'https://ui-avatars.com/api/?name=John+Kibet&background=random',
    },
    preview: 'Can we reschedule our meeting?',
    time: '1h ago',
    unread: true,
  },
  {
    id: 'MSG-003',
    sender: {
      name: 'Tom Kinyanjui',
      avatar: 'https://ui-avatars.com/api/?name=Tom+Kinyanjui&background=random',
    },
    preview: 'Thank you for the advice, Advocate...',
    time: 'Yesterday',
    unread: false,
  },
];

export const earningsData = {
  totalEarnings: 450000,
  pendingPayouts: 25000,
  completedServices: 142,
  clientRating: 4.8,
  reviewCount: 56,
  availableBalance: 25000,
  minimumPayout: 5000,
  revenueHistory: [
    { month: 'Jan', amount: 35000 },
    { month: 'Feb', amount: 42000 },
    { month: 'Mar', amount: 38000 },
    { month: 'Apr', amount: 55000 },
    { month: 'May', amount: 48000 },
    { month: 'Jun', amount: 62000 },
  ],
  earningsByService: [
    { service: 'Remote Notarization', percentage: 45, color: '#2563EB' },
    { service: 'Virtual Consultations', percentage: 30, color: '#60A5FA' },
    { service: 'Doc Generation', percentage: 25, color: '#E5E7EB' },
  ],
  recentTransactions: [
    {
      id: 'TXN-001',
      service: 'Land Sale Agreement',
      client: 'Wanjiku M.',
      date: '12 Jun 2024',
      amount: 5000,
      status: 'Pending',
    },
    {
      id: 'TXN-002',
      service: 'Virtual Consultation (1h)',
      client: 'Omondi P.',
      date: '10 Jun 2024',
      amount: 3000,
      status: 'Paid',
    },
    {
      id: 'TXN-003',
      service: 'Affidavit Notarization',
      client: 'Grace K.',
      date: '8 Jun 2024',
      amount: 2500,
      status: 'Paid',
    },
    {
      id: 'TXN-004',
      service: 'Power of Attorney',
      client: 'James M.',
      date: '5 Jun 2024',
      amount: 4500,
      status: 'Paid',
    },
  ],
};

export const lawyerProfile = {
  id: 'ADV-001',
  name: 'Advocate John Kamau',
  title: 'Advocate of the High Court of Kenya',
  lskNumber: 'P.105/2012',
  experience: '12+ Years',
  casesHandled: '500+',
  rating: 4.8,
  reviewCount: 124,
  consultationFee: 3000,
  verified: true,
  avatar: 'https://ui-avatars.com/api/?name=John+Kamau&background=0A1E41&color=fff&size=200',
  specializations: [
    'Land Law & Conveyancing',
    'Family Law',
    'Remote Notarization',
  ],
  biography: `John Kamau is a seasoned Advocate of the High Court of Kenya with over 12 years of experience in civil litigation and conveyancing. He has successfully handled over 500 cases across various practice areas including property law, family disputes, and commercial transactions. 

His commitment to justice and client satisfaction has earned him a stellar reputation in the Kenyan legal community. John is known for his meticulous approach to case preparation and his ability to explain complex legal concepts in simple terms.`,
  education: [
    { degree: 'LLB (Hons)', institution: 'University of Nairobi', year: '2010' },
    { degree: 'Diploma in Law', institution: 'Kenya School of Law', year: '2011' },
    { degree: 'LLM (Commercial Law)', institution: 'University of London', year: '2015' },
  ],
  availableSlots: [
    { date: 'TODAY', day: '12', time: '2:00 PM - 2:30 PM', available: true },
    { date: 'TODAY', day: '12', time: '4:30 PM - 5:00 PM', available: true },
    { date: 'TOM', day: '13', time: '9:00 AM - 9:30 AM', available: true },
  ],
  reviews: [
    {
      id: 'REV-001',
      client: { name: 'Grace M.', avatar: 'GM' },
      rating: 5,
      comment: 'John helped me draft my land sale agreement quickly...',
      date: '2 weeks ago',
    },
    {
      id: 'REV-002',
      client: { name: 'David O.', avatar: 'DO' },
      rating: 4,
      comment: 'Very professional remote consultation...',
      date: '1 month ago',
    },
  ],
};

export const availabilitySlots = [
  { time: '9:00', available: false },
  { time: '11:00', available: true },
  { time: '14:00', available: true },
  { time: '16:00', available: true },
];
