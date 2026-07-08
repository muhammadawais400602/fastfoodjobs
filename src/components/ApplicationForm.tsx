"use client";
import { useRef, useState } from "react";
import Link from "next/link";

export default function ApplicationForm() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) setFileName(files[0].name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => setSent(true), 1200);
  };

  return (
    <>
      <section className="bg-surface-container-lowest rounded-xl shadow-[0px_8px_30px_rgba(29,53,87,0.08)] border border-outline-variant/10 overflow-hidden">
        <div className="p-8 md:p-14">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Personal info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="full_name">
                  Full Name
                </label>
                <input
                  className="h-12 px-4 rounded-lg border border-outline/30 bg-surface-bright text-base outline-none focus:border-secondary-container focus:border-2 transition-all"
                  id="full_name"
                  name="full_name"
                  placeholder="John Doe"
                  required
                  type="text"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-on-surface-variant" htmlFor="email">
                  Email Address
                </label>
                <input
                  className="h-12 px-4 rounded-lg border border-outline/30 bg-surface-bright text-base outline-none focus:border-secondary-container focus:border-2 transition-all"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  required
                  type="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="phone">
                Phone Number
              </label>
              <input
                className="h-12 px-4 rounded-lg border border-outline/30 bg-surface-bright text-base outline-none focus:border-secondary-container focus:border-2 transition-all"
                id="phone"
                name="phone"
                placeholder="(555) 000-0000"
                required
                type="tel"
              />
            </div>

            {/* CV upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant">Upload CV</label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${
                  dragActive
                    ? "border-primary bg-primary-fixed"
                    : fileName
                      ? "border-outline-variant bg-primary-fixed/20"
                      : "border-outline-variant bg-surface-container hover:bg-surface-container-high"
                }`}
                onClick={() => fileInput.current?.click()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  handleFiles(e.dataTransfer.files);
                }}
              >
                <input
                  ref={fileInput}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  name="cv_upload"
                  type="file"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-[32px]">upload_file</span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-on-surface">Click to upload or drag and drop</p>
                  <p className="text-xs font-bold text-on-surface-variant mt-1">PDF, DOC, DOCX (Max. 5MB)</p>
                </div>
                {fileName && <div className="text-xs text-primary font-bold mt-2">Selected: {fileName}</div>}
              </div>
            </div>

            {/* Motivation */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-on-surface-variant" htmlFor="motivation">
                Why do you want to work here?
              </label>
              <textarea
                className="p-4 rounded-lg border border-outline/30 bg-surface-bright text-base outline-none focus:border-secondary-container focus:border-2 transition-all resize-none"
                id="motivation"
                name="motivation"
                placeholder="Tell us what makes you a great fit for the FastFoodJobs community..."
                required
                rows={4}
              ></textarea>
            </div>

            {/* Action footer */}
            <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-outline-variant/30 mt-10">
              <p className="text-xs font-bold text-on-surface-variant max-w-[300px]">
                By clicking send, you agree to our Terms and that your data will be handled according to our Privacy
                Policy.
              </p>
              <button
                className="w-full md:w-auto h-14 px-12 bg-primary text-on-primary rounded-lg text-base font-bold shadow-lg hover:shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-80"
                type="submit"
                disabled={submitting}
              >
                {submitting && !sent ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  <>
                    <span>Send Application</span>
                    <span className="material-symbols-outlined">send</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Success modal */}
      {sent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-md"></div>
          <div className="bg-surface relative rounded-2xl p-12 max-w-md w-full shadow-2xl text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-primary-fixed text-primary rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[48px]">check_circle</span>
            </div>
            <div>
              <h2 className="text-2xl md:text-[32px] font-bold leading-tight text-on-surface">Application Sent!</h2>
              <p className="text-base text-on-surface-variant mt-2">
                Thanks for applying to FastFoodJobs. The franchise owner will contact you shortly if it&apos;s a match.
              </p>
            </div>
            <Link
              href="/"
              className="w-full bg-primary text-on-primary h-12 rounded-lg text-sm font-semibold flex items-center justify-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
