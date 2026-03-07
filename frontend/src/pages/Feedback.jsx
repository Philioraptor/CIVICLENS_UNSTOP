import { useState } from 'react';
import { Send, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

const Feedback = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-civic-dark mb-4">Report an Issue</h1>
        <p className="text-gray-600">Help us improve your neighborhood by reporting infrastructure issues or providing direct feedback to the city council.</p>
      </div>

      {submitted ? (
        <div className="glass-card p-12 text-center flex flex-col items-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-civic-dark mb-2">Thank you!</h2>
            <p className="text-gray-600">Your feedback has been submitted to the authorities and will be reviewed shortly.</p>
        </div>
      ) : (
        <div className="glass-card p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" required className="w-full rounded-lg border-gray-300 border p-3 focus:ring-civic-blue focus:border-civic-blue" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" required className="w-full rounded-lg border-gray-300 border p-3 focus:ring-civic-blue focus:border-civic-blue" placeholder="john@example.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Related Project</label>
                    <select className="w-full rounded-lg border-gray-300 border p-3 focus:ring-civic-blue focus:border-civic-blue bg-white">
                        <option value="">Select a project (Optional)</option>
                        <option value="1">Downtown Metro Expansion</option>
                        <option value="2">Riverside Park Renovation</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                    <select required className="w-full rounded-lg border-gray-300 border p-3 focus:ring-civic-blue focus:border-civic-blue bg-white">
                        <option value="">Select issue type</option>
                        <option value="delay">Project Delay</option>
                        <option value="safety">Safety Hazard</option>
                        <option value="noise">Noise Complaint</option>
                        <option value="general">General Feedback</option>
                    </select>
                </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea required rows="4" className="w-full rounded-lg border-gray-300 border p-3 focus:ring-civic-blue focus:border-civic-blue" placeholder="Describe the issue in detail..."></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image Evidence (Optional)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600 justify-center">
                            <span className="relative rounded-md font-medium text-civic-blue hover:text-civic-lightBlue focus-within:outline-none">
                            <span>Upload a file</span>
                            </span>
                            <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                </div>
            </div>

            <button type="submit" className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-lg">
              <Send className="w-5 h-5" /> Submit Feedback
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Feedback;
