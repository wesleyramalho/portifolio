"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useSectionContext } from "@/contexts/SectionContext";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { FormInput, FormTextarea } from "@/components/ui/FormInput";
import RecaptchaProvider from "@/components/ui/RecaptchaProvider";
import { useEntranceAnimation } from "@/hooks/useEntranceAnimation";
import { contactSchema } from "@/lib/contact-schema";

type FormStatus = "idle" | "confirming" | "loading" | "success" | "error";
type FieldName = "name" | "email" | "message";

const COUNTDOWN_SECONDS = 5;

export default function Contact() {
  const { isActive } = useSectionContext();
  // Only load reCAPTCHA script after Contact becomes active for the first time
  const [enableRecaptcha, setEnableRecaptcha] = useState(false);

  useEffect(() => {
    if (isActive) setEnableRecaptcha(true);
  }, [isActive]);

  if (enableRecaptcha) {
    return (
      <RecaptchaProvider>
        <ContactInner />
      </RecaptchaProvider>
    );
  }

  return <ContactInner />;
}

function ContactInner() {
  const { isActive } = useSectionContext();
  const t = useTranslations("contact");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<FieldName, string>>
  >({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>(
    {},
  );

  const abortRef = useRef<AbortController | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const hasSentRef = useRef(false);

  useEntranceAnimation(".contact-item", isActive);

  useEffect(() => () => stopCountdown(), []);

  function getFieldValue(field: FieldName): string {
    if (field === "name") return name;
    if (field === "email") return email;
    return message;
  }

  function mapZodError(field: FieldName, code: string): string {
    if (code === "too_small") return t("errorRequired");
    if (field === "email" && code === "invalid_string") return t("errorEmail");
    if (field === "name" && code === "invalid_string") return t("errorName");
    return t("errorRequired");
  }

  const validateField = useCallback(
    (field: FieldName) => {
      const value = field === "name" ? name : field === "email" ? email : message;
      const result = contactSchema.shape[field].safeParse(value);

      if (!result.success) {
        const code = result.error.issues[0].code;
        setFieldErrors((prev) => ({ ...prev, [field]: mapZodError(field, code) }));
      } else {
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [name, email, message],
  );

  function handleBlur(field: FieldName) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  }

  function handleChange(field: FieldName, value: string) {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else setMessage(value);

    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function stopCountdown() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function startCountdown() {
    stopCountdown();
    hasSentRef.current = false;
    startTimeRef.current = Date.now();
    setCountdown(COUNTDOWN_SECONDS);

    timerRef.current = setInterval(() => {
      const remaining = Math.max(
        0,
        COUNTDOWN_SECONDS -
          Math.floor((Date.now() - startTimeRef.current) / 1000),
      );
      setCountdown(remaining);
      if (remaining <= 0) {
        stopCountdown();
        if (!hasSentRef.current) {
          hasSentRef.current = true;
          sendEmail();
        }
      }
    }, 250);
  }

  async function sendEmail() {
    setStatus("loading");
    abortRef.current = new AbortController();

    try {
      let recaptchaToken = "";
      if (executeRecaptcha) {
        recaptchaToken = await executeRecaptcha("contact");
      }

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          recaptchaToken,
          ...(honeypot && { company: honeypot }),
        }),
        signal: abortRef.current.signal,
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
        setTouched({});
        setFieldErrors({});
      } else {
        setStatus("error");
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setStatus("error");
      }
    }
  }

  function validate(): boolean {
    setTouched({ name: true, email: true, message: true });

    const result = contactSchema.safeParse({ name, email, message });
    if (result.success) {
      setFieldErrors({});
      return true;
    }

    const errors: Partial<Record<FieldName, string>> = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as FieldName;
      if (!errors[field]) {
        errors[field] = mapZodError(field, issue.code);
      }
    }
    setFieldErrors(errors);
    return false;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Honeypot: silently fake success
    if (honeypot) {
      setStatus("success");
      return;
    }

    if (!validate()) return;
    setStatus("confirming");
    startCountdown();
  }

  function handleCancel() {
    stopCountdown();
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setStatus("idle");
  }

  const isDisabled = status === "loading" || status === "confirming";

  return (
    <section
      id="contact"
      className="h-svh px-8 md:px-16 overflow-y-auto"
      role="region"
      aria-label="Contact"
      aria-roledescription="slide"
    >
      <div className="max-w-2xl mx-auto w-full pt-24 pb-28 md:pt-28 md:pb-16">
        <SectionHeading>{t("title")}</SectionHeading>
        <p className="contact-item font-sans text-body text-zinc-400 mb-8 -mt-6">
          {t("subtitle")}
        </p>

        <div className="contact-item mb-3 flex justify-start">
          <a
            href="https://resend.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 1800 1800"
              fill="none"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1000.46 450C1174.77 450 1278.43 553.669 1278.43 691.282C1278.43 828.896 1174.77 932.563 1000.46 932.563H912.382L1350 1350H1040.82L707.794 1033.48C683.944 1011.47 672.936 985.781 672.935 963.765C672.935 932.572 694.959 905.049 737.161 893.122L908.712 847.244C973.85 829.812 1018.81 779.353 1018.81 713.298C1018.8 632.567 952.745 585.78 871.095 585.78H450V450H1000.46Z"
                fill="currentColor"
              />
            </svg>
            <span
              className="font-sans"
              style={{ fontSize: "11px" }}
            >
              Powered by Resend
            </span>
          </a>
        </div>

        <GlassCard className="contact-item relative overflow-hidden p-8">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="19"
                  stroke="currentColor"
                  strokeOpacity="0.3"
                  strokeWidth="1.5"
                  className="text-white"
                />
                <path
                  d="M12 20.5l6 6 10-12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                />
              </svg>
              <p className="font-sans font-semibold text-body text-zinc-100">
                {t("successTitle")}
              </p>
              <p className="font-sans text-label text-zinc-400">
                {t("successSubtitle")}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col gap-5"
            >
              {/* Honeypot — hidden from real users, bots fill it */}
              <input
                type="text"
                name="company"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                autoComplete="off"
                tabIndex={-1}
                aria-hidden="true"
                className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
              />

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-name"
                  className="font-mono tracking-wide text-label text-zinc-400"
                >
                  {t("name")}
                </label>
                <FormInput
                  id="contact-name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder={t("namePlaceholder")}
                  value={name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  disabled={isDisabled}
                  hasError={!!fieldErrors.name}
                  aria-invalid={!!fieldErrors.name}
                  aria-errormessage={fieldErrors.name ? "error-name" : undefined}
                />
                {fieldErrors.name && (
                  <p
                    id="error-name"
                    role="alert"
                    className="font-mono text-label text-red-400"
                  >
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-email"
                  className="font-mono tracking-wide text-label text-zinc-400"
                >
                  {t("email")}
                </label>
                <FormInput
                  id="contact-email"
                  type="email"
                  required
                  maxLength={254}
                  pattern="^\S+@\S+$"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  disabled={isDisabled}
                  hasError={!!fieldErrors.email}
                  aria-invalid={!!fieldErrors.email}
                  aria-errormessage={
                    fieldErrors.email ? "error-email" : undefined
                  }
                />
                {fieldErrors.email && (
                  <p
                    id="error-email"
                    role="alert"
                    className="font-mono text-label text-red-400"
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="contact-message"
                  className="font-mono tracking-wide text-label text-zinc-400"
                >
                  {t("message")}
                </label>
                <FormTextarea
                  id="contact-message"
                  required
                  maxLength={2000}
                  rows={5}
                  placeholder={t("messagePlaceholder")}
                  value={message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onBlur={() => handleBlur("message")}
                  disabled={isDisabled}
                  hasError={!!fieldErrors.message}
                  aria-invalid={!!fieldErrors.message}
                  aria-errormessage={
                    fieldErrors.message ? "error-message" : undefined
                  }
                />
                {fieldErrors.message && (
                  <p
                    id="error-message"
                    role="alert"
                    className="font-mono text-label text-red-400"
                  >
                    {fieldErrors.message}
                  </p>
                )}
              </div>

              {status === "error" && (
                <p className="font-mono text-label text-red-400" role="alert">
                  {t("error")}
                </p>
              )}

              <div className="flex items-center justify-end gap-3">
                {(status === "confirming" || status === "loading") && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="font-mono tracking-wide text-label text-zinc-400 hover:text-white transition-colors bg-transparent border-0 p-0 cursor-pointer"
                  >
                    {t("cancel")}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="font-mono tracking-widest uppercase text-label text-white bg-white/10 border border-white/20 rounded-md px-6 py-2.5 hover:bg-white/20 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 min-w-[160px] justify-center"
                >
                  {status === "loading" ? (
                    <>
                      <span
                        className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      {t("sending")}
                    </>
                  ) : status === "confirming" ? (
                    t("sendingIn", { seconds: countdown })
                  ) : (
                    t("send")
                  )}
                </button>
              </div>
            </form>
          )}

          {status === "confirming" && (
            <div
              className="absolute bottom-0 left-0 h-0.5 bg-white/40 transition-[width] duration-300 ease-linear"
              style={{ width: `${(countdown / COUNTDOWN_SECONDS) * 100}%` }}
              aria-hidden="true"
            />
          )}
        </GlassCard>


      </div>
    </section>
  );
}
