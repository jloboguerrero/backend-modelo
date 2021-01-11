const { response } = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email: email });
        if( existeEmail ){
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            //msg: 'Crear usuario!!!'
            //body: req.body
            usuario,
            token
        }); 

    } catch(error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
}


const login = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {

        const usuarioDB = await Usuario.findOne({email});
        if( !usuarioDB ){
            return res.status(400).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        // Validar el passwrod
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Passowrd incorrecto'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'No pudo ingresar, hable con el administrador'
        });
    }


    return res.json({
        ok: true,
        msg: 'login'
    });
}

const renewToken = async ( req, res = response ) => {

    // const uid del usuario
    const uid = req.uid;

    // Generar un nuevo JWT, generarJWT... uid..
    const token = await generarJWT( uid );

    // Obtener el usuario por UID, usuario.findById...
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        msg: 'Renew',
        uid: req.uid,
        usuario,
        token
    });
};


module.exports = {
    crearUsuario,
    login,
    renewToken
}