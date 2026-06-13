"use client";
import { Calendar, Mail, ArrowUpRight } from "lucide-react";
import { FaLinkedin, FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full max-w-4xl mx-auto px-6 sm:px-8 pb-12 pt-20 border-t border-gray-200 dark:border-gray-800/50 mt-20 flex flex-col gap-8">
      
      <h3 className="text-xs font-mono text-gray-500 tracking-widest uppercase mb-2">Let's Work Together</h3>

      {/* 2-Column Bento Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Card: Get in Touch */}
        <div className="flex flex-col gap-6 p-8 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <div>
            <h4 className="text-xl font-bold mb-2 text-black dark:text-white">Get in Touch</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Choose your preferred method to connect and let's discuss your project.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* Note: Update the href below when you have a Calendly or booking link */}
            <a href="#" className="flex items-center justify-between p-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all group">
              <div className="flex items-center gap-4">
                <Calendar className="text-gray-500" size={20} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black dark:text-gray-200">Schedule a free call</span>
                  <span className="text-xs text-gray-500 font-mono">30-minute strategy session</span>
                </div>
              </div>
              <ArrowUpRight className="text-gray-600 group-hover:text-white transition-colors" size={16} />
            </a>

            <a href="mailto:shaunaksmnt@gmail.com" className="flex items-center justify-between p-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all group">
              <div className="flex items-center gap-4">
                <Mail className="text-gray-500" size={20} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black dark:text-gray-200">Email Me</span>
                  <span className="text-xs text-gray-500 font-mono">Quick inquiries & questions</span>
                </div>
              </div>
              <ArrowUpRight className="text-gray-600 group-hover:text-white transition-colors" size={16} />
            </a>

            <a href="https://in.linkedin.com/in/shaunak-samanta-87022a261" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl hover:border-gray-400 dark:hover:border-gray-600 transition-all group">
              <div className="flex items-center gap-4">
                <FaLinkedin className="text-gray-500" size={20} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-black dark:text-gray-200">Connect on LinkedIn</span>
                  <span className="text-xs text-gray-500 font-mono">Follow for updates & insights</span>
                </div>
              </div>
              <ArrowUpRight className="text-gray-600 group-hover:text-white transition-colors" size={16} />
            </a>
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-auto">Response within 24 hours • Available for hire</p>
        </div>

        {/* Right Card: Send a Message Form */}
        <div className="flex flex-col gap-6 p-8 bg-gray-50 dark:bg-[#0d0d0d] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm">
          <div>
            <h4 className="text-xl font-bold mb-2 text-black dark:text-white">Send a Message</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Prefer to write? Fill out the form and I'll get back to you within 24 hours.
            </p>
          </div>

          <form className="flex flex-col gap-3 flex-grow" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Full Name" className="w-full p-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 text-black dark:text-white" />
            <input type="email" placeholder="Email Address" className="w-full p-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 text-black dark:text-white" />
            <textarea placeholder="Your Message" rows={4} className="w-full p-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-500 resize-none text-black dark:text-white"></textarea>
            
            <button className="w-full py-3 mt-auto bg-black dark:bg-[#ededed] text-white dark:text-black font-semibold rounded-xl hover:opacity-80 transition-opacity flex items-center justify-center gap-2">
              Send Message <ArrowUpRight size={18} />
            </button>
          </form>
        </div>

      </div>

    {/* Quote Section */}
      <div className="p-6 bg-gray-100 dark:bg-[#151515] border border-gray-200 dark:border-gray-800 rounded-xl flex items-start gap-4">
        <span className="text-gray-400 dark:text-gray-500 text-2xl leading-none font-serif">"</span>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-mono text-gray-800 dark:text-gray-300">The luck of having talent is not enough; one must also have a talent for luck.</p>
          <span className="text-xs text-gray-500">• Hector Berlioz</span>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-500">
        <p>© 2026 Shaunak. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Showcase</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="https://in.linkedin.com/in/shaunak-samanta-87022a261" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <FaLinkedin size={16} />
          </a>
          <a href="#" className="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <FaTwitter size={16} />
          </a>
          <a href="mailto:shaunaksmnt@gmail.com" className="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <Mail size={16} />
          </a>
          <a href="https://github.com/shai-tan1" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white cursor-pointer transition-colors">
            <FaGithub size={16} />
          </a>
        </div>
      </div>

    </footer>
  );
}