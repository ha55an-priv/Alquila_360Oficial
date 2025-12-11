import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as puppeteer from 'puppeteer';
import * as handlebars from 'handlebars';

const TEMPLATE_PATH = path.join(process.cwd(), 'src', 'shared', 'pdf-generator', 'templates');
const UPLOADS_PATH = path.join(process.cwd(), 'uploads', 'facturas');

@Injectable()
export class PdfGeneratorService {

    /**
     * Genera un comprobante de pago en formato PDF y lo guarda en el sistema.
     * @param data Los datos necesarios para el comprobante.
     * @returns La ruta al archivo PDF guardado.
     */
    async generatePaymentReceipt(data: any): Promise<string> {
        
        const fileName = `comprobante_${data.idInquilino}_${Date.now()}.pdf`;
        const dirPath = path.join(process.cwd(), 'uploads', 'comprobantes');
        const filePath = path.join(dirPath, fileName);
        
        fs.mkdirSync(dirPath, { recursive: true });

        const htmlContent = this.generateHtmlContent(data);
        
        let browser;
        try {
            // 3. Lanzar el navegador virtual (Headless)
            browser = await puppeteer.launch({ 
                headless: true, // Asegúrate que esté en true para producción
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Recomendado para entornos de servidor
            });
            const page = await browser.newPage();

            // 4. Establecer el contenido HTML
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

            // 5. Generar el PDF y guardarlo en la ruta
            await page.pdf({
                path: filePath,
                format: 'A4',
                printBackground: true, // Para imprimir colores de fondo
                margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
            });

            console.log(`Comprobante generado en: ${filePath}`);
            return filePath;
            
        } catch (error) {
            console.error('Error generando PDF con Puppeteer:', error);
            throw new InternalServerErrorException('Error al generar el comprobante de pago.');
        } finally {
            if (browser) {
                await browser.close(); // Cierra el navegador al finalizar, crucial para liberar recursos
            }
        }
    }
    
    async generateContrato(data: any): Promise<Buffer> {
        
        let browser;
        try {
            const templatePath = path.join(process.cwd(), 'templates', 'contrato.hbs');
            
            // 1. Cargar y compilar la plantilla
            if (!fs.existsSync(templatePath)) {
                throw new InternalServerErrorException('Plantilla de contrato no encontrada.');
            }
            const templateSource = fs.readFileSync(templatePath, 'utf-8');
            const template = handlebars.compile(templateSource);

            // 2. Generar el contenido HTML usando los datos
            const htmlContent = template(data);

            // 3. Lanzar Puppeteer
            browser = await puppeteer.launch({ 
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                headless: true 
            });
            
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            
            // 4. Generar el Buffer PDF
            const pdfUint8Array = await page.pdf({ 
                format: 'A4', 
                printBackground: true 
            });

            return Buffer.from(pdfUint8Array);
            
        } catch (error) {
            // Manejo de errores de Puppeteer o Handlebars
            console.error("PDF Generation Error (Contrato):", error);
            throw new InternalServerErrorException(`Error al generar el PDF del contrato: ${error.message}`);
        } finally {
            // 5. CERRAR EL NAVEGADOR SIEMPRE
            if (browser) {
                await browser.close();
            }
        }
    }
    
   async generateInvoice(datosFactura: any): Promise<string> {
    
    // 1. Verificar/Crear el directorio de subida (uploads/facturas)
    if (!fs.existsSync(UPLOADS_PATH)) {
        fs.mkdirSync(UPLOADS_PATH, { recursive: true });
    }

    // 2. Cargar y Compilar la Plantilla HTML (Usando Handlebars)
    const templateHtml = fs.readFileSync(
        path.join(TEMPLATE_PATH, 'invoice.html'), // Asegúrate de que 'invoice.html' exista
        'utf8'
    );
    const template = handlebars.compile(templateHtml);
    
    // 3. Renderizar el HTML con los datos
    const htmlContent = template(datosFactura);
    
    // 4. Configurar el nombre y la ruta del archivo
    const fileName = `factura-cuota-${datosFactura.cuotaInfo.fechaVencimiento.toISOString().substring(0, 7)}-${Date.now()}.pdf`;
    const filePath = path.join(UPLOADS_PATH, fileName);

    let browser;
    try {
        // 5. Iniciar el navegador Puppeteer
        browser = await puppeteer.launch({
            // Es crucial para entornos Docker/Linux (servidores)
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
        });

        const page = await browser.newPage();

        // Establecer el contenido HTML
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0', // Espera hasta que la red esté inactiva
        });

        // 6. Generar el PDF
        await page.pdf({
            path: filePath,
            format: 'A4',
            printBackground: true, // Importante para colores y fondos
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm',
            },
        });

        // 7. Retorna el nombre del archivo guardado
        return fileName;

    } catch (error) {
        console.error('Error al generar el PDF de la factura:', error);
        throw new InternalServerErrorException('Error en el servicio de generación de PDF de factura.');
    } finally {
        // 8. Asegurarse de cerrar el navegador
        if (browser) {
            await browser.close();
        }
    }
}
    private generateHtmlContent(data: any): string {
        
        // Aseguramos que la fecha sea legible
        const fechaPagoStr = data.fechaPago.toLocaleString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 0; }
                    .container { padding: 40px; max-width: 800px; margin: auto; border: 1px solid #ccc; }
                    h1 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
                    .detail { margin-bottom: 10px; }
                    .label { font-weight: bold; width: 150px; display: inline-block; }
                    .footer { margin-top: 30px; border-top: 1px dashed #ccc; padding-top: 10px; text-align: center; font-size: 10px; color: #666; }
                    .amount { font-size: 24px; font-weight: bold; color: #1e8449; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Comprobante de Pago de Alquiler</h1>
                    <p>Documento generado automáticamente el ${new Date().toLocaleDateString()}.</p>
                    
                    <h2>Detalles de la Transacción</h2>
                    <div class="detail"><span class="label">Fecha de Pago:</span> ${fechaPagoStr}</div>
                    <div class="detail"><span class="label">Monto Abonado:</span> <span class="amount">$${data.montoPagado.toFixed(2)}</span></div>
                    <div class="detail"><span class="label">Método:</span> ${data.metodo}</div>
                    <div class="detail"><span class="label">Referencia:</span> ${data.referencia || 'N/A'}</div>

                    <h2>Información de la Cuota</h2>
                    <div class="detail"><span class="label">Cuota para:</span> Propiedad ID ${data.idPropiedad}</div>
                    <div class="detail"><span class="label">Inquilino ID:</span> ${data.idInquilino}</div>

                    <div class="footer">
                        Este comprobante es válido solo con la verificación de la Referencia de Transacción.
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}