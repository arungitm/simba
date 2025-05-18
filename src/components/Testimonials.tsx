import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  company: string;
  logo: string;
  rating?: number;
}

interface TestimonialsProps {
  title?: string;
  description?: string;
  testimonials?: TestimonialProps[];
}

const defaultTestimonials: TestimonialProps[] = [
  {
    quote:
      "Simba Ventura has been an exceptional partner for our petroleum needs. Their commitment to quality and timely delivery has significantly improved our operations.",
    author: "Ahmed Al-Farsi",
    company: "Gulf Energy Solutions",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=GES&backgroundColor=0B1C3F&textColor=F5A623",
    rating: 5,
  },
  {
    quote:
      "We've been sourcing minerals through Simba Ventura for over three years. Their transparent pricing and reliable supply chain have made them our preferred vendor.",
    author: "Sarah Johnson",
    company: "African Mining Corp",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=AMC&backgroundColor=0B1C3F&textColor=F5A623",
    rating: 5,
  },
  {
    quote:
      "The coal quality from Simba Ventura consistently exceeds industry standards. Their attention to detail and customer service are unmatched in the market.",
    author: "Rajiv Mehta",
    company: "Power Generation Ltd",
    logo: "https://api.dicebear.com/7.x/initials/svg?seed=PGL&backgroundColor=0B1C3F&textColor=F5A623",
    rating: 4,
  },
];

const Testimonials: React.FC<TestimonialsProps> = ({
  title = "What Our Clients Say",
  description = "Trusted by leading companies across the Middle East and Africa",
  testimonials = defaultTestimonials,
}) => {
  return (
    <div className="w-full py-16 bg-gray-50">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex flex-col h-full"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonial.logo}
                    alt={`${testimonial.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-[#0B1C3F]">
                    {testimonial.company}
                  </h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < (testimonial.rating || 5) ? "text-[#F5A623] fill-[#F5A623]" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[#546E7A] italic mb-4 flex-grow">
                "{testimonial.quote}"
              </p>
              <p className="text-[#0B1C3F] font-medium">{testimonial.author}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
