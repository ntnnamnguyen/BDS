"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { submitContact } from "@/features/leads/actions";
import { LeadMockControls } from "@/features/leads/components/LeadMockControls";
import type { LeadMockUiConfig } from "@/lib/mocks/leads";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LuxuryButton } from "@/components/ui/luxury-button";

interface PrivateContactFormClientProps {
  mockConfig: LeadMockUiConfig;
  projectId?: string;
  sourcePath?: string;
}

export function PrivateContactFormClient({
  mockConfig,
  projectId,
  sourcePath,
}: PrivateContactFormClientProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const requestIdRef = useRef<string | null>(null);

  const clientAction = (formData: FormData) => {
    requestIdRef.current ??= crypto.randomUUID();
    formData.set("clientRequestId", requestIdRef.current);

    startTransition(async () => {
      try {
        const result = await submitContact(formData);

        if (result.success) {
          toast.success("Yêu cầu tư vấn đã được gửi riêng tư.");
          requestIdRef.current = null;
          formRef.current?.reset();
          setOpen(false);
          return;
        }

        toast.error(result.error);
      } catch {
        toast.error("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <LuxuryButton>Kết nối riêng tư</LuxuryButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-luxury-base border-none rounded-none p-10">
        <DialogHeader className="space-y-4">
          <DialogTitle className="font-serif text-3xl text-luxury-ink">
            Yêu cầu tư vấn
          </DialogTitle>
          <p className="font-sans text-xs text-luxury-stone leading-relaxed uppercase tracking-widest">
            Thông tin chỉ được dùng để phản hồi yêu cầu tư vấn của anh/chị.
          </p>
        </DialogHeader>

        <form
          ref={formRef}
          action={clientAction}
          className="space-y-8 mt-8"
        >
          {projectId && (
            <input type="hidden" name="projectId" value={projectId} />
          )}
          {sourcePath && (
            <input type="hidden" name="sourcePath" value={sourcePath} />
          )}

          <div className="space-y-2 group">
            <label htmlFor="private-contact-name" className="font-sans text-[10px] uppercase tracking-luxury text-luxury-stone group-focus-within:text-luxury-bronze transition-colors">
              Danh xưng & Họ tên
            </label>
            <input
              name="name"
              id="private-contact-name"
              required
              className="w-full bg-transparent border-b border-luxury-taupe py-2 focus:outline-none focus:border-luxury-bronze transition-all font-serif text-lg"
              placeholder="Anh/Chị..."
            />
          </div>

          <div className="space-y-2 group">
            <label htmlFor="private-contact-phone" className="font-sans text-[10px] uppercase tracking-luxury text-luxury-stone group-focus-within:text-luxury-bronze transition-colors">
              Phương thức liên hệ (Zalo/iMessage)
            </label>
            <input
              name="phone_number"
              id="private-contact-phone"
              type="tel"
              required
              className="w-full bg-transparent border-b border-luxury-taupe py-2 focus:outline-none focus:border-luxury-bronze transition-all font-serif text-lg"
              placeholder="090..."
            />
          </div>

          <div className="space-y-2 group">
            <label htmlFor="private-contact-message" className="font-sans text-[10px] uppercase tracking-luxury text-luxury-stone group-focus-within:text-luxury-bronze transition-colors">
              Nhu cầu cụ thể
            </label>
            <textarea
              name="message"
              id="private-contact-message"
              className="w-full bg-transparent border-b border-luxury-taupe py-2 focus:outline-none focus:border-luxury-bronze transition-all font-serif text-lg min-h-[100px] resize-none"
              placeholder="Dòng tiền, pháp lý, hay vị trí..."
            />
          </div>

          <LeadMockControls
            config={mockConfig}
            controlId="private-contact-lead-mock-outcome"
          />

          <LuxuryButton
            type="submit"
            disabled={isPending}
            className="w-full mt-4"
          >
            {isPending ? "Đang gửi..." : "Gửi yêu cầu bảo mật"}
          </LuxuryButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
