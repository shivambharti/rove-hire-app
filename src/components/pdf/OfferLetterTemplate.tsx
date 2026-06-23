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

const styles = StyleSheet.create({
    page: {
        backgroundColor: '#FFFFFF',
        paddingBottom: 40,
        fontFamily: 'Helvetica',
    },

    /* HEADER */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingVertical: 18,
        borderBottomWidth: 2,
        borderBottomColor: PRIMARY,
    },

    logo: {
        width: 350,
        height: 120,
        objectFit: 'contain',
    },

    companyInfo: {
        textAlign: 'right',
    },

    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: PRIMARY,
        marginBottom: 4,
    },

    companyText: {
        fontSize: 9,
        color: '#555',
        marginBottom: 2,
    },

    content: {
        paddingHorizontal: 40,
        paddingTop: 25,
    },

    titleSection: {
        alignItems: 'center',
        marginBottom: 25,
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: PRIMARY,
        letterSpacing: 1,
    },

    titleLine: {
        width: 180,
        borderBottomWidth: 2,
        borderBottomColor: PRIMARY,
        marginTop: 8,
    },

    reference: {
        marginTop: 10,
        fontSize: 9,
        color: '#666',
    },

    candidateCard: {
        backgroundColor: '#F5F8FF',
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY,
        padding: 12,
        marginBottom: 20,
    },

    cardRow: {
        marginBottom: 4,
        fontSize: 10,
    },

    body: {
        fontSize: 10,
        lineHeight: 1.8,
        color: '#333',
        textAlign: 'justify',
        marginBottom: 12,
    },

    bold: {
        fontWeight: 'bold',
    },

    compensationBox: {
        backgroundColor: '#EEF4FF',
        borderWidth: 1,
        borderColor: '#D6E4FF',
        padding: 14,
        marginVertical: 15,
    },

    compensationTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: PRIMARY,
        marginBottom: 8,
    },

    compensationText: {
        fontSize: 10,
        marginBottom: 4,
    },

    acceptanceBox: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#FAFAFA',
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },

    acceptanceTitle: {
        fontWeight: 'bold',
        color: PRIMARY,
        marginBottom: 6,
        fontSize: 10,
    },

    signatureSection: {
        marginTop: 40,
    },

    signatureRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    signatureBox: {
        width: '42%',
    },

    signatureTitle: {
        color: PRIMARY,
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 35,
    },

    signatureLine: {
        borderTopWidth: 1,
        borderTopColor: '#000',
        marginBottom: 5,
    },

    signatureText: {
        fontSize: 9,
        color: '#444',
    },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 24,
        backgroundColor: PRIMARY,
        justifyContent: 'center',
        alignItems: 'center',
    },

    footerText: {
        color: '#FFF',
        fontSize: 8,
    },
});

