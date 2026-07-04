import {
  Calendar,
  File,
  FileText,
  Handshake,
  Headphones,
  MessageSquare,
  ShieldCheck,
  Trophy,
  UserPlus,
  CircleHelp,
  Users,
  Image,
  Lock,
} from "lucide-react";

export const sidebarMenu = {
  navMain: [
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
    {
      title: "Events",
      url: "/events",
      icon: Calendar,
      isActive: true,
    },
    {
      title: "Driver Requests",
      url: "/driver-requests",
      icon: UserPlus,
    },
    {
      title: "Results",
      url: "/results",
      icon: Trophy,
    },

    {
      title: "Messages",
      url: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Sponsors",
      url: "/sponsors",
      icon: Handshake,
    },
    {
      title: "Sponsor Applications",
      url: "/sponsor-applications",
      icon: FileText,
    },
    {
      title: "Rulebook",
      url: "/rulebook",
      icon: ShieldCheck,
    },
    {
      title: "Legal",
      url: "/legal",
      icon: File,
    },
    {
      title: "Help & Support",
      url: "/help-support",
      icon: Headphones,
    },
    {
      title: "FAQ",
      url: "/faq",
      icon: CircleHelp,
    },
    {
      title: "Logo",
      url: "/logo",
      icon: Image,
    },
    {
      title: "Admins",
      url: "/admins",
      icon: Users,
    },
    {
      title: "Change Password",
      url: "/change-password",
      icon: Lock,
    },
  ],

};

export const profileData = {
  name: "Rahad Ullah",
  email: "rahadullah10@gmail.com",
  role: "Admin",
  avatar:
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D",
};

