import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
  contactType?: string;
  role?: string;
  currentRole?: string;
  experience?: string;
  englishLevel?: string;
  pageOrigin?: string;
}

export async function POST(req: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY IS MISSING AT RUNTIME');
    return NextResponse.json({ error: 'Configuración del servidor incompleta (API KEY)' }, { status: 500 });
  }

  // Initialize inside the function to avoid issues during build time
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const body = (await req.json()) as ContactBody;
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Respuesta inválida o vacía' }, { status: 400 });
    }

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

    // Auto-responder logic
    try {
      if (email) {
        await resend.emails.send({
          from: 'TalentSync360 <onboarding@resend.dev>',
          to: email,
          subject: 'Confirmación de recepción - TalentSync360',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #2563eb;">¡Hola ${name}!</h2>
              <p>Confirmación de recepción: El motor de TalentSync360 ha recibido los datos correctamente. El equipo técnico validará la información y contactará en breve para los siguientes pasos. Gracias por el contacto.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="font-size: 12px; color: #94a3b8;">
                Este es un mensaje automático del sistema TalentSync360 Engine.
              </p>
            </div>
          `,
        });
      }
    } catch (autoErr) {
      // We don't want to fail the whole request if the auto-responder fails
      console.error('AUTO-RESPONDER ERROR:', autoErr);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Email enviado con éxito via Resend.',
      id: data?.id 
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido en el servidor';
    console.error('FATAL SERVER ERROR:', err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
