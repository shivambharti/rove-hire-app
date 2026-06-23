import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
} from '@react-pdf/renderer';

const PRIMARY = '#123D8D';
const LIGHT_BLUE = '#EAF1FF';

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 40,
        fontFamily: 'Helvetica',
        position: 'relative',
    },

    /* HEADER */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 14,
        borderBottomWidth: 2,
        borderBottomColor: PRIMARY,
    },

    logoWrapper: {
        width: '52%',
    },

    logo: {
        width: 350,
        height: 120,
        objectFit: 'contain',
    },

    divider: {
        width: 1,
        height: 55,
        backgroundColor: '#D9D9D9',
        marginHorizontal: 15,
    },

    companyBlock: {
        flex: 1,
    },

    companyName: {
        fontSize: 16,
        color: PRIMARY,
        fontWeight: 'bold',
        marginBottom: 4,
    },

    companySub: {
        fontSize: 8,
        color: '#666',
        marginBottom: 2,
    },

    /* TITLE */
    titleSection: {
        alignItems: 'center',
        marginTop: 18,
        paddingHorizontal: 25,
    },

    title: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#1D2D5A',
        textAlign: 'center',
    },

    ornament: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },

    ornamentLine: {
        width: 80,
        height: 1,
        backgroundColor: '#8AA3D8',
    },

    diamond: {
        color: PRIMARY,
        marginHorizontal: 10,
        fontSize: 12,
    },

    dateBadge: {
        backgroundColor: '#F6F7FB',
        borderWidth: 1,
        borderColor: '#D8DCE7',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },

    dateText: {
        fontSize: 8,
        color: '#444',
    },

    /* CONTENT */
    content: {
        paddingHorizontal: 28,
        paddingTop: 15,
    },

    intro: {
        fontSize: 8.5,
        color: '#333',
        lineHeight: 1.6,
        marginBottom: 10,
        textAlign: 'justify',
    },

    bold: {
        fontWeight: 'bold',
    },

    section: {
        marginTop: 10,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },

    iconCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 1,
        borderColor: PRIMARY,
        backgroundColor: LIGHT_BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },

    iconText: {
        color: PRIMARY,
        fontSize: 10,
        fontWeight: 'bold',
    },

    sectionTitle: {
        color: PRIMARY,
        fontSize: 11,
        fontWeight: 'bold',
    },

    sectionLine: {
        height: 1,
        backgroundColor: '#C8D5F0',
        marginTop: 3,
        marginBottom: 4,
    },

    body: {
        fontSize: 8,
        color: '#333',
        lineHeight: 1.5,
        textAlign: 'justify',
    },

    bullet: {
        fontSize: 8,
        marginLeft: 12,
        marginTop: 2,
        lineHeight: 1.4,
    },

    /* SIGNATURE */
    signatureWrapper: {
        marginTop: 18,
        paddingHorizontal: 28,
    },

    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },

    signatureBox: {
        width: '45%',
    },

    signatureHeading: {
        color: PRIMARY,
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },

    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: '#333',
        marginBottom: 5,
    },

    signatureLabel: {
        fontSize: 7,
        color: '#444',
    },

    /* FOOTER */
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 22,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },

    footerText: {
        color: '#FFF',
        fontSize: 7,
    },
});

const Section = ({
    icon,
    title,
    children,
}: {
    icon: string;
    title: string;
    children: React.ReactNode;
}) => (
    <View style={styles.section}>
        <View style={styles.sectionHeader}>
            <View style={styles.iconCircle}>
                <Text style={styles.iconText}>{icon}</Text>
            </View>

            <Text style={styles.sectionTitle}>{title}</Text>
        </View>

        <View style={styles.sectionLine} />

        <View>{children}</View>
    </View>
);

