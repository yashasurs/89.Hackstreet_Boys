import React from "react";
import Link from "next/link";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-[#2f3136] rounded-xl shadow-lg p-6 border border-[#202225] transition-all duration-300 hover:bg-[#36393f] hover:shadow-xl hover:-translate-y-1">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-[#8e6bff] mb-3">{title}</h3>
      <p className="text-sm text-[#dcddde]">{description}</p>
    </div>
  );
}

// Type for the TestimonialCard props
interface TestimonialProps {
  text: string;
  author: string;
  role: string;
}

function TestimonialCard({ text, author, role }: TestimonialProps) {
  return (
    <div className="bg-[#2f3136] rounded-xl p-6 border border-[#202225] hover:shadow-lg transition-all duration-300">
      <div className="mb-4 text-[#dcddde] italic relative">
        <span className="absolute -left-3 -top-3 text-2xl text-[#8e6bff]">"</span>
        <p className="pl-3">{text}</p>
        <span className="absolute -bottom-5 right-0 text-2xl text-[#8e6bff]">"</span>
      </div>
      <div className="flex items-center mt-6 pt-4 border-t border-[#40444b]">
        <div className="w-12 h-12 bg-[#8e6bff] rounded-full flex items-center justify-center text-white font-bold text-lg">
          {author.charAt(0)}
        </div>
        <div className="ml-4">
          <p className="font-medium text-white">{author}</p>
          <p className="text-xs text-[#b9bbbe]">{role}</p>
        </div>
      </div>
    </div>
  );
}

// Steps component
interface StepProps {
  number: number;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex items-start group">
      <div className="bg-[#8e6bff] rounded-full w-10 h-10 flex items-center justify-center mr-4 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        <span className="font-bold text-white">{number}</span>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#8e6bff] transition-colors duration-300">{title}</h3>
        <p className="text-[#b9bbbe]">{description}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#36393f] text-white">
      {/* Navigation */}
      <nav className="bg-[#202225] sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-[#8e6bff]">BrightMind</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link href="/features" className="text-[#dcddde] hover:text-white transition">Features</Link>
            <Link href="/pricing" className="text-[#dcddde] hover:text-white transition">Pricing</Link>
            <Link href="/about" className="text-[#dcddde] hover:text-white transition">About</Link>
            <Link href="/contact" className="text-[#dcddde] hover:text-white transition">Contact</Link>
          </div>
          <div>
            <Link href="/login">
              <button className="px-4 py-2 bg-[#8e6bff] hover:bg-[#7b5cff] text-white font-medium rounded-md transition">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-[#2f3136] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8e6bff]/30 to-transparent opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 pt-20 pb-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-[#8e6bff]">BrightMind</span>
            </h1>
            <p className="text-lg md:text-xl text-[#dcddde] max-w-2xl mx-auto mb-10">
              Your smart learning companion for students in rural India. Discover new topics, receive clear explanations, and test your knowledge — all in your preferred language.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/explore">
                <button className="px-8 py-4 bg-[#8e6bff] hover:bg-[#7b5cff] text-white font-bold rounded-md transition shadow-lg shadow-[#8e6bff]/20">
                  Start Learning
                </button>
              </Link>
              <Link href="/about">
                <button className="px-8 py-4 bg-[#36393f] border border-[#8e6bff] text-[#8e6bff] font-bold rounded-md hover:bg-[#2f3136] transition">
                  How It Works
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-[#36393f] to-transparent"></div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Features That Make Learning Fun</h2>
            <div className="w-24 h-1 bg-[#8e6bff] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🎧" 
              title="Interactive Audio Learning" 
              description="Ask questions with your voice and listen to clear, child-friendly explanations tailored to your learning style."
            />
            <FeatureCard 
              icon="🧠" 
              title="Adaptive Curriculum" 
              description="Our AI personalizes content to match your learning pace and style, ensuring better comprehension and retention."
            />
            <FeatureCard 
              icon="🌍" 
              title="Multiple Languages" 
              description="Learn in Hindi, English, Tamil, and more regional languages to make quality education accessible for everyone."
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#2f3136] py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-[#8e6bff] mb-2">10K+</div>
              <p className="text-[#b9bbbe]">Active Students</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#8e6bff] mb-2">500+</div>
              <p className="text-[#b9bbbe]">Learning Modules</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#8e6bff] mb-2">8</div>
              <p className="text-[#b9bbbe]">Languages</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-[#8e6bff] mb-2">95%</div>
              <p className="text-[#b9bbbe]">Student Satisfaction</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How BrightMind Works</h2>
          <div className="w-24 h-1 bg-[#8e6bff] mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-[#2f3136] rounded-xl p-6 border border-[#202225] shadow-xl">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-[#202225] flex items-center justify-center">
                {/* Placeholder for an image/illustration */}
                <div className="relative z-10 text-8xl">📚</div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#8e6bff]/20 to-transparent"></div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="space-y-8">
              <Step 
                number={1}
                title="Choose a Subject"
                description="Select from Math, Science, History and more to begin your personalized learning journey."
              />
              <Step 
                number={2}
                title="Learn at Your Pace"
                description="Read or listen to simple explanations that break down complex concepts into easy-to-understand steps."
              />
              <Step 
                number={3}
                title="Test Your Knowledge"
                description="Take engaging quizzes to reinforce what you've learned and earn badges for your achievements."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-[#2f3136] py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
            <div className="w-24 h-1 bg-[#8e6bff] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              text="BrightMind helped me understand difficult math concepts through simple examples. Now I enjoy solving problems instead of being afraid of them!" 
              author="Priya S."
              role="Class 8 Student, Bangalore"
            />
            <TestimonialCard 
              text="I love that I can learn in Hindi. The voice feature is very helpful when I'm not sure how to read something. It feels like having a teacher at home." 
              author="Rahul M."
              role="Class 6 Student, Jaipur"
            />
            <TestimonialCard 
              text="The quizzes are fun and challenging. I can see how much I'm improving every week! My parents are amazed at how much I've learned." 
              author="Anjali K."
              role="Class 7 Student, Chennai"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-[#36393f] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8e6bff]/20 to-transparent opacity-30"></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
            <p className="text-xl text-[#dcddde] max-w-2xl mx-auto mb-10">
              Join thousands of students across India who are learning and growing with BrightMind every day.
            </p>
            <Link href="/register">
              <button className="px-10 py-4 bg-[#8e6bff] hover:bg-[#7b5cff] text-white font-bold rounded-md text-lg transition shadow-lg shadow-[#8e6bff]/20">
                Create Free Account
              </button>
            </Link>
            <p className="mt-6 text-[#b9bbbe]">No credit card required. Start learning today.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#202225] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-[#8e6bff] mb-4">BrightMind</h2>
              <p className="text-[#b9bbbe] mb-6">Making quality education accessible for all students across rural India.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-[#b9bbbe] hover:text-white transition">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-[#b9bbbe] hover:text-white transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-[#b9bbbe] hover:text-white transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Features</Link></li>
                <li><Link href="/subjects" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Subjects</Link></li>
                <li><Link href="/languages" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Languages</Link></li>
                <li><Link href="/resources" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Resources</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">About Us</Link></li>
                <li><Link href="/team" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Our Team</Link></li>
                <li><Link href="/careers" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Careers</Link></li>
                <li><Link href="/contact" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Terms of Service</Link></li>
                <li><Link href="/accessibility" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Accessibility</Link></li>
                <li><Link href="/cookies" className="text-[#b9bbbe] hover:text-[#8e6bff] transition">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#40444b] mt-12 pt-8 text-center text-[#72767d]">
            <p>© 2025 BrightMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}