import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

import type { InvestmentReportData } from "@/features/investment/calculator";

// Đăng ký Font Montserrat (Đảm bảo đường dẫn .ttf chuẩn để không lỗi tiếng Việt)
Font.register({
  family: 'Montserrat',
  fonts: [
    { src: '/fonts/Montserrat-VariableFont_wght.ttf', fontWeight: 400 },
    { src: '/fonts/Montserrat-VariableFont_wght.ttf', fontWeight: 700 },
  ]
});

const styles = StyleSheet.create({
  page: { 
    padding: 50, 
    backgroundColor: '#FFFFFF', 
    fontFamily: 'Montserrat',
    lineHeight: 1.5 
  },
  // Header: Sang trọng, tối giản
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-end', 
    borderBottomWidth: 1, 
    borderBottomColor: '#B8860B', 
    paddingBottom: 15, 
    marginBottom: 25 
  },
  brandGroup: { flexDirection: 'column' },
  brandName: { fontSize: 14, fontWeight: 700, color: '#2C3E50', letterSpacing: 1 },
  reportTag: { fontSize: 8, color: '#B8860B', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
  date: { fontSize: 8, color: '#95A5A6' },

  // Section Styling
  section: { marginBottom: 20 },
  sectionHeading: { 
    fontSize: 9, 
    color: '#000000', 
    fontWeight: 700, 
    textTransform: 'uppercase', 
    letterSpacing: 1, 
    marginBottom: 10,
    backgroundColor: '#F9F7F2', 
    padding: '4 8',
    borderLeftWidth: 2,
    borderLeftColor: '#B8860B'
  },

  // Table rows
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 8, 
    borderBottomWidth: 0.3, 
    borderBottomColor: '#E0E0E0' 
  },
  label: { fontSize: 9, color: '#7F8C8D' },
  value: { fontSize: 10, color: '#2C3E50', fontWeight: 600 },

  // Highlight Card: Dòng tiền thực nhận
  cashflowCard: { 
    marginVertical: 15, 
    padding: 15, 
    backgroundColor: '#2C3E50', 
    borderRadius: 2
  },
  cashflowLabel: { fontSize: 8, color: '#FFFFFF', opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5 },
  cashflowValue: { fontSize: 20, color: '#B8860B', fontWeight: 700, marginTop: 4 },

  // Dự phóng Stats
  statsContainer: { flexDirection: 'row', gap: 12, marginTop: 10 },
  statBox: { 
    flex: 1, 
    padding: 12, 
    borderWidth: 0.5, 
    borderColor: '#B8860B',
    backgroundColor: '#FCFBFA'
  },
  statLabel: { fontSize: 7, color: '#7F8C8D', textTransform: 'uppercase', marginBottom: 4 },
  statValue: { fontSize: 13, color: '#2C3E50', fontWeight: 700 },

  // Tổng kết cuối
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#2C3E50'
  },
  totalLabel: { fontSize: 10, fontWeight: 700, color: '#2C3E50' },
  totalValue: { fontSize: 15, fontWeight: 700, color: '#B8860B' },

  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 50, 
    right: 50, 
    fontSize: 7, 
    color: '#BDC3C7', 
    textAlign: 'center',
    borderTopWidth: 0.3,
    borderTopColor: '#BDC3C7',
    paddingTop: 10
  }
});

export const InvestmentReport = ({ data }: { data: InvestmentReportData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.brandGroup}>
          <Text style={styles.brandName}>HANOI ESTATE</Text>
          <Text style={styles.reportTag}>Premium Analytics Report</Text>
        </View>
        <Text style={styles.date}>Ngày lập: {new Date().toLocaleDateString('vi-VN')}</Text>
      </View>

      {/* 1. THÔNG SỐ ĐẦU VÀO */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Thông số tài sản & Giả định</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Giá trị bất động sản</Text>
          <Text style={styles.value}>{data.formatPrice}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Vốn tự có (Equity)</Text>
          <Text style={styles.value}>{data.formatEquity}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Khoản vay ngân hàng</Text>
          <Text style={styles.value}>{data.loanPcnt}% ({data.formatLoan})</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Lãi suất & Thời hạn</Text>
          <Text style={styles.value}>{data.interest}% - {data.loanTerm} năm</Text>
        </View>
      </View>

      {/* 2. DÒNG TIỀN VẬN HÀNH */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Dòng tiền vận hành hàng tháng</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Doanh thu thuê kỳ vọng</Text>
          <Text style={styles.value}>{data.formatRent}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Thuế & Phí vận hành ({data.opexPcnt}%)</Text>
          <Text style={styles.value}>- {data.formatOpex}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gốc + Lãi trả ngân hàng</Text>
          <Text style={styles.value}>- {data.formatMonthlyPayment}</Text>
        </View>
        
        <View style={styles.cashflowCard}>
          <Text style={styles.cashflowLabel}>Dòng tiền thuần thực nhận (Net Cashflow)</Text>
          <Text style={styles.cashflowValue}>{data.formatNetCashflow}</Text>
        </View>
      </View>

      {/* 3. HIỆU QUẢ CHIẾN LƯỢC DÀI HẠN */}
      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Dự phóng hiệu quả sau {data.forecastYears} năm</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Lợi nhuận (ROE)</Text>
            <Text style={styles.statValue}>{data.roe}% / năm</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Giá trị tài sản Y-{data.forecastYears}</Text>
            <Text style={styles.statValue}>{data.formatFutureValue}</Text>
          </View>
        </View>

        <View style={{ marginTop: 15 }}>
          <View style={styles.row}>
            <Text style={styles.label}>Lợi nhuận từ tăng giá vốn</Text>
            <Text style={styles.value}>{data.formatCapitalGain}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tổng tiền thuê cộng dồn</Text>
            <Text style={styles.value}>{data.formatAccumulatedRent}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TỔNG LỢI NHUẬN RÒNG DỰ KIẾN</Text>
            <Text style={styles.totalValue}>{data.formatTotalProfit}</Text>
          </View>
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text>Báo cáo này mang tính chất tham khảo dựa trên các giả định tài chính tại thời điểm lập.</Text>
        <Text style={{ marginTop: 2 }}>© Hanoi Estate Premium Services | Trang 1 / 1</Text>
      </View>
    </Page>
  </Document>
);
