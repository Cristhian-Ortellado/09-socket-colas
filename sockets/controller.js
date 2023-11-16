const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
  socket.emit("last-ticket", ticketControl.last);
  socket.emit("current-state", ticketControl.last_4);
  socket.emit("pending-tickets", ticketControl.tickets.length);

  socket.on("next-ticket", (payload, callback) => {
    const next = ticketControl.next();
    callback(next);
    socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);
    // TODO: Notify that we have a new ticket that need to be assigned
  });

  socket.on("take-ticket", ({ escritorio }, callback) => {
    if (!escritorio) {
      return callback({
        ok: false,
        msg: "Desktop is mandatory",
      });
    }

    const ticket = ticketControl.takeTicket(escritorio); 
    socket.broadcast.emit('current-state', ticketControl.last_4);
    socket.broadcast.emit("pending-tickets", ticketControl.tickets.length);
    
    if (!ticket) {
      return callback({
        ok: false,
        msg: "There is not more tickets",
      });
    } else {
      callback({
        ok: true,
        ticket,
        pendingT:ticketControl.tickets.length
      });
    }
    
  });
};

module.exports = {
  socketController,
};
