import mercadopago from 'mercadopago';


const controller = {
    payment: async(req, res, next) => {
        let preference = {
            items: [
                {
                    title: req.query.title,
                    unit_price: req.query.price,
                    quantity: req.query.unit,
                }
            ]
        };
        mercadopago.preferences.create(preference)
            .then(function (response) {
                // Este valor reemplazará el string "$$init_point$$" en tu HTML
                res.json({ response});
            }).catch(function (err) {
                next(err);
            });
     
    }
    
}

export default controller;