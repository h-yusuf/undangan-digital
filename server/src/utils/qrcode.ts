export async function generateQRCode(data: string): Promise<string> {
  const QRCode = await import('qrcode');
  
  try {
    const qrDataURL = await QRCode.toDataURL(data, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    
    return qrDataURL;
  } catch (error) {
    throw new Error('Failed to generate QR code');
  }
}

export function generateCheckInURL(guestId: string, eventSlug: string): string {
  return `https://yourdomain.com/checkin?guest=${guestId}&event=${eventSlug}`;
}
