import { Lead, Deal, Task, CRMSettings, LeadStatus, User, Attachment } from '../types/crm';

const MOCK_USER: User = {
    id: 'u1',
    full_name: 'Alex Sales',
    email: 'alex@so360.com',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
};

const MOCK_LEADS: Lead[] = [
    {
        id: 'l1',
        company_name: 'TechFlow Inc',
        contact_name: 'Sarah Chen',
        contact_email: 'sarah@techflow.io',
        source: 'Website',
        owner: MOCK_USER,
        status: 'Open',
        created_at: '2024-01-15T10:00:00Z',
        activities: [
            {
                id: 'la1',
                type: 'Call',
                notes: 'Initial discovery call. Sarah is looking for a scalable CRM solution.',
                date: '2024-01-16T11:00:00Z',
                author: MOCK_USER
            },
            {
                id: 'la2',
                type: 'Email',
                notes: 'Sent product overview and pricing details.',
                date: '2024-01-17T09:30:00Z',
                author: MOCK_USER
            }
        ],
        notes: [
            {
                id: 'ln1',
                content: ' Sarah was referred by TechSummit 2023.',
                author: MOCK_USER,
                created_at: '2024-01-15T10:05:00Z'
            }
        ],
        custom_fields: {
            'lcf1': 'Software',
            'lcf2': 'linkedin.com/in/sarahchen'
        },
        documents: [
            {
                id: 'doc1',
                name: 'Requirement_Analysis.pdf',
                size: 2450000,
                type: 'application/pdf',
                uploaded_at: '2024-01-16T11:00:00Z',
                uploaded_by: MOCK_USER,
                url: '#'
            }
        ]
    },
    {
        id: 'l2',
        company_name: 'GreenEnergy Solutions',
        contact_name: 'Marc Fontana',
        contact_email: 'm.fontana@greenenergy.eu',
        source: 'Referral',
        owner: MOCK_USER,
        status: 'Qualified',
        created_at: '2024-01-18T14:30:00Z',
        activities: [],
        notes: [],
        custom_fields: {
            'lcf1': 'Renewables'
        }
    }
];

const MOCK_DEALS: Deal[] = [
    {
        id: 'd1',
        name: 'Enterprise License - TechFlow',
        company_name: 'TechFlow Inc',
        value: 50000,
        expected_close_date: '2024-03-31',
        stage: 'Proposal',
        owner: MOCK_USER,
        notes: [
            {
                id: 'n1',
                content: ' Sarah is interested in the premium support package.',
                author: MOCK_USER,
                created_at: '2024-01-20T10:00:00Z'
            }
        ],
        activities: [
            {
                id: 'a1',
                type: 'Meeting',
                notes: 'Introductory call with the CTO. Discussed scalability requirements.',
                date: '2024-01-19T14:00:00Z',
                author: MOCK_USER
            }
        ],
        last_activity_at: '2024-01-20T09:00:00Z',
        lead_id: 'l1',
        custom_fields: {
            'dcf1': true,
            'dcf2': 'Email'
        },
        documents: [
            {
                id: 'doc2',
                name: 'Financial_Quote_v2.xlsx',
                size: 1120000,
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                uploaded_at: '2024-01-19T14:30:00Z',
                uploaded_by: MOCK_USER,
                url: '#'
            }
        ]
    }
];

const MOCK_TASKS: Task[] = [
    {
        id: 't1',
        title: 'Follow up on proposal',
        due_date: '2024-01-25',
        status: 'Open',
        deal_id: 'd1',
        deal_name: 'Enterprise License - TechFlow',
        lead_id: 'l1',
        assigned_to: MOCK_USER
    }
];

