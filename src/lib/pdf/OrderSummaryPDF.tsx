import { Document, Page, Text, View, StyleSheet, Image, Link } from "@react-pdf/renderer";
import { formatCurrency } from "../utils";

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
    marginBottom: 1,
    color: "#111827",
  },
  roomBadge: {
    backgroundColor: "#f3f4f6",
    color: "#374151",
    fontSize: 9,
    fontWeight: "bold",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 3,
    marginLeft: 6,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    marginTop: 2,
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
  link: {
    color: "#2563eb",
    textDecoration: "underline",
    fontSize: 9,
  },
});

export type ReservationItem = {
  roomTypeName: string;
  roomNumber: string;
  guestName?: string;
  guestPhone?: string;
  startDate: string;
  endDate: string;
  totalGuests?: number;
  price: number;
};

type OrderSummaryPDFProps = {
  bookingId: string;
  orderedByName: string;
  phoneNumber?: string;
  paymentMethod: string;
  totalPrice: number;
  reservations: ReservationItem[]; // 👈 sekarang array, bukan single object
};

const OrderSummaryPDF = ({
  bookingId,
  orderedByName,
  phoneNumber,
  paymentMethod,
  totalPrice,
  reservations,
}: OrderSummaryPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* Header dengan logo */}
      <View style={styles.header} fixed>
        <View>
          <Text style={styles.headerText}>Order Summary</Text>
          <Text style={styles.headerSubtext}>
            Booking Date: {new Date().toLocaleDateString("id-ID")}
          </Text>
        </View>
        <Image
          style={styles.logo}
          src="https://zv35rsaixcn4ha4e.public.blob.vercel-storage.com/large-bg-black.png"
        />
      </View>

      <View style={styles.body}>
        <Text style={styles.statusBadge}>PAYMENT CONFIRMED</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Booking ID</Text>
            <Text style={styles.value}>{bookingId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Ordered by</Text>
            <Text style={styles.value}>{orderedByName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone Number</Text>
            <Text style={styles.value}>{phoneNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Rooms</Text>
            <Text style={styles.value}>{reservations.length > 1 ? `${reservations.length} rooms` : `${reservations.length} room`}</Text>
          </View>
        </View>

        {/* Loop semua reservation, 1 card per kamar, terurut ke bawah */}
        {reservations.map((res, index) => (
          <View style={styles.card} key={index} wrap={false}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionTitle}>Room {index + 1}</Text>
              <Text style={styles.roomBadge}>{res.roomTypeName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Guest Name</Text>
              <Text style={styles.value}>{res.guestName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Guest Phone</Text>
              <Text style={styles.value}>{res.guestPhone}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Room Number</Text>
              <Text style={styles.value}>{res.roomNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Check-in</Text>
              <Text style={styles.value}>{res.startDate}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Check-out</Text>
              <Text style={styles.value}>{res.endDate}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Capacity</Text>
              <Text style={styles.value}>{res.totalGuests ?? "-"}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>Room Price</Text>
              <Text style={styles.value}>{formatCurrency(res.price)}</Text>
            </View>
          </View>
        ))}

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
          <Text style={styles.footerText}>
            If you need any assistance or experience any issues, please feel free to&nbsp;
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