
const { randomUUID } = require('crypto');
const Prize = require('../models/Prize');
const Claim = require('../models/PrizeClaim');

const PREMIOS = [
  { id: 'skybrill', nombre: 'SkyBrill — Set de collar y aretes', stockInicial: 1 },
  { id: 'aromacielo', nombre: 'Aromacielo — Vela aromática', stockInicial: 3 },
  { id: 'mini-nonitas', nombre: 'Mini Nonitas — Cupón de descuento', stockInicial: 3 },
  { id: 'petzuki', nombre: 'Petzuki — Cupón de descuento para mascotas', stockInicial: 3 }
];

// Crear los premios iniciales si aun no existen
const inicializarPremios = async () => {
  for (const premio of PREMIOS) {
    await Prize.updateOne(
      { id: premio.id },
      {
        $setOnInsert: {
          ...premio,
          stockDisponible: premio.stockInicial
        }
      },
      { upsert: true }
    );
  }
};
// consulta al inventario
const obtenerInventario = async (req, res) => {
  try {
    await inicializarPremios();

    const premios = await Prize.find().select('id stockDisponible -_id');

    const inventario = {};

    premios.forEach((premio) => {
      inventario[premio.id] = premio.stockDisponible;
    });

    return res.status(200).json({ data: inventario });

  } catch (error) {
    console.error('Error al consultar inventario:', error);

    return res.status(500).json({
      message: 'Error al consultar el inventario'
    });
  }
};

// reclamar premio
const reclamarPremio = async (req, res) => {
  let premioReservado = null;

  try {
    const { xp, deviceId } = req.body;

    if (
      !Number.isInteger(xp) ||
      xp < 1000 ||
      typeof deviceId !== 'string' ||
      !deviceId.trim()
    ) {
      return res.status(400).json({
        message: 'No cumples los requisitos para reclamar un premio'
      });
    }

    const idDispositivo = deviceId.trim();

    // comprobamos si ya reclamo
    const reclamoExistente = await Claim.findOne({
      deviceId: idDispositivo
    });

    if (reclamoExistente) {
      return res.status(409).json({
        message: 'Este dispositivo ya reclamó un premio'
      });
    }

    await inicializarPremios();

    
    premioReservado = await Prize.findOneAndUpdate(
      { stockDisponible: { $gt: 0 } },
      { $inc: { stockDisponible: -1 } },
      { new: true }
    );

    let resultado;

    if (premioReservado) {
      resultado = {
        tipo: 'fisico',
        premio: {
          id: premioReservado.id,
          nombre: premioReservado.nombre,
          stockInicial: premioReservado.stockInicial
        },
        codigo: `ZIRO-${randomUUID()}`
      };
    } else {
      const cartas = [
        'Fe', 'Esperanza', 'Caridad', 'Prudencia',
        'Justicia', 'Fortaleza', 'Templanza', 'Humildad',
        'Paciencia', 'Gratitud', 'Perseverancia', 'Alegría'
      ];

      const carta = cartas[Math.floor(Math.random() * cartas.length)];

      resultado = {
        tipo: 'digital',
        carta,
        codigo: `ZIRO-${randomUUID()}`
      };
    }

    try {
      await Claim.create({
        deviceId: idDispositivo,
        xp,
        tipo: resultado.tipo,
        premioId: resultado.premio?.id || null,
        carta: resultado.carta || null,
        codigo: resultado.codigo
      });

    } catch (error) {
      // si el registro da error, devolver la unidad reservada
      if (premioReservado) {
        await Prize.updateOne(
          { _id: premioReservado._id },
          { $inc: { stockDisponible: 1 } }
        );

        premioReservado = null;
      }

      throw error;
    }

    // la reclamación quedó registrada correctamente
    premioReservado = null;

    return res.status(201).json({
      data: resultado
    });

  } catch (error) {
    console.error('Error al reclamar premio:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Este dispositivo ya reclamó un premio'
      });
    }

    return res.status(500).json({
      message: 'Error interno al reclamar el premio'
    });
  }
};

module.exports = {
  inicializarPremios,
  obtenerInventario,
  reclamarPremio
};
