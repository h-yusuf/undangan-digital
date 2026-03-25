export interface WhatsAppMessage {
  to: string;
  message: string;
}

export function generateWhatsAppLink(phoneNumber: string, message: string): string {
  // Remove non-numeric characters
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  
  // Add country code if not present (assume Indonesia +62)
  const formattedPhone = cleanPhone.startsWith('62') 
    ? cleanPhone 
    : `62${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}`;
  
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

export function generateInvitationMessage(
  guestName: string,
  eventTitle: string,
  eventDate: string,
  invitationLink: string
): string {
  return `Halo ${guestName}! 👋

Anda diundang ke acara:
*${eventTitle}*

📅 ${eventDate}

Silakan buka undangan digital Anda:
${invitationLink}

Mohon konfirmasi kehadiran Anda melalui link di atas.

Terima kasih! 🙏`;
}

export async function sendWhatsAppBulk(
  messages: WhatsAppMessage[]
): Promise<{ success: number; failed: number }> {
  // This is a placeholder for actual WhatsApp API integration
  // You would integrate with services like:
  // - Twilio WhatsApp API
  // - WhatsApp Business API
  // - Fonnte.com (Indonesia)
  // - Wablas.com (Indonesia)
  
  let success = 0;
  let failed = 0;
  
  for (const msg of messages) {
    try {
      // TODO: Implement actual API call
      // const response = await fetch('https://api.whatsapp-service.com/send', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${API_KEY}` },
      //   body: JSON.stringify(msg)
      // });
      
      success++;
    } catch (error) {
      failed++;
    }
  }
  
  return { success, failed };
}