export const NDATemplate = ({ data }: { data: any }) => {
    const currentDate = new Date().toLocaleDateString();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={styles.logoWrapper}>
                        <Image
                            src="https://i.pinimg.com/280x280_RS/91/c4/d9/91c4d9e4f143a38ace58c431d4289a91.jpg"
                            style={styles.logo}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.companyBlock}>
                        <Text style={styles.companyName}>
                            ROVE Innotech Pvt. Ltd.
                        </Text>

                        <Text style={styles.companySub}>
                            Confidential & Proprietary
                        </Text>

                        <Text style={styles.companySub}>
                            Employee Documentation
                        </Text>
                    </View>
                </View>

                {/* TITLE */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>
                        NON-DISCLOSURE AGREEMENT (NDA)
                    </Text>

                    <View style={styles.ornament}>
                        <View style={styles.ornamentLine} />
                        <Text style={styles.diamond}>◆</Text>
                        <View style={styles.ornamentLine} />
                    </View>

                    <View style={styles.dateBadge}>
                        <Text style={styles.dateText}>
                            Effective Date: {currentDate}
                        </Text>
                    </View>
                </View>

                {/* CONTENT */}
                <View style={styles.content}>
                    <Text style={styles.intro}>
                        This Non-Disclosure Agreement
                        ("Agreement") is entered into on{' '}
                        <Text style={styles.bold}>{currentDate}</Text> by and
                        between <Text style={styles.bold}>ROVE Innotech Pvt. Ltd.</Text>{' '}
                        ("Company") and{' '}
                        <Text style={styles.bold}>{data?.name || 'Employee'}</Text>.
                    </Text>

                    <Text style={styles.intro}>
                        The Employee acknowledges that during employment they may
                        receive access to confidential, proprietary and sensitive
                        information belonging to the Company.
                    </Text>

                    <Section
                        icon="1"
                        title="1. Confidential Information"
                    >
                        <Text style={styles.body}>
                            Confidential Information includes software source
                            code, technical documentation, business plans,
                            customer information, pricing strategies, product
                            roadmaps, operational processes and any information
                            identified as confidential.
                        </Text>
                    </Section>

                    <Section
                        icon="2"
                        title="2. Employee Obligations"
                    >
                        <Text style={styles.bullet}>
                            • Maintain strict confidentiality.
                        </Text>

                        <Text style={styles.bullet}>
                            • Use information only for authorized business.
                        </Text>

                        <Text style={styles.bullet}>
                            • Not disclose without written approval.
                        </Text>

                        <Text style={styles.bullet}>
                            • Prevent misuse or unauthorized access.
                        </Text>
                    </Section>

                    <Section icon="3" title="3. Exclusions">
                        <Text style={styles.body}>
                            Information shall not be confidential if publicly
                            available, previously known, received legally from a
                            third party, or independently developed.
                        </Text>
                    </Section>

                    <Section
                        icon="4"
                        title="4. Return of Company Property"
                    >
                        <Text style={styles.body}>
                            Upon termination or request, the Employee shall
                            immediately return all company property, records,
                            credentials, documents and confidential materials.
                        </Text>
                    </Section>
                </View>

                {/* SIGNATURES */}
                <View style={styles.signatureWrapper}>
                    <View style={styles.signatureRow}>
                        <View style={styles.signatureBox}>
                            <Text style={styles.signatureHeading}>
                                FOR ROVE INNOTECH PVT. LTD.
                            </Text>

                            <View style={styles.signatureLine} />

                            <Text style={styles.signatureLabel}>
                                Authorized Signatory
                            </Text>

                            <Text style={styles.signatureLabel}>
                                Date: ____________
                            </Text>
                        </View>

                        <View style={styles.signatureBox}>
                            <Text style={styles.signatureHeading}>
                                EMPLOYEE
                            </Text>

                            <View style={styles.signatureLine} />

                            <Text style={styles.signatureLabel}>
                                {data?.name || 'Employee Signature'}
                            </Text>

                            <Text style={styles.signatureLabel}>
                                Date: ____________
                            </Text>
                        </View>
                    </View>
                </View>

                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        ROVE Innotech Pvt. Ltd. | Confidential & Proprietary |
                        Non-Disclosure Agreement
                    </Text>
                </View>
            </Page>
        </Document>
    );
};