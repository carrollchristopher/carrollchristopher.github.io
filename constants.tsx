import { ExperienceItem, EducationItem, SkillCategory } from './types';
import profileImage from './assets/profile.webp';
import profileImageSmall from './assets/profile-400.webp';

export const CHRIS_DATA = {
  name: "Chris Carroll",
  title: "Escalation Lead Engineer",
  subtitle: "Cloud Architect",
  location: "Boca Raton, FL",
  email: "Carroll7044@gmail.com",
  phone: "631-521-0628",
  linkedin: "https://www.linkedin.com/in/christopher-c-857a5722b/",
  github: "https://github.com/carrollchristopher",
  profileImage,
  profileImageSmall,
  bio: [
    "Driven and results-oriented Cloud Architect with a strong foundation in cybersecurity, IT infrastructure, and enterprise solutions. Possessing a robust academic foundation in MIS Cybersecurity, I currently serve as an Escalation Lead Engineer at Dedicated IT. In this capacity, I specialize in architecting, deploying, and refining sophisticated cloud/hybrid infrastructures that drive secure operational excellence and innovation.",
    "Complementing my infrastructure expertise is in-depth, hands-on knowledge of full stack development, application load balancing, and database management. I design and deliver end-to-end solutions across modern web frameworks, reverse proxies, and relational database systems, engineering resilient, high-availability platforms that bridge the gap between infrastructure and application layers. Underpinning this work is a mature DevOps practice. I containerize and orchestrate workloads, define environments through infrastructure as code, and automate operations with scripting and observability tooling, ensuring every deployment is repeatable, secure, and reliable.",
    "Armed with a Master of Science in Management Information Systems from Florida Atlantic University, my focus continues to be the intersection of technology, strategy, and leadership. Passionate about cloud security, automation, DevOps, and digital transformation, I am eager to take on leadership roles that challenge me to innovate, optimize, and drive organizational success.",
  ],
  kpis: [
    { label: "Years in IT", value: "4+" },
    { label: "Users Supported", value: "50K+" },
    { label: "Cloud Platforms", value: "3" },
    { label: "Certifications", value: "4" }
  ]
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Dedicated IT",
    role: "Escalation Lead Engineer",
    location: "Palm Beach Gardens, FL",
    period: "June 2025 – Present",
    bullets: [
      "Escalation point for infrastructure, security, and DevOps operations across a multi-client healthcare and enterprise base, driving root-cause analysis across compute, storage, virtualization, and network layers.",
      "Engineered internal DevOps platforms with containerized Docker/Kubernetes workloads, infrastructure as code (Terraform, Ansible), and self-hosted AI tooling built on local LLMs, ML pipelines, and RAG.",
      "Built full stack applications on Next.js, React, and Node.js with PostgreSQL/MySQL backends, owning schema design, replication, backup, and performance tuning, delivered on high-availability stacks with reverse proxying, HAProxy load balancing, TLS automation, and failover across on-prem and cloud.",
      "Embedded DevSecOps controls in delivery pipelines (secrets management, least-privilege IAM, dependency scanning, policy-as-code) with observability through Prometheus, Grafana, synthetic monitoring, and MS Graph API alerting.",
      "Automated endpoint provisioning, application packaging, and configuration enforcement at fleet scale with PowerShell, Bash, Python, and RMM tooling.",
      "Architected enterprise networks spanning site-to-site VPN, multi-WAN failover, SD-WAN, BGP/OSPF, VLAN segmentation, HA firewall clustering, and zero-trust policy across mixed-vendor platforms.",
      "Engineered virtualization, storage, and backup across VMware vSphere, Hyper-V, Azure, AWS, and Google Cloud, including HA/DRS, SAN/iSCSI, GCP project provisioning and API enablement, gsutil/CLI storage operations, and datacenter operations (server provisioning, iDRAC/iLO, RAID, hardware lifecycle, power/cooling planning).",
      "Administered Active Directory, Entra ID, Intune, and Jamf, including replication, FSMO, DC recovery, hybrid identity sync, Conditional Access, PIM, Autopilot, and security baselines across Windows, macOS, and iOS.",
      "Led incident response and forensics across endpoint, identity, and web layers with detection tooling on MS Graph and EDR telemetry."
    ]
  },
  {
    company: "Kinetix Solutions",
    role: "System Engineer",
    location: "Coconut Creek, FL",
    period: "April 2024 – June 2025",
    bullets: [
      "Architected and deployed Azure, GCP, and AWS infrastructure, including AWS EC2, EBS, VPC networking, subnets, route tables, NAT gateways, and hybrid connectivity to on-premises environments.",
      "Served as the top escalation point for the Professional Services team, owning root-cause analysis on complex client incidents.",
      "Migrated and managed datacenter infrastructure for enterprise clients across Azure, Hyper-V, KVM, and VMware ESXi, including host lifecycle, virtual networking, storage, and resource optimization.",
      "Automated provisioning, compliance, and application deployment with AWS Systems Manager, CloudFormation, Lambda, Azure Automation, Intune, and shell scripting.",
      "Developed and tailored Next.js web applications with React, JavaScript, HTML, and CSS for client-facing and internal tooling.",
      "Designed and enforced security policies across Azure, AWS, GCP, Intune, and legacy Active Directory domain controllers.",
      "Owned patch management and system upgrades across cloud and on-premises environments.",
      "Configured network infrastructure on a project basis including firewalls, switches, wireless access points, NVR/DVR, PCI systems, and associated virtual networks.",
      "Administered public and private DNS across multi-tenant client environments."
    ]
  },
  {
    company: "Florida Atlantic University",
    role: "SA Systems Technician",
    location: "Boca Raton, FL",
    period: "July 2023 – April 2024",
    bullets: [
      "Managerial Leadership: Classified under FAU's Administrative, Managerial and Professional (AMP) positions.",
      "Scale Operations: Conducted migrations/upgrades on campus servers impacting over 50,000 users.",
      "Full-Stack Regulation: Coding and regulating university sites using PHP, MySQL, and HTML.",
      "Data Security: Managed health/medical information in accordance with HIPAA compliance standards.",
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
    title: "Cloud and Infrastructure",
    skills: ["Azure", "AWS", "Google Cloud", "VMware vSphere", "Hyper-V", "SAN/iSCSI", "Datacenter Operations", "Disaster Recovery"]
  },
  {
    title: "DevOps and Automation",
    skills: ["Docker", "Kubernetes", "Terraform", "Ansible", "Infrastructure as Code", "Prometheus", "Grafana", "PowerShell", "Bash", "Python"]
  },
  {
    title: "Security",
    skills: ["DevSecOps", "IAM", "Conditional Access", "PIM", "EDR", "Incident Response", "Digital Forensics", "Zero Trust", "Compliance"]
  },
  {
    title: "Networking",
    skills: ["BGP/OSPF", "VLAN Segmentation", "Site-to-Site VPN", "SD-WAN", "Multi-WAN Failover", "HA Firewall Clustering"]
  },
  {
    title: "Application and Data",
    skills: ["Next.js", "React", "Node.js", "PostgreSQL", "MySQL", "HAProxy", "Reverse Proxying", "TLS Automation", "High Availability"]
  },
  {
    title: "Identity and Endpoint",
    skills: ["Active Directory", "Entra ID", "Intune", "Jamf", "Group Policy", "Autopilot", "Windows/macOS/Linux Fleets"]
  }
];

export const EDUCATION: EducationItem[] = [
  {
    institution: "Florida Atlantic University",
    degree: "Master of Science, Information Technology & Management",
    major: "MIS Cybersecurity",
    date: "May 2026",
    gpa: "3.75",
    highlights: ["Six-time member of the Dean's List"]
  },
  {
    institution: "Florida Atlantic University",
    degree: "Bachelor of Science, Management Information Systems",
    major: "MIS Cybersecurity",
    date: "May 2023",
    gpa: "3.55",
    highlights: ["Three-time member of the Dean's List"]
  }
];

export const CERTIFICATIONS = [
  "CompTIA A+",
  "CompTIA Security+",
  "Cisco Network Security: Secure Routing and Switching",
  "Microsoft Security Essentials: Professional"
];
