
import { ExperienceItem, EducationItem, SkillCategory } from './types';

export const CHRIS_DATA = {
  name: "Chris Carroll",
  title: "Escalation Lead Engineer",
  tagline: "Architecting Resilience. Taming Complexity. Delivering Uptime.",
  location: "Boca Raton, FL",
  email: "Carroll7044@gmail.com",
  phone: "631-521-0628",
  linkedin: "https://www.linkedin.com/in/christopher-c-857a5722b/",
  github: "https://github.com/",
  resumeUrl: "/resume.pdf", // Placeholder for actual file path
  profileImage: "https://media.licdn.com/dms/image/v2/D4E03AQE6BfS3A8N4oA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1715699477545?e=1744848000&v=beta&t=M8X7y3p-8A3u3K5_R-xS8Y7Z5M8Y7Z5M8Y7Z5M8Y7Z5",
  brandStory: "I thrive in the 'escalation' phase—where complexity meets critical impact. My career is defined by transforming fragmented infrastructure into hardened, automated, and secure hybrid systems. I don't just fix servers; I architect the operational maturity that allows businesses to scale without fear of downtime.",
  about: "Dynamic IT engineer with deep expertise in hybrid cloud and on-prem infrastructure. Specialized in virtualization, automation, networking, and security, I deliver operational maturity through platforms like Azure, Hyper-V, VMware, and Kubernetes.",
  kpis: [
    { label: "Escalation Resolve Rate", value: "98%" },
    { label: "Infrastructure Automation", value: "70%+" },
    { label: "Uptime Commitment", value: "99.9%" },
    { label: "Certifications", value: "3+" }
  ]
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Dedicated IT",
    role: "Escalation Lead Engineer",
    location: "Palm Beach Gardens, FL",
    period: "June 2025 – Present",
    bullets: [
      "Senior Escalation Resource: Administering hybrid Azure, Hyper V, VMware, Kubernetes, Docker, and hosted data center environments.",
      "Automation Lead: Managing provisioning and updates with PowerShell, Bash, Intune, and Azure Automation.",
      "Network Architect: Designing Meraki, pfSense, SonicWall platforms with site-to-site VPNs, static routes, VTIs, and segmented VLANs.",
      "Migration Specialist: Leading email and server migrations across Microsoft 365 and Google Workspace environments.",
      "Infrastructure Ops: Configuring firewalls, switches, Unifi gear, NVR/DVR, PCI systems, and managed public/private DNS."
    ]
  },
  {
    company: "Kinetix Solutions",
    role: "System Engineer",
    location: "Coconut Creek, FL",
    period: "April 2024 – June 2025",
    bullets: [
      "Virtualization Ops: Managed and deployed virtual machines, storage, and networks in Azure and Hyper-V.",
      "Compliance Officer: Implemented and maintained device compliance policies via Microsoft Intune.",
      "Systems Automation: Automated system and application updates using Intune and Azure Automation.",
      "VMware Lifecycle: Managed infrastructure including ESXi hosts and virtual networks, optimizing resources in Azure.",
      "Network Projects: Configured network equipment (firewalls, switches, Unifi) and managed DNS records."
    ]
  },
  {
    company: "Florida Atlantic University",
    role: "SA Systems Technician",
    location: "Boca Raton, FL",
    period: "July 2023 – April 2024",
    bullets: [
      "Managerial Leadership: Classified under FAU's Administrative, Managerial and Professional (AMP) positions.",
      "Scale Operations: Conducted migrations/upgrades on campus servers impacting over 50,000+ users.",
      "Full-Stack Regulation: Coding and regulating university sites using PHP, MySQL, and HTML.",
      "Data Security: Managed health/medical information in accordance with HIPPA compliance standards.",
      "Infrastructure Governance: Managed IT infrastructure and applications for all three FAU campuses."
    ]
  },
  {
    company: "Florida Atlantic University",
    role: "System Administrator",
    location: "Boca Raton, FL",
    period: "August 2022 – July 2023",
    bullets: [
      "Cloud Strategy: Staging and configuring Windows VMs and desktops on a departmental basis.",
      "Web Governance: Developed Single-Sign-On tools and regulated the SSERCA website using Linux/HTML.",
      "HPC Management: Managed HPC clusters and high-volume service request tickets."
    ]
  },
  {
    company: "ITsavvy",
    role: "NOC Intern",
    location: "Hauppauge, NY",
    period: "May 2022 – July 2022",
    bullets: [
      "Client Support: Assisted IT clientele with service requests using Autotask, Datto, and FortiLAN systems.",
      "IoT Integration: Built and coded Raspberry Pi devices for specific client deployments.",
      "Infrastructure Maintenance: Dismantled and reinstalled network servers and resolved requests via TeamViewer/OpenSSH."
    ]
  }
];

export const SKILLS: SkillCategory[] = [
  {
    title: "Technical Expertise",
    skills: ["Azure & Hyper-V", "VMware ESXi", "Kubernetes", "PowerShell & Bash", "Intune Automation", "HIPPA Compliance"]
  },
  {
    title: "Networking & Security",
    skills: ["pfSense & SonicWall", "Cisco Meraki", "Unifi Gear", "VLAN Segmentation", "Site-to-Site VPN", "IPSec/VTIs"]
  },
  {
    title: "Web & Management",
    skills: ["PHP/MySQL/HTML", "Autotask & Datto", "DNS Management", "NVR/DVR", "HPC Clusters", "Project Management"]
  },
  {
    title: "Soft Skills",
    skills: ["High EQ Teamwork", "Interpersonal Etiquette", "Technical Writing", "Strategic Escalation", "Operational Excellence"]
  }
];

export const EDUCATION: EducationItem[] = [
  {
    institution: "Florida Atlantic University",
    degree: "Master of Science, Information Technology & Management",
    major: "Cybersecurity focus",
    date: "Expected May 2025",
    gpa: "4.0",
    highlights: ["Concentration: IT Strategy & Scalability"]
  },
  {
    institution: "Florida Atlantic University",
    degree: "Bachelor of Science, Management Information Systems (MIS)",
    major: "Cybersecurity focus",
    date: "May 2023",
    gpa: "3.55",
    highlights: ["Three-time member of the Dean's List"]
  }
];

export const CERTIFICATIONS = [
  "CompTIA Security+ Certification",
  "CompTIA A+ Core 1 Certification",
  "CompTIA A+ Core 2 Certification"
];
