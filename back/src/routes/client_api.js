const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('../lib/auth');
const { isNotLoggedIn } = require('../lib/auth');
const pool = require('../database');
const helpers = require('../lib/helpers');

//Api para registrar un nuevo cliente
router.post('/api/client_register', async (req, res) => {
    const { names, lastnames, document, email, phone, username, password, term_condition } = req.body;
    let created_at = new Date();
    const username_result = await pool.query('SELECT username FROM users WHERE username = ?', [username]);
    const document_result = await pool.query('SELECT document FROM users WHERE document = ?', [document]);
    const email_result = await pool.query('SELECT email FROM users WHERE email = ?', [email]);
    if(username_result.length > 0){
        data = {
            "code": "1",
            "save": false,
            "error": "Este nombre de usuario ya se encuentra registrado."
        };
    }else if(document_result.length > 0){
        data = {
            "code": "1",
            "save": false,
            "error": "Este documento ya se encuentra registrado."
        };
    }else if(email_result.length > 0){
        data = {
            "code": "1",
            "save": false,
            "error": "Este email ya se encuentra registrado."
        };
    }else if(req.body.password != req.body.confirm_password){
        data = {
            "code": "1",
            "save": false,
            "error": "Las contraseñas no coinciden."
        };
    }else{
        const newClient = {
            names,
            lastnames,
            document,
            email,
            phone,
            username,
            term_condition,
            created_at
        };
        newClient.password = await helpers.encryptPassword(password);
        const add_client = await pool.query('INSERT INTO users SET ?', [newClient]);
        const id_user = add_client.insertId;
        let id_profile = 3;
        let status_user_profile = 1;

        const newPorfileUSer = {
            id_user,
            id_profile,
            status_user_profile
        };
        const query_user_profile = await pool.query('INSERT INTO user_profile SET ?', [newPorfileUSer]);

        if(add_client){
            data = {
                "code": "0",
                "message": "Registro exitoso",
                "save": true
            };
        }else{
            data = {
                "code": "1",
                "error": "Error al realizar el registro. Verifique",
                "save": false
            };
        }
    }
    res.status(200).json(data);
});

module.exports = router;