export type ApplicationError = {
  name: string;
  message: string;
};

export type ViaCEPAddress = {
  logradouro: string,
  complemento: string,
  bairro: string,
  localidade: string,
  uf: string,

};

//Regra de Negócio
export type AddressEnrollment = {
  logradouro: string,
  complemento: string,
  bairro: string,
  cidade: string,
  uf: string,
  error?: string

}

export type RequestError = {
  status: number,
  data: object | null,
  statusText: string,
  name: string,
  message: string,
};

export type TicketType = {
  id: number,
  name: string,
  price: number,
  isRemote: boolean,
  includesHotel: boolean,
  createdAt: Date | string,
  updatedAt: Date | string,
}

export type NewPayment = {
    ticketId: number,
    cardData: {
      issuer: string,
      number: number,
      name: string,
      expirationDate: Date,
      cvv: number
    }
}

export type PaymentEntity = {
  id: number,
  ticketId: number,
  value: number,
  cardIssuer: string, // VISA | MASTERCARD
  cardLastDigits: string
  createdAt: Date,
  updatedAt: Date
}

export type Payment = {
  ticketId: number,
  value: number,
  cardIssuer: string, // VISA | MASTERCARD
  cardLastDigits: string
}

export type RoomReturn = {
  id: number
  name: string,
  capacity: number,
  hotelId: number,
  hotel: {
    name: string,
    image: string
  }
}
