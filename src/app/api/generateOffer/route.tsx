import { put } from '@vercel/blob';
import { renderToBuffer } from '@react-pdf/renderer';
import { OfferLetterTemplate } from '@/components/pdf/OfferLetterTemplate';
// import { NDATemplate } from '@/components/pdf/NDATemplate'; // Assuming you have this
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  console.log("body", body);
  const { candidateId, name } = body;

  try {
    // 1. Generate PDFs as buffers
    const offerBuffer = await renderToBuffer(<OfferLetterTemplate data={body} />);
    // const ndaBuffer = await renderToBuffer(<NDATemplate data={body} />);

    // 2. Upload both to Vercel Blob
    const offerBlob = await put(`offers/${candidateId}-offer.pdf`, offerBuffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: true, // This generates a unique URL every time
    });

    // const ndaBlob = await put(`offers/${candidateId}-nda.pdf`, ndaBuffer, {
    //   access: 'public',
    //   contentType: 'application/pdf',
    // });

    // 3. Update your MongoDB record
    // Ensure you save both URLs so they can be rendered in the UI later
    /* 
    await db.collection('interviews').updateOne({ _id: body.interviewId }, { 
      $set: { 
        status: 'Offer Sent', 
        offerUrl: offerBlob.url,
        // ndaUrl: ndaBlob.url
      } 
    });
    */

    return NextResponse.json({
      success: true,
      offerUrl: offerBlob.url,
      // ndaUrl: ndaBlob.url 
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json({ error: 'Failed to generate documents' }, { status: 500 });
  }
}