import { put } from '@vercel/blob';
import { renderToBuffer } from '@react-pdf/renderer';
import { OfferLetterTemplate } from '@/components/pdf/OfferLetterTemplate';
// import { NDATemplate } from '@/components/pdf/NDATemplate'; // Assuming you have this
import { NextResponse } from 'next/server';
import { Candidate } from "@/models/Candidate";
export async function POST(req: Request) {
  const body = await req.json();
  console.log("body", body);
  const { candidateId, name, role } = body;

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

    await Candidate.findByIdAndUpdate(candidateId, {
      $set: {
        status: 'Offer Sent',
        offerLetterUrl: offerBlob.url,
        // ndaUrl: ndaBlob.url
      },
      $push: {
        timeline: {
          status: 'Offer Sent',
          timestamp: new Date(),
          note: `Offer letter generated for the role: ${role}`
        }
      }
    });

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