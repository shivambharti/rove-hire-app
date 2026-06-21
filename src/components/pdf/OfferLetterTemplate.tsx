import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 50, fontSize: 11, fontFamily: 'Helvetica' },
    headerSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    logo: { width: 240, height: 100, objectFit: 'contain' },
    companyInfo: { textAlign: 'right', fontSize: 10 },
    title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textDecoration: 'underline' },
    body: { lineHeight: 1.5, marginBottom: 20 },
    bold: { fontWeight: 'bold' },
    signatureSection: { marginTop: 30 },
    sigLine: { borderTop: '1px solid black', width: 140, marginTop: 40 }
});

export const OfferLetterTemplate = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header Section */}
            <View style={styles.headerSection}>
                <Image
                    style={styles.logo}
                    src="https://i.pinimg.com/280x280_RS/91/c4/d9/91c4d9e4f143a38ace58c431d4289a91.jpg" // Replace with your actual hosted logo URL
                />
                <View style={styles.companyInfo}>
                    <Text>ROVE Innotech</Text>
                    <Text>Website: https://www.rovedashcam.com/</Text>
                </View>
            </View>

            <Text style={styles.title}>Offer Letter</Text>

            {/* Body */}
            <View style={styles.body}>
                <Text>Date: {new Date().toLocaleDateString()}</Text>
                <Text style={{ marginTop: 10 }}>Dear {data.name},</Text>

                <Text style={{ marginTop: 15 }}>
                    We congratulate you on your selection as <Text style={styles.bold}>"{data.role}"</Text> at ROVE Innotech.
                    We look forward to your contribution in our pursuit of excellence.
                </Text>

                <Text style={{ marginTop: 15 }}>
                    ROVE is a young company with an average age of employees below 30, all of whom share the same hope and aspirations.
                    The culture and atmosphere is informal and conducive to creativity with a lot of roles to play around.
                    The pressure may be high and the job demanding but we hope you’ll find it exciting, stimulating, and challenging.
                </Text>

                <Text style={{ marginTop: 15 }}>
                    You will be joining the company on a gross salary (Cost to the company) of <Text style={styles.bold}>{data.currency} {data.salary} per annum</Text>.
                    You would be on probation for a period of 6 (Six) months. On successful completion of your probation period, you will be confirmed.
                    You are requested to join on or before <Text style={styles.bold}>{new Date(data.startDate).toLocaleDateString()}</Text>.
                </Text>

                <Text style={{ marginTop: 15 }}>
                    On acceptance of this offer, your appointment with the company will be on the basis of the standard terms and conditions.
                    Based on your confirmation to join us, we are closing this position. In case you do not join us on the agreed date,
                    it will be taken as a breach of contract liable for legal action.
                </Text>
            </View>

            {/* Signature Section */}
            <View style={styles.signatureSection}>
                <Text>Yours sincerely,</Text>
                <Text>For ROVE Innotech</Text>
                <View style={styles.sigLine} />
                <Text>Authorized Signatory</Text>
            </View>
        </Page>
    </Document>
);