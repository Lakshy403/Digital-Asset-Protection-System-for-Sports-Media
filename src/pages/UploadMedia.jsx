import { useRef, useState } from 'react';
import { UploadCloud, FileVideo, X, CheckCircle, Loader2 } from 'lucide-react';
import { storage, db } from '../firebase';
import { ref, uploadBytesResumable } from 'firebase/storage';
import { collection, getDocs, query, where } from 'firebase/firestore';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForBackendRecord(storagePath) {
  const deadline = Date.now() + 120000;

  while (Date.now() < deadline) {
    const snapshot = await getDocs(
      query(collection(db, 'mediaLibrary'), where('storagePath', '==', storagePath))
    );

    if (!snapshot.empty) {
      return snapshot.docs[0].data();
    }

    await sleep(2500);
  }

  throw new Error('Timed out waiting for backend analysis.');
}

function summarizeVerificationState(record) {
  const provenanceStatus = record?.provenance?.status;
  const synthStatus = record?.synthId?.status;
  const synthReasonCode = record?.synthId?.reasonCode;

  if (provenanceStatus === 'verified') {
    return 'upload provenance verified';
  }

  if (provenanceStatus === 'manual_review_required') {
    return 'upload provenance needs manual review';
  }

  if (synthStatus === 'verified') {
    return 'SynthID verified';
  }

  if (synthStatus === 'manual_verification_required') {
    if (synthReasonCode === 'node_runtime_auto_verifier_unavailable') {
      return 'manual SynthID review required because auto-verification is unavailable in this runtime';
    }

    return 'manual SynthID review required';
  }

  if (synthStatus === 'unsupported_image_format') {
    return 'SynthID unsupported for this image format';
  }

  if (synthStatus === 'not_applicable' || synthStatus === 'not_supported') {
    return 'SynthID not applicable for this asset type';
  }

  return 'provenance state recorded';
}

export default function UploadMedia() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(-1);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [pipelineMessage, setPipelineMessage] = useState('Waiting to start...');
  const fileInputRef = useRef(null);

  const steps = [
    'Uploading to Google Cloud Storage',
    'Analyzing media in Cloud Functions with Vertex AI',
    'Recording provenance and SynthID verification state',
    'Saving the audit trail to Firestore',
  ];

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPending = files.map((file) => ({
      file,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      progress: 0,
      status: 'pending',
    }));

    setPendingFiles((prev) => [...prev, ...newPending]);
  };

  const updateFile = (index, updates) => {
    setPendingFiles((prev) => prev.map((item, itemIndex) => (
      itemIndex === index ? { ...item, ...updates } : item
    )));
  };

  const uploadSingleFile = (file, index) => new Promise((resolve, reject) => {
    const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    updateFile(index, { status: 'uploading' });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        updateFile(index, { progress: Math.round(progress) });
      },
      (error) => {
        updateFile(index, { status: 'error' });
        reject(error);
      },
      async () => {
        updateFile(index, { status: 'complete', progress: 100 });
        resolve(uploadTask.snapshot.ref.fullPath);
      }
    );
  });

  const handleStartProcessing = async () => {
    if (pendingFiles.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setProcessingStep(0);
    setPipelineMessage('Uploading files to Cloud Storage...');

    const filesToProcess = pendingFiles.slice();

    try {
      for (let index = 0; index < filesToProcess.length; index += 1) {
        const fileObj = filesToProcess[index];
        if (fileObj.status !== 'pending') continue;

        const storagePath = await uploadSingleFile(fileObj.file, index);

        setProcessingStep(1);
        setPipelineMessage(`Waiting for Vertex AI analysis on ${fileObj.name}...`);

        const record = await waitForBackendRecord(storagePath);

        setProcessingStep(2);
        setPipelineMessage(
          `Verification recorded for ${fileObj.name}: ${summarizeVerificationState(record)}`
        );
        await sleep(700);

        setProcessingStep(3);
        setPipelineMessage(
          `Firestore updated for ${fileObj.name} with status ${record.status || 'Needs Review'}.`
        );
        await sleep(700);
      }

      setProcessingStep(steps.length);
      setPipelineMessage('All selected files have completed backend processing.');
    } catch (error) {
      console.error('Upload pipeline failed', error);
      setPipelineMessage(error.message || 'Backend pipeline failed.');
    }
  };

  const removeFile = (index) => {
    setPendingFiles((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Upload Media</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Upload video files or images to trigger the real Cloud Storage{' -> '}Cloud Functions{' -> '}Vertex AI pipeline.
        </p>
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
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Pending Uploads ({pendingFiles.length})</h3>

        {pendingFiles.length > 0 ? (
          <>
            <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
              {pendingFiles.map((file, idx) => (
                <div key={`${file.name}-${idx}`} className="p-4 flex items-center justify-between">
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
                        />
                      </div>
                    )}
                    <span className="text-xs font-medium text-[var(--text-secondary)] w-8 text-right">{file.progress}%</span>
                    <button
                      onClick={() => removeFile(idx)}
                      disabled={file.status === 'uploading' || isProcessing}
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
                disabled={pendingFiles.every((file) => file.status === 'complete') || isProcessing}
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
                  <div key={step} className="flex items-center gap-3">
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-[var(--border)] rounded-full shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        isCompleted ? 'text-green-500' : isCurrent ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-50'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-6 text-sm text-[var(--text-secondary)]">{pipelineMessage}</p>

            {processingStep >= steps.length && (
              <div className="mt-8 animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                  <p className="text-green-500 font-semibold mb-1">Backend Processing Complete</p>
                  <p className="text-xs text-green-400">Media is stored, analyzed, and synced to Firestore with provenance details.</p>
                </div>
                <button
                  onClick={() => {
                    setIsProcessing(false);
                    setPendingFiles([]);
                    setProcessingStep(-1);
                    setPipelineMessage('Waiting to start...');
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
