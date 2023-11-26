import { ticketModel } from "../models/ticket.model.js";


export default class TicketManager {
    constructor() {
        console.log('working Tickets with DB')
    }
    save = async (order) =>{
        const newTicket = await ticketModel.create(order)
        return newTicket
    }

}