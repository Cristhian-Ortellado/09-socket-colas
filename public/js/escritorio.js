// Referencias del HTML
const lblTicket  = document.querySelector('small');
const btnTakeTicket = document.querySelector('button');
const lblEscritorio = document.querySelector('h1')
const divAlert = document.querySelector('.alert');
const queueNumber = document.querySelector('#lblPendientes')

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerHTML = escritorio;
divAlert.style.display = 'none';


const socket = io();



socket.on('connect', () => {
    btnTakeTicket.disabled = false;
});

socket.on('disconnect', () => {
    btnTakeTicket.disabled = true;
});

socket.on('pending-tickets', (pendingTickets) => {
    queueNumber.innerText = pendingTickets;
});


btnTakeTicket.addEventListener( 'click', () => {
    
    socket.emit('take-ticket', {escritorio},({ok, ticket,pendingT})=>{
        if (!ok) {
            lblTicket.innerText = `Anyone`;
            return divAlert.style.display = '';
        }
        queueNumber.innerText = pendingT;
        lblTicket.innerText = `Ticker ${ticket.number}`;
    });
    

});

