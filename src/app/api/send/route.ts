import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  console.log('>>> LLEGÓ PETICIÓN AL SERVIDOR: ' + new Date().toISOString());
  
  try {
    const body = await req.json();
    console.log('--- SERVER SIDE PAYLOAD ---', body);

    const { name, email, message, contactType, role, currentRole, experience, englishLevel, pageOrigin } = body;

    const { data, error } = await resend.emails.send({
      from: 'TalentSync360 <onboarding@resend.dev>',
      to: 'alejandroschultz23@gmail.com',
      subject: `Nuevo Lead: ${name} (${contactType?.toUpperCase()})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #2563eb;">Nuevo contacto desde TalentSync360</h2>
          <hr />
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Tipo de Contacto:</strong> ${contactType}</p>
          ${role ? `<p><strong>Interés (B2B):</strong> ${role}</p>` : ''}
          ${currentRole ? `<p><strong>Rol Actual:</strong> ${currentRole}</p>` : ''}
          ${experience ? `<p><strong>Experiencia:</strong> ${experience}</p>` : ''}
          ${englishLevel ? `<p><strong>Nivel de Inglés:</strong> ${englishLevel}</p>` : ''}
          <p><strong>Origen:</strong> ${pageOrigin || 'Directo'}</p>
          <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-left: 4px solid #2563eb;">
            <strong>Mensaje:</strong><br />
            ${message}
          </div>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 30px;">
            Enviado el ${new Date().toLocaleString()} - TalentSync360 Engine
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('RESEND ERROR:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado con éxito via Resend.',
      id: data?.id 
    });
  } catch (err: any) {
    console.error('FATAL SERVER ERROR:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
