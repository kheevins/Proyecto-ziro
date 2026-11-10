const Score = require ('../models/Score')

//__________________Primera funcion____________//
const guardarPuntaje = async (req, res) => {
    try {
        const {nombre, puntaje, deviceId} = req.body;

        if(
            typeof nombre !== 'string' ||
            !nombre.trim() ||
            nombre.trim().length > 40 ||
            !Number.isInteger(puntaje) ||
            puntaje < 0 ||
            typeof deviceId !== 'string' ||
            !deviceId.trim()
        ){
            return res.status(400).json({
                mensaje: '!Los datos del puntaje no son validos¡'
            });
        }

        const scoreExistente = await Score.findOne({deviceId});

        if (scoreExistente) {
            if(puntaje > scoreExistente.puntaje) {
                scoreExistente.nombre = nombre.trim();
                scoreExistente.puntaje = puntaje;

                await scoreExistente.save()
            }

            return res.status(200).json({
                mensaje: 'Puntuación revisada exitosamente'
            });
        }

        await Score.create({
            nombre: nombre.trim(),
            puntaje,
            deviceId: deviceId.trim()
        });

        return res.status(201).json({
            mensaje: 'Su Puntuación fue guardada corectamente'
        });
    } catch (error) {
        console.error('Error al guardar la puntuación', error);

        return res.status(500).json({
            mensaje: 'Error interno al guardar la puntuación'
        });
    }
};

//_______________segunda funcion_________________//
const obtenerTop10 = async (req, res) => {
  try {
    let limit = Number.parseInt(req.query.limit, 10);

    if (!Number.isInteger(limit) || limit < 1) {
      limit = 10;
    }

    limit = Math.min(limit, 10);

    const puntajes = await Score.find()
      .sort({ puntaje: -1, createdAt: 1 })
      .limit(limit)
      .select('nombre puntaje -_id');

    return res.status(200).json({
      data: puntajes
    });

  } catch (error) {
    console.error('Error al obtener ranking:', error);

    return res.status(500).json({
      message: 'Error al consultar el ranking'
    });
  }
};

module.exports = {
    guardarPuntaje,
    obtenerTop10
};