import React from "react";
import { Download, Printer } from "lucide-react";

interface TicketPDFProps {
  reservation: {
    id: string;
    seatNumber: number;
    createdAt: string;
  };
  schedule: {
    departureTime: string;
    arrivalTime: string;
    date: string;
  };
  route: {
    origin: string;
    destination: string;
    price: number;
    duration: string;
  };
  company: {
    name: string;
    phone: string;
    email: string;
  };
  bus: {
    plateNumber: string;
    model: string;
  };
  user: {
    name: string;
    email: string;
  };
}

export function TicketPDF({
  reservation,
  schedule,
  route,
  company,
  bus,
  user,
}: TicketPDFProps) {
  const generatePDF = () => {
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Boleto Electrónico - ${reservation.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .ticket {
              background: white;
              max-width: 600px;
              margin: 0 auto;
              border-radius: 10px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
              color: white;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .header p {
              margin: 5px 0 0;
              opacity: 0.9;
            }
            .content {
              padding: 30px;
            }
            .route-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 30px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .city {
              text-align: center;
              flex: 1;
            }
            .city h2 {
              margin: 0;
              font-size: 20px;
              color: #1f2937;
            }
            .city p {
              margin: 5px 0 0;
              color: #6b7280;
              font-size: 14px;
            }
            .arrow {
              margin: 0 20px;
              font-size: 24px;
              color: #ea580c;
            }
            .details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .detail-group h3 {
              margin: 0 0 10px;
              color: #374151;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .detail-group p {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
            }
            .price-section {
              text-align: center;
              padding: 20px;
              background: #fef3e2;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .price {
              font-size: 28px;
              font-weight: bold;
              color: #ea580c;
            }
            .qr-section {
              text-align: center;
              padding: 20px;
              border-top: 2px dashed #d1d5db;
            }
            .qr-placeholder {
              width: 100px;
              height: 100px;
              background: #f3f4f6;
              border: 2px dashed #9ca3af;
              margin: 0 auto 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 8px;
            }
            .footer {
              background: #f9fafb;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
            @media print {
              body { background: white; padding: 0; }
              .ticket { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="header">
              <h1>BOLETO ELECTRÓNICO</h1>
              <p>Código de reserva: ${reservation.id}</p>
            </div>
            
            <div class="content">
              <div class="route-info">
                <div class="city">
                  <h2>${route.origin}</h2>
                  <p>Origen</p>
                </div>
                <div class="arrow">→</div>
                <div class="city">
                  <h2>${route.destination}</h2>
                  <p>Destino</p>
                </div>
              </div>

              <div class="details">
                <div class="detail-group">
                  <h3>Pasajero</h3>
                  <p>${user.name}</p>
                </div>
                <div class="detail-group">
                  <h3>Empresa</h3>
                  <p>${company.name}</p>
                </div>
                <div class="detail-group">
                  <h3>Fecha de Viaje</h3>
                  <p>${schedule.date}</p>
                </div>
                <div class="detail-group">
                  <h3>Horario</h3>
                  <p>${schedule.departureTime} - ${schedule.arrivalTime}</p>
                </div>
                <div class="detail-group">
                  <h3>Asiento</h3>
                  <p>#${reservation.seatNumber}</p>
                </div>
                <div class="detail-group">
                  <h3>Bus</h3>
                  <p>${bus.plateNumber} - ${bus.model}</p>
                </div>
                <div class="detail-group">
                  <h3>Duración</h3>
                  <p>${route.duration}</p>
                </div>
                <div class="detail-group">
                  <h3>Fecha de Emisión</h3>
                  <p>${new Date(reservation.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div class="price-section">
                <div class="price">$${route.price}</div>
              </div>

              <div class="qr-section">
                <div class="qr-placeholder">
                  <span style="color: #9ca3af; font-size: 12px;">QR CODE</span>
                </div>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">
                  Presenta este código QR en el terminal
                </p>
              </div>
            </div>

            <div class="footer">
              <p><strong>${company.name}</strong></p>
              <p>Teléfono: ${company.phone} | Email: ${company.email}</p>
              <p>Este boleto es válido únicamente para la fecha y horario especificados</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Crear una nueva ventana para el PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(ticketHTML);
      printWindow.document.close();

      // Esperar a que se cargue el contenido antes de imprimir
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  const downloadPDF = () => {
    // usar jsPDF o html2pdf
    generatePDF();
  };

  return (
    <div className="flex space-x-3">
      <button
        onClick={downloadPDF}
        className="flex items-center px-4 py-2 space-x-2 text-sm text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
      >
        <Download className="w-4 h-4" />
        <span>Descargar PDF</span>
      </button>

      <button
        onClick={generatePDF}
        className="flex items-center px-4 py-2 space-x-2 text-sm text-white transition-colors bg-gray-600 rounded-md hover:bg-gray-700"
      >
        <Printer className="w-4 h-4" />
        <span>Imprimir</span>
      </button>
    </div>
  );
}
