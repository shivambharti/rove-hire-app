import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: { padding: 50, fontSize: 10, fontFamily: 'Helvetica', color: '#333' },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
    logo: { width: 100, height: 30, objectFit: 'contain' },
    title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, textDecoration: 'underline' },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
    bodyText: { lineHeight: 1.5, marginBottom: 10, textAlign: 'justify' },
    bold: { fontWeight: 'bold' },
    signatureGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 60 },
    sigLine: { borderTopWidth: 1, borderColor: '#000', width: 180, marginTop: 40 },
});

export const NDATemplate = ({ data }: { data: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Image src="https://i.pinimg.com/280x280_RS/91/c4/d9/91c4d9e4f143a38ace58c431d4289a91.jpg" style={styles.logo} />
                <Text>Confidential Document</Text>
            </View>

            <Text style={styles.title}>NON-DISCLOSURE AGREEMENT (NDA)</Text>

            <View>
                <Text style={styles.bodyText}>
                    This Non-Disclosure Agreement (the "Agreement") is entered into as of {new Date().toLocaleDateString()} 
                    between <Text style={styles.bold}>ROVE Innotech</Text> (the "Company") and <Text style={styles.bold}>{data.name}</Text> (the "Employee").
                </Text>

                <Text style={styles.sectionTitle}>1. DEFINITION OF CONFIDENTIAL INFORMATION</Text>
                <Text style={styles.bodyText}>
                    "Confidential Information" includes all non-public, proprietary information, including but not limited to, 
                    technical data, trade secrets, software code, customer lists, business strategies, and financial information 
                    disclosed by the Company to the Employee.
                </Text>

                <Text style={styles.sectionTitle}>2. OBLIGATIONS OF THE EMPLOYEE</Text>
                <Text style={styles.bodyText}>
                    The Employee agrees to: (a) hold all Confidential Information in strict confidence; (b) use such information 
                    solely for the performance of their duties at the Company; and (c) not disclose such information to any 
                    third party without prior written consent from the Company.
                </Text>

                <Text style={styles.sectionTitle}>3. EXCLUSIONS</Text>
                <Text style={styles.bodyText}>
                    Confidential Information does not include information that is: (a) already in the public domain; 
                    (b) rightfully obtained from a third party without breach of any confidentiality obligation; 
                    or (c) independently developed by the Employee without use of the Company's information.
                </Text>

                <Text style={styles.sectionTitle}>4. TERM AND TERMINATION</Text>
                <Text style={styles.bodyText}>
                    This Agreement shall remain in effect during the term of the Employee's employment and for a period of 
                    3 (three) years following the termination of such employment, regardless of the reason for termination.
                </Text>

                <Text style={styles.sectionTitle}>5. GOVERNING LAW</Text>
                <Text style={styles.bodyText}>
                    This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in 
                    which ROVE Innotech is headquartered.
                </Text>
            </View>

            <View style={styles.signatureGrid}>
                <View>
                    <View style={styles.sigLine} />
                    <Text>Authorized Signatory (ROVE Innotech)</Text>
                </View>
                <View>
                    <View style={styles.sigLine} />
                    <Text>Employee Signature ({data.name})</Text>
                </View>
            </View>
        </Page>
    </Document>
);