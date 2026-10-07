'use client';
import React, { useRef, useTransition } from 'react'; // Thay useState bằng useTransition
import { motion } from 'framer-motion';
import {
  Headphones, Music, MessageCircle, ShieldCheck,
  Mail, Phone, ArrowUpRight
} from 'lucide-react';
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Hoặc alert/toast tùy bạn dùng

// Import action đã tạo
import { submitContact } from "@/features/leads/actions";
import { LeadMockControls } from "@/features/leads/components/LeadMockControls";
import type { LeadMockUiConfig } from "@/lib/mocks/leads";

interface ContactPageClientProps {
  mockConfig: LeadMockUiConfig;
}

export function ContactPageClient({ mockConfig }: ContactPageClientProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const requestIdRef = useRef<string | null>(null);

  const socialLinks = [
    { name: 'LinkedIn', icon: <Headphones className="w-5 h-5" />, url: '#', color: 'hover:text-blue-600' },
    { name: 'Zalo', icon: <MessageCircle className="w-5 h-5" />, url: '#', color: 'hover:text-blue-500' },
    { name: 'Facebook', icon: <Music className="w-5 h-5" />, url: '#', color: 'hover:text-blue-700' },
  ];

  // Hàm xử lý Form
  const clientAction = async (formData: FormData) => {
    requestIdRef.current ??= crypto.randomUUID();
    formData.set('clientRequestId', requestIdRef.current);

    startTransition(async () => {
      try {
        const result = await submitContact(formData);

        if (result.success) {
          toast.success("Thông tin của bạn đã được gửi riêng tư đến tôi.");
          requestIdRef.current = null;
          formRef.current?.reset();
        } else {
          toast.error(result.error || "Có lỗi xảy ra, vui lòng thử lại.");
        }
      } catch {
        toast.error("Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.");
      }
    });
  };

  return (
    <section className="min-h-screen bg-[#0A0A0A] text-white py-24 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-luxury-bronze/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

        {/* CỘT TRÁI: THÔNG TIN KẾT NỐI (Giữ nguyên) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-serif leading-tight">
              Kết nối <br />
              <span className="text-luxury-bronze italic">Riêng tư</span>
            </h1>
            <p className="text-white/50 font-light text-lg max-w-md leading-relaxed">
              Mọi cuộc đối thoại về đầu tư và bất động sản đều cần sự bảo mật tuyệt đối. Hãy để lại lời nhắn, tôi sẽ trực tiếp phản hồi bạn.
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-bold">Mạng xã hội cá nhân</p>
            <div className="flex gap-6">
              <TooltipProvider delayDuration={200}>
                <div className="flex gap-6">
                  {socialLinks.map((social) => (
                    <Tooltip key={social.name}>
                      <TooltipTrigger asChild>
                        <a href={social.url} target="_blank" rel="noopener noreferrer" className={`p-4 border border-white/10 rounded-full transition-all duration-300 hover:bg-white hover:border-white group ${social.color}`}>
                          <div className="group-hover:scale-110 transition-transform text-white group-hover:text-black">
                            {social.icon}
                          </div>
                        </a>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="bg-white text-black text-[10px] uppercase tracking-widest font-bold border-none rounded-none px-3 py-1.5">
                        <p>{social.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </div>
          </div>

          <div className="space-y-6 pt-8 border-t border-white/10">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-luxury-bronze/20 transition-colors">
                <Mail className="w-5 h-5 text-luxury-bronze" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Email trực tiếp</p>
                <p className="text-lg font-light">contact@hanoiestate.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-luxury-bronze/20 transition-colors">
                <Phone className="w-5 h-5 text-luxury-bronze" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/30">Hotline cá nhân</p>
                <p className="text-lg font-light">+84 90 123 4567</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CỘT PHẢI: FORM ĐĂNG KÝ (Đã tích hợp Action) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-[#111] p-8 md:p-12 border border-white/5 shadow-2xl relative z-10">
            {/* Thêm id và thay action */}
            <form ref={formRef} action={clientAction} className="space-y-8">
              <input type="hidden" name="sourcePath" value="/contact" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label htmlFor="contact-name" className="text-[10px] uppercase tracking-widest text-white/50 ml-1">Danh xưng</label>
                  <Input
                    id="contact-name"
                    name="name"
                    required
                    placeholder="Quý khách tên là..."
                    className="bg-transparent border-0 border-b border-white/10 rounded-none focus-visible:ring-0 focus-visible:border-luxury-bronze h-12 px-0 text-lg font-light transition-all text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-phone" className="text-[10px] uppercase tracking-widest text-white/50 ml-1">Số điện thoại (Zalo)</label>
                  <Input
                    id="contact-phone"
                    name="phone_number"
                    type="tel"
                    required
                    placeholder="090 ··· ····"
                    className="bg-transparent border-0 border-b border-white/10 rounded-none focus-visible:ring-0 focus-visible:border-luxury-bronze h-12 px-0 text-lg font-light transition-all text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="contact-message" className="text-[10px] uppercase tracking-widest text-white/50 ml-1">Nội dung quan tâm</label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="Yêu cầu riêng tư của bạn về dự án..."
                  className="bg-transparent border-0 border-b border-white/10 rounded-none focus-visible:ring-0 focus-visible:border-luxury-bronze min-h-[120px] px-0 text-lg font-light resize-none transition-all text-white"
                />
              </div>

              <LeadMockControls
                config={mockConfig}
                controlId="contact-lead-mock-outcome"
                theme="dark"
              />

              {/* THÔNG BÁO BẢO MẬT (Giữ nguyên thiết kế) */}
              <div className="flex gap-4 p-4 bg-luxury-bronze/5 border border-luxury-bronze/20 rounded-sm">
                <ShieldCheck className="w-6 h-6 text-luxury-bronze shrink-0" />
                <p className="text-[11px] text-white/60 font-light leading-relaxed italic">
                  <span className="text-luxury-bronze font-bold uppercase tracking-tighter mr-1">Cam kết bảo mật:</span>
                  Thông tin chỉ được sử dụng để phản hồi yêu cầu tư vấn và không
                  được chia sẻ cho bên thứ ba ngoài mục đích này.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-white hover:bg-luxury-bronze text-black hover:text-white h-16 rounded-none uppercase tracking-[0.3em] text-xs font-bold transition-all duration-500 group"
              >
                {isPending ? 'Đang gửi thông tin...' : 'Gửi yêu cầu kết nối'}
                <ArrowUpRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Button>
            </form>
          </div>

          {/* Trang trí: Khung viền chạy sau Card */}
          <div className="absolute -top-4 -right-4 w-full h-full border border-luxury-bronze/20 -z-0" />
        </motion.div>

      </div>
    </section>
  );
}