export const crmService = {
    getLeads: async (): Promise<Lead[]> => {
        // Mock API delay
        await new Promise(r => setTimeout(r, 800));
        return MOCK_LEADS;
    },

    createLead: async (lead: Omit<Lead, 'id' | 'created_at' | 'owner'>): Promise<Lead> => {
        const newLead: Lead = {
            ...lead,
            id: `l${Date.now()}`,
            owner: MOCK_USER,
            created_at: new Date().toISOString(),
            activities: [],
            notes: []
        };
        return newLead;
    },

    getLeadById: async (id: string): Promise<Lead | undefined> => {
        return MOCK_LEADS.find(l => l.id === id);
    },

    getDeals: async (): Promise<Deal[]> => {
        await new Promise(r => setTimeout(r, 800));
        return MOCK_DEALS;
    },

    getDealById: async (id: string): Promise<Deal | undefined> => {
        return MOCK_DEALS.find(d => d.id === id);
    },

    updateDealStage: async (id: string, stage: Deal['stage'], reason?: string): Promise<void> => {
        console.log(`Updating deal ${id} to stage ${stage}${reason ? ` with reason: ${reason}` : ''}`);
    },

    getTasks: async (): Promise<Task[]> => {
        await new Promise(r => setTimeout(r, 600));
        return MOCK_TASKS;
    },

    getTaskById: async (id: string): Promise<Task | undefined> => {
        return MOCK_TASKS.find(t => t.id === id);
    },

    getDealsByLeadId: async (leadId: string): Promise<Deal[]> => {
        await new Promise(r => setTimeout(r, 400));
        return MOCK_DEALS.filter(d => d.lead_id === leadId);
    },

    getTasksByLeadId: async (leadId: string): Promise<Task[]> => {
        await new Promise(r => setTimeout(r, 400));
        return MOCK_TASKS.filter(t => t.lead_id === leadId);
    },

    getSettings: async (): Promise<CRMSettings> => {
        await new Promise(r => setTimeout(r, 400));
        return {
            deal_stages: [
                { id: '1', name: 'Lead' },
                { id: '2', name: 'Qualified' },
                { id: '3', name: 'Proposal' },
                { id: '4', name: 'Negotiation' },
                { id: '5', name: 'Won' },
                { id: '6', name: 'Lost' }
            ],
            default_owner_id: 'u1',
            lead_sources: [
                { id: 's1', name: 'Website', archived: false },
                { id: 's2', name: 'Referral', archived: false },
                { id: 's3', name: 'Cold Call', archived: false }
            ],
            lead_custom_fields: [
                { id: 'lcf1', label: 'Industry', type: 'text', required: false },
                { id: 'lcf2', label: 'LinkedIn Profile', type: 'text', required: false }
            ],
            deal_custom_fields: [
                { id: 'dcf1', label: 'Technical Setup Req', type: 'boolean', required: false },
                { id: 'dcf2', label: 'Preferred Contact Method', type: 'text', required: false }
            ],
            lead_scoring: [
                { id: 'ls1', criteria: 'Source is Referral', points: 20, type: 'source' },
                { id: 'ls2', criteria: 'Completed a Call', points: 10, type: 'activity' },
                { id: 'ls3', criteria: 'Industry is Tech', points: 15, type: 'field' }
            ]
        };
    },

    updateSettings: async (settings: CRMSettings): Promise<CRMSettings> => {
        await new Promise(r => setTimeout(r, 800));
        console.log('Settings updated:', settings);
        return settings;
    },

    updateLead: async (id: string, updates: Partial<Lead>): Promise<Lead> => {
        await new Promise(r => setTimeout(r, 500));
        console.log(`Lead ${id} updated:`, updates);
        return { id, ...updates } as Lead;
    },

    updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
        await new Promise(r => setTimeout(r, 500));
        console.log(`Task ${id} updated:`, updates);
        return { id, ...updates } as Task;
    },

    updateNote: async (leadId: string, noteId: string, content: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 500));
        console.log(`Note ${noteId} in lead ${leadId} updated:`, content);
    },

    deleteNote: async (leadId: string, noteId: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 500));
        console.log(`Note ${noteId} in lead ${leadId} deleted`);
    },

    getUsers: async (): Promise<User[]> => {
        return [
            MOCK_USER,
            { id: 'u2', full_name: 'Sarah Manager', email: 'sarah@so360.com', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahM' }
        ];
    },

    uploadDocument: async (entityId: string, file: File): Promise<Attachment> => {
        await new Promise(r => setTimeout(r, 1500));
        return {
            id: `doc${Date.now()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            uploaded_at: new Date().toISOString(),
            uploaded_by: MOCK_USER,
            url: '#'
        };
    },

    deleteDocument: async (entityId: string, documentId: string): Promise<void> => {
        await new Promise(r => setTimeout(r, 500));
        console.log(`Document ${documentId} deleted from ${entityId}`);
    }
};
