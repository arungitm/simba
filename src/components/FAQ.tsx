import React from "react";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  description?: string;
  faqs?: FAQItem[];
  className?: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "What commodities does Simba Ventura FZE trade?",
    answer:
      "Simba Ventura FZE specializes in trading petroleum products, coal, minerals, and foodstuffs. Our extensive network of suppliers allows us to source high-quality commodities that meet international standards and specifications.",
  },
  {
    question: "What is the minimum order quantity (MOQ) for your products?",
    answer:
      "Minimum order quantities vary by product category. For petroleum products, our MOQ is typically 10,000 MT, for coal it's 5,000 MT, for minerals it depends on the specific type, and for foodstuffs, we can accommodate orders starting from 1,000 MT. Please contact us for specific product MOQs.",
  },
  {
    question: "Which Incoterms do you work with?",
    answer:
      "We work with all major Incoterms including FOB, CIF, CFR, EXW, and DDP. Our team can advise on the most suitable Incoterm based on your location, requirements, and risk preferences. The specific terms will be clearly outlined in our quotation and contract.",
  },
  {
    question:
      "How long does the trading process take from inquiry to delivery?",
    answer:
      "The timeline varies depending on product availability, quantity, destination, and shipping conditions. Typically, the process takes 4-8 weeks from initial inquiry to final delivery. Our team provides regular updates throughout the process to keep you informed of progress.",
  },
  {
    question: "What payment terms do you offer?",
    answer:
      "We offer flexible payment terms including Letter of Credit (L/C), Documentary Collection (D/C), and Telegraphic Transfer (T/T) for established clients. The specific payment terms are negotiated based on the transaction value, relationship history, and other factors.",
  },
  {
    question: "Do you provide product quality certifications?",
    answer:
      "Yes, all our products come with relevant quality certifications and test reports from internationally recognized inspection agencies. We can arrange for third-party inspection and verification at loading ports to ensure the products meet your specifications.",
  },
];

const FAQ: React.FC<FAQProps> = ({
  title = "Frequently Asked Questions",
  description = "Find answers to common questions about our trading process and services",
  faqs = defaultFAQs,
  className = "",
}) => {
  return (
    <div className={`w-full py-16 bg-white ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-[#0B1C3F] mb-4"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-[#546E7A] max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="text-[#0B1C3F] font-medium text-left hover:text-[#F5A623] py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#546E7A] pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
