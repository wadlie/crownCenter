import openSocket from 'socket.io-client';
const  socket = openSocket('/');


function onNewFormSubmission(cb) {
  socket.on('formsubmission', formsubmissions => cb(null, formsubmissions));
}

function onNewFarm(cb) {
    socket.on('farm', farms=> cb(null, farms))
}

function onNewFarmFarmer(cb) {
    socket.on('farmfarmer', farms=> cb(null, farms))
}


export { onNewFormSubmission, onNewFarm, onNewFarmFarmer};