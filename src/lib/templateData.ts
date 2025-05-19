export type Template = {
  id: string;
  name: string;
  industry: "realtor" | "consultant" | "lawyer" | "coach" | "general" | "marketing" | "tech" | "creative" | "finance" | "healthcare" | "fitness" | "wellness";
  layout: "standard" | "modern" | "minimal" | "bold" | "hubspot" | "compact" | "elegant" | "corporate" | "creative" | "professional";
  premium: boolean;
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
      github?: string;
      behance?: string;
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
    id: "standard-template",
    name: "Standard",
    industry: "general",
    layout: "standard",
    premium: false,
    defaultValues: {
      name: "Alex Johnson",
      title: "Marketing Specialist",
      company: "Company Inc.",
      email: "alex@company.com",
      phone: "(555) 123-4567",
      website: "www.company.com",
      address: "123 Main St, Anytown, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/alexjohnson",
        twitter: "twitter.com/alexjohnson"
      },
      ctaText: "Contact Me",
      ctaUrl: "https://www.company.com/contact",
      tagline: "Helping businesses grow"
    },
    imagePosition: "left",
    socialIconStyle: "color"
  },
  {
    id: "modern-template",
    name: "Modern",
    industry: "tech",
    layout: "modern",
    premium: false,
    defaultValues: {
      name: "Jordan Smith",
      title: "Software Developer",
      company: "Tech Solutions",
      email: "jordan@techsolutions.com",
      phone: "(555) 987-6543",
      website: "www.techsolutions.com",
      address: "456 Business Ave, Metropolis, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/jordansmith",
        github: "github.com/jordansmith"
      },
      ctaText: "View Portfolio",
      ctaUrl: "https://www.techsolutions.com/portfolio",
      tagline: "Building tomorrow's solutions today"
    },
    imagePosition: "right",
    socialIconStyle: "circle"
  },
  {
    id: "minimal-template",
    name: "Minimal",
    industry: "creative",
    layout: "minimal",
    premium: false,
    defaultValues: {
      name: "Morgan Lee",
      title: "Graphic Designer",
      company: "Creative Studio",
      email: "morgan@creativestudio.com",
      phone: "(555) 765-4321",
      website: "www.creativestudio.com",
      address: "789 Art St, Design City, USA",
      socialLinks: {
        behance: "behance.net/morganlee",
        instagram: "instagram.com/morganlee"
      },
      ctaText: "View Portfolio",
      ctaUrl: "https://www.creativestudio.com/portfolio",
      tagline: "Creating visual experiences"
    },
    imagePosition: "none",
    socialIconStyle: "monochrome"
  },
  {
    id: "bold-template",
    name: "Bold",
    industry: "marketing",
    layout: "bold",
    premium: false,
    defaultValues: {
      name: "Taylor Williams",
      title: "Marketing Director",
      company: "Impact Marketing",
      email: "taylor@impactmarketing.com",
      phone: "(555) 234-5678",
      website: "www.impactmarketing.com",
      address: "101 Brand Dr, Media City, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/taylorwilliams",
        instagram: "instagram.com/taylorwilliams",
        twitter: "twitter.com/taylorwilliams"
      },
      ctaText: "Let's Talk Strategy",
      ctaUrl: "https://www.impactmarketing.com/contact",
      tagline: "Making brands unforgettable"
    },
    imagePosition: "top",
    socialIconStyle: "square"
  },
  {
    id: "hubspot-template",
    name: "Hubspot",
    industry: "consultant",
    layout: "hubspot",
    premium: false,
    defaultValues: {
      name: "Sam Rivera",
      title: "Business Consultant",
      company: "Growth Strategies",
      email: "sam@growthstrategies.com",
      phone: "(555) 555-1234",
      website: "www.growthstrategies.com",
      address: "555 Consulting Lane, Business Park, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/samrivera",
        twitter: "twitter.com/samrivera"
      },
      ctaText: "Book a Consultation",
      ctaUrl: "https://www.growthstrategies.com/book",
      tagline: "Your success is our business"
    },
    imagePosition: "left",
    socialIconStyle: "color"
  },
  {
    id: "compact-template",
    name: "Compact",
    industry: "general",
    layout: "compact",
    premium: false,
    defaultValues: {
      name: "Jamie Doe",
      title: "Project Manager",
      company: "Solutions Inc.",
      email: "jamie@solutionsinc.com",
      phone: "(555) 333-2222",
      website: "www.solutionsinc.com",
      address: "100 Business Plaza, Enterprise, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/jamiedoe"
      },
      ctaText: "Schedule Meeting",
      ctaUrl: "https://calendar.solutionsinc.com/jamie",
      tagline: "Delivering projects on time, every time"
    },
    imagePosition: "right",
    socialIconStyle: "monochrome"
  },
  {
    id: "fitness-template",
    name: "Fitness Trainer",
    industry: "fitness",
    layout: "bold",
    premium: false,
    defaultValues: {
      name: "Chris Parker",
      title: "Personal Trainer",
      company: "Elite Fitness",
      email: "chris@elitefitness.com",
      phone: "(555) 789-0123",
      website: "www.elitefitness.com",
      address: "200 Gym Avenue, Fitness City, USA",
      socialLinks: {
        instagram: "instagram.com/chrisparkerfit",
        facebook: "facebook.com/chrisparkerfit"
      },
      ctaText: "Book a Training Session",
      ctaUrl: "https://www.elitefitness.com/book",
      tagline: "Transform your body, transform your life"
    },
    imagePosition: "left",
    socialIconStyle: "circle"
  },
  {
    id: "yoga-template",
    name: "Yoga Instructor",
    industry: "wellness",
    layout: "minimal",
    premium: false,
    defaultValues: {
      name: "Serena Ray",
      title: "Yoga Instructor",
      company: "Peaceful Mind Yoga",
      email: "serena@peacefulyoga.com",
      phone: "(555) 456-7890",
      website: "www.peacefulyoga.com",
      address: "108 Zen Street, Harmony Town, USA",
      socialLinks: {
        instagram: "instagram.com/serenarayyoga",
        facebook: "facebook.com/peacefulyoga"
      },
      ctaText: "Join a Class",
      ctaUrl: "https://www.peacefulyoga.com/schedule",
      tagline: "Find your balance, find your peace"
    },
    imagePosition: "right",
    socialIconStyle: "monochrome"
  },
  {
    id: "nutrition-template",
    name: "Nutritionist",
    industry: "wellness",
    layout: "elegant",
    premium: false,
    defaultValues: {
      name: "Dr. Maya Collins",
      title: "Clinical Nutritionist",
      company: "Nourish Wellness",
      email: "maya@nourishwellness.com",
      phone: "(555) 234-5678",
      website: "www.nourishwellness.com",
      address: "450 Health Avenue, Wellness Valley, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/drmayacollins",
        instagram: "instagram.com/drmayacollins"
      },
      ctaText: "Schedule Consultation",
      ctaUrl: "https://www.nourishwellness.com/consult",
      tagline: "Food is medicine, eat with purpose"
    },
    imagePosition: "left",
    socialIconStyle: "color"
  },
  {
    id: "crossfit-template",
    name: "CrossFit Coach",
    industry: "fitness",
    layout: "modern",
    premium: false,
    defaultValues: {
      name: "Ryan Torres",
      title: "Head CrossFit Coach",
      company: "CrossFit Revolution",
      email: "ryan@crossfitrevolution.com",
      phone: "(555) 123-9876",
      website: "www.crossfitrevolution.com",
      address: "785 Strength Street, Power City, USA",
      socialLinks: {
        instagram: "instagram.com/coachryan",
        facebook: "facebook.com/crossfitrevolution"
      },
      ctaText: "Start Your Journey",
      ctaUrl: "https://www.crossfitrevolution.com/join",
      tagline: "Push your limits, find your strength"
    },
    imagePosition: "top",
    socialIconStyle: "square"
  },
  {
    id: "elegant-template",
    name: "Elegant",
    industry: "finance",
    layout: "elegant",
    premium: false,
    defaultValues: {
      name: "Robin Chen",
      title: "Financial Advisor",
      company: "Wealth Management",
      email: "robin@wealthmanagement.com",
      phone: "(555) 123-9876",
      website: "www.wealthmanagement.com",
      address: "888 Finance Park, Money Valley, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/robinchen"
      },
      ctaText: "Schedule Consultation",
      ctaUrl: "https://www.wealthmanagement.com/consultation",
      tagline: "Securing your financial future"
    },
    imagePosition: "right",
    socialIconStyle: "monochrome"
  },
  {
    id: "corporate-template",
    name: "Corporate",
    industry: "finance",
    layout: "corporate",
    premium: false,
    defaultValues: {
      name: "Morgan Reynolds",
      title: "Senior Executive",
      company: "Global Enterprises",
      email: "morgan@globalenterprises.com",
      phone: "(555) 567-8901",
      website: "www.globalenterprises.com",
      address: "750 Corporate Tower, Business District, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/morganreynolds"
      },
      ctaText: "Connect with Our Team",
      ctaUrl: "https://www.globalenterprises.com/team",
      tagline: "Excellence in business solutions"
    },
    imagePosition: "none",
    socialIconStyle: "square"
  },
  {
    id: "creative-template",
    name: "Creative",
    industry: "creative",
    layout: "creative",
    premium: false,
    defaultValues: {
      name: "Jesse Martinez",
      title: "Art Director",
      company: "Design Collective",
      email: "jesse@designcollective.co",
      phone: "(555) 345-6789",
      website: "www.designcollective.co",
      address: "303 Creative Ave, Art District, USA",
      socialLinks: {
        instagram: "instagram.com/jessemartinez",
        behance: "behance.net/jessemartinez"
      },
      ctaText: "View My Work",
      ctaUrl: "https://www.designcollective.co/jesse",
      tagline: "Where imagination meets design"
    },
    imagePosition: "top",
    socialIconStyle: "color"
  },
  {
    id: "professional-template",
    name: "Professional",
    industry: "healthcare",
    layout: "professional",
    premium: false,
    defaultValues: {
      name: "Dr. Avery Thompson",
      title: "Healthcare Professional",
      company: "Wellness Center",
      email: "dr.thompson@wellnesscenter.com",
      phone: "(555) 234-5678",
      website: "www.wellnesscenter.com",
      address: "475 Health Parkway, Wellness City, USA",
      socialLinks: {
        linkedin: "linkedin.com/in/dravery"
      },
      ctaText: "Schedule Appointment",
      ctaUrl: "https://www.wellnesscenter.com/appointments",
      tagline: "Your health is our priority"
    },
    imagePosition: "left",
    socialIconStyle: "monochrome"
  }
];
