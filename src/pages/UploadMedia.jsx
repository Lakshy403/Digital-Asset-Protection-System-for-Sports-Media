import { useState, useRef } from 'react';
import { UploadCloud, FileVideo, X, CheckCircle, Loader2 } from 'lucide-react';
import { storage, db } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

export default function UploadMedia() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(-1);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [isDeepfakeTest, setIsDeepfakeTest] = useState(false);
  const fileInputRef = useRef(null);

  const steps = [
    "Uploading to Google Cloud Storage",
    "Processing in Cloud Functions...",
    "Injecting Invisible Watermark (Google SynthID)",
    "Generating Provenance Metadata Audit Log"
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Add files to state
    const newPending = files.map(file => ({
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      progress: 0,
      status: 'pending' // pending, uploading, complete, error
    }));

    setPendingFiles(prev => [...prev, ...newPending]);
  };

  const handleStartProcessing = () => {
    if (pendingFiles.length === 0) return;
    
    setIsProcessing(true);
    setProcessingStep(0); // Uploading to GCS

    // Upload files
    pendingFiles.forEach((fileObj, index) => {
      if (fileObj.status !== 'pending') return;

      const file = fileObj.file;
      const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      setPendingFiles(prev => {
        const nxt = [...prev];
        nxt[index].status = 'uploading';
        return nxt;
      });

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPendingFiles(prev => {
            const nxt = [...prev];
            nxt[index].progress = Math.round(progress);
            return nxt;
          });
        }, 
        (error) => {
          console.error("Upload failed", error);
          setPendingFiles(prev => {
            const nxt = [...prev];
            nxt[index].status = 'error';
            return nxt;
          });
        }, 
        async () => {
          // Upload complete
          setPendingFiles(prev => {
            const nxt = [...prev];
            nxt[index].status = 'complete';
            nxt[index].progress = 100;
            return nxt;
          });

          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

            // Simulate the cloud function running steps via UI for demo
            setProcessingStep(1); // Functions triggered
            await new Promise(r => setTimeout(r, 2000));
            
            setProcessingStep(2); // SynthID
            await new Promise(r => setTimeout(r, 3500));
            
            // Generate mock SynthID signature
            const synthIdSignature = `synth_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;
            const authenticityScore = isDeepfakeTest ? 15 : Math.floor(Math.random() * (100 - 85 + 1) + 85); 
            const finalStatus = isDeepfakeTest ? "Violation" : "Protected";
            
            setProcessingStep(3); // Audit log
            await new Promise(r => setTimeout(r, 1500));

            // We update/create a document in 'mediaLibrary' collection
            const isVideo = file.type.startsWith('video/');
            const metadata = {
              id: synthIdSignature, 
              filename: file.name,
              bucketPath: uploadTask.snapshot.ref.fullPath,
              downloadURL: downloadURL,
              title: file.name.replace(/\.[^/.]+$/, ""), // File name without extension
              type: isVideo ? 'Video' : 'Image',
              uploadDate: new Date().toISOString(),
              status: finalStatus,
              thumbnail: isVideo ? "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop" : downloadURL, 
              size: fileObj.size, 
              synthIdSignature: synthIdSignature,
              authenticityScore: authenticityScore,
              auditTrail: [
                { 
                  step: "Uploaded to Google Cloud Storage bucket",
                  timestamp: new Date(Date.now() - 4000).toISOString(),
                  status: "success"
                },
                { 
                  step: isDeepfakeTest ? "Vertex AI Deepfake Scanner / Threat Detection" : "SynthID invisible watermark injected (Vertex AI)",
                  timestamp: new Date(Date.now() - 2000).toISOString(),
                  signature: isDeepfakeTest ? null : synthIdSignature,
                  status: isDeepfakeTest ? "failed" : "success",
                  errorDetails: isDeepfakeTest ? "Generative adversarial artifacts detected across 84% of frames. Fingerprint failed." : null
                },
                { 
                  step: "Asset hash registered in BigQuery Ledger",
                  timestamp: new Date().toISOString(),
                  status: "success"
                }
              ]
            };

            await addDoc(collection(db, "mediaLibrary"), metadata);

            setProcessingStep(4); // Fully Complete
          } catch (err) {
             console.error("Local pipeline error", err);
          }
        }
      );
    });
  };

  const removeFile = (index) => {
    setPendingFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Upload Media</h1>
        <p className="text-sm text-[var(--text-secondary)]">Upload video files or images to start monitoring for unauthorized usage.</p>
      </div>

      <div className="mt-8">
        <div 
          className="border-2 border-dashed border-[var(--border)] rounded-2xl p-12 text-center hover:bg-[var(--surface)] transition-colors cursor-pointer group bg-[var(--background)]"
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            multiple 
            accept="video/*,image/*" 
          />
          <div className="w-20 h-20 mx-auto bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-10 h-10 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Drag & drop your files here</h3>
          <p className="text-[var(--text-secondary)] mb-6">Or click to browse from your computer (MP4, AVI, MOV, JPG up to 2GB)</p>
          <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors pointer-events-none">
            Select Files
          </button>
        </div>
        
        <div className="flex items-center gap-3 mt-4 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-xl group/toggle cursor-pointer" onClick={() => setIsDeepfakeTest(!isDeepfakeTest)}>
          <div className="relative flex items-center">
            <input type="checkbox" id="deepfake-test" checked={isDeepfakeTest} readOnly className="sr-only" />
            <div className={`block w-10 h-6 rounded-full transition-colors ${isDeepfakeTest ? 'bg-red-500' : 'bg-[var(--border)]'}`}></div>
            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isDeepfakeTest ? 'translate-x-4' : 'translate-x-0'}`}></div>
          </div>
          <label htmlFor="deepfake-test" className="text-sm font-medium text-[var(--text-primary)] cursor-pointer group-hover/toggle:text-indigo-400 transition-colors">
            Run in <span className="text-red-400 font-bold">Malicious Tester</span> Mode (Simulate Vertex AI Deepfake Engine Alert)
          </label>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pending Uploads ({pendingFiles.length})</h3>
        
        {pendingFiles.length > 0 ? (
          <>
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
              {pendingFiles.map((file, idx) => (
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
                    {file.status === 'error' ? (
                      <span className="text-red-500 text-xs">Error</span>
                    ) : (
                      <div className="flex-1 bg-[var(--background)] rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${file.status === 'complete' ? 'bg-green-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${file.progress}%` }}
                        ></div>
                      </div>
                    )}
                    <span className="text-xs font-medium text-[var(--text-secondary)] w-8 text-right">{file.progress}%</span>
                    <button 
                      onClick={() => removeFile(idx)}
                      disabled={file.status === 'uploading'}
                      className="text-[var(--text-secondary)] hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button 
                onClick={handleStartProcessing}
                disabled={pendingFiles.every(f => f.status === 'complete') || isProcessing}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Start Processing Pipeline
              </button>
            </div>
          </>
        ) : (
          <div className="text-[var(--text-secondary)] text-sm border border-[var(--border)] rounded-xl p-8 text-center bg-[var(--surface)]">
            No files selected yet.
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              GCP Backend Pipeline
            </h3>
            
            <div className="space-y-4">
              {steps.map((step, index) => {
                const isCompleted = processingStep > index;
                const isCurrent = processingStep === index;

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
              <div className="mt-8 animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                  <p className="text-green-500 font-semibold mb-1">Protection Validated</p>
                  <p className="text-xs text-green-400">Media is successfully stored and registered in Firestore.</p>
                </div>
                <button 
                  onClick={() => {
                    setIsProcessing(false);
                    setPendingFiles([]); // Clear queue on finish
                  }}
                  className="mt-4 w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--border)] rounded-lg font-medium transition-colors"
                >
                  Close & View Library
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
