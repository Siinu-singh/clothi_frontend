'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, ChevronDown } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import styles from './Contact.module.css';

interface FormFields {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const contactChannels = [
  {
    icon: Mail,
    title: 'Email Us',
    details: 'hello@clothi.com',
    link: 'mailto:hello@clothi.com',
    description: 'We reply to all inquiries within 24 hours.',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: '+91 75037 35901',
    link: 'tel:+917503735901',
    description: 'Mon-Fri, 9am - 6pm PST.',
  },
  {
    icon: MapPin,
    title: 'Our Showroom',
    details: '842 Coastal Hwy, Encinitas, CA',
    link: 'https://maps.google.com',
    description: 'Come experience our collection in person.',
  },
  {
    icon: Clock,
    title: 'Opening Hours',
    details: 'Mon - Fri: 9am - 6pm PST',
    description: 'Weekend closed.',
  },
];

const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Orders are processed within 1-2 business days. Standard domestic shipping takes 3-5 business days. Express shipping options are available at checkout.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns and exchanges on unworn, unwashed items in their original packaging within 30 days of delivery. Returns are free for domestic orders.',
  },
  {
    question: 'How can I track my order?',
    answer: 'Once your order ships, you will receive a shipping confirmation email containing your tracking link. You can also view status updates in your Account dashboard.',
  },
  {
    question: 'Where are Clothi garments manufactured?',
    answer: 'Our garments are designed in California and responsibly crafted in fair-trade certified facilities across Peru, Portugal, and India, using certified organic pima cotton.',
  },
];

export default function ContactClient() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormFields>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        tempErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
    }

    if (!formData.subject.trim()) {
      tempErrors.subject = 'Subject is required';
      isValid = false;
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error dynamically when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success('Your message has been sent successfully! We will get back to you shortly.');
      
      // Clear form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setErrors({});
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      {/* Hero Header */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.heroKicker}>CONNECT WITH US</span>
          <h1 className={styles.heroTitle}>Get in Touch</h1>
          <p className={styles.heroSubtitle}>
            Have a question about our collections, sizing, shipping, or returns? 
            Our team is here to help you guide your choices.
          </p>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className={styles.container}>
        <div className={styles.grid}>
          {/* Left Column: Direct channels */}
          <div className={styles.infoColumn}>
            <section aria-labelledby="channels-heading">
              <h2 id="channels-heading" className={styles.sectionTitle}>Contact Channels</h2>
              <div className={styles.channelsGrid}>
                {contactChannels.map((channel, idx) => (
                  <div key={idx} className={styles.channelCard}>
                    <div className={styles.iconWrapper} aria-hidden="true">
                      <channel.icon size={20} strokeWidth={1.5} />
                    </div>
                    <div className={styles.channelInfo}>
                      <h3>{channel.title}</h3>
                      {channel.link ? (
                        <a 
                          href={channel.link} 
                          className={styles.channelLink}
                          target={channel.link.startsWith('http') ? '_blank' : undefined}
                          rel={channel.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                        >
                          {channel.details}
                        </a>
                      ) : (
                        <span className={styles.channelText}>{channel.details}</span>
                      )}
                      <p className={styles.channelText} style={{ marginTop: '0.25rem', fontSize: '0.75rem' }}>
                        {channel.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Contact Form */}
          <section className={styles.formSection} aria-labelledby="form-heading">
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h2 id="form-heading">Send a Message</h2>
                <p>Fill out the form below and a style advisor will be in touch with you shortly.</p>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    className={`${styles.input} ${errors.name ? styles.errorInput : ''}`}
                  />
                  {errors.name && (
                    <span id="name-error" className={styles.errorText} role="alert">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                  />
                  {errors.email && (
                    <span id="email-error" className={styles.errorText} role="alert">
                      {errors.email}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.formLabel}>Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help you?"
                    required
                    aria-required="true"
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    className={`${styles.input} ${errors.subject ? styles.errorInput : ''}`}
                  />
                  {errors.subject && (
                    <span id="subject-error" className={styles.errorText} role="alert">
                      {errors.subject}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message" className={styles.formLabel}>Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Write your message here..."
                    required
                    aria-required="true"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className={`${styles.textarea} ${errors.message ? styles.errorInput : ''}`}
                  />
                  {errors.message && (
                    <span id="message-error" className={styles.errorText} role="alert">
                      {errors.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    <>
                      <span className={styles.spinner} aria-hidden="true" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} aria-hidden="true" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>

        {/* Section 3: FAQs (Centered) */}
        <section aria-labelledby="faqs-heading" className={styles.faqSection}>
          <div className={styles.faqContainer}>
            <h2 id="faqs-heading" className={styles.faqTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`${styles.faqItem} ${openFaqIdx === idx ? styles.faqItemOpen : ''}`}
                >
                  <button 
                    className={styles.faqQuestion}
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={openFaqIdx === idx}
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={16} className={styles.faqIcon} aria-hidden="true" />
                  </button>
                  <div className={styles.faqAnswerWrapper}>
                    <div className={styles.faqAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
