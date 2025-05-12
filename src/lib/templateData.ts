
export type Template = {
  id: string;
  name: string;
  industry: "realtor" | "consultant" | "lawyer" | "coach" | "general";
  layout: "standard" | "modern" | "minimal" | "bold";
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
    id: "realtor-premium",
    name: "Realtor Premium",
    industry: "realtor",
    layout: "modern",
    premium: true,
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
    id: "general-standard",
    name: "General Standard",
    industry: "general",
    layout: "standard",
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
  }
];
