import Joi from "joi";

const cardDataSchema = Joi.object({
  issuer: Joi.string().required(),
  number: Joi.number().required(),
  name: Joi.string().required(),
  expirationDate: Joi.string().required(),
  cvv: Joi.number().required()  
});

export const newPaymentSchema = Joi.object({
  ticketId: Joi.number().required(),
  cardData: cardDataSchema 
});

