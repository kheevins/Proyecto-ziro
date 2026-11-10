const Contact = require('../models/Contact');
const transporter = require('../config/mailer')

const createContact = async (req, res) => {
    try{
       const { name, email, rol, parroquia, message} = req.body || {};
       
       console.log('Datos recibidos desde React:', req.body);

       //Comprobamos si los campos no estan vacios
       const campos = [ name, email, rol, parroquia, message];

       if(
        campos.some(
            (campo) => typeof campo !== 'string' || !campo.trim()
        )
       ){
        return res.status(400).json({
            mensaje: '!Todos los campos son obligatorios¡'
        });
       }

       //Borrar espacios y normalizar el email
       const datos = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        rol: rol.trim(),
        parroquia: parroquia.trim(),
        message: message.trim()
       };

       const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

       if(!emailValido.test(datos.email)) {
        return res.status(400).json({
            mensaje: 'El correo no es valido'
        });
       }

       //comprobar que elija un rol de los existentes
       const rolesExistentes = [
        'Catequista',
        'Párroco',
        'Padre de Familia',
        'Otro'
       ];

       if(!rolesExistentes.includes(datos.rol)) {
        return res.status(400).json({
            mensaje: 'El rol seleccionado no esta permitido'
        });
       }

       //Guardar el contacto
       const newContact = new Contact(datos);

       await newContact.save();

       try {
        await transporter.sendMail({
            from : `"Ziro Web" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: datos.email,
            subject: `Nuevo mensaje de ${datos.name}`,
            text: `
        
        Nombre: ${datos.name}
        Correo: ${datos.email}
        Rol: ${datos.rol}
        Parroquia: ${datos.parroquia}

        Mensaje: ${datos.message}

            `,

        });

        console.log('El correo fue enviado de manera exitosa');
       }catch (emailError) {
        console.error('Erro al intentar enviar el correo', email.Error.message);
       }

       return res.status(201).json({
        mensaje: 'El mensaje se envió correctamente'
       });
    } catch (error) {
        console.error('Hubo un error al crear el contacto:', error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                mensaje: 'El mensaje no cumple con los requisitos'
            });
        }

        return res.status(500).json({
            mensaje: 'Error interno al enviar el mensaje'
        });
    }
};

module.exports = {
    createContact
};