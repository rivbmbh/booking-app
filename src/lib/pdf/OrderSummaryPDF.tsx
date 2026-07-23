// lib/pdf/OrderSummaryPDF.tsx
import { Document, Page, Text, View, StyleSheet, Image, Font, Link } from "@react-pdf/renderer";
import { formatCurrency } from "../utils";

// Optional: pakai font custom biar lebih rapi (kalau tidak, skip bagian ini)
Font.register({
  family: "Helvetica-Bold",
  src: "https://cdn.jsdelivr.net/npm/@canvas-fonts/helvetica-bold/Helvetica-Bold.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#1f2937",
  },
  header: {
    backgroundColor: "#1c0606",
    padding: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 40,
    objectFit: "contain",
  },
  headerText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtext: {
    color: "#9ca3af",
    fontSize: 9,
    marginTop: 4,
  },
  body: {
    padding: 30,
  },
  statusBadge: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    fontSize: 10,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  card: {
    border: "1 solid #e5e7eb",
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    color: "#6b7280",
  },
  value: {
    color: "#111827",
    fontWeight: "bold",
  },
  divider: {
    borderBottom: "1 solid #e5e7eb",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },
  footer: {
    marginTop: 30,
    paddingTop: 16,
    borderTop: "1 solid #e5e7eb",
    textAlign: "center",
  },
  footerText: {
    fontSize: 9,
    color: "#9ca3af",
  },
  footerURLText: {
    textAlign: "center",
    fontSize: 9,
    marginTop: 4,
    color: "#9ca3af",
  },
  roomImage: {
    width: "100%",
    height: 140,
    objectFit: "cover",
    borderRadius: 6,
    marginBottom: 16,
  },
    link: {
    color: "#2563eb",
    textDecoration: "underline",
    fontSize: 9,
  },
});

type OrderSummaryPDFProps = {
  bookingId: string;
  guestName: string;
  roomTypeName: string;
  // roomImageUrl?: string; // 👈 tambahan untuk gambar kamar
  startDate: string;
  endDate: string;
  totalPrice: number;
  paymentMethod: string;
  roomNumber?: string; // optional, bisa diisi jika ada
  phoneNumber?: string; // optional, bisa diisi jika ada
  totalGuests?: number; // optional, bisa diisi jika ada
};

const OrderSummaryPDF = ({
  bookingId,
  guestName,
  roomTypeName,
  startDate,
  endDate,
  totalPrice,
  paymentMethod,
  roomNumber,
  phoneNumber,
  totalGuests,
}: OrderSummaryPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header dengan logo */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Order Summary</Text>
          <Text style={styles.headerSubtext}>Booking Date: {new Date().toLocaleDateString("id-ID")}</Text>
        </View>
          <Image style={styles.logo} src="https://zv35rsaixcn4ha4e.public.blob.vercel-storage.com/large-bg-black.png" />
      </View>

      <View style={styles.body}>
        <Text style={styles.statusBadge}>PAYMENT CONFIRMED</Text>

        {/* Gambar kamar (opsional) */}
        {/* {roomImageUrl && <Image style={styles.roomImage} src={roomImageUrl} />} */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Booking ID</Text>
            <Text style={styles.value}>{bookingId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Guest Name</Text>
            <Text style={styles.value}>{guestName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{phoneNumber}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Stay Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Room Type</Text>
            <Text style={styles.value}>{roomTypeName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Room Number</Text>
            <Text style={styles.value}>{roomNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check-in</Text>
            <Text style={styles.value}>{startDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Check-out</Text>
            <Text style={styles.value}>{endDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Guests</Text>
            <Text style={styles.value}>{totalGuests}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Method</Text>
            <Text style={styles.value}>{paymentMethod}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing EXO Hotel as your accommodation. We hope you have a comfortable stay and enjoy our services!
          </Text>
          <Text style={styles.footerText}>If you need any assistance or experience any issues, please feel free to&nbsp;
          <Link src="https://wa.me/6281242622241" style={styles.link}>
            contact us via WhatsApp
          </Link>
          </Text>
          <Link src="https://www.exohotel.com" style={styles.footerURLText}>
            www.exohotel.com
          </Link>
        </View>
      </View>
    </Page>
  </Document>
);

export default OrderSummaryPDF;