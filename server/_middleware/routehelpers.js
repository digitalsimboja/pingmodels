const Joi = require('joi');


module.exports = {


    validateParam: (schema, name) => {

        return (req, res, next) => {

            const options = {
                abortEarly: false, // include all errors
                allowUnknown: true, // ignore unknown props
                stripUnknown: true // remove unknown props
            };

            const result = schema.validate({ param: req['params'][name] }, options);
            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }
                if (!req.value['params']) {
                    req.value['params'] = {};
                }
                req.value['params'][name] = result.value.param;
                next();
            }

        }

    },

    validateBody: (schema) => {
        return (req, res, next) => {
            const options = {
                abortEarly: false, // include all errors
                allowUnknown: true, // ignore unknown props
                stripUnknown: true // remove unknown props
            };

            const result = schema.validate(req.body, options);
            if (result.error) {
                return res.status(400).json(result.error);
            } else {
                if (!req.value) {
                    req.value = {};
                }
                if (!req.value['body']) {
                    req.value['body'] = {};
                }
                req.value['body'] = result.value;
                next();
            }
        }
    },


    schemas: {
        userSchema: Joi.object().keys({
            firstName: Joi.string().required().trim(),
            lastName: Joi.string().required().trim(),
            username: Joi.string().required().lowercase().trim(),
            email: Joi.string().email().required().lowercase().trim(),
            phoneNumber: Joi.number().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required(),
            acceptTerms: Joi.boolean().valid(true).required()

        }),
        
        authSchema: Joi.object().keys({
            username: Joi.string().required().trim(),
            password: Joi.string().required().trim(),

        }),

        replaceUserSchema: Joi.object().keys({

            firstName: Joi.string().trim().required(),
            lastName: Joi.string().trim().required(),
            email: Joi.string().email().trim().required(),
            phoneNumber: Joi.string().required(),
            password: Joi.string().required(),
            confirmPassword: Joi.string().valid(Joi.ref('password')).required(),

        }),

        updateUserSchema: Joi.object().keys({
            username: Joi.string().trim(),
            firstName: Joi.string().trim(),
            lastName: Joi.string().trim(),
            phoneNumber: Joi.string(),
            password: Joi.string(),
            confirmPassword: Joi.string().valid(Joi.ref('password')),

        }),

        photoSchema: Joi.object().keys({
            imageUrl: Joi.string(),
            imageTitle: Joi.string().required(),
            imageDesc: Joi.string().required(),
            imageControl: Joi.string().required(),

        }),

        editPhotoSchema: Joi.object().keys({
            
            imageTitle: Joi.string(),
            imageDesc: Joi.string(),
            

        }),

        putPhotoSchema: Joi.object().keys({
            imageUrl: Joi.string(),
            imageTitle: Joi.string().required(),
            imageDesc: Joi.string().required(),
            imageControl: Joi.string().required(),

        }),

        putVideoSchema: Joi.object().keys({
            videoUrl: Joi.string().required(),
            videoTitle: Joi.string().required(),
            videoDesc: Joi.string().required(),
            videoControl: Joi.string().required(),

        }),

        editVideoSchema: Joi.object().keys({
            
            videoTitle: Joi.string(),
            videoDesc: Joi.string(),
           

        }),

        videoSchema: Joi.object().keys({
            videoUrl: Joi.string().required(),
            videoTitle: Joi.string().required(),
            videoDesc: Joi.string().required(),
            videoControl: Joi.string().required(),
        }),

        userVideoSchema: Joi.object().keys({
            videoUrl: Joi.string(),
            videoTitle: Joi.string(),
            videoDesc: Joi.string(),
            videoControl: Joi.string(),
        }),

        editProfileSchema:  Joi.object().keys({
            location: Joi.string(),
            bio: Joi.string(),
            avatar: Joi.string(),
        }),


        bankAccountSchema: Joi.object().keys({

            bankAccount: Joi.number().required(),
            bankName: Joi.string().required().trim(),
            bankAccountName: Joi.string().required().trim(),

        }),
        updateBankAccountSchema: Joi.object().keys({

            bankAccount: Joi.number(),
            bankName: Joi.string().trim(),
            bankAccountName: Joi.string().trim(),

        }),

        accountBalanceSchema: {
            accountBalance: Joi.number(),
            transactionAmount: Joi.number(),
        },

        withdrawSchema: Joi.object().keys({
            bankAccount: Joi.number().required(),
            bankName: Joi.string().required(),
            bankAccountName: Joi.string().required(),
            transactionAmount: Joi.number().required(),
        }),


        tokenSchema: Joi.object().keys({
            tokenAmountCredited: Joi.number().required(),
            tokenAmountDebited: Joi.number(),
            tokenBalance: Joi.number(),
            


        }),


        IdSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/)
        }),

        userNameSchema: Joi.object().keys({
            username: Joi.string()
        })

    }


}


