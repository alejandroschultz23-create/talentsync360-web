import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('>>> LLEGÓ PETICIÓN AL SERVIDOR: ' + new Date().toISOString());
  
  try {
    const body = await req.json();
    console.log('--- SERVER SIDE PAYLOAD ---', body);

    // TODO: Implement actual Resend logic here
    // const { data, error } = await resend.emails.send({ ... });

    return NextResponse.json({ 
      success: true, 
      message: 'Solicitud recibida correctamente en el servidor.',
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    console.error('SERVER ERROR:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
