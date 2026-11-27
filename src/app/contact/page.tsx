import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollUpButton from '@/components/ScrollUpButton';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Get in touch with the Tailcast team. We'd love to hear from you.",
};

const contactMethods = [
  {
    title: 'Email',
    value: 'contact@tailcast.com',
    icon: (
      <path
        d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
        stroke="rgb(99, 102, 241)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    title: 'Office',
    value: (
      <>
        123 Innovation Drive
        <br />
        San Francisco, CA 94107
      </>
    ),
    icon: (
      <>
        <path
          d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
          stroke="rgb(99, 102, 241)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
          stroke="rgb(99, 102, 241)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    title: 'Phone',
    value: '+1 (555) 123-4567',
    icon: (
      <path
        d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7294C21.7209 20.9845 21.5573 21.2136 21.3521 21.4019C21.1469 21.5901 20.9046 21.7335 20.6408 21.8227C20.3769 21.9119 20.0974 21.9451 19.82 21.92C16.7428 21.5856 13.787 20.5342 11.19 18.85C8.77383 17.3147 6.72534 15.2662 5.19 12.85C3.49998 10.2412 2.44824 7.271 2.12 4.18C2.09501 3.90347 2.12788 3.62476 2.2165 3.36162C2.30513 3.09849 2.44757 2.85669 2.63477 2.65162C2.82196 2.44655 3.04981 2.28271 3.30379 2.17052C3.55778 2.05833 3.83234 2.00026 4.11 2H7.11C7.59531 1.99523 8.06579 2.16708 8.43376 2.48353C8.80173 2.79999 9.04208 3.23945 9.11 3.72C9.23662 4.68007 9.47145 5.62273 9.81 6.53C9.94455 6.88792 9.97366 7.27691 9.89391 7.65088C9.81415 8.02485 9.62886 8.36811 9.36 8.64L8.09 9.91C9.51356 12.4136 11.5864 14.4864 14.09 15.91L15.36 14.64C15.6319 14.3711 15.9752 14.1858 16.3491 14.1061C16.7231 14.0263 17.1121 14.0555 17.47 14.19C18.3773 14.5286 19.3199 14.7634 20.28 14.89C20.7658 14.9585 21.2094 15.2032 21.5265 15.5775C21.8437 15.9518 22.0122 16.4296 22 16.92Z"
        stroke="rgb(99, 102, 241)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

const offices = [
  {
    city: 'San Francisco',
    region: 'Headquarters',
    address: (
      <>
        123 Innovation Drive
        <br />
        San Francisco, CA 94107
      </>
    ),
    hours: 'Mon–Fri, 9am–6pm PT',
  },
  {
    city: 'London',
    region: 'Europe',
    address: (
      <>
        45 Kings Road, 3rd Floor
        <br />
        London, SW3 4ND, UK
      </>
    ),
    hours: 'Mon–Fri, 9am–6pm GMT',
  },
  {
    city: 'Singapore',
    region: 'Asia-Pacific',
    address: (
      <>
        8 Marina View, #12-01
        <br />
        Singapore 018960
      </>
    ),
    hours: 'Mon–Fri, 9am–6pm SGT',
  },
];

function PinIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z"
        stroke="rgb(99, 102, 241)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
        stroke="rgb(99, 102, 241)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function OfficeCard({ office }: { office: (typeof offices)[number] }) {
  return (
    <div className="card group p-8">
      <div className="bg-primaryColor/15 mb-5 flex h-12 w-12 items-center justify-center rounded-xl">
        <PinIcon size={22} />
      </div>
      <h3 className="text-primaryText mb-1 text-lg font-bold">{office.city}</h3>
      <p className="text-secondaryColor mb-3 text-sm font-bold">{office.region}</p>
      <p className="text-secondaryText mb-4 text-sm leading-relaxed">{office.address}</p>
      <div className="text-secondaryText flex items-center gap-2 text-sm">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        {office.hours}
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <section className="bg-bgDark2 pt-32 pb-20 md:pt-44">
        <div className="content-container">
          <div className="fade-in">
            <div className="flex flex-col gap-16 lg:flex-row lg:gap-24">
              <div className="lg:w-1/2">
                <span className="block-subtitle">Contact Us</span>
                <h1 className="text-primaryText mt-6 mb-6 text-4xl font-bold lg:text-5xl">
                  Get in touch
                </h1>
                <p className="text-secondaryText mb-12 leading-loose">
                  Have a question or want to learn more about our analytics platform? Fill out the
                  form and our team will get back to you within 24 hours.
                </p>
                <div className="space-y-6">
                  {contactMethods.map((method) => (
                    <div key={method.title} className="flex items-start gap-4">
                      <div className="bg-bgDark3 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {method.icon}
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-primaryText mb-1 font-bold">{method.title}</h3>
                        <p className="text-secondaryText">{method.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-1/2">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== SECTION A - Office Locations ===================== */}
      <section className="bg-bgDark2 pt-10 pb-20">
        <div className="content-container">
          <div className="fade-in mb-14 text-center">
            <span className="block-subtitle">Our Offices</span>
            <h2 className="text-primaryText mt-6 mb-4 text-4xl font-bold lg:text-5xl">
              Find us worldwide
            </h2>
            <p className="text-secondaryText mx-auto max-w-2xl leading-relaxed">
              Visit one of our offices or connect with a local team member.
            </p>
          </div>
          <div className="fade-in grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offices.map((office) => (
              <OfficeCard key={office.city} office={office} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ScrollUpButton />
    </>
  );
}
