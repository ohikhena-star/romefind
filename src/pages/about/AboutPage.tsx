import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Compass, BookOpen, Layers, CheckCircle } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-surface-950 min-h-screen transition-colors pb-24">
      {/* Header */}
      <div className="bg-surface-50 dark:bg-surface-900 py-16 md:py-24 border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-white mb-6">
            How ROMEfind Works
          </h1>
          <p className="text-xl text-surface-600 dark:text-surface-300">
            We're building the discovery engine for opportunities. Not just a job board, but a tool to expand what you think is possible.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-24">
        
        {/* Step 1 */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-2xl bg-rome-100 dark:bg-rome-900/30 text-rome-600 flex items-center justify-center flex-shrink-0 mt-1">
            <Compass size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">1. Discover adjacencies</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-4 leading-relaxed">
              If you're looking for a software engineering internship, you might also be a great fit for an open-source grant, an innovation fellowship, or a tech-for-good hackathon. We show you these parallel paths.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
            <Layers size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">2. Understand & Compare</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-4 leading-relaxed">
              Opportunities are broken down into structured data: eligibility requirements, funding amounts, time commitments, and deadlines. Compare options side-by-side to find the highest leverage path for you.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center flex-shrink-0 mt-1">
            <BookOpen size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">3. Prepare & Learn</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 mb-4 leading-relaxed">
              Found a goal but missing a requirement? We link opportunities directly to the resources you need to bridge the gap. Turn a rejection into a roadmap.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-surface-100 dark:bg-surface-900 rounded-3xl p-8 md:p-12 text-center border border-surface-200 dark:border-surface-800">
          <h2 className="text-3xl font-bold text-surface-900 dark:text-white mb-4">Ready to start discovering?</h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-xl mx-auto">
            Join ROMEfind today and start building your custom pipeline of possibilities.
          </p>
          <Link to="/signup">
            <Button variant="primary" size="lg">
              Create an account
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
