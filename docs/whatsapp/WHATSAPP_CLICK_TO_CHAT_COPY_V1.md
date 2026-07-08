# WhatsApp Click-to-Chat Copy (V1)

## 1. Frontend Elements

* **Bilingual Number Endpoint Placeholder:** `WHATSAPP_BUSINESS_NUMBER_PLACEHOLDER`

### English Version
* **Button Label:** `Talk to TalentSync360`
* **Tooltip / Accessible Text:** `Open a manual WhatsApp chat session with a TalentSync360 representative`
* **Prefilled WhatsApp Message:**
  ```text
  Hi TalentSync360, I’d like to ask about your LATAM tech talent network.
  ```

### Spanish Version
* **Button Label:** `Hablar con TalentSync360`
* **Tooltip / Accessible Text:** `Abrir una sesión de chat manual de WhatsApp con un representante de TalentSync360`
* **Prefilled WhatsApp Message:**
  ```text
  Hola TalentSync360, quiero hacer una consulta sobre su red de talento tech LATAM.
  ```

---

## 2. Operator Response Templates

These templates are used manually by the operator monitoring the WhatsApp device.

### Candidate Safety & Redirection
When a candidate asks basic questions, applies, or attempts to send a CV:

* **English:**
  > Please do not send CVs or sensitive personal data via WhatsApp. We’ll guide you to the official application flow. You can officially apply and submit your details securely at: https://www.talentsync360.com/talents

* **Spanish:**
  > Por favor no envíes CVs ni datos personales sensibles por WhatsApp. Te vamos a orientar hacia el canal oficial de aplicación. Puedes aplicar oficialmente y subir tus datos de forma segura en: https://www.talentsync360.com/talents

---

### Company / Client Inquiry Qualification
When a company, consultancies, or partner reaches out to ask about LATAM talent sprints:

* **English:**
  > Thank you for reaching out! I can help you with basic info on our LATAM vetting process and pricing. To proceed with a validated sourcing brief or to schedule a call, please visit: https://www.talentsync360.com/contact

* **Spanish:**
  > ¡Gracias por escribirnos! Te puedo brindar información básica sobre nuestro proceso de validación en LATAM y tarifas. Para avanzar con un brief de búsqueda validado o agendar una llamada, por favor ingresa a: https://www.talentsync360.com/contact

---

### Compliance Fallback (If a CV is received)
In the event that a user ignores instructions and sends a CV file or link:

* **English:**
  > [Compliance Notice] We have deleted the file/data you sent to maintain compliance with our data protection policies. We do not accept resume files via WhatsApp. Please submit your application through our secure portal: https://www.talentsync360.com/talents

* **Spanish:**
  > [Aviso de Cumplimiento] Hemos eliminado el archivo/datos que enviaste para cumplir con nuestras políticas de protección de datos. No aceptamos currículums por WhatsApp. Por favor, envía tu postulación a través de nuestro portal seguro: https://www.talentsync360.com/talents

---

## 3. Internal Operator Guidelines

1. **Delete CVs Immediately:** If a candidate uploads a document, delete the message from the chat history and reply with the **Compliance Fallback** template. Do not download or forward candidate documents.
2. **Pre-sales Only:** Do not negotiate fees, offer discounts, or commit to service level agreements (SLAs) over chat. Direct commercial leads to the booking link.
3. **No Automation:** Do not connect this phone number to auto-reply bots or AI response tools.
