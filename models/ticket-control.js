const path = require('path')
const fs = require('fs')


class Ticket {
    constructor(number, desktop){
        this.number = number;
        this.desktop = desktop;
    }
}

class TicketControl {
  constructor() {
    this.last = 0;
    this.today = new Date().getDate();
    this.tickets = [];
    this.last_4 = [];

    this.init();
  }

  get toJson() {
    return {
      last: this.last,
      today: this.today,
      tickets: this.tickets,
      last_4: this.last_4,
    };
  }

  init(){
    const {today,last,last_4,tickets} = require('../db/data.json');
    
    // we are in the same day
    if(today == this.today){
        this.tickets = tickets;
        this.last = last;
        this.last_4 = last_4;
    }else{
        // is another day
        this.saveDB()
    }
  }

  saveDB(){
    const dbPath = path.join(__dirname,'../db/data.json');
    fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
  }

  next(){
    this.last +=1;
    const ticket = new Ticket(this.last, null);
    this.tickets.push(ticket);

    this.saveDB();
    return 'Ticket ' + ticket.number;
  }

  takeTicket(desktop){

    // we dont' have tickets
    if(this.tickets.length === 0){
        return null;
    }

    //use the first ticket
    const ticket = this.tickets.shift();

    ticket.desktop = desktop;
    this.last_4.unshift(ticket);

    //validate last 4 always
    if(this.last_4.length > 4){
        this.last_4.splice(-1,1);
    }

    this.saveDB();

    return ticket;
    

  }
}

module.exports = TicketControl;