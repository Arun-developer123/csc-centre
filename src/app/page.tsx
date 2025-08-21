"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  BadgeHelp,
  Building2,
  Globe2,
  UserCheck,
  Landmark,
  FileCheck2,
  SearchCheck,
  CreditCard,
  Plane,
  IdCard,
  ClipboardCheck,
  HeartHandshake,
  Baby,
  Heart,
  Gem,
  Zap,
  FileSignature,
  Lightbulb,
  MessageCircle,
} from "lucide-react";

// ✅ Single-file, production-ready landing page for a CSC Centre
// Tech: React + TailwindCSS + Framer Motion + Lucide Icons
// How to use:
// - Drop this component into your Next.js/React app and make it your homepage.
// - Replace placeholder details (phone, address, email, Google Map, WhatsApp number).
// - Deploy to Vercel for instant hosting.

const services = [
  { title: "Aadhar Card Correction", icon: IdCard, desc: "Name/DOB/Address updates with proper documentation support." },
  { title: "PAN Card", icon: CreditCard, desc: "New PAN, corrections & instant e-PAN assistance." },
  { title: "PF Claim & KYC", icon: Landmark, desc: "EPFO withdrawals, KYC linking & issue resolution." },
  { title: "Air Tickets", icon: Plane, desc: "Domestic & international flight bookings at best rates." },
  { title: "Ration Card", icon: ClipboardCheck, desc: "New/duplicate cards, member addition & corrections." },
  { title: "Domicile/Caste/Income/EWS", icon: FileCheck2, desc: "End-to-end certificate application & tracking." },
  { title: "Family ID", icon: UserCheck, desc: "Family ID creation & updates with verification." },
  { title: "Passport", icon: Globe2, desc: "Fresh passport, renewal & appointment assistance." },
  { title: "FIR", icon: SearchCheck, desc: "FIR filing guidance & online application support." },
  { title: "Police Verification", icon: ShieldCheck, desc: "Tenant/employee verification & status tracking." },
  { title: "Jeevan Praman", icon: Building2, desc: "Digital life certificate generation for pensioners." },
  { title: "Birth Certificate", icon: Baby, desc: "Hospital/municipal coordination & re-issuance." },
  { title: "Insurance", icon: HeartHandshake, desc: "Health, life, vehicle insurance—new & renewals." },
  { title: "Marriage Certificate", icon: FileSignature, desc: "Application, document prep & appointment help." },
  { title: "Electricity Connection", icon: Zap, desc: "New meter, name change, bill corrections & more." },
] as const;

const perks = [
  { icon: Sparkles, label: "Same‑Day Processing" },
  { icon: ShieldCheck, label: "Verified Government Portals" },
  { icon: CheckCircle2, label: "100% Receipt & Acknowledgement" },
  { icon: Gem, label: "Best Service Experience" },
] as const;

// Replace with your real details
const BUSINESS = {
  name: "Sawariya CSC Centre",
  specialist: "Mr. Sahil Sharma",
  phone: "+91 7838903944",
  whatsapp: "917838903944", // numeric with country code
  email: "support@sawariyacsc.in",
  addressLine: "House no 87, Gali No. 8, Davilal Nagar, Devilal Colony, Sector 9, Gurugram, Haryana 122001",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.566197727284!2d77.0015013!3d28.4611535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d17ea3aadef83%3A0x4288907b45b9f45b!2sSawariya%20CSC%20CENTRE!5e0!3m2!1sen!2sin!4v1692700000000!5m2!1sen!2sin",
  timings: "Mon–Sun: 9:00 AM – 8:00 PM",
  defaultSendMethod: "whatsapp" as "whatsapp" | "email", // choose default
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true, amount: 0.2 },
};