export const OfferLetterTemplate = ({
    data,
}: {
    data: any;
}) => {
    const currentDate = new Date().toLocaleDateString();

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Image
                        src="https://i.pinimg.com/280x280_RS/91/c4/d9/91c4d9e4f143a38ace58c431d4289a91.jpg"
                        style={styles.logo}
                    />

                    <View style={styles.companyInfo}>
                        <Text style={styles.companyName}>
                            ROVE Innotech Pvt. Ltd.
                        </Text>

                        <Text style={styles.companyText}>
                            Confidential & Proprietary
                        </Text>

                        <Text style={styles.companyText}>
                            Human Resources Department
                        </Text>

                        <Text style={styles.companyText}>
                            www.rovedashcam.com
                        </Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* TITLE */}
                    <View style={styles.titleSection}>
                        <Text style={styles.title}>
                            OFFER LETTER
                        </Text>

                        <View style={styles.titleLine} />

                        <Text style={styles.reference}>
                            Ref No: ROVE/HR/
                            {new Date().getFullYear()}/
                            {data?.employeeId || '001'}
                        </Text>
                    </View>

                    {/* CANDIDATE INFO */}
                    <View style={styles.candidateCard}>
                        <Text style={styles.cardRow}>
                            Name: {data?.name}
                        </Text>

                        <Text style={styles.cardRow}>
                            Position: {data?.role}
                        </Text>

                        <Text style={styles.cardRow}>
                            Proposed Joining Date:{' '}
                            {new Date(
                                data?.startDate
                            ).toLocaleDateString()}
                        </Text>

                        <Text style={styles.cardRow}>
                            Date Issued: {currentDate}
                        </Text>
                    </View>

                    {/* BODY */}
                    <Text style={styles.body}>
                        Dear{' '}
                        <Text style={styles.bold}>
                            {data?.name}
                        </Text>
                        ,
                    </Text>

                    <Text style={styles.body}>
                        We are delighted to offer you the
                        position of{' '}
                        <Text style={styles.bold}>
                            {data?.role}
                        </Text>{' '}
                        with{' '}
                        <Text style={styles.bold}>
                            ROVE Innotech Pvt. Ltd.
                        </Text>
                        .
                    </Text>

                    <Text style={styles.body}>
                        Your qualifications, experience,
                        technical expertise and overall
                        performance during the selection
                        process have impressed us. We are
                        confident that your contribution
                        will play a vital role in the
                        continued growth and success of our
                        organization.
                    </Text>

                    {/* COMPENSATION */}
                    <View style={styles.compensationBox}>
                        <Text
                            style={
                                styles.compensationTitle
                            }
                        >
                            Compensation & Employment
                            Details
                        </Text>

                        <Text
                            style={
                                styles.compensationText
                            }
                        >
                            Annual CTC:{' '}
                            {data?.currency || '₹'}{' '}
                            {data?.salary}
                        </Text>

                        <Text
                            style={
                                styles.compensationText
                            }
                        >
                            Designation:{' '}
                            {data?.role}
                        </Text>

                        <Text
                            style={
                                styles.compensationText
                            }
                        >
                            Manger:{' '}
                            {data?.manager}
                        </Text>

                        <Text
                            style={
                                styles.compensationText
                            }
                        >
                            Probation Period: 6 Months
                        </Text>

                        <Text
                            style={
                                styles.compensationText
                            }
                        >
                            Work Location:{' '}
                            {data?.location ||
                                'Remote'}
                        </Text>

                        <Text
                            style={
                                styles.compensationText
                            }
                        >
                            Joining Date:{' '}
                            {new Date(
                                data?.startDate
                            ).toLocaleDateString()}
                        </Text>
                    </View>

                    <Text style={styles.body}>
                        Your employment will initially be
                        subject to a probationary period of
                        six (6) months. During this period,
                        your performance, attendance,
                        conduct and suitability for the role
                        will be evaluated.
                    </Text>

                    <Text style={styles.body}>
                        This offer is contingent upon
                        successful verification of all
                        documents, qualifications,
                        employment records and other
                        information submitted by you.
                    </Text>

                    <Text style={styles.body}>
                        We request you to confirm your
                        acceptance of this offer by signing
                        and returning a copy of this letter.
                    </Text>

                    {/* ACCEPTANCE */}
                    <View wrap={false}>

                        <View style={styles.acceptanceBox}>
                            <Text
                                style={
                                    styles.acceptanceTitle
                                }
                            >
                                Acceptance
                            </Text>

                            <Text
                                style={{
                                    fontSize: 9,
                                }}
                            >
                                I hereby accept the offer of
                                employment and agree to the
                                terms and conditions stated
                                herein.
                            </Text>
                        </View>

                        {/* SIGNATURES */}
                        <View
                            style={styles.signatureSection}
                        >
                            <View
                                style={styles.signatureRow}
                            >
                                <View
                                    style={
                                        styles.signatureBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.signatureTitle
                                        }
                                    >
                                        FOR ROVE INNOTECH
                                        PVT. LTD.
                                    </Text>

                                    <View
                                        style={
                                            styles.signatureLine
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.signatureText
                                        }
                                    >
                                        Authorized Signatory
                                    </Text>

                                    <Text
                                        style={
                                            styles.signatureText
                                        }
                                    >
                                        Date: ___________
                                    </Text>
                                </View>

                                <View
                                    style={
                                        styles.signatureBox
                                    }
                                >
                                    <Text
                                        style={
                                            styles.signatureTitle
                                        }
                                    >
                                        EMPLOYEE ACCEPTANCE
                                    </Text>

                                    <View
                                        style={
                                            styles.signatureLine
                                        }
                                    />

                                    <Text
                                        style={
                                            styles.signatureText
                                        }
                                    >
                                        {data?.name}
                                    </Text>

                                    <Text
                                        style={
                                            styles.signatureText
                                        }
                                    >
                                        Date: ___________
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>


                {/* FOOTER */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        ROVE Innotech Pvt. Ltd. |
                        Official Employment Offer |
                        Confidential
                    </Text>
                </View>
            </Page>
        </Document>
    );
};