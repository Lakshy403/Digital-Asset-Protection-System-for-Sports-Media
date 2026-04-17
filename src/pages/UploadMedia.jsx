import { useState, useEffect } from 'react';
import { UploadCloud, FileVideo, X, CheckCircle, Loader2 } from 'lucide-react';

export default function UploadMedia() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(-1);

  const steps = [
    "Injecting Invisible Watermark (Google SynthID)",
    "Scanning for Deepfake Artifacts (Vertex AI)",
    "Encrypting for Media CDN",
    "Registering Metadata in BigQuery"
  ];

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setProcessingStep(0);
  };

  useEffect(() => {
    if (processingStep >= 0 && processingStep < steps.length) {
      const timer = setTimeout(() => {
        setProcessingStep(prev => prev + 1);
      }, 1500); // simulate 1.5s per step
      return () => clearTimeout(timer);
    }
  }, [processingStep]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Upload Media</h1>
        <p className="text-sm text-[var(--text-secondary)]">Upload video files or images to start monitoring for unauthorized usage.</p>
      </div>

      <div className="mt-8">
        <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-12 text-center hover:bg-[var(--surface)] transition-colors cursor-pointer group bg-[var(--background)]">
          <div className="w-20 h-20 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Drag & drop your files here</h3>
          <p className="text-[var(--text-secondary)] mb-6">Or click to browse from your computer (MP4, AVI, MOV up to 2GB)</p>
          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
            Select Files
          </button>
        </div>
      </div>

      {/* Dummy File Preview */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pending Uploads</h3>
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
          {[
            { name: 'NBA_Finals_Highlights.mp4', size: '245 MB', progress: 100 },
            { name: 'Player_Interview_04.mov', size: '1.2 GB', progress: 45 },
          ].map((file, idx) => (
            <div key={idx} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[var(--background)] rounded-lg flex items-center justify-center text-[var(--text-secondary)]">
                  <FileVideo className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{file.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{file.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-1/3">
                <div className="flex-1 bg-[var(--background)] rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${file.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-[var(--text-secondary)] w-8 text-right">{file.progress}%</span>
                <button className="text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <button 
            onClick={handleStartProcessing}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            Start Processing Uploads
          </button>
        </div>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              Processing Pipeline
            </h3>
            
            <div className="space-y-4">
              {steps.map((step, index) => {
                const isCompleted = processingStep > index;
                const isCurrent = processingStep === index;
                const isPending = processingStep < index;

                return (
                  <div key={index} className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0"></div>
                    ) : (
                      <div className="w-5 h-5 border-2 border-[var(--border)] rounded-full shrink-0"></div>
                    )}
                    <span 
                      className={`text-sm font-medium ${
                        isCompleted ? 'text-green-500' 
                        : isCurrent ? 'text-[var(--text-primary)]' 
                        : 'text-[var(--text-secondary)] opacity-50'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            {processingStep >= steps.length && (
              <div className="mt-8">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                  <p className="text-green-500 font-semibold mb-1">Processing Complete!</p>
                  <p className="text-xs text-green-400">Assets are now protected and monitored.</p>
                </div>
                <button 
                  onClick={() => setIsProcessing(false)}
                  className="mt-4 w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)] rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
