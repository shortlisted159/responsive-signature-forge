
export type Template = {
  id: string;
  name: string;
  industry: "realtor" | "consultant" | "lawyer" | "coach" | "general" | "marketing" | "tech" | "creative" | "finance" | "healthcare";
  layout: "standard" | "modern" | "minimal" | "bold" | "hubspot" | "compact" | "elegant" | "corporate" | "creative" | "professional";
  premium: boolean; // We'll keep this property but set all to false
  defaultValues: {
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    socialLinks: {
      linkedin?: string;
      twitter?: string;
      facebook?: string;
      instagram?: string;
    };
    ctaText: string;
    ctaUrl: string;
    tagline: string;
  };
  imagePosition: "left" | "right" | "top" | "none";
  socialIconStyle: "color" | "monochrome" | "circle" | "square";
};

export const templates: Template[] = [
  {
    id: "realtor-standard",
    name: "Realtor Standard",
    industry: "realtor",
    layout: "standard",
    premium: false,
    defaultValues: {
      name: "Alex Johnson",
      title: "Real Estate Agent",
      company: "Luxury Home Realty",
      email: "alex@luxuryhomerealty.com",
      phone: "(555) 123-4567",
      website: "www.luxuryhomerealty.com",
      address: "123 Main St, Anytown, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/alexjohnson",
        facebook: "facebook.com/alexjohnsonrealty",
        instagram: "instagram.com/alexjohnsonrealty"
      },
      ctaText: "View My Listings",
      ctaUrl: "https://www.luxuryhomerealty.com/listings",
      tagline: "Helping You Find Your Dream Home"
    },
    imagePosition: "left",
    socialIconStyle: "color"
  },
  {
    id: "consultant-modern",
    name: "Consultant Modern",
    industry: "consultant",
    layout: "modern",
    premium: false,
    defaultValues: {
      name: "Jordan Smith",
      title: "Business Strategy Consultant",
      company: "Smith Consulting Group",
      email: "jordan@smithconsulting.com",
      phone: "(555) 987-6543",
      website: "www.smithconsulting.com",
      address: "456 Business Ave, Metropolis, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/jordansmith",
        twitter: "twitter.com/jordansmith"
      },
      ctaText: "Schedule a Consultation",
      ctaUrl: "https://calendly.com/jordansmith",
      tagline: "Transforming Challenges into Opportunities"
    },
    imagePosition: "right",
    socialIconStyle: "circle"
  },
  {
    id: "lawyer-minimal",
    name: "Lawyer Minimal",
    industry: "lawyer",
    layout: "minimal",
    premium: false,
    defaultValues: {
      name: "Morgan Lee, Esq.",
      title: "Attorney at Law",
      company: "Lee & Associates Legal Group",
      email: "morgan@leelegal.com",
      phone: "(555) 765-4321",
      website: "www.leelegal.com",
      address: "789 Court St, Justice City, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/morganlee"
      },
      ctaText: "Request Legal Consultation",
      ctaUrl: "https://www.leelegal.com/consultation",
      tagline: "Dedicated Legal Representation"
    },
    imagePosition: "none",
    socialIconStyle: "monochrome"
  },
  {
    id: "coach-bold",
    name: "Coach Bold",
    industry: "coach",
    layout: "bold",
    premium: false,
    defaultValues: {
      name: "Taylor Williams",
      title: "Executive Coach & Speaker",
      company: "Peak Performance Coaching",
      email: "taylor@peakcoaching.com",
      phone: "(555) 234-5678",
      website: "www.peakcoaching.com",
      address: "101 Motivation Dr, Inspiration, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/taylorwilliams",
        instagram: "instagram.com/coachtaylor",
        facebook: "facebook.com/peakcoaching"
      },
      ctaText: "Book a Discovery Call",
      ctaUrl: "https://www.peakcoaching.com/discovery",
      tagline: "Unlock Your Full Potential"
    },
    imagePosition: "top",
    socialIconStyle: "square"
  },
  {
    id: "realtor-hubspot",
    name: "Realtor HubSpot",
    industry: "realtor",
    layout: "hubspot",
    premium: false,
    defaultValues: {
      name: "Sam Rivera",
      title: "Luxury Real Estate Specialist",
      company: "Elite Properties",
      email: "sam@eliteproperties.com",
      phone: "(555) 555-1234",
      website: "www.eliteproperties.com",
      address: "555 Luxury Lane, Beverly Hills, CA",
      socialLinks: {
        linkedin: "linkedin.com/in/samrivera",
        instagram: "instagram.com/samriverarealty",
        facebook: "facebook.com/elitepropertiessam"
      },
      ctaText: "Schedule a Private Showing",
      ctaUrl: "https://www.eliteproperties.com/showings",
      tagline: "Exceptional Homes for Exceptional People"
    },
    imagePosition: "left",
    socialIconStyle: "color"
  },
  {
    id: "general-compact",
    name: "General Compact",
    industry: "general",
    layout: "compact",
    premium: false,
    defaultValues: {
      name: "Jamie Doe",
      title: "Marketing Specialist",
      company: "Acme Corporation",
      email: "jamie@acmecorp.com",
      phone: "(555) 333-2222",
      website: "www.acmecorp.com",
      address: "100 Business Plaza, Enterprise, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/jamiedoe",
        twitter: "twitter.com/jamiedoe"
      },
      ctaText: "Learn More",
      ctaUrl: "https://www.acmecorp.com",
      tagline: "Innovative Solutions for Business Growth"
    },
    imagePosition: "right",
    socialIconStyle: "monochrome"
  },
  // New templates start here
  {
    id: "tech-elegant",
    name: "Tech Elegant",
    industry: "tech",
    layout: "elegant",
    premium: false,
    defaultValues: {
      name: "Robin Chen",
      title: "Software Engineering Lead",
      company: "NextGen Technologies",
      email: "robin@nextgentech.io",
      phone: "(555) 123-9876",
      website: "www.nextgentech.io",
      address: "888 Innovation Park, Silicon Valley, CA",
      socialLinks: {
        linkedin: "linkedin.com/in/robinchen",
        twitter: "twitter.com/robinchen",
        github: "github.com/robinchen"
      },
      ctaText: "View Portfolio",
      ctaUrl: "https://www.nextgentech.io/robin",
      tagline: "Building Tomorrow's Technology Today"
    },
    imagePosition: "right",
    socialIconStyle: "monochrome"
  },
  {
    id: "creative-professional",
    name: "Creative Professional",
    industry: "creative",
    layout: "professional",
    premium: false,
    defaultValues: {
      name: "Cameron Blake",
      title: "Creative Director",
      company: "Artistry Studios",
      email: "cameron@artistrystudios.com",
      phone: "(555) 789-0123",
      website: "www.artistrystudios.com",
      address: "42 Gallery Way, Portland, OR",
      socialLinks: {
        instagram: "instagram.com/cameronblake",
        behance: "behance.net/cameronblake",
        linkedin: "linkedin.com/in/cameronblake"
      },
      ctaText: "View My Work",
      ctaUrl: "https://www.artistrystudios.com/portfolio",
      tagline: "Where Vision Becomes Reality"
    },
    imagePosition: "left",
    socialIconStyle: "circle"
  },
  {
    id: "finance-corporate",
    name: "Finance Corporate",
    industry: "finance",
    layout: "corporate",
    premium: false,
    defaultValues: {
      name: "Morgan Reynolds, CFA",
      title: "Senior Financial Advisor",
      company: "Wealth Architects Group",
      email: "morgan@wealtharchitects.com",
      phone: "(555) 567-8901",
      website: "www.wealtharchitects.com",
      address: "750 Finance Tower, Manhattan, NY",
      socialLinks: {
        linkedin: "linkedin.com/in/morganreynolds",
      },
      ctaText: "Schedule Financial Review",
      ctaUrl: "https://www.wealtharchitects.com/consultation",
      tagline: "Building Financial Security for Generations"
    },
    imagePosition: "none",
    socialIconStyle: "square"
  },
  {
    id: "marketing-creative",
    name: "Marketing Creative",
    industry: "marketing",
    layout: "creative",
    premium: false,
    defaultValues: {
      name: "Jesse Martinez",
      title: "Digital Marketing Strategist",
      company: "Pulse Marketing",
      email: "jesse@pulsemarketing.co",
      phone: "(555) 345-6789",
      website: "www.pulsemarketing.co",
      address: "303 Trendy Ave, Austin, TX",
      socialLinks: {
        linkedin: "linkedin.com/in/jessemartinez",
        twitter: "twitter.com/jessemktg",
        instagram: "instagram.com/jessemktg"
      },
      ctaText: "Get a Free Audit",
      ctaUrl: "https://www.pulsemarketing.co/audit",
      tagline: "Elevating Brands in the Digital Age"
    },
    imagePosition: "top",
    socialIconStyle: "color"
  },
  {
    id: "healthcare-professional",
    name: "Healthcare Professional",
    industry: "healthcare",
    layout: "minimal",
    premium: false,
    defaultValues: {
      name: "Dr. Avery Thompson",
      title: "Family Medicine Physician",
      company: "Wellness Medical Group",
      email: "dr.thompson@wellnessmedical.com",
      phone: "(555) 234-5678",
      website: "www.wellnessmedicalgroup.com",
      address: "475 Health Parkway, Chicago, IL",
      socialLinks: {
        linkedin: "linkedin.com/in/dravery",
      },
      ctaText: "Schedule Appointment",
      ctaUrl: "https://www.wellnessmedicalgroup.com/appointments",
      tagline: "Compassionate Care for the Whole Family"
    },
    imagePosition: "left",
    socialIconStyle: "monochrome"
  },
  {
    id: "tech-modern",
    name: "Tech Modern",
    industry: "tech",
    layout: "modern",
    premium: false,
    defaultValues: {
      name: "Harper Kim",
      title: "Product Manager",
      company: "InnovateTech",
      email: "harper@innovatetech.co",
      phone: "(555) 456-7890",
      website: "www.innovatetech.co",
      address: "Tech Campus, Building 5, San Francisco, CA",
      socialLinks: {
        linkedin: "linkedin.com/in/harperkim",
        twitter: "twitter.com/harperpm",
        github: "github.com/harperkim"
      },
      ctaText: "See Our Products",
      ctaUrl: "https://www.innovatetech.co/products",
      tagline: "Innovation at the Speed of Thought"
    },
    imagePosition: "right",
    socialIconStyle: "circle"
  }
];
