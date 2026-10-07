import { SectionHeading } from "@/components/ui/section-heading";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-luxury-base pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeading 
          subtitle="Legal Notice" 
          title="Tuyên bố Miễn trừ Trách nhiệm" 
        />
        
        <div className="prose prose-stone max-w-none font-sans text-luxury-ink/80 leading-relaxed space-y-8 mt-12">
          <section className="space-y-4">
            <h3 className="font-serif text-2xl text-luxury-ink">1. Bản chất của thông tin</h3>
            <p>
              Tất cả các báo cáo, thông số tài chính và phân tích dòng tiền được cung cấp trên website này (bao gồm cả công cụ tính toán tự động) chỉ mang tính chất <strong>tham khảo và giả định</strong>. 
              Các con số này được xây dựng dựa trên dữ liệu thị trường tại thời điểm nghiên cứu và không cấu thành một lời cam kết chắc chắn về lợi nhuận trong tương lai.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="font-serif text-2xl text-luxury-ink">2. Rủi ro đầu tư</h3>
            <p>
              Thị trường bất động sản luôn tiềm ẩn các biến số về kinh tế vĩ mô, chính sách pháp lý và biến động lãi suất ngân hàng. 
              Tôi (Cố vấn) khuyến nghị Anh/Chị nên thực hiện thẩm định độc lập (Due Diligence) và tham vấn các chuyên gia pháp lý/tài chính trước khi thực hiện bất kỳ giao dịch nào. 
              Chúng tôi không chịu trách nhiệm cho bất kỳ tổn thất tài chính nào phát sinh từ việc sử dụng thông tin trên trang web này.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="font-serif text-2xl text-luxury-ink">3. Độ chính xác của dữ liệu</h3>
            <p>
              Mặc dù tôi luôn nỗ lực cập nhật dữ liệu từ những nguồn uy tín nhất (Chủ đầu tư, đơn vị vận hành, báo cáo thị trường), 
              nhưng độ chính xác tuyệt đối không thể được đảm bảo tại mọi thời điểm do tính chất thay đổi nhanh chóng của ngành bất động sản.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="font-serif text-2xl text-luxury-ink">4. Quyền sở hữu trí tuệ</h3>
            <p>
              Các mô hình tính toán và bài phân tích chuyên sâu là tài sản trí tuệ của cá nhân tôi. 
              Việc sao chép hoặc sử dụng lại cho mục đích thương mại mà không có sự đồng ý bằng văn bản là vi phạm quyền sở hữu trí tuệ.
            </p>
          </section>

          <div className="pt-12 border-t border-luxury-taupe/30 text-center italic text-xs text-luxury-stone">
            Cập nhật lần cuối: Tháng 4, 2026.
          </div>
        </div>
      </div>
    </main>
  );
}
