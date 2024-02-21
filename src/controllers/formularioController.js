require('dotenv').config();
const nodemailer = require('nodemailer');
const Joi = require('joi');

const formularioSchema = Joi.object({
    nombre: Joi.string().required(),
    email: Joi.string().email().required(),
    telefono: Joi.string().required(),
    modelo: Joi.string().required(),
    cantidad: Joi.number().integer().min(50).max(300).required(),
    personalizacion: Joi.boolean(),
    lanyard: Joi.boolean(),
    stand: Joi.string().valid('Córdoba', 'Provincia', 'Fuera de provincia', 'Ninguno').required(),
});

const preciosModelos = {
    'modelo1': { '50-100': 4, '100-300': 3.5 },
    'modelo2': { '50-100': 3.5, '100-300': 3 },
    'modelo3': { '50-100': 3, '100-300': 2.85 },
};

const costosAdicionales = {
    personalizacion: 0.5,
    lanyard: 1,
    stand: { 'Córdoba': 100, 'Provincia': 150, 'Fuera de provincia': 0 }, 
};

const calcularPresupuesto = (modelo, cantidad, personalizacion, lanyard, stand) => {
    let rango = cantidad <= 100 ? '50-100' : '100-300';
    let precioBase = preciosModelos[modelo][rango];
    let costo = cantidad * precioBase;

    if (personalizacion) costo += cantidad * costosAdicionales.personalizacion;
    if (lanyard) costo += cantidad * costosAdicionales.lanyard;
    costo += costosAdicionales.stand[stand] || 0;

    return costo;
};

const enviarCorreo = async (destinatario, asunto, contenido) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false, 
                minVersion: 'TLSv1.2',
            }
        });
        
        let mailOptions = {
            from: `"GH Vaper" <${process.env.SMTP_USER}>`,
            to: destinatario,
            subject: asunto,
            text: contenido,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado al destinatario:', destinatario);
        console.log('Asunto:', asunto);
        console.log('Contenido:', contenido);
        console.log('Correo enviado: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar correo al destinatario:', error);
        throw error; 
    }
};

const procesarFormulario = async (req, res) => {
    try {
        const value = await formularioSchema.validateAsync(req.body);
        const presupuesto = calcularPresupuesto(value.modelo, value.cantidad, value.personalizacion, value.lanyard, value.stand);
        
        // Contenido del correo para el cliente
        const contenidoCliente = `Hola ${value.nombre}, el costo total estimado es: ${presupuesto} euros.`;
        await enviarCorreo(value.email, "Detalles del Presupuesto", contenidoCliente);
        console.log('Correo enviado al cliente:', value.email);

        const contenidoAdmin = `Nuevo formulario recibido:\nNombre: ${value.nombre}\nEmail: ${value.email}\nTeléfono: ${value.telefono}\nModelo: ${value.modelo}\nCantidad: ${value.cantidad}\nPersonalización: ${value.personalizacion ? "Sí" : "No"}\nLanyard: ${value.lanyard ? "Sí" : "No"}\nStand: ${value.stand}`;
        await enviarCorreo(process.env.ADMIN_EMAIL, "Nuevo Formulario Recibido", contenidoAdmin);
        console.log('Correo enviado al administrador:', process.env.ADMIN_EMAIL);

        res.json({ mensaje: "Formulario procesado, correo enviado." });
    } catch (error) {
        console.error('Error al procesar formulario:', error);
        res.status(400).json({ error: error.message });
    }
};

module.exports = { procesarFormulario };