// 🔹 Modal component (no external libs)
function ApplyModal({
  open,
  onClose,
  selectedService,
  defaultSend,
}: {
  open: boolean;
  onClose: () => void;
  selectedService?: string;
  defaultSend: "whatsapp" | "email";
}) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(selectedService || services[0].title);
  const [notes, setNotes] = useState("");
  const [sendVia, setSendVia] = useState<"whatsapp" | "email">(defaultSend);
  const [fileNames, setFileNames] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setService(selectedService || services[0].title);
      setFileNames([]);
      setNotes("");
      setName("");
      setPhone("");
      setSendVia(defaultSend);
      // focus trap lite
      setTimeout(() => dialogRef.current?.focus(), 0);
    }
  }, [open, selectedService, defaultSend]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const waText = useMemo(() => {
    const lines = [
      `Service: ${service}`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      notes ? `Notes: ${notes}` : "",
      fileNames.length
        ? `Docs (to be shared on WhatsApp): ${fileNames.join(", ")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
    return encodeURIComponent(`Hi ${BUSINESS.name}, I want to apply for a service.\n\n${lines}`);
  }, [service, name, phone, notes, fileNames]);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Service Application – ${service}`);
    const body = encodeURIComponent(
      [
        `Service: ${service}`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        notes ? `Notes: ${notes}` : "",
        fileNames.length
          ? `Docs: (Email clients often don't allow attaching via link) Please reply to this email with the files: ${fileNames.join(", ")}`
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    );
    return `mailto:${BUSINESS.email}?subject=${subject}&body=${body}`;
  }, [service, name, phone, notes, fileNames]);

  function validatePhone(p: string) {
    // Very light validation: at least 10 digits
    const digits = p.replace(/\D/g, "");
    return digits.length >= 10;
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setFileNames(files.map((f) => f.name));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your name.");
    if (!validatePhone(phone)) return alert("Please enter a valid phone number (10+ digits).");

    if (sendVia === "whatsapp") {
      const link = `https://wa.me/${BUSINESS.whatsapp}?text=${waText}`;
      window.open(link, "_blank");
    } else {
      window.location.href = mailtoHref; // opens email client
    }

    onClose();
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Apply for a service"
      tabIndex={-1}
      ref={dialogRef}
      className="fixed inset-0 z-[60]"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center px-4">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BadgeHelp className="h-5 w-5" /> Apply Now
              </h3>
              <p className="text-white/70 text-sm mt-1">
                Fill the details below. We will respond during working hours.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl px-3 py-1.5 bg-white/10 hover:bg-white/20 text-sm"
            >
              Close
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-5 grid gap-3">
            <label className="grid gap-1">
              <span className="text-sm text-white/80">Select Service</span>
              <select
                className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s.title} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid sm:grid-cols-2 gap-3">
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your Name"
                className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
              <input
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Phone Number"
                className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
              />
            </div>

            <input
              name="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes (e.g., urgent, city, existing ID, etc.)"
              className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60"
            />


            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className="text-white/80">Send via:</span>
              <label className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 border ${sendVia === "whatsapp" ? "border-green-400/60 bg-green-400/10" : "border-white/10"}`}>
                <input
                  type="radio"
                  name="sendVia"
                  checked={sendVia === "whatsapp"}
                  onChange={() => setSendVia("whatsapp")}
                />
                WhatsApp
              </label>
              <label className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 border ${sendVia === "email" ? "border-indigo-400/60 bg-indigo-400/10" : "border-white/10"}`}>
                <input
                  type="radio"
                  name="sendVia"
                  checked={sendVia === "email"}
                  onChange={() => setSendVia("email")}
                />
                Email
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 rounded-2xl px-5 py-3 bg-indigo-500 hover:bg-indigo-600 transition inline-flex items-center justify-center"
            >
              Submit & Continue <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function SawariyaCSCCentre() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [applyFor, setApplyFor] = useState<string | undefined>(undefined);

  const waText = encodeURIComponent(
    `Hello ${BUSINESS.name}, I need help with online services.`
  );
  const waLink = `https://wa.me/${BUSINESS.whatsapp}?text=${waText}`;

  function openApply(service?: string) {
    setApplyFor(service);
    setApplyOpen(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Sticky Navbar */}
<header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/5 bg-white/5 border-b border-white/10">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    
    {/* Left Side Logo + Name */}
    <div className="flex items-center gap-3">
      {/* Small Photo/Logo */}
      <div className="h-10 w-10 rounded-full overflow-hidden shadow-lg border border-white/20">
        <img
          src="/khatu-shyam.jpg"   // 👈 public folder में image डालनी है
          alt="Khatu Shyam Ji"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Text */}
      <div>
        <p className="text-sm/5 text-white/70">Digital Seva Kendra</p>
        <h1 className="text-base font-semibold">{BUSINESS.name}</h1>
      </div>
    </div>

    {/* Center Navigation */}
    <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
      <a href="#services" className="hover:text-white">Services</a>
      <a href="#about" className="hover:text-white">About</a>
      <a href="#contact" className="hover:text-white">Contact</a>
    </nav>

    {/* Right Side Buttons */}
    <div className="flex items-center gap-2">
      <a
        href={`tel:${BUSINESS.phone}`}
        className="hidden sm:flex items-center gap-2 rounded-2xl px-4 py-2 border border-white/20 hover:border-white/40 transition shadow-sm"
      >
        <Phone className="h-4 w-4" />
        <span className="text-sm">Call Now</span>
      </a>
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-2 rounded-2xl px-4 py-2 bg-green-500/90 hover:bg-green-500 transition shadow"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-sm font-medium">WhatsApp</span>
      </a>
    </div>
  </div>
</header>

      {/* Hero Section */}
<section className="relative overflow-hidden">
  {/* Background Image */}
  <div className="absolute inset-0 -z-0">
    <img
      src="/khatu-shyam.jpg" // 👈 public folder में image डालना
      alt="Khatu Shyam Ji"
      className="w-full h-full object-cover"
    />
    {/* Dark overlay for readability */}
    <div className="absolute inset-0 bg-black/5" />
  </div>

  {/* Hero Content */}
  <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-10 items-center text-white">
    <motion.div {...fadeUp}>
      <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs">
        <ShieldCheck className="h-3.5 w-3.5" />
        Trusted Online Services Centre
      </div>

      <h2 className="mt-4 text-3xl sm:text-5xl font-bold tracking-tight">
        Thank you for contacting {BUSINESS.name}
      </h2>

      <p className="mt-4 text-base sm:text-lg text-white/80">
        Please let us know how we can help you. <span className="inline-block">👏🏻</span>
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Heart className="h-5 w-5" />
        <span>
          <strong>{BUSINESS.specialist}</strong> in all our Online Services.
        </span>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-green-500 hover:bg-green-600 transition shadow"
        >
          Get Help on WhatsApp <ArrowRight className="ml-2 h-4 w-4" />
        </a>
        <button
          onClick={() => openApply()}
          className="inline-flex items-center justify-center rounded-2xl px-5 py-3 border border-white/20 hover:border-white/40 transition"
        >
          Apply Now
        </button>
      </div>

      <div className="mt-8 grid grid-cols-2 sm:flex gap-4 text-sm text-white/80">
        {perks.map((p) => (
          <div key={p.label} className="inline-flex items-center gap-2">
            <p.icon className="h-4 w-4" />
            <span>{p.label}</span>
          </div>
        ))}
      </div>
    </motion.div>

          {/* Right card */}
          <motion.div {...fadeUp} className="lg:ml-auto">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 shadow-2xl backdrop-blur">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <BadgeHelp className="h-5 w-5" /> Quick Enquiry
              </h3>
              <p className="mt-2 text-white/70 text-sm">
                Tell us what you need. We’ll call you back within working hours.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget as HTMLFormElement;
                  const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                  const need = (form.elements.namedItem("need") as HTMLInputElement).value;
                  window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
                    `Hi ${BUSINESS.name}, I am ${name}. I need help with: ${need}.`
                  )}`);
                }}
                className="mt-6 grid gap-3"
              >
                <input name="name" required placeholder="Your Name" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60" />
                <input name="phone" required placeholder="Your Phone" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60" />
                <input name="need" required placeholder="Service you need (e.g., Aadhar correction)" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60" />
                <button type="submit" className="rounded-2xl px-5 py-3 bg-indigo-500 hover:bg-indigo-600 transition inline-flex items-center justify-center">
                  Send Enquiry <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </form>
              <div className="mt-6 text-sm text-white/70 grid gap-1">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {BUSINESS.phone}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {BUSINESS.email}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4" /> {BUSINESS.timings}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.h3 {...fadeUp} className="text-2xl sm:text-3xl font-bold">All Services</motion.h3>
        <motion.p {...fadeUp} className="mt-2 text-white/70 max-w-2xl">
          One centre for all government & utility services. Transparent pricing, instant receipts, and proper guidance.
        </motion.p>

        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map(({ title, icon: Icon, desc }) => (
            <motion.div
              key={title}
              {...fadeUp}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.06] transition shadow-lg flex flex-col"
            >
              <div className="flex items-start gap-3 flex-1">
                <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{title}</h4>
                  <p className="mt-1 text-sm text-white/70">{desc}</p>
                </div>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => openApply(title)}
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-indigo-500 hover:bg-indigo-600 transition"
                >
                  Apply Now <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border border-white/20 hover:border-white/40"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600/30 to-violet-600/30 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xl font-semibold">Need something else?</h4>
              <p className="text-white/80">We also handle many other online services. Message us your requirement.</p>
            </div>
            <div className="flex gap-3">
              <a
                href={waLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 bg-green-500 hover:bg-green-600 transition"
              >
                Chat on WhatsApp <ArrowRight className="h-4 w-4" />
              </a>
              <button onClick={() => openApply()} className="inline-flex items-center gap-2 rounded-2xl px-5 py-3 border border-white/20 hover:border-white/40 transition">
                Apply Now
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUp}>
            <h3 className="text-2xl sm:text-3xl font-bold">Why Choose {BUSINESS.name}?</h3>
            <p className="mt-3 text-white/80">
              We simplify government and utility tasks with expert guidance, quick processing, and transparent updates. From Aadhaar to Passport, we manage it smoothly so you don’t have to wait in long queues or struggle with forms.
            </p>
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {perks.map((p) => (
                <li key={p.label} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 className="h-5 w-5" /> {p.label}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp} className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 p-2">
            <div className="aspect-video rounded-2xl overflow-hidden">
              <iframe
                title="Google Map"
                src={BUSINESS.mapEmbed}
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="p-4">
              <p className="flex items-start gap-2 text-white/80"><MapPin className="mt-0.5 h-4 w-4" /> {BUSINESS.addressLine}</p>
              <p className="flex items-center gap-2 text-white/80 mt-2"><Clock className="h-4 w-4" /> {BUSINESS.timings}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.h3 {...fadeUp} className="text-2xl sm:text-3xl font-bold">Contact Us</motion.h3>
        <div className="mt-6 grid lg:grid-cols-3 gap-6">
          <motion.div {...fadeUp} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h4 className="font-semibold">Call / Email</h4>
            <div className="mt-4 space-y-2 text-white/80">
              <a href={`tel:${BUSINESS.phone}`} className="flex items-center gap-2 hover:text-white"><Phone className="h-4 w-4" /> {BUSINESS.phone}</a>
              <a href={`mailto:${BUSINESS.email}`} className="flex items-center gap-2 hover:text-white"><Mail className="h-4 w-4" /> {BUSINESS.email}</a>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> {BUSINESS.addressLine}</p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 lg:col-span-2">
            <h4 className="font-semibold">Quick Message</h4>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const name = (form.elements.namedItem("name") as HTMLInputElement).value;
                const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
                const msg = (form.elements.namedItem("msg") as HTMLInputElement).value;
                window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(
                  `Hi ${BUSINESS.name}, I am ${name} (${phone}). ${msg}`
                )}`);
              }}
              className="mt-4 grid sm:grid-cols-2 gap-3"
            >
              <input name="name" required placeholder="Your Name" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60" />
              <input name="phone" required placeholder="Phone Number" className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60" />
              <input name="msg" required placeholder="How can we help you?" className="sm:col-span-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/60" />
              <button type="submit" className="sm:col-span-2 rounded-2xl px-5 py-3 bg-indigo-500 hover:bg-indigo-600 transition inline-flex items-center justify-center">
                Send on WhatsApp <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-white/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/80 font-medium">{BUSINESS.name}</p>
              <p className="mt-1">Digital Seva • Govt & Utility Services</p>
            </div>
            <div className="flex items-center gap-4">
              <a className="hover:text-white" href="#services">Services</a>
              <a className="hover:text-white" href="#about">About</a>
              <a className="hover:text-white" href="#contact">Contact</a>
            </div>
          </div>
          <p className="mt-6">© {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating Actions */}
      <a
        href={waLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 rounded-full p-4 bg-green-500 shadow-2xl hover:bg-green-600 transition"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
      </a>

      <a
        href={`tel:${BUSINESS.phone}`}
        className="fixed bottom-5 right-20 hidden sm:flex rounded-full p-4 bg-indigo-500 shadow-2xl hover:bg-indigo-600 transition"
        aria-label="Call Now"
      >
        <Phone className="h-5 w-5" />
      </a>

      {/* SEO & Structured Data (optional) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: BUSINESS.name,
            image: "",
            address: BUSINESS.addressLine,
            telephone: BUSINESS.phone,
            email: BUSINESS.email,
            openingHours: BUSINESS.timings,
            url: typeof window !== "undefined" ? window.location.href : "",
            sameAs: [`https://wa.me/${BUSINESS.whatsapp}`],
            description:
              "CSC centre for Aadhaar, PAN, certificates, passport, police verification, ration card, insurance, electricity connection and more.",
            areaServed: "India",
            slogan: "Fast, verified & hassle-free digital services",
          }),
        }}
      />

      {/* Apply Modal */}
      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        selectedService={applyFor}
        defaultSend={BUSINESS.defaultSendMethod}
      />
    </div>
  );
}
