interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ to, subject, htmlContent }: SendEmailParams) {
  try {
    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      console.error('Brevo no configurado: faltan BREVO_API_KEY o BREVO_SENDER_EMAIL.');
      return { ok: false, error: 'BREVO_ENV_MISSING' };
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY as string,
      },
      body: JSON.stringify({
        sender: {
          name: process.env.BREVO_SENDER_NAME,
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      let errorData: unknown = null;
      try {
        errorData = await response.json();
      } catch {
        errorData = await response.text();
      }
      console.error('Error desde la API de Brevo:', errorData);
      return { ok: false, error: errorData };
    }

    const data = await response.json();
    console.log('Correo enviado con ID:', data.messageId);
    return { ok: true, data };
  } catch (error) {
    console.error('Error de red enviando correo:', error);
    return { ok: false, error };
  }
}


export async function sendBudgetAlert(
  userEmail: string, 
  presupuestoNombre: string, 
  porcentaje: number, 
  excedido: boolean
) {
  const subject = excedido 
    ? `Alerta de Presupuesto: ${presupuestoNombre}`
    : `Aviso de Presupuesto: ${presupuestoNombre}`;

  const mensaje = excedido
    ? `Alerta: Has superado el límite establecido para tu presupuesto de ${presupuestoNombre}.`
    : `Hola, has consumido el ${porcentaje.toFixed(0)}% de tu presupuesto de ${presupuestoNombre}.`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h3 style="color: ${excedido ? '#dc3545' : '#ffc107'};">${subject}</h3>
      <p>${mensaje}</p>
      <br/>
      <p><small>Este es un mensaje automático de tu App de Finanzas.</small></p>
    </div>
  `;

  return await sendEmail({ to: userEmail, subject, htmlContent });
}

export async function sendHighAmountAlert(
  userEmail: string, 
  monto: number, 
  descripcion: string
) {
  const subject = `Alerta de Seguridad: Transacción inusual`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h3 style="color: #0dcaf0;">${subject}</h3>
      <p>Hola,</p>
      <p>Se ha registrado un gasto de <strong>$${monto.toFixed(2)}</strong> en "<em>${descripcion}</em>".</p>
      <p>Te enviamos este correo por seguridad y control. Si reconoces esta transacción, puedes ignorar este mensaje.</p>
      <br/>
      <p><small>Este es un mensaje automático de tu App de Finanzas.</small></p>
    </div>
  `;

  return await sendEmail({ to: userEmail, subject, htmlContent });
}